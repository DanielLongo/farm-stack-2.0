import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { AppState, AppStateStatus } from "react-native";

interface BiometricTokenContextValue {
  biometricToken: string | null;
  setBiometricToken: Dispatch<SetStateAction<string | null>>;
}

// Create the context with a default value of undefined.
const BiometricTokenContext = createContext<
  BiometricTokenContextValue | undefined
>(undefined);

// Custom hook to use the token context
export const useBiometricToken = (): BiometricTokenContextValue => {
  const context = useContext(BiometricTokenContext);
  if (!context) {
    throw new Error(
      "useBiometricToken must be used within a BiometricTokenProvider"
    );
  }
  return context;
};

// Use React.PropsWithChildren to ensure 'children' is correctly recognized
export const BiometricTokenProvider = ({
  children,
}: React.PropsWithChildren<{}>): JSX.Element => {
  const [biometricToken, setBiometricToken] = useState<string | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "background" || nextAppState === "inactive") {
          setBiometricToken(null);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <BiometricTokenContext.Provider
      value={{ biometricToken, setBiometricToken }}
    >
      {children}
    </BiometricTokenContext.Provider>
  );
};
