import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import lowImage from 'assets/low.png';

const LoadImage = React.memo(props => {
    const {src, alt, lazy} = props;
    const [srcImage, setSrc] = useState(lowImage);

    useEffect(() => {
        if(!lazy){
            const image = new Image();
            image.onload = () => {
                setSrc(image.src);
            }
            image.src = src;
        }
        //eslint-disable-next-line
    }, [src]);

    if(!lazy){
        return <img src={srcImage} alt={alt} />;
    }
    return (
        <img src={lowImage} data-src={src} alt={alt} className="lazyload"/>
    );
});

LoadImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    lazy: PropTypes.bool,
};

LoadImage.defaultProps = {
    lazy: true
}

export default LoadImage;