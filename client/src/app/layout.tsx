import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Mustage Adaptrix",
	description: "Mustage Adaptrix",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="en">
			<body className={`antialiased bg-mustage-900`}>
				{children}
			</body>
		</html>
	);
}
