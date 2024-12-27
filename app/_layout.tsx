import { router, SplashScreen, Stack } from "expo-router";
import "../global.css";
import { ReactNode, useEffect } from "react";
import useAuth, { AuthProvider } from "../hooks/useAuth";

export default function RootLayout() {
  return(
    <AuthProvider>
      <AppLayout/>
    </AuthProvider>
  )
}

function AppLayout(){
  const {user} = useAuth()

    useEffect(()=>{
      if(!user)
      {
          router.replace("/login")
      }
      
    },[user]);
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(screens)"/>
      </Stack>
  );
}