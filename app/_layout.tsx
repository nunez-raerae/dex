import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Pokédex",
            headerShown: false,
          }}
        />
        <Stack.Screen name="[MoreDetail]" />
      </Stack>
    </QueryClientProvider>
  );
}
