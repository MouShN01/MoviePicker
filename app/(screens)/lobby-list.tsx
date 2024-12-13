import { View, Text, FlatList, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import useAuth from '../../hooks/useAuth'
import Icon from 'react-native-vector-icons/Ionicons'

const LobbyList = () => {
  const [lobbies, setLobbies] = useState([]);
  const { user } = useAuth();
  const genreMap = {
    "28": "Action",
    "35": "Comedy",
    "18": "Drama",
    "27": "Horror",
    "16": "Animation",
  };
  
  const typeMap = {
    "movie": "Movie",
    "tv": "TV Show",
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'lobbies'), (snapshot) => {
      const availableLobbies = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((lobby) => lobby.status === 'waiting' && lobby.hostId !== user.uid);
      setLobbies(availableLobbies);
    });

    return () => unsubscribe();
  }, []);

  const joinLobby = async (lobbyId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You need to be logged in to join a lobby.');
        return;
      }

      const lobbyRef = doc(db, 'lobbies', lobbyId);

      await updateDoc(lobbyRef, {
        guestId: user.uid,
        status: "connected",
      });

      Alert.alert('Success', `Request sent to join lobby: ${lobbyId}`);
      router.replace({pathname:"/pick", params:{lobbyId},});
    } catch (error) {
      console.error('Error joining lobby:', error);
      Alert.alert('Error', 'Failed to join lobby. Please try again.');
    }
  };

  return (
    <ImageBackground
      className="flex-1"
      resizeMode="cover"
      source={require("../../assets/images/Bg_2var.jpg")}
    >
      <View className="flex-1">
        <View className="absolute top-4 left-4 flex-row items-center z-10">
          <TouchableOpacity
            className="w-12 h-12 bg-black rounded-full justify-center items-center"
            onPress={() => router.replace("/")}
          >
            <Icon name="arrow-back" color="white" size={24} />
          </TouchableOpacity>
          <Text className="ml-4 text-2xl text-white font-bold">Available Lobbies</Text>
        </View>
        <FlatList
          data={lobbies}
          contentContainerStyle={{paddingHorizontal: 16, padding:80}}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 bg-gray-900 mb-4 rounded-lg w-full"
              onPress={() => joinLobby(item.id)}
            >
              <Text className="text-lg font-bold text-white">Host: {item.hostName}</Text>
              <Text className="text-md font-bold text-white">Type: {typeMap[item.type]}</Text>
              <Text className="text-md font-bold text-white">Genre: {genreMap[item.genre]}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
};

export default LobbyList;
