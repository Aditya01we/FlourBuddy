import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { webClientId } from '../../backend/Config';

let configured = false;

export const configureGoogle = () => {
  if (configured) return;

  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
  });

  configured = true;
};

