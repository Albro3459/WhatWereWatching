

export type Filter = {
    selectedGenres: string[];
    selectedTypes: string[];
    selectedServices: string[];
    selectedPaidOptions: string[];
};

export const Genres = [
    { label: 'Action', value: 'Action' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Animation', value: 'Animation' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Crime', value: 'Crime' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Sci-Fi', value: 'Science Fiction' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Reality', value: 'Reality' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Documentary', value: 'Documentary' },
    { label: 'Family', value: 'Family' },
    { label: 'Musical', value: 'Musical' },
    { label: 'Biography', value: 'Biography' },
    { label: 'History', value: 'History' },
    { label: 'War', value: 'War' },
    { label: 'Western', value: 'Western' },
];

export const Types = [
    { label: 'Movie', value: 'movie' },
    { label: 'Show', value: 'series' },
];

export const Services = [
    { label: 'Netflix', value: 'netflix' },
    { label: 'Hulu', value: 'hulu' },
    { label: 'HBO Max', value: 'hbomaxus' },
    { label: 'Amazon Prime', value: 'Prime Video' },
    { label: 'Apple TV', value: 'apple' },
    { label: 'Disney+', value: 'disney' },
    { label: 'Peacock', value: 'peacock' },
    { label: 'Paramount+', value: 'cbsaacf' },
    { label: 'Tubi', value: 'tvs.sbd.13160' },
];

export const PaidOptions = [
    { label: 'Free', value: 'free' },
    { label: 'Subscription', value: 'subscription' },
    { label: 'Rent', value: 'rent' },
    { label: 'Buy', value: 'buy' },
    { label: 'Add On', value: 'addon' },
];

export default {};