import React from 'react';

const votingBallot = (props) => {
    const recipeOptions = props.recipes.map( (recipe, index) => {
        return(
            <option key={"option-" + index} value={index+1}>{index+1 + ": " + recipe.title}</option>
        )
    });

    return (
        <div className="container my-5 p-5 bg-light rounded border border-secondary shadow">
            <h3>Voting Ballot</h3>
            <div className="row my-5">
                <div className="col-sm-4">
                    <select id="vote-1" className="custom-select my-2">
                        {recipeOptions}
                    </select> 
                </div>
                <div className="col-sm-4">
                    <select id="vote-2" className="custom-select my-2">
                        {recipeOptions}
                    </select> 
                </div>
                <div className="col-sm-4">
                    <select id="vote-3" className="custom-select my-2">
                        {recipeOptions}
                    </select> 
                </div>
            </div>
            <div className="row my-5">
                <div className="col-sm-4"></div>
                <div className="col-sm-2 text-center">
                    <p>Enter Passphrase: </p>
                </div>
                <div className="col-sm-3">
                    <input id="inputPassphrase" type="password" className="m-auto form-control" />
                </div>              
                <div className="col-sm-3"></div>
            </div>
            <div className="row mt-5">
                <button type="button" 
                    className="btn btn-primary m-auto"
                    onClick={() => { 
                        const v1 = document.querySelector('#vote-1').value;
                        const v2 = document.querySelector('#vote-2').value;
                        const v3 = document.querySelector('#vote-3').value;
                        const pw = document.querySelector('#inputPassphrase').value;
                        return(                                  
                            props.voteClicked(v1,v2,v3,pw)
                        )
                    }} >
                    Vote
                </button>
            </div>
        </div>
    );
};

export default votingBallot;