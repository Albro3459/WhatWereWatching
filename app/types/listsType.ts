import { Content } from "./contentType";

export type WatchList = {
    Planned: Content[],
    Watching: Content[],
    Completed: Content[],
    Favorite: Content[],
};

export default {};