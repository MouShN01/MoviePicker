import { Text, View, ActivityIndicator, ImageBackground } from 'react-native'
import { useEffect, useState } from 'react'
import React from 'react'
import {db} from "../../firebase"
import { onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { router, useLocalSearchParams } from 'expo-router'

const WaitingRoomScreen = () => {
    const [status, setStatus] = useState('waiting');
    const { lobbyId } = useLocalSearchParams();

    useEffect(()=>{
      console.log(lobbyId)
        const unsubscribe = onSnapshot(doc(db, "lobbies", lobbyId), (doc) => {
            const data = doc.data();
            if(data && data.guestId)
            {
                setStatus("connected");
                router.replace("/pick");
            }
        });

        return ()=>unsubscribe();
    }, [lobbyId]);

  return (
    <ImageBackground
      className="flex-1"
      resizeMode="cover"
      source={require("../../assets/images/Bg_2var.jpg")}
    >
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold text-white">Waiting for a guest...</Text>
        {status === "waiting" ? (
          <ActivityIndicator className=' color-black' size="large"/>
        ) : (
          <Text className="text-xl font-bold">Guest connected!</Text>
        )}
      </View>
    </ImageBackground>
  );
};

export default WaitingRoomScreen