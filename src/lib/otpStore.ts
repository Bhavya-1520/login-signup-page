// Global OTP store that persists across hot reloads in development
// Using globalThis to prevent the Map from being reset on module reload

const globalForOtp = globalThis as unknown as {
  otpStore: Map<string, { otp: string; expiresAt: number }>;
};

if (!globalForOtp.otpStore) {
  globalForOtp.otpStore = new Map<string, { otp: string; expiresAt: number }>();
}

const otpStore = globalForOtp.otpStore;

export default otpStore;
