//Requiring Dependencies 
const fs = require('fs')
const inquirer = require('inquirer')
const axios = require('axios')
var pdf = require('html-pdf')

inquirer
// Questions that prompt the user for input
	.prompt([
		{
			type: 'input',
			message: 'Please Enter Your GitHub Username',
			name: 'username'
		},
		{
			type: 'list',
			message: 'What is your favorite color?',
			name: 'colors',
			choices: ['green', 'blue', 'pink', 'red']
		}
	])
	.then(function(res) {
		// store the users answers in variables
		username = res.username
		colors = res.colors
		const queryUrl = `https://api.github.com/users/${username}`
		// function makes seperate api call for users star count 
		starCount(username)
		// make the api call then use the data to pass into the writeResume function
		axios.get(queryUrl).then(function(res) { 
			writeResume(res.data, colors, stars)
		})
	})
// create PDF document function
const writePDF = (filePath, html) =>
	pdf.create(html, { format: 'Letter' }).toFile(filePath, function(err, res) {
		if (err) return console.log(err)
		console.log(res) 
	})
// reads file data
const readFile = (file, encoding) =>
	new Promise(function(resolve, reject) {
		fs.readFile(file, encoding, function(err, data) {
			if (err) {
				return reject(err)
			}

			resolve(data)
		})
	})
// writes a file or writes over an existing file
const writeFile = (file, data) =>
	new Promise(function(resolve, reject) {
		fs.writeFile(file, data, function(err) {
			if (err) {
				return reject(err)
			}
			resolve('Success')
		})
	})

// function that takes in the user data and inserts the data into a template
const writeResume = async (user, favColor, stars) => {
	try {
		// reading the template.html file and saving its data in a variable 
		let template = await readFile('./generate.html', 'utf8')
// replaces parts of the document with user specific data
		template = template.replace('{name}', user.name)
		template = template.replace('{company}', user.company)
		template = template.replace('{blog}', user.blog)
		template = template.replace('{profile}', user.html_url)
		

		let foundLocation = true,
			foundColors = true
		while (foundLocation || foundColors) {
			if (template.indexOf('{location}') < 0) {
				foundLocation = false
			} else {
				template = template.replace('{location}', user.location) 
			}

			if (template.indexOf('{colors}') < 0) {
				foundColors = false
			} else {
				template = template.replace('{colors}', favColor) 
			}
		}
		template = template.replace('{bio}', user.bio)
		template = template.replace('{repos}', user.public_repos)
		template = template.replace('{followers}', user.followers)
		template = template.replace('{following}', user.following)
		template = template.replace('{avatar}', user.avatar_url)
		template = template.replace('{stars}', stars) 

	

		writePDF('./resume.pdf', template)
		writeFile('./resume.html', template)
	} catch (error) {
		console.log(error)
	}
}

let username = ''
let colors = ''
let stars = ''
function starCount(username) {
	const queryUrl2 = `https://api.github.com/users/${username}/starred`
	axios.get(queryUrl2).then(function(res) {
		console.log('starred', res.data.length)
		stars = res.data.length
	})
	return stars
}
