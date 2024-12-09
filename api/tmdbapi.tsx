import axios from "axios";

const API_KEY = "94f34062cbb7aa801e41e62748bc8cb8";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMoviesByGenreAndType = async (genreId, type) => {
  try {
    // Убедимся, что параметры корректны
    const endpoint = type === "tv" ? "discover/tv" : "discover/movie";

    // Логируем параметры для проверки
    console.log("Fetching movies with genre:", genreId, "and type:", type);

    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: {
        api_key: API_KEY,
        with_genres: genreId,
        language: "en-US",
        sort_by: "popularity.desc",
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies: ", error);
    return [];
  }
};
