

export type Filter = {
    selectedGenres: string[];
    selectedTypes: string[];
    selectedServices: string[];
    selectedPaidOptions: string[];
};

export const Genres = [
    { label: 'Action', value: 'action' },
    { label: 'Adventure', value: 'adventure' },
    { label: 'Animation', value: 'animation' },
    { label: 'Comedy', value: 'comedy' },
    { label: 'Crime', value: 'crime' },
    { label: 'Documentary', value: 'documentary' },
    { label: 'Drama', value: 'drama' },
    { label: 'Family', value: 'family' },
    { label: 'Fantasy', value: 'fantasy' },
    { label: 'History', value: 'history' },
    { label: 'Horror', value: 'horror' },
    { label: 'Musical', value: 'music' },
    { label: 'Biography', value: 'biography' },
    { label: 'Mystery', value: 'mystery' },
    { label: 'News', value: 'news' },
    { label: 'Reality', value: 'reality' },
    { label: 'Romance', value: 'romance' },
    { label: 'Science Fiction', value: 'scifi' },
    { label: 'Talk Show', value: 'talk' },
    { label: 'Thriller', value: 'thriller' },
    { label: 'War', value: 'war' },
    { label: 'Western', value: 'western' }
];

export const Types = [
    { label: 'Movie', value: 'movie' },
    { label: 'Show', value: 'series' },
];

export const Services = [
    { label: 'Netflix', value: 'netflix' },
    { label: 'Hulu', value: 'hulu' },
    { label: 'HBO Max', value: 'hbo' },
    { label: 'Amazon Prime', value: 'prime' },
    { label: 'Apple TV', value: 'apple' },
    { label: 'Disney+', value: 'disney' },
    { label: 'Peacock', value: 'peacock' },
    { label: 'Paramount+', value: 'paramount' },
    { label: 'Discovery+', value: 'discovery' },
    { label: 'Starz', value: 'starz' },
    { label: 'Tubi', value: 'tubi' },
];

export const PaidOptions = [
    { label: 'Free', value: 'free' },
    { label: 'Subscription', value: 'subscription' },
    { label: 'Rent', value: 'rent' },
    { label: 'Buy', value: 'buy' },
];

export default {};