import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthContext";
import Header from "@/component/layout/Header";
import Footer from "@/component/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Project03 - 당신의 프로젝트 파트너",
    description: "개발자, 디자이너, 기획자를 위한 프로젝트 매칭 플랫폼",
};

export default function RootLayout({
       children,
   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
        <body className={`${inter.className} bg-background text-text-main`}>
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}
