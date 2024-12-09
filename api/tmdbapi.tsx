import axios from 'axios'

const API_KEY = "94f34062cbb7aa801e41e62748bc8cb8";
const BASE_URL="https://api.themoviedb.org/3"

export const fetchMoviesByGenreAndType = async  (genreId, type) =>{
    try{
        const endpoint = type === "tv" ? "discover/tv" : "discover/movie";
        const responce = await axios.get(
            `${BASE_URL}/${endpoint}`,
            {
                params:{
                    api_key: API_KEY,
                    with_genres:genreId,
                    language: "en-US",
                    sort_by:"popularity.desc",
                },
            }
        );
        return responce.data.results;
    } catch(error){
        console.error("Error fatching movies: ", error);
    }
};