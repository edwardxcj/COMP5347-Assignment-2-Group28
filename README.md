# Project Title

 COMP5347 Assignment2 Phone Zone
 
## Prerequisites
### Database Side
#### Run your database
```mongod --dbpath (your mongodb database path)```

#### Import the json files
```mongoimport --jsonArray --db phoneZone --collection phonelisting --file (the path of the phonelisting.json file)```

```mongoimport --jsonArray --db phoneZone --collection userlist --file (the path of the userlist.json file)```

```mongoimport --jsonArray --db phoneZone --collection cartlist --file (the path of the cart.json file)```

### Server Side
* run ```npm install``` to install all the dependencies needed

## Run the application
* run ```node app.js``` to start the application

Then you can open ```http://localhost:3000/``` in your browser for using this application


## Built With

* Node.js  - The JavaScript runtime environment
* Express  - The web framework used
* MVC  - The design pattern followed


## Authors

* Hao Li
* Changjian Xiong
* Ziyi Cheng


