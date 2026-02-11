import './globals.css';

export const metadata = {
  title: 'Research Topic Generator — Medical Microbiology',
  description: 'AI-powered research topic generator for medical microbiology students in Lagos, Nigeria',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
