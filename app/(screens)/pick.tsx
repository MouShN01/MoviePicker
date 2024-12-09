import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchMoviesByGenreAndType } from "../../api/tmdbapi";
import Swiper from "react-native-deck-swiper";

const MovieSwipeScreen = () => {
  const { genreId, type, lobbyId } = useLocalSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const moviesData = await fetchMoviesByGenreAndType(genreId, type);
      setMovies(moviesData || []);
      setLoading(false);
    };
    fetchMovies();
  }, [genreId, type]);

  const handleSwipeRight = (index) => {
    const likedMovie = movies[index];
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
    <View className="flex-1 bg-gray-900 justify-center items-center">
      <View className="absolute top-10">
        <Text className="text-center text-white text-2xl font-bold mt-4 mb-2">
          Swipe Movies
        </Text>
      </View>
      <View className="flex-1 justify-center items-center w-full h-full">
        <Swiper
          containerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }} // Выравнивание
          cards={movies}
          renderCard={(movie) => (
            <View className="w-72 h-96 bg-white rounded-lg shadow-lg border-gray-300 overflow-hidden">
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }}
                className="w-full h-2/3"
                resizeMode="cover"
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
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
          cardIndex={0}
          backgroundColor="transparent"
          stackSize={3}
          animateCardOpacity
          verticalSwipe={false}
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
    </View>
  );
};

export default MovieSwipeScreen;
