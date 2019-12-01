import React from 'react';

const weekBanner = (props) => {
    return (
        <div className="jumbotron">
            <h1 className="display-4">{props.week}</h1>
        </div>
    );
};

export default weekBanner;