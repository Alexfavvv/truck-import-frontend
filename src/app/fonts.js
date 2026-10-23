import { Inter, Manrope, Montserrat } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const gilroy = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-gilroy',
  display: 'swap',
})

export const heronew = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heronew',
  display: 'swap',
})
