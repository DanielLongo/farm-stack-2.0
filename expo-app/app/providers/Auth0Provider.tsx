import { Auth0Provider } from 'react-native-auth0';
import Constants from 'expo-constants';
import { useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import type { PropsWithChildren } from 'react';

export function Auth0ProviderWrapper({ children }: PropsWithChildren) {
  const onRedirectCallback = useCallback(async () => {
    await WebBrowser.dismissBrowser();
  }, []);

  return (
    <Auth0Provider
      domain={Constants.expoConfig?.extra?.auth0Domain || ''}
      clientId={Constants.expoConfig?.extra?.auth0ClientId || ''}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
