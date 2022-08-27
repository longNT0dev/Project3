import React from "react";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css"

const ImageSlider = ({ slides }) => {
    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }
    const images = slides.map(src => ({ original: src, thumbnail: src, originalWidth: "600px", originalHeight: "320px", thumbnailWidth: '250px!important', thumbnailHeight: "150px!important" }))

    return (
        <ImageGallery items={images} showFullscreenButton={false} showPlayButton={false} showBullets={true} />
    );
};

export default ImageSlider