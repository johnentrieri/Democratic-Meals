import React from 'react';

const resultsAlert = (props) => {
  
    let voteCounts = []
    for (let i=0 ; i < props.recipes.length ; i++) {
            voteCounts.push(0);
    }

    let total=0;
    for (let i=0 ; i < props.results.length ; i++) {
        for (let j=0 ; j < props.results[i].votes.length ; j++) {
            if (props.results[i].votes[j] !== 0) {
                let recipeIndex = props.results[i].votes[j] - 1;
                voteCounts[recipeIndex] += 1;
                total += 1;
            }
        }
    }

    if (props.isComp) {

        const userResults = props.results.map( (user,index) => {
            return(
                <div className="col-sm">
                    <div className="card">
                        <div className="card-body">
                            <h5>{user.name}</h5>
                            <p>Votes: {user.votes}</p>
                        </div>
                    </div>
                </div>
            );
        });
        
        const recipeResults = props.recipes.map( (recipe,index) => {
            return(<li>{recipe.title + " (" + voteCounts[index] + " Votes)"}</li>)
        });

        return(
            <div className="alert alert-success container" role="alert">
                <div className="row my-3">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        <h4>Voting has completed for this week, here are the results:</h4>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                <div className="row my-3">
                    {userResults}
                </div>
                <div className="row my-3">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        <ol>
                            {recipeResults}
                        </ol>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
            </div>
        );
    } else {
        return (<div></div>);
    }
};

export default resultsAlert;