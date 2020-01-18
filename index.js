
var fs = require("fs");
var inquirer = require("inquirer");
// const axios = require("axios");

// code to prompt to user questions
const questions = [
    {
        type: "input",
        message: "Please type your Github username",
        name: "username"
    },
    {
        type: "list",
        message: "what is your favorite color?",
        name: "favorite color",
        choices: ["green", "blue", "pink", "red"]
    }
  
];
// function to take inout from user and use it to get back info from 
inquirer
  inquirer.prompt(questions).then(answers => {
    // Use user feedback for... whatever!!
    console.log(answers);
  });


// async function getUsername() {
   
//     const { username } = await inquirer.prompt(questions);

//     const response = await axios.get("https://api.github.com/users/${username}");


// }

// create PDF document function
// edit pdf document
// function writeToFile(fileName, data) {
 
// }

// function init() {

// init();
// }
