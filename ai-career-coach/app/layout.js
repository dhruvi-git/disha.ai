import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner"; // Assuming you might have this, if not, remove it.

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Disha AI - AI Career Coach",
  description: "Advance your career with AI-powered insights.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined, // We are using custom variables below
        variables: {
          colorPrimary: "#8B5CF6", // Your Vivid Purple
          colorBackground: "#120b2e", // Dark purple card background
          colorInputBackground: "#1e1b4b", // Muted input background
          colorInputText: "#ffffff", // White text in inputs
          colorText: "#ffffff", // Main white text
          colorTextSecondary: "#A1A1AA", // Grey secondary text
          colorTextOnPrimaryBackground: "#ffffff",
          fontFamily: inter.style.fontFamily,
        },
        elements: {
          // This makes the card look like a "Glass" element
          card: "bg-white/5 backdrop-blur-md border border-white/10 shadow-xl",
          headerTitle: "text-white",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "bg-white/5 hover:bg-white/10 border-white/10 text-white",
          dividerLine: "bg-white/10",
          dividerText: "text-gray-400",
          formFieldLabel: "text-gray-300",
          formFieldInput: "bg-white/5 border-white/10 text-white focus:border-purple-500 transition-all",
          footerActionLink: "text-purple-400 hover:text-purple-300",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-background text-foreground`}>
          {/* Main content wrapper */}
          <main className="min-h-screen relative z-10">
            {children}
          </main>
          
          {/* Optional: Add a Toaster if your app uses one */}
          <Toaster richColors theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}