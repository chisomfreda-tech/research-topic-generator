import './globals.css';
export const metadata = { title: 'Benchtop — From Bench to Publication', description: 'Helping Nigerian researchers go from bench to publication faster' };
export default function RootLayout({ children }) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
