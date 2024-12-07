import { router, SplashScreen, Stack } from "expo-router";
import "../global.css";
import { ReactNode, useEffect } from "react"; // Import ReactNode for typing children
import useAuth, { AuthProvider } from "../hooks/useAuth"; // Assuming useAuth and AuthProvider are typed correctly

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