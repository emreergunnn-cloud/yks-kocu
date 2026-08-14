import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ykskocu.app',
  appName: 'YKS Koçu',
  webDir: 'out',

  server: {
    url: 'http://10.0.2.2:3000',
    cleartext: true,
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