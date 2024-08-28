import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="email-conf" options={{ headerShown: false }} />
        <Stack.Screen name="reset-pw" options={{ headerShown: false }} />
        <Stack.Screen
          name="complete-register"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="reset-pw-email-conf"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar backgroundColor="#fffef6" style="dark" />
    </>
  );
};

export default AuthLayout;
