import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

const Dialog = props => {
    const {visible, title, header, footer, onClose, style, children} = props;

    return (
        <div className={`dialog ${visible ? 'show' : ''}`}>
            <div className="dialog-container" style={style}>
                <span onClick={onClose} className="dialog-container__close">&times;</span>
                <div className="dialog-container__header">
                    {header ? header : <h2 className="dialog-container__header-title">{title}</h2>}
                </div>
                <div className="dialog-container__body">
                    {children}
                </div>
                {footer ? <div className="dialog-container__footer">
                    {footer}
                </div> : null }
            </div>
        </div>
    );
};

Dialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    title: PropTypes.string,
    header: PropTypes.element,
    footer: PropTypes.element,
    style: stylePropType
};

Dialog.defaultProps = {
    visible: false,
    onClose: () => {}
};

export default Dialog;