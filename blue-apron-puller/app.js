const puppeteer = require('puppeteer');
const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');

//Asynchronous Function so we can use 'await' with Puppeteer
(async () => {

    //Normal Puppeteer Front Matter
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Blue Apron Recipe Page
    await page.goto('https://www.blueapron.com/pages/sample-recipes');

    //Go to Family (4-Serving) Tab
    await page.click('#Family-tab');

    const result = await page.evaluate(() => {

        //Find the visible 'Weeks' displayed
        const weekCards = document.getElementsByClassName('week-content');

        //Loop through each displayed Week
        for(let i=0 ; i<weekCards.length ; i++) {
            
            //Scrape the 'Week of...' date string
            tempWeek = weekCards[i].querySelector('.week-header-content__date').innerText;

            //Get Current Date & Time
            const currentDate = new Date();

            //Formulate Date String out of 'Week of ...' string to create Date object
            const dateString = tempWeek.split(' ')[2] + " " + tempWeek.split(' ')[3].slice(0,-2) + ", " + currentDate.getFullYear();
            const deliveryDate = new Date(dateString);
        
            //Determine number of days between current date and the Monday of the 'Week of ...' date
            const dateOffset = (deliveryDate - currentDate) / (1000*60*60*24);

            //Cutoff is ~7 Days (Delivery Date is Monday, cutoff is Tuesday)
            //Should be modified for different cutoffs, delivery dates, etc.

            //If we are within the cutoff period, it is too late to modify that week's recipes - skip to the next loop iteration
            if (dateOffset < 7) { 
                continue;
            };

            //Create Object structure to return
            const tempWeekObj = { week: "", meals: [] };

            //Set 'week' attribute to the dateString formulated above
            tempWeekObj.week = dateString;

            //Scrape for each currently visible Recipe Card within this week
            const recipeCards = weekCards[i].querySelector('.Family .recipe-cards-3ds').getElementsByClassName('recipe-product-card__container');

            //Loop through each recipe in a given week
            for(let j=0 ; j<recipeCards.length ; j++) {

                //Create Meal Object structure
                const tempMealObj = { title: "", subtitle: "", img: "" };

                //Get Recipe Title
                tempMealObj.title = recipeCards[j].querySelector('.recipe-content__title').innerText;

                //Get Recipe Subtitle
                tempMealObj.subtitle = recipeCards[j].querySelector('.recipe-content__subtitle').innerText;

                //Get Recipe Image URL
                //Blue Apron Image URLs usually contain content after the .jpg (e.g. ...jpg?quality=1")
                //Processing is here to cut the string off after '.jpg'
                tempImgStr = recipeCards[j].querySelector('.recipe-image-tag').src
                tempMealObj.img = tempImgStr.slice(0,tempImgStr.indexOf('.jpg') + '.jpg'.length);

                //Push into Return Object
                tempWeekObj.meals.push(tempMealObj);
            }

            return(tempWeekObj);
        }
    });

    //Recipe Data File Location
    const recipeDataFile = './recipe-data.json';

    let prevData = "";

    
    if (fs.existsSync(recipeDataFile)) {

        //Pull previously saved JSON file as string
        prevData = fs.readFileSync(recipeDataFile, "utf8");

    } else {

        //No previous data found
        prevData = "";
    }

    //Convert newly scraped object into string
    const newData = JSON.stringify(result);

    //String comparison to see if anything has changed
    if (prevData === newData) {

        //Processing if nothing has changed since the last scrape
        console.log("New Data Not Found");

        //Notify Admin - Site was scraped, no new recipes
        axios.post('http://192.168.1.44:5000/notify/', querystring.stringify({
            who : 'admin',
            subject: '[Democratic Meals] No New Recipes',
            message: 'Blue Apron was scraped and no new recipes have been found.'
        }))
        .then( (response) => {
            console.log("Admin Notified");

            process.exit();
        })
        .catch( (error) => {
            console.log(error);
        });
    } 
    else {

        //Processing if recipe data has changed since the last scrape
        console.log("New Data Found");

        //Notify All Users - New recipes are available
        axios.post('http://192.168.1.44:5000/notify/', querystring.stringify({
            who : 'all',
            subject: '[Democratic Meals] New Recipes',
            message: 'New recipes have been pulled from Blue Apron: http://192.168.1.44:3000'
        }))
        .then( (response) => {
            console.log("Notifications Sent");

            //Reset Polls
            return( axios.post('http://192.168.1.44:5000/reset/') );
        })
        .then( (response) => {
            console.log("Polls Reset");

            //Write data to JSON file
            
            fs.writeFileSync(recipeDataFile, newData, 'utf8', (error) => {
                if (error) throw error;
                console.log('Complete');
            });

            process.exit();
            
        })
        .catch( (error) => {
            console.log(error);
        });
    }   
})();