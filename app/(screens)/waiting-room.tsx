import { Text, View, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import React from 'react'
import {db} from "../../firebase"
import { onSnapshot, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { router, useLocalSearchParams } from 'expo-router'
import Icon from "react-native-vector-icons/Ionicons"

const WaitingRoomScreen = () => {
    const [status, setStatus] = useState('waiting');
    const { lobbyId } = useLocalSearchParams<{lobbyId:string}>();

    useEffect(()=>{
      console.log(lobbyId)
        const unsubscribe = onSnapshot(doc(db, "lobbies", lobbyId), (doc) => {
            const data = doc.data();
            if(data && data.guestId)
            {
                setStatus("connected");
                router.replace({pathname:"/pick", params:{lobbyId},});
            }
        });

        return ()=>unsubscribe();
    }, [lobbyId]);

    const handleExit = async () => {
        try {
          if (lobbyId) {
            const lobbyRef = doc(db, "lobbies", lobbyId);
            await deleteDoc(lobbyRef);
          }
          router.replace("/(screens)/create-lobby");
        } catch (error) {
          console.error("Error deleting lobby or navigating:", error);
        }
      };
  return (
    <ImageBackground
      className="flex-1"
      resizeMode="cover"
      source={require("../../assets/images/Bg_2var.jpg")}
    >
      <View className="flex-1 justify-center items-center">
        <TouchableOpacity
          className="absolute top-4 left-4 w-12 h-12 bg-black rounded-full justify-center items-center"
          onPress={handleExit}
        >
          <Icon name="arrow-back" color="white" size={24}/>
        </TouchableOpacity>
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