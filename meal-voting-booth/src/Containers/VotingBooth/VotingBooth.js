import React, {Component} from 'react';

import WeekBanner from '../../Components/WeekBanner/WeekBanner';
import RecipeViewer from '../../Components/RecipeViewer/RecipeViewer';
import VotingControls from '../../Components/VotingBallot/VotingBallot';
import ResultsAlert from '../../Components/ResultsAlert/ResultsAlert';

class VotingBooth extends Component {
    state = {
        week: "December 9th, 2019",
        recipes: [
            {
                title: "Hot Italian Pork Sausage & Brussels Sprouts",
                subtitle: "with Lumaca Rigata Pasta",
                img: "https://media.blueapron.com/recipes/22818/c_main_dish_images/1572900536-33-0008-4521/1209_FPM_Pork-Pasta_9618_Web_high_menu_thumb.jpg"
            },
            {
                title: "Chicken Teriyaki & Miso Kale",
                subtitle: "with Sesame-Roasted Purple Potatoes",
                img: "https://media.blueapron.com/recipes/22816/c_main_dish_images/1575047191-34-0036-7344/1209_FPP_Teriyaki-Chicken-Miso-Kale_023_Web_high_menu_thumb.jpg"
            },
            {
                title: "Sheet Pan Pesto Salmon",
                subtitle: "with a Roasted Vegetable Medley",
                img: "https://media.blueapron.com/recipes/22959/c_main_dish_images/1572900222-35-0014-6094/1209_FPF_Salmon_9628_Web_high_menu_thumb.jpg"
            },
            {
                title: "Chipotle Beyond Beef™ Tacos",
                subtitle: "with Fresh Tomato Salsa & Monterey Jack Cheese",
                img: "https://media.blueapron.com/recipes/22819/c_main_dish_images/1575047025-34-0024-4598/1209_FPV_Beyond-Taco-Night_039_Web_high_menu_thumb.jpg"
            },
            {
                title: "Pork Chops & Buttermilk Mashed Potatoes",
                subtitle: "with Honey-Mustard Pan Sauce & Green Beans",
                img: "https://media.blueapron.com/recipes/22960/c_main_dish_images/1572902152-35-0034-1231/0715_FP5_Pork-Chops_3619_Crop_Right_high_menu_thumb.jpg"
            },
            {
                title: "One-Pot Chicken & Udon Noodles",
                subtitle: "with Spicy Soy-Miso Sauce",
                img: "https://media.blueapron.com/recipes/22821/c_main_dish_images/1572902525-33-0032-8974/1209_FP6_Chicken-Udon_9661_Web_high_menu_thumb.jpg"
            }
        ],
        pollResults: [
            {name: "Jared", votes: [1,2,4]},
            {name: "John", votes: [1,2,3]},
            {name: "Steph", votes: [4,4,4]},
        ]
    }

    voteHandler = (v1, v2, v3, pw) => {
        console.log("You voted for: " + v1 + ", " + v2 + ", and " + v3);
        console.log("You used passphrase: " + pw);
    }

    render() {

        return (
            <div>
                <WeekBanner week={this.state.week} />
                <ResultsAlert results={this.state.pollResults} recipes={this.state.recipes}/>
                <RecipeViewer recipes={this.state.recipes} />
                <VotingControls recipes={this.state.recipes} voteClicked={this.voteHandler}/>                
            </div>
        )
    }
};

export default VotingBooth;