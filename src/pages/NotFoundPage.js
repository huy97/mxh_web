import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = props => {
    return (
        <div className="not-found">
            <h1>404</h1>
            <h3>Oops! Trang bạn truy cập không tồn tại.</h3>
            <Link to="/" className="button">Trang chủ</Link>
        </div>
    );
};
export default NotFoundPage;