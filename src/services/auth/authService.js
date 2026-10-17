import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { configureGoogle } from './googleAuthService';

export const signInWithGoogle = async () => {
  configureGoogle();

  await GoogleSignin.hasPlayServices();
  await GoogleSignin.signOut().catch(() => {});

  const response = await GoogleSignin.signIn();


  const idToken = response?.idToken || response?.data?.idToken;
  if (!idToken) {
    throw new Error('No ID Token found.');
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await auth().signInWithCredential(googleCredential);

  return userCredential;
};

// Note: OTP/login via firebase phone auth can be added later here.

