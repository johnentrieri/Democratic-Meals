import React from 'react';

const recipe = (props) => {
    return (
        <div className="card h-100">
            <img src={props.imgSrc} className="card-img-top" alt="..." />
            <div className="card-body">
                <h4 className="card-title">{props.index}</h4>
                <h5 className="card-title">{props.title}</h5>
                <p className="card-subtitle">{props.subtitle}</p>
            </div>
        </div>
    );
};

export default recipe;