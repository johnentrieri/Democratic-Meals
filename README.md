# Democratic-Meals

Democratic Meals is a collection of scripts & web applications that allow for a group of users to digitally vote for their preferred meals within a given week, while preserving anonymity and ensuring a fair and democratic voting process.

The components that comprise Democratic Meals are:

  * [Blue Apron Puller](#blue-apron-puller)
  * [Meal Database Manager](#meal-db-manager)
  * [Meal Voting Booth](#meal-voting-booth)

<br />

## <a name="blue-apron-puller"></a> Blue Apron Puller
Blue Apron Puller is a JavaScript Web Scraping application that pulls the weekly available recipes from [Blue Apron](https://blueapron.com) and saves the recipe data within a JSON file in a pre-defined location.

<br />

## <a name="meal-db-manager"></a> Meal Database Manager
Meal Database Manager is a Python-based web-server that maintains the following information:
  * User Info
  * Recipe Data
  * Current Voting Results

Meal Database Manager provides a simple API for interacting with the maintained data.

<br />

## <a name="meal-voting-booth"></a> Meal Voting Booth
Meal Voting Booth is React based JavaScript web application that provides the front-end Graphical User Interface (GUI) for users to view the weekly recipes, cast their votes, and also view the final results once voting is complete.