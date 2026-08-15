import './globals.css';

export const metadata = {
  title: 'Eyam 1665: The Boundary Stone Dilemma',
  description: 'Interactive documentary & ethics simulator on the 1665-66 Eyam plague quarantine.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
