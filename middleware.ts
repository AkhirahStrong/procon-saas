import { clerkMiddleware } from "@clerk/nextjs/server"; // ✅ part of @clerk/nextjs

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"], // Protect everything except static files
};
