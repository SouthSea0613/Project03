import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project03",
    description: "Project03",
};

export default function RootLayout({
   children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
        {children}
        </div>
    );
}
