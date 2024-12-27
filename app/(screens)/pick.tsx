import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Image, ImageBackground, Alert, Modal, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { fetchMoviesByGenreAndType } from "../../api/tmdbapi";
import Swiper from "react-native-deck-swiper";
import { SafeAreaView } from "react-native-safe-area-context";
import { addVote } from '../../utils/addVote'

type Movie = {
  id: string;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
};

const MovieSwipeScreen = () => {
  const { lobbyId } = useLocalSearchParams<{lobbyId:string}>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [likedMovies, setlikedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [matchedMovie, setMatchedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreMovies, setNoMoreMovies] = useState(false);
  const [genre, setGenre] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    const fetchLobbyData = async () => {
      if (!lobbyId || Array.isArray(lobbyId)) {
        console.log('Invalid lobbyId provided.');
        return;
      }

      const lobbyRef = doc(db, 'lobbies', lobbyId);
      const lobbySnap = await getDoc(lobbyRef);

      if (!lobbySnap.exists()) {
        console.log('Lobby not found.');
        return;
      }

      const lobbyData = lobbySnap.data();
      const { genre, type } = lobbyData;

      if (!genre || !type) {
        console.log('Missing genre or type in lobby data.');
        return;
      }

      setGenre(genre);
      setType(type);

      console.log('Genre:', genre, 'Type:', type);

      setLoading(true);
      const moviesData = await fetchMoviesByGenreAndType(genre, type, 1);
      setMovies(moviesData || []);
      setLoading(false);
    };

    fetchLobbyData();
  }, [lobbyId]);

  useEffect(()=>{

    if (!lobbyId || Array.isArray(lobbyId)) {
        console.log('Invalid lobbyId provided.');
        return;
      }

    const lobbyRef = doc(db, "lobbies", lobbyId);

    const unsubscribe = onSnapshot(lobbyRef, (snapshot) =>{
      if(!snapshot.exists()) return;

      const lobbyData = snapshot.data();
      const votes = lobbyData.votes || {};
      const currentUserId = auth.currentUser?.uid;

      if(!currentUserId) return;

      const currentUserVotes:string[] = votes[currentUserId] || [];
      if (currentUserVotes.length === 0) return;

      const otherUsersVotes = Object.entries(votes)
        .filter(([userId])=>userId!==currentUserId)
        .flatMap(([, userVotes])=>userVotes);

      if(otherUsersVotes.length === 0) return;

      const matchedMovieId = currentUserVotes.find((movieId)=> otherUsersVotes.includes(movieId));

        if(matchedMovieId)
        {
          const movie = movies.find((m:{id:string})=>m.id === matchedMovieId);
          if(movie)
          {
            setMatchedMovie(movie);
            setModalVisible(true);
          }
        }
    });
    return ()=>unsubscribe()
  }, [lobbyId, movies]);

  useEffect(() => {
    if (!lobbyId || Array.isArray(lobbyId)) {
        console.log('Invalid lobbyId provided.');
        return;
      }
    
    const lobbyRef = doc(db, "lobbies", lobbyId);
  
    const unsubscribe = onSnapshot(lobbyRef, async (snapshot) => {
      if (!snapshot.exists()) return;
  
      const lobbyData = snapshot.data();
  
      if (lobbyData.status === "closed") {
        try {
          await deleteDoc(lobbyRef);
          router.push("/");
          console.log("Lobby deleted due to closed status.");
        } catch (error) {
          console.error("Error deleting lobby:", error);
        }
      }
    });
  
    return () => unsubscribe();
  }, [lobbyId]);

  const handleSwipeRight = async (index:number) => {
    const likedMovie = movies[index];
    setlikedMovies((prevMovies) => [...prevMovies, likedMovie]);
    const result = await addVote(lobbyId, likedMovie.id);
    console.log("Liked: ", likedMovie?.title || likedMovie?.name);
  };

  const handleSwipeLeft = (index:number) => {
    const dislikedMovie = movies[index];
    console.log("Disliked: ", dislikedMovie?.title || dislikedMovie?.name);
  };

  const handleEndReached = async () => {
    if (loadingMore || noMoreMovies || !genre || !type) return;
  
    setLoadingMore(true);
    try {
      const nextPageMovies = await fetchMoviesByGenreAndType(genre, type, page + 1);
      console.log(nextPageMovies);
  
      if (nextPageMovies.length === 0) {
        setNoMoreMovies(true);
      } else {
        setMovies([]);
        setTimeout(() => {
          setMovies(nextPageMovies);
          setPage((prevPage) => prevPage + 1);
      }, 0);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleExit = async () => {
    try {
      if (lobbyId) {
        const lobbyRef = doc(db, "lobbies", lobbyId);
        await updateDoc(lobbyRef, { status: "closed" });
        setModalVisible(false);  
      }
    } catch (error) {
      console.error("Error deleting lobby or navigating:", error);
    }
  };

  if(loading)
  {
    return(
      <View className="flex-1 justify-center items-center bg-gray-900">
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="text-white text-xl mt-4">Loading movies...</Text>
    </View>
    );
  }

  if (movies.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white text-xl mt-4">No movies found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        className="flex-1"
        resizeMode="cover"
        source={require("../../assets/images/Bg_2var.jpg")}
      >
      <View className="flex-row items-center justify-center">
        <Text className="text-2xl text-white font-bold">Movie Picker</Text>
      </View>
      <View className="flex-1 -mt-6">
        <Swiper
          key={movies.length}
          containerStyle={{
            backgroundColor: "transparent",
          }}
          cards={movies}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
          onSwipedAll={handleEndReached}
          cardIndex={0}
          stackSize={3}
          animateCardOpacity
          verticalSwipe={false}
          renderCard={(movie) => (
            <View className="relative bg-white h-5/6 rounded-xl justify-center items-center shadow-xl">
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }}
                className="w-full h-4/6"
                resizeMode="contain"
              />
              <View className="p-4">
                <Text className="text-lg font-bold text-black">
                  {movie.title || movie.name}
                </Text>
                <Text className="text-gray-600">
                  Rating: {movie.vote_average.toFixed(1)}
                </Text>
                <Text className="text-gray-700 mt-2" numberOfLines={5}>
                  {movie.overview}
                </Text>
              </View>
            </View>
          )}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: "red",
                  color: "white",
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: -20,
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  backgroundColor: "green",
                  color: "white",
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
          }}
        />
      </View>
      <View className="flex-1 justify-center items-center">
        <TouchableOpacity
          className="absolute bottom-1 w-5/6 left-1/8 rounded-lg bg-black py-3"
          onPress={handleExit}
        >
          <Text className="text-center text-white font-bold">Leave Lobby</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    {matchedMovie && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black-50/75">
          <View className="bg-white rounded-lg p-4 w-4/5 max-h-3/4 shadow-lg"
          style={{
            borderWidth: 2,
            borderColor: "#000",
            shadowColor: "#000", 
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16, 
            elevation: 10, 
          }}
          >
            <Text className="text-2xl font-bold text-center text-black mb-4">
              🎉 You got a match! 🎉
            </Text>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${matchedMovie.poster_path}`,
              }}
              className="w-full h-48 rounded mb-4"
              resizeMode="contain"
            />
            <ScrollView
              style={{ maxHeight: 150 }}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <Text className="text-xl font-bold text-black text-center mb-2">
                {matchedMovie.title || matchedMovie.name}
              </Text>
              <Text className="text-gray-700 text-justify">
                {matchedMovie.overview || "No description available."}
              </Text>
            </ScrollView>
            <TouchableOpacity
              className="bg-black rounded-full mt-4 p-3"
              onPress={handleExit}
            >
              <Text className="text-white text-center text-lg">Return to Main Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )}


    </SafeAreaView>
  );
};

export default MovieSwipeScreen;
