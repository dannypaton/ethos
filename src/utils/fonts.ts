import localFont from 'next/font/local';

// Cirka Font Family
export const cirkaVariable = localFont({
  src: '../../public/fonts/Cirka-Variable.ttf',
  variable: '--font-cirka-variable',
  display: 'swap'
});

export const cirkaLight = localFont({
  src: '../../public/fonts/Cirka-Light.otf',
  variable: '--font-cirka-light',
  display: 'swap'
});

export const cirkaBold = localFont({
  src: '../../public/fonts/Cirka-Bold.otf',
  variable: '--font-cirka-bold',
  display: 'swap'
});

// Owners Text Font Family
export const ownersTextLight = localFont({
  src: [
    {
      path: '../../public/fonts/OwnersText-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OwnersText-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OwnersText-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OwnersText-Light.eot',
      weight: '300',
      style: 'normal',
    },
  ],
  variable: '--font-owners-light',
  display: 'swap'
});

export const ownersTextRegular = localFont({
  src: [
    {
      path: '../../public/fonts/OwnersText-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OwnersText-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OwnersText-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-owners-regular',
  display: 'swap'
});

export const ownersTextItalic = localFont({
  src: [
    {
      path: '../../public/fonts/OwnersText-RegularItalic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/OwnersText-RegularItalic.eot',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-owners-italic',
  display: 'swap'
}); 