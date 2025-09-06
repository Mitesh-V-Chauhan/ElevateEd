import type { Metadata } from "next";
import { Inter, Exo_2 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { InputProvider } from '@/contexts/InputContext';
import { QuizProvider } from '@/contexts/QuizContext';
import ClientLayout from '@/components/ClientLayout';
import OnboardingCheck from '@/components/OnboardingCheck';
import AuthRedirect from '@/components/AuthRedirect';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
});

export const metadata: Metadata = {
  title: "ElevateEd AI - Transform Learning with Intelligent Quizzes",
  description: "Transform any content into engaging, personalized quizzes using advanced AI. Upload PDFs or paste text to create interactive learning experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/elevateed.jpeg" className="rounded-full" />
      </head>
      <body
        className={`${inter.variable} ${exo2.variable} antialiased h-full`}
      >
        <ThemeProvider>
          <AuthProvider>
            <InputProvider>
              <QuizProvider>
                <AuthRedirect>
                  <OnboardingCheck>
                    <ClientLayout>
                      {children}
                    </ClientLayout>
                  </OnboardingCheck>
                </AuthRedirect>
              </QuizProvider>
            </InputProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

