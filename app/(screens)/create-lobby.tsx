import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { createLobby } from '@/hooks/useLobby';
import { router } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select'

const LobbyCreateScreen = () => {
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const genres = [
        {label:"Action", value:"28"},
        {label:"Comedy", value:"35"},
        {label:"Drama", value:"18"},
        {label:"Horror", value:"27"},
        {label:"Anumation", value:"16"},
    ];

    const types = [
        {label:"Movie", value:"movie"},
        {label:"TV Show", value:"tv"},
        {label:"Cartoon", value:"cartoon"},
    ];

    const handleCreateLobby = async ()=>{
        if(!selectedGenre||!selectedType)
        {
            Alert.alert("Please select both genre and type!");
            return;
        }

        const lobbyId = await createLobby({genre: selectedGenre, type:selectedType});
        if(lobbyId)
        {
            router.push({pathname:"/waiting-room", params:{lobbyId},})
        }
        else
        {
            console.log("Error creating lobby");
        }
    }
  return (
    <View className=' flex-1 justify-center items-center'>
      <Text className='font-bold text-3xl text-black'>Create a lobby</Text>
      <Text className='text-2xl text-white'>Select a ganre</Text>
      <RNPickerSelect
        onValueChange={(value)=>setSelectedGenre(value)}
        items={genres}
        placeholder={{label:"Select a genre", value:null}}
      />

      <Text className='text-2xl text-white'>Select Type:</Text>
      <RNPickerSelect
        onValueChange={(value)=>setSelectedType(value)}
        items={types}
        placeholder={{label:"Select a type", value:null}}
      />
      <TouchableOpacity
        className="w-full rounded-lg mt-8 bg-black py-3"
        onPress={handleCreateLobby}
      >
        <Text className="text-center text-white font-bold">Create Lobby</Text>
      </TouchableOpacity>
    </View>
  )
}

export default LobbyCreateScreen

const styles = StyleSheet.create({})