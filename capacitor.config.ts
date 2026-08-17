import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ykskocu.app',
  appName: 'YKS Koçu',
  webDir: 'out',

  server: {
    url: 'https://yks-kocu-beta.vercel.app',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },

    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
  },
};

export default config;
