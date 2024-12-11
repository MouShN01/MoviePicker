import { View, Text, FlatList, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import useAuth from '../../hooks/useAuth'

const LobbyList = () => {
  const [lobbies, setLobbies] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'lobbies'), (snapshot) => {
      const availableLobbies = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((lobby) => lobby.status === 'waiting' && lobby.hostId !== user.uid); // Фильтруем только доступные лобби
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

      // Обновляем лобби, добавляя guestId
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
      <View className="flex-1 p-4">
        <Text className="text-2xl text-white font-bold mb-4">Available Lobbies</Text>
        <FlatList
          data={lobbies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 bg-gray-900 mb-4 rounded-lg"
              onPress={() => joinLobby(item.id)}
            >
              <Text className="text-lg font-bold text-white">Host: {item.hostId}</Text>
              <Text className="text-md font-bold text-white">Type: {item.type}</Text>
              <Text className="text-md font-bold text-white">Genre: {item.genre}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
};

export default LobbyList;
