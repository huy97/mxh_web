import React from 'react';
import PropTypes from 'prop-types';

const PostModify = props => {
    return (
        <div className="post-item__modify">
            <button className="post-item__modify-btn">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </button>
        </div>
    );
};

PostModify.propTypes = {
    post: PropTypes.object.isRequired
};

export default PostModify;