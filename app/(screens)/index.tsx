import { Alert, ImageBackground, TouchableOpacity, Button, StyleSheet, Text, View } from 'react-native'
import {useEffect} from 'react'
import {router} from 'expo-router'
import { createLobby } from "../../hooks/useLobby"
import useAuth from '../../hooks/useAuth'

const Index = () => {
  const {user, logout} = useAuth()
  if(!user) return null

  const handleCreateLobby = () => {
    router.replace("/create-lobby")
  };

  const handleLobbyList = () =>
  {
    router.replace("/lobby-list")
  }

  return (
    <ImageBackground
      className="flex-1"
      resizeMode="cover"
      source={require("../../assets/images/Bg_2var.jpg")}
    >
      <View className="flex-1 justify-center items-center">
        <Text className="font-bold text-3xl text-white">You loged as:</Text>
        <Text className="text-2xl text-white">{user.displayName}</Text>
        <View className="w-full p-5">
        <TouchableOpacity
          className="w-full rounded-lg mt-8 bg-black py-3"
          onPress={handleCreateLobby}
        >
          <Text className="text-center text-white font-bold">Create session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full rounded-lg mt-8 bg-black py-3"
          onPress={handleLobbyList}
        >
          <Text className="text-center text-white font-bold">Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full rounded-lg mt-8 bg-black py-3"
          onPress={logout}
        >
          <Text className="text-center text-white font-bold">Log out</Text>
        </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Index

const styles = StyleSheet.create({})