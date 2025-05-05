import { ClerkProvider } from "@clerk/nextjs";
// import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
