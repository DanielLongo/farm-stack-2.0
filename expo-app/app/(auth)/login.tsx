import { useAuth0 } from 'react-native-auth0';
import { TouchableOpacity } from 'react-native';
import { ThemedView, ThemedText } from '@/components';

export default function LoginScreen() {
  const { authorize } = useAuth0();

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 20 }}>Welcome Back</ThemedText>
      <TouchableOpacity
        onPress={() => authorize()}
        style={{ backgroundColor: '#0a7ea4', padding: 15, borderRadius: 8 }}
      >
        <ThemedText style={{ color: 'white', textAlign: 'center' }}>
          Login with Auth0
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
