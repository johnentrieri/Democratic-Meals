import React from 'react';
import classes from './Footer.module.css';

const footer = (props) => {
    return (
        <footer className={classes.footer}>
            <span className="text-muted">Olive Robots</span>
        </footer>
    );
};

export default footer;