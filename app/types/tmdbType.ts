export type TMDB = {
    movie_results: Array<{
      backdrop_path: string | null;
      id: number;
      title: string;
      original_title: string;
      overview: string;
      poster_path: string | null;
      media_type: string;
      adult: boolean;
      original_language: string;
      genre_ids: number[];
      popularity: number;
      release_date: string;
      video: boolean;
      vote_average: number;
      vote_count: number;
    }>;
    person_results: Array<unknown>;
    tv_results: Array<{
      backdrop_path: string | null;
      id: number;
      name: string;
      original_name: string;
      overview: string;
      poster_path: string | null;
      media_type: string;
      adult: boolean;
      original_language: string;
      genre_ids: number[];
      popularity: number;
      first_air_date: string;
      vote_average: number;
      vote_count: number;
      origin_country: string[];
    }>;
    tv_episode_results: Array<unknown>;
    tv_season_results: Array<unknown>;
};
  
export default {};