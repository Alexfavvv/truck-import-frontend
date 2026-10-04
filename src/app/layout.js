// import { gilroy } from './fonts'
import "./globals.css";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
// import MediaQuery from 'react-responsive';
import { gilroy, inter } from '@/app/fonts'

export const metadata = {
  title: "Грузовые запчасти оптом в Москве | truck-import.ru",
  description: "Запчасти для грузовых автомобилей оптом в Москве. Продажа оригинальных и аналоговых запчастей для MAN, MERCEDES, VOLVO, DAF, SCANIA, IVECO, и других марок. Гибкие условия, быстрая доставка, проверенные поставщики. Мы предлагаем надежные запчасти для вашего бизнеса!",
};


export default function RootLayout({ children }) {

  return (
    <html lang="ru" className={`${gilroy.className} ${inter.variable}`}>
      <body>
        {/* <MediaQuery minWidth={768}> */}
          <Header />
        {/* </MediaQuery> */}

        {children}
        <Footer />
        <SpeedInsights/>
        <Analytics/>
      </body>
    </html>
  );
}
