import { baseApi } from '@/redux/api/baseApi';
import { User, setUser } from './authSlice';

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, void>({
      query: () => '/users/me',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const userData = (data as any).data?.user || (data as any).data || (data as any).user || data;
          dispatch(setUser(userData));
        } catch (err) {
          // do nothing, global error handler or component can handle
        }
      },
    }),
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<any, { name: string; phone?: string; email?: string; password?: string; roleId?: number; [key: string]: any }>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    googleLogin: builder.mutation<any, { idToken?: string; token?: string }>({
      query: (data) => ({
        url: '/auth/google',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<any, { phone: string; otpCode: string }>({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    sendOtp: builder.mutation<any, { phone: string }>({
      query: (data) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resendOtp: builder.mutation<any, { phone: string }>({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useLoginMutation, useRegisterMutation, useGoogleLoginMutation, useVerifyOtpMutation, useSendOtpMutation, useResendOtpMutation, useLazyGetUserProfileQuery } = authApi;
