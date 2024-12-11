import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Image, ImageBackground, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { fetchMoviesByGenreAndType } from "../../api/tmdbapi";
import Swiper from "react-native-deck-swiper";
import { SafeAreaView } from "react-native-safe-area-context";
import { addVote } from '../../utils/addVote'

const MovieSwipeScreen = () => {
  const { lobbyId } = useLocalSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      console.log('id: ', lobbyId);
      if (!lobbyId) {
        console.log('No lobbyId provided.');
        return;
      }

      // Fetch lobby details
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

      console.log('Genre:', genre, 'Type:', type);

      // Fetch movies based on genre and type
      setLoading(true);
      const moviesData = await fetchMoviesByGenreAndType(genre, type);
      setMovies(moviesData || []);
      setLoading(false);
    };
    fetchMovies();
  }, [lobbyId]);

  useEffect(()=>{
    if(!lobbyId) return;

    const lobbyRef = doc(db, "lobbies", lobbyId);

    const unsubscribe = onSnapshot(lobbyRef, (snapshot) =>{
      if(!snapshot.exists()) return;

      const lobbyData = snapshot.data();
      const votes = lobbyData.votes || {};
      const currentUserId = auth.currentUser?.uid;

      const otherUsersVotes = Object.entries(votes)
        .filter(([userId])=>userId!==currentUserId)
        .map(([, userVotes])=>userVotes);

      if(otherUsersVotes.length === 0) return;

      const commonMovies = otherUsersVotes.reduce((acc, userVotes)=>{
        if(!acc) return new Set(userVotes);
        return new Set([...acc].filter((movie)=>userVotes.includes(movie)));
      }, null);

      if(commonMovies && commonMovies.size > 0){
        const matchedMovieId = [...commonMovies][0];
        const matchedMovie = movies.find((movie)=>movie.id===matchedMovieId);

        if(matchedMovie)
        {
          Alert.alert(
            "Match found!",
            `You both liked the movie: ${matchedMovie.title || matchedMovie.name}`
          );
        }
      }
    });
    return ()=>unsubscribe()
  }, [lobbyId, movies]);

  const handleSwipeRight = async (index) => {
    const likedMovie = movies[index];
    const result = await addVote(lobbyId, likedMovie.id);
    if(result.success)
    {
      Alert.alert("Match found!", `You both liked the movie: ${result.movieId}`);
    }
    console.log("Liked: ", likedMovie?.title || likedMovie?.name);
  };

  const handleSwipeLeft = (index) => {
    const dislikedMovie = movies[index];
    console.log("Disliked: ", dislikedMovie?.title || dislikedMovie?.name);
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
          containerStyle={{
            backgroundColor: "transparent",
          }}
          cards={movies}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
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
    </ImageBackground>
    </SafeAreaView>
  );
};

export default MovieSwipeScreen;
