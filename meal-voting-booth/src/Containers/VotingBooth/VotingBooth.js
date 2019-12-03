import React, {Component} from 'react';
import axios from 'axios';

import WeekBanner from '../../Components/WeekBanner/WeekBanner';
import RecipeViewer from '../../Components/RecipeViewer/RecipeViewer';
import VotingBallot from '../../Components/VotingBallot/VotingBallot';
import ResultsAlert from '../../Components/ResultsAlert/ResultsAlert';

class VotingBooth extends Component {
    state = {
        week: "",
        recipes: [],
        pollResults: [],
        voteStatus: "",
        voteMessage: ""
    }

    componentDidMount() {
        axios.get('http://192.168.1.44:5000/recipes/')
        .then( (response) => {
            const recipeData = response.data;
            this.setState({ week : recipeData.week, recipes : recipeData.meals });
        })

        axios.get('http://192.168.1.44:5000/polls/')
        .then( (response) => {
            const pollData = response.data.results;
            this.setState({ pollResults : pollData });
        })
    }


    componentDidUpdate(prevProps, prevState) {
        if(prevState.voteStatus !== this.state.voteStatus) {
            axios.get('http://192.168.1.44:5000/polls/')
            .then( (response) => {
                const pollData = response.data.results;
                this.setState({ pollResults : pollData });
            })
        }
    }

    voteHandler = (v1, v2, v3, pw) => {
        console.log("You voted for: " + v1 + ", " + v2 + ", and " + v3);
        console.log("You used passphrase: " + pw);

        let bodyFormData = new FormData();
        bodyFormData.set('passphrase', pw);
        bodyFormData.set('v1', v1);
        bodyFormData.set('v2', v2);
        bodyFormData.set('v3', v3);

        axios({
            method: 'post',
            url: `http://192.168.1.197:44/vote/`,
            data: bodyFormData,
            headers: {'Content-Type': 'multipart/form-data' }
        })
        .then( (response) => {
            this.setState({ voteStatus : response.data.status });
            this.setState({ voteMessage : response.data.message });
        })
    }

    render() {

        return (
            <div>
                <WeekBanner week={this.state.week} />
                <ResultsAlert results={this.state.pollResults} recipes={this.state.recipes}/>
                <RecipeViewer recipes={this.state.recipes} />
                <VotingBallot
                    recipes={this.state.recipes}
                    voteClicked={this.voteHandler}
                    voteStatus={this.state.voteStatus}
                    voteMessage={this.state.voteMessage} />                
            </div>
        )
    }
};

export default VotingBooth;