import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QWERTY — Autonomous AI Companion & Engineer',
  description: 'Meet QWERTY, an autonomous conversational and voice-enabled AI companion inspired by Nous Research Hermes Agent.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-mesh" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
