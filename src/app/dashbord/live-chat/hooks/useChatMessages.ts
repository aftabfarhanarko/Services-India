import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { uploadImage } from "@/lib/upload";
import { useGetChatHistoryQuery } from "@/redux/features/shared/chatApi";

export function useChatMessages(
  user: any,
  activeChatUser: any,
  role: string,
  refetchInbox: () => void,
  messagesEndRef: React.RefObject<HTMLDivElement | null>
) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: historyRes } = useGetChatHistoryQuery(activeChatUser?.id || activeChatUser?._id, {
    skip: !activeChatUser,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (historyRes) {
      setMessages(historyRes);
      scrollToBottom();
    }
  }, [historyRes]);

  useEffect(() => {
    if (!user?.id && !user?._id) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";
    const newSocket = io(apiBase, {
      query: { userId: user.id || user._id },
    });

    newSocket.on("newMessage", (message: any) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.id === message.id ||
            (m.content === message.content && String(m.sender?.id) === String(message.sender?.id))
        );
        if (exists) {
          return prev.map((m) =>
            m.isOptimistic && m.content === message.content ? message : m
          );
        }
        return [...prev, message];
      });
      refetchInbox();
      scrollToBottom();
    });

    newSocket.on("messageSent", (message: any) => {
      setMessages((prev) => {
        const hasOptimistic = prev.some(
          (m) => m.isOptimistic && m.content === message.content
        );
        if (hasOptimistic) {
          return prev.map((m) =>
            m.isOptimistic && m.content === message.content ? message : m
          );
        }
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      refetchInbox();
      scrollToBottom();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, refetchInbox]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleSendMessage = async (
    e: React.FormEvent,
    fileInputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    e.preventDefault();
    if ((!messageInput.trim() && !imageFile) || !socket || !activeChatUser || isUploading) return;

    const currentMsgText = messageInput;
    const receiverId = activeChatUser.id || activeChatUser._id;

    const optimisticMsg = {
      id: "temp-" + Date.now(),
      sender: {
        id: user?.id || user?._id,
        name: user?.name || "You",
        role: role,
      },
      content: currentMsgText,
      imageUrl: imagePreview || undefined,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setMessageInput("");
    scrollToBottom();

    let uploadedImageUrl = undefined;
    if (imageFile) {
      setIsUploading(true);
      setImagePreview(null);
      setImageFile(null);
      try {
        uploadedImageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("Image upload failed:", error);
        setIsUploading(false);
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
        return;
      }
      setIsUploading(false);
    }

    socket.emit("sendMessage", {
      receiverId: Number(receiverId),
      content: currentMsgText || " ",
      imageUrl: uploadedImageUrl,
    });

    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    messages,
    setMessages,
    messageInput,
    setMessageInput,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    isUploading,
    setIsUploading,
    handleSendMessage,
  };
}
