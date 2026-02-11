import './globals.css';
export const metadata = { title: 'Research Topic Generator', description: 'AI-powered research topic generator for medical microbiology' };
export default function RootLayout({ children }) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
