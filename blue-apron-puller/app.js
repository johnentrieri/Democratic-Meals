const puppeteer = require('puppeteer');
const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');

const API_URL = "http://192.168.1.44:5000";
const SITE_URL = "http://192.168.1.44:3000";

//Asynchronous Function so we can use 'await' with Puppeteer
(async () => {

    //Normal Puppeteer Front Matter
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Blue Apron Recipe Page
    await page.goto('https://www.blueapron.com/pages/sample-recipes');

    //Evaluate JavaScript on page
    const result = await page.evaluate(() => {

        //Click 'Signature for Four' Tab
        document.querySelectorAll('.MenuSelector-styles-module__button___1vIjh')[0].click();

        //Get all 'Week' <div>'s
        const weekSections = [];
        const weekHeaders = document.querySelectorAll('.SampleRecipes-styles-module__weeklyHeader___SbQVc');
        for (let i=0;i<weekHeaders.length;i++) {
            weekSections.push(weekHeaders[i].parentNode);
        }

        //Loop through each displayed Week

        for (let i=0;i<weekSections.length;i++) {

            //Get MONTH DAY string
            tempWeek = weekSections[i].querySelectorAll('.WeeklyHeader-styles-module__weekOfText___3EIxz')[1].innerText;

            //Get Current Date & Time
            const currentDate = new Date();

            //Formulate Date String out of 'Week of ...' string to create Date object
            const dateString = tempWeek.split(' ')[0].slice(0,1) + tempWeek.split(' ')[0].slice(1).toLowerCase() + " " + tempWeek.split(' ')[1].slice(0,-2) + ", " + currentDate.getFullYear();
            const deliveryDate = new Date(dateString);

            //Determine number of days between current date and the Monday of the 'Week of ...' date
            const dateOffset = (deliveryDate - currentDate) / (1000*60*60*24);

            //Cutoff is ~6 Days (Delivery Date is Monday, cutoff is Tuesday)
            //Should be modified for different cutoffs, delivery dates, etc.

            //If we are within the cutoff period, it is too late to modify that week's recipes - skip to the next loop iteration            
            if (dateOffset < 6) { 
                continue;
            };

            //Create Object structure to return
            const tempWeekObj = { week: "", meals: [] };

            //Set 'week' attribute to the dateString formulated above
            tempWeekObj.week = dateString;

            //Scrape for each currently visible Recipe Card within this week
            const recipeCards = weekSections[i].querySelectorAll('.FoodOfferingBoxes-styles-module__productCardWrapper___3qT_8');

            //Loop through each recipe in a given week
            for(let j=0 ; j<recipeCards.length ; j++) {

                //Create Meal Object structure
                const tempMealObj = { title: "", subtitle: "", img: "" };

                //Get Recipe Title
                tempMealObj.title = recipeCards[j].querySelectorAll('.pom-Product__Title p')[0].innerText

                //Get Recipe Subtitle
                tempMealObj.subtitle = recipeCards[j].querySelectorAll('.pom-Product__Title p')[1].innerText

                //Get Recipe Image URL
                tempImgStr = recipeCards[j].querySelector('.pom-Product__image').src;

                //Blue Apron Image URLs usually contain content after the .jpg (e.g. ...jpg?quality=1")
                //Processing is here to cut the string off after '.jpg'
                tempMealObj.img = tempImgStr.slice(0,tempImgStr.indexOf('.jpg') + '.jpg'.length);

                //Push into Return Object
                tempWeekObj.meals.push(tempMealObj);
            }

            return(tempWeekObj);

        }        

        return(offsets);
        //const rep = document.querySelectorAll('.pom-Product__Title')[0].innerText;
    });

    //Recipe Data File Location
    const recipeDataFile = './recipe-data.json';
    let prevDataWeek = "";

    
    if (fs.existsSync(recipeDataFile)) {

        //Pull previously saved JSON file as string
        prevDataWeek = JSON.parse(fs.readFileSync(recipeDataFile, "utf8")).week;

    } else {

        //No previous data found
        prevDataWeek = "";
    }

    //Convert newly scraped object into string
    const newDataWeek = result.week;

    console.log("Previous Week: " + prevDataWeek);
    console.log("New Week: " + newDataWeek);


    //String comparison to see if anything has changed
    if (prevDataWeek === newDataWeek) {

        //Processing if nothing has changed since the last scrape
        console.log("New Data Not Found");

        //Notify Admin - Site was scraped, no new recipes
        axios.post(API_URL + '/notify/', querystring.stringify({
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
        axios.post(API_URL + '/notify/', querystring.stringify({
            who : 'all',
            subject: '[Democratic Meals] New Recipes',
            message: 'New recipes have been pulled from Blue Apron: ' + SITE_URL
        }))
        .then( (response) => {
            console.log("Notifications Sent");

            //Reset Polls
            return( axios.post(API_URL + '/reset/') );
        })
        .then( (response) => {
            console.log("Polls Reset");

            //Write data to JSON file            
            fs.writeFileSync(recipeDataFile, JSON.stringify(result), 'utf8', (error) => {
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