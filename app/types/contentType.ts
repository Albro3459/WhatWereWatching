type Genre = {
    id: string;
    name: string;
  };
  
  type Audio = {
    language: string;
    region?: string; // Optional
  };
  
  type Subtitle = {
    closedCaptions: boolean;
    locale: {
      language: string;
    };
  };
  
  type Price = {
    amount: string;
    currency: string;
    formatted: string;
  };
  
  type ServiceImageSet = {
    lightThemeImage: string;
    darkThemeImage: string;
    whiteImage: string;
  };
  
  type Service = {
    id: string;
    name: string;
    homePage: string;
    themeColorCode: string;
    imageSet: ServiceImageSet;
  };
  
  type StreamingOption = {
    service: Service;
    type: 'rent' | 'buy' | 'subscription';
    link: string;
    videoLink?: string; // Optional
    quality: string;
    audios: Audio[];
    subtitles: Subtitle[];
    price?: Price; // Optional, since "subscription" might not have a price
    expiresSoon: boolean;
    expiresOn?: number; // Optional
    availableSince: number;
  };
  
  type ImageSet = {
    verticalPoster: {
      w240?: string;
      w360?: string;
      w480?: string;
      w600?: string;
      w720?: string;
    };
    horizontalPoster: {
      w360?: string;
      w480?: string;
      w720?: string;
      w1080?: string;
      w1440?: string;
    };
    verticalBackdrop: {
      w240?: string;
      w360?: string;
      w480?: string;
      w600?: string;
      w720?: string;
    };
    horizontalBackdrop: {
      w360?: string;
      w480?: string;
      w720?: string;
      w1080?: string;
      w1440?: string;
    };
  };
  
  export type Content = {
    itemType: 'show';
    showType: 'movie' | 'series';
    id: string;
    imdbId: string;
    tmdbId: string;
    title: string;
    overview: string;
    releaseYear: number;
    originalTitle: string;
    genres: Genre[];
    directors: string[];
    cast: string[];
    rating: number;
    runtime: number;
    imageSet: ImageSet;
    streamingOptions: {
      [countryCode: string]: StreamingOption[];
    };
  };
  
  export default {};