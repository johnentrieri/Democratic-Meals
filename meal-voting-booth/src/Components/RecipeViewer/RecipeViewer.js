import React from 'react';

import Recipe from './Recipe/Recipe';

const recipeViewer = (props) => {
    const recipes = props.recipes.map( (recipe,index) => {
        return(<div className="col-sm-4 p-2" key={"recipe-" + index}><Recipe index={index+1} title={recipe.title} subtitle={recipe.subtitle} imgSrc={recipe.img}/></div>)
    })
    return (
        <div className="container">
                <div className="row">
                    {recipes}
                </div>
        </div>
    );
};

export default recipeViewer;