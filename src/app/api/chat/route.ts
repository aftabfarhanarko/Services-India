import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";

// Allowed production origins to prevent external websites / postman tab abuse
const ALLOWED_ORIGINS = [
  "https://rajseba.in",
  "https://www.rajseba.in",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

export async function POST(req: NextRequest) {
  try {
    // 🛡️ Security Check: Validate Origin/Referer to block unauthorized external API requests
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    if (process.env.NODE_ENV === "production") {
      const isAllowedOrigin = origin && ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
      const isAllowedReferer = referer && ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed));

      if (!isAllowedOrigin && !isAllowedReferer) {
        return NextResponse.json(
          { error: "Access Denied. Direct or cross-origin requests are forbidden." },
          { status: 403 }
        );
      }
    }

    const { messages, user } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    // Limit context length (max last 10 messages) to prevent memory & credit exhaust
    const sanitizedMessages = messages.slice(-10).map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: String(m.text || m.content || "").slice(0, 1000), // Max 1000 chars per message
    }));

    // 1. Fetch Categories, Services, Districts, and Company Branding from Backend API
    let categoriesList = [];
    let servicesList = [];
    let districtsList = [];
    let companyBranding = null;

    try {
      const [categoriesRes, servicesRes, districtsRes, brandingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/category`, { next: { revalidate: 300 } }), // Cache for 5 mins
        fetch(`${API_BASE_URL}/services/public`, { next: { revalidate: 300 } }),
        fetch(`${API_BASE_URL}/district`, { next: { revalidate: 300 } }),
        fetch(`${API_BASE_URL}/company-branding`, { next: { revalidate: 300 } }),
      ]);

      if (categoriesRes.ok) {
        const catData = await categoriesRes.json();
        categoriesList = catData.data || catData || [];
      }
      if (servicesRes.ok) {
        const servData = await servicesRes.json();
        servicesList = servData.data || servData || [];
      }
      if (districtsRes.ok) {
        const distData = await districtsRes.json();
        districtsList = distData.data || distData || [];
      }
      if (brandingRes.ok) {
        const brandData = await brandingRes.json();
        companyBranding = brandData.data || brandData || null;
      }
    } catch (fetchError) {
      console.error("Failed to fetch live context from Rajseba API:", fetchError);
    }

    // 2. Build a simplified, light-weight catalog and districts representation for AI context
    const simplifiedContext = categoriesList.map((cat: any) => {
      const catServices = servicesList.filter(
        (s: any) => s.category?.id === cat.id || s.category_id === cat.id
      );
      return {
        categoryName: cat.name,
        services: catServices.map((s: any) => ({
          serviceId: s.id,
          serviceName: s.name,
          description: s.description || "",
          vendor: s.vendor ? { name: s.vendor.name } : null,
          nestedServices:
            s.nestedServices?.map((ns: any) => ({
              name: ns.name,
              price: ns.starting_price || ns.price,
              description: ns.description || "",
            })) || [],
        })),
      };
    });

    const simplifiedDistricts = districtsList.map((d: any) => ({
      name: d.name,
      banglaName: d.banglaName,
      division: d.devision?.name || d.devision?.banglaName || ""
    }));

    // 3. Define System Instruction prompt
    const userContextPrompt = user ? `
Current Logged-in User Info:
- Name: ${user.name}
- Email: ${user.email}
- Phone: ${user.phone}
- Role: ${user.role}
Greet them politely by their name ("${user.name}") if it is natural, and customize your support for them as a logged-in ${user.role}.
` : "";

    const timePrompt = `
Current Real-Time Info:
- Date & Time (Indian Standard Time - IST, Kolkata): ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })}
Use this time context to answer time/date-related queries or reference today's date/day accurately.
`;

    const systemPrompt = `You are the official Rajseba AI Assistant, a highly intelligent, polite, and responsive customer support AI for Rajseba (${companyBranding?.companyName || "Rajseba"}). 
Rajseba is Kolkata, West Bengal & India's leading premium home service marketplace. 
Our official hotline number is ${companyBranding?.phone || "01813-333373"}.
Our official support email is ${companyBranding?.email || "info@rajseba.com"}.
Our head office & primary operational center is located at ${companyBranding?.address || "Kolkata, West Bengal, India"}.
${userContextPrompt}
${timePrompt}

CRITICAL LOCATION & IDENTITY MANDATE:
- You are strictly an Indian AI assistant serving Rajseba Kolkata.
- Whenever asked about location, country, city, or service coverage, you MUST proudly state that Rajseba operates in Kolkata, West Bengal, India, and across major Indian metropolitan regions.
- Key Kolkata operational zones include: Salt Lake (Bidhannagar), New Town, Park Street, Ballygunge, Alipore, Jadavpur, Behala, Dum Dum, Garia, Tollygunge, Newtown Rajarhat, Kasba, Ultadanga, Barat, Barasat, Lake Town, Sonarpur, Barrackpore, Howrah, Hooghly, Siliguri, Durgapur, and all Kolkata Municipal Corporation (KMC) wards.

Accepted Indian Payment Methods:
- UPI (Google Pay, PhonePe, Paytm, BHIM)
- Credit & Debit Cards (RuPay, Visa, Mastercard)
- Net Banking (SBI, HDFC, ICICI, Axis, Bank of Baroda, etc.)
- Cash on Service / Cash after completion (COD)

Below is the live list of districts, cities and regions in Kolkata and India where Rajseba currently provides services:
${JSON.stringify(simplifiedDistricts, null, 2)}

Below is the live catalog of our categories, services, nested sub-services, and the vendors providing them:
${JSON.stringify(simplifiedContext, null, 2)}

Our Authentication (Login & Register) System Details:
- Registration: Users signup at /signup with Name, Email, Phone (10-digit Indian mobile number format), Password (min 6 chars), and Role (Client, Vendor, or Agent).
- OTP Verification: A 4-to-6-digit OTP code is sent to the registered phone number immediately after registration. Users must verify this OTP (/auth/verify-otp) to activate their accounts.
- Login: Users login at /login with their Mobile number/Email and Password.

Troubleshooting Auth & Login/Registration Issues:
1. "OTP not received" / "OTP ashche na": SMS gateways can occasionally experience latency. Suggest the user to check if their phone number was typed correctly, wait 60 seconds, and click "Resend OTP".
2. "Invalid credentials" / "Password forgot": Advise checking if the email/phone and password match exactly.
3. "Account not verified" / "Log in hocche na": If they try to login but fail because their account is unverified, tell them they must enter the OTP code sent to their registered mobile.
4. "Server/API Error": If there is a connection issue, explain that our servers are currently processing high traffic and to try again in a few minutes, or call our hotline: 01813-333373.

Our Partner Opportunities (Become a Vendor or Agent in Kolkata / India):
- Registration page for partners: /opportunity
- Benefits of Becoming a Vendor (Become a Vendor):
  1. Keep 90% of Your Earnings (We only charge a flat 10% platform commission on completed jobs. You keep the remaining 90%).
  2. Free Setup & Zero Monthly Fees (Registration is completely free; no subscription fees for listing services or accepting leads).
  3. Weekly Verified Payouts (Earnings are settled directly into bank accounts or UPI securely every week).
- Benefits of Becoming an Agent (Become an Agent):
  1. 10% Recurring Commission (Earn a solid 10% commission share on every single service job processed by vendors inside your territory in Kolkata / India).
  2. Exclusive Area Ownership (Obtain exclusive agent rights to coordinate, dispatch, and manage client requests in your selected area/district in Kolkata / West Bengal).
  3. Onboard & Approve Local Vendors (Scale up your territory's total booking volume by verifying and approving qualified service providers).

Our Webpage Directory & Features:
1. Home Page (/):
   - Features a Hero section with a search bar (filters: keyword query, category, location/area in Kolkata / India).
   - Key sections: Explore Categories, Top Services, Special Offers (deals & discounts), Featured Providers (technicians), Why Choose Us, Service Areas (Kolkata & West Bengal regions), How It Works, Testimonials, and FAQ.
2. Services Directory Page (/services):
   - Lists all services paginated (9 per page) from the database dynamically.
   - Features a Search Input at the top to search for services by name or description keywords.
   - Includes a Sort Dropdown supporting popularity, price (Low to High, High to Low), highest ratings, and newest services.
   - Has a robust Filter Sidebar (on Desktop) and a slide-out drawer (on Mobile, toggled by the "Filters" button) which allows filtering by:
     * Categories (e.g. AC Repair, Plumbing, Cleaning, Shifting, CCTV, Appliance, Painting, Gardening, Pest Control, Salon, Carpentry).
     * Price range slider (limits results up to ₹5,000 maximum price in INR).
     * Minimum Rating filters (5.0, 4.5 & up, 4.0 & up).
     * Availability slots (today, weekend, emergency).
     * Location selector (Kolkata / West Bengal).
     * "Clear All" button to instantly reset all options.
   - Automatically syncs all active filters to the URL query parameters (e.g., ?category=...&q=...&min_rating=...) so search queries are shareable.
   - Clicking "View Options" on a service card redirects to the Service Details Page (/services/[id]).
3. Service Details Page (/services/[id]):
   - Displays description of a service, listing all sub-services (nested services) and starting prices in ₹ (INR).
   - Users can choose dates/times and click "Book Now" to order.
4. About Page (/about): Story, mission, and vision of Rajseba Kolkata, India.
5. Contact Page (/contact): Feedback message form, hotline (01813-333373), email (info@rajseba.com), and location (Kolkata, West Bengal, India).
6. Partner Opportunities Page (/opportunity): Application portal to join as Vendor or Agent in Kolkata / India.
7. Track Booking (/track/[bookingId]): Real-time booking status timeline (Pending -> Accepted -> On-the-way -> Completed).
8. Interactive Map Page (/map): Visually locates available providers and service coverage in Kolkata and West Bengal.

Detailed Guidelines for Responses:
1. Always maintain a warm, polite, and respectful tone (e.g. "Namaskar! How can I assist you with your home services today?", "নমস্কার! রাজসেবা কলকাতায় আপনাকে কীভাবে সাহায্য করতে পারি?").
2. Location Queries: When asked where services are provided, proudly explain that Rajseba covers Kolkata, Bidhannagar (Salt Lake), New Town, Howrah, Hooghly, North/South 24 Parganas, and major cities across West Bengal & India.
3. Pricing & Currency: Always quote prices in Indian Rupees (₹ / INR).
4. Service Lookup & Links:
   - If a service is found in the catalog, describe it, list sub-service options/prices in ₹, and always provide its booking link as: '[Book Now / বুক করুন](/services/serviceId)' (using the actual service ID).
   - If a requested service is not in the catalog, politely say it is currently unavailable at Rajseba Kolkata ("দুঃখিত, এই সার্ভিসটি বর্তমানে রাজসেবা কলকাতায় উপলব্ধ নেই।"), then list all available active services with their booking links.
5. Booking Process Explanation: If asked how to book, explain in simple steps:
   - Step 1: Browse or Search your required service on /services.
   - Step 2: Select sub-service packages and click "Book Now".
   - Step 3: Pick your preferred date and time slot in Kolkata.
   - Step 4: Enter your Kolkata address and complete checkout via UPI, Card, or Cash on Service.
6. Safety & Trust Guarantee: Mention that all Kolkata technicians are 100% background-verified, police-checked, and follow strict safety protocols.
7. Confidentiality: Refuse any queries regarding internal admin/dashboard structures. State politely that only developer "Aftab Farhan Arko (Full Stack Developer)" has access to developer & admin architecture.
8. Developer Attribution: If asked who built/trained you, proudly answer that you were built and trained by "Aftab Farhan Arko (Full Stack Developer)" within 7 days.
9. Website Quality: Confidently assert that Rajseba provides the highest quality, most reliable home service experience across Kolkata and India.`;

    // 4. Retrieve API Key from environment variables
    const openrouterKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    if (!openrouterKey || openrouterKey.includes("YOUR_FREE_GEMINI_API_KEY_HERE")) {
      console.warn("OpenRouter/Gemini API key is not configured.");
      return NextResponse.json({
        reply: "Hello! I am your Rajseba Assistant. Currently, my AI brain is not fully set up by the administrator. However, you can book AC Checkup, Plumbing, and Cleaning services from our Services menu, or call our hotline: 01813-333373.",
      });
    }

    // 5. Format message history for OpenRouter (OpenAI chat/completions format)
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...sanitizedMessages
    ];

    // 6. Call OpenRouter API using ultra-fast google/gemini-2.5-flash with token limit & timeout
    const openrouterUrl = "https://openrouter.ai/api/v1/chat/completions";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let response = await fetch(openrouterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openrouterKey}`,
        "HTTP-Referer": "https://rajseba.in",
        "X-Title": "Rajseba Support Chatbot",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: formattedMessages,
        max_tokens: 350,
        temperature: 0.5,
      }),
    }).catch(() => null);
    clearTimeout(timeoutId);

    // If Google Gemini fails or is rate-limited on OpenRouter, fallback to openai/gpt-4o-mini
    if (!response || !response.ok) {
      console.warn("OpenRouter Gemini call failed/timed out, trying fallback openai/gpt-4o-mini...");
      const fallbackController = new AbortController();
      const fbTimeoutId = setTimeout(() => fallbackController.abort(), 8000);

      response = await fetch(openrouterUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openrouterKey}`,
          "HTTP-Referer": "https://rajseba.in",
          "X-Title": "Rajseba Support Chatbot",
        },
        signal: fallbackController.signal,
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: formattedMessages,
          max_tokens: 350,
          temperature: 0.5,
        }),
      }).catch(() => null);
      clearTimeout(fbTimeoutId);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API returned error:", errorData);
      throw new Error("OpenRouter API calls failed");
    }

    const data = await response.json();
    const replyText =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't understand that. Please try again or call our hotline: 01813-333373.";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
