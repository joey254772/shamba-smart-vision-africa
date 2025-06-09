
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b966e807223c4252bb69411970ed7863',
  appName: 'agrijolt-kenya',
  webDir: 'dist',
  server: {
    url: 'https://b966e807-223c-4252-bb69-411970ed7863.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Geolocation: {
      permissions: ['location']
    },
    Device: {
      permissions: ['camera']
    }
  },
  android: {
    allowMixedContent: true
  },
  ios: {
    contentInset: 'automatic'
  }
};

export default config;
