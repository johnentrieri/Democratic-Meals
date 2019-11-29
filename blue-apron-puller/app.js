const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.blueapron.com/pages/sample-recipes');

    await page.click('#Family-tab');

    const result = await page.evaluate(() => {

        const data = [];
        const weekCards = document.getElementsByClassName('week-content');

        for(let i=0 ; i<weekCards.length ; i++) {
            
            tempWeek = weekCards[i].querySelector('.week-header-content__date').innerText;

            const currentDate = new Date();
            const dateString = tempWeek.split(' ')[2] + " " + tempWeek.split(' ')[3].slice(0,-2) + ", " + currentDate.getFullYear();
            const deliveryDate = new Date(dateString);
        
            const dateOffset = (deliveryDate - currentDate) / (1000*60*60*24);

            if (dateOffset < 7) { 
                continue;
            };

            const tempWeekObj = { week: "", meals: [] };
            tempWeekObj.week = dateString;

            const recipeCards = weekCards[i].querySelector('.Family .recipe-cards-3ds').getElementsByClassName('recipe-product-card__container');
            for(let j=0 ; j<recipeCards.length ; j++) {
                const tempMealObj = { title: "", subtitle: "", img: "" };

                tempMealObj.title = recipeCards[j].querySelector('.recipe-content__title').innerText;
                tempMealObj.subtitle = recipeCards[j].querySelector('.recipe-content__subtitle').innerText;
                tempMealObj.img = recipeCards[j].querySelector('.recipe-image-tag').src;

                tempWeekObj.meals.push(tempMealObj);
            }
            return(tempWeekObj);
        }
    });
    const json = JSON.stringify(result);
    fs.writeFile('recipe-data.json', json, 'utf8', (error) => {
        if (error) throw error;
        console.log('Complete');
    });
})();