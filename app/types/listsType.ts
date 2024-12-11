import { Content, PosterContent } from "./contentType";

// export type WatchList = {
//     Planned: Content[],
//     Watching: Content[],
//     Completed: Content[],
//     Favorite: Content[],
// };

export type WatchList = {
    [key: string]: Content[];
};

export type PosterList = {
  [key: string]: PosterContent[];
};

export default {};