export const getFallbackImage = (index: number) => {
    // We have 4 local placeholder images: 1.jpg, 2.jpg, 3.jpg, 4.jpg
    const totalPlaceholders = 4;
    const imageNumber = (index % totalPlaceholders) + 1;
    return `/images/placeholders/${imageNumber}.jpg`;
};
