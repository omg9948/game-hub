import './globals.css';

export const metadata = {
  title: 'Game Hub - ศูนย์รวมเกมของเรา',
  description: 'รวมลิงก์เกมต่างๆ ที่ทีมของเราสร้างขึ้น',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}