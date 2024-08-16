const chalk = require('chalk');

module.exports = {
	name: 'yomomma',
	description: 'generates a joke from the yo momma machine',
	execute(message) {
		// Based off of the Python Yo Momma machine. Will not function exactly the same, and some features have been stripped from this version.
		// Imports lists of words
		const colors = [ 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'magenta', 'aqua', 'beige'];
		const yogrammer = [ 'yo', 'your', 'ur', 'youre', 'my', 'our'];
		const peoples = [ 'momma', 'mom', 'mother', 'dad', 'daddy', 'father', 'brother', 'sister', 'stepsister', 'stepbrother', 'grandma', 'grandpa', 'uncle', 'cat', 'dog', 'horse', 'hamster', 'puppy', 'kitty', 'spider', 'stepmother', 'stepfather', 'wife', 'husband', 'boyfriend', 'girlfriend', 'friend', 'family'];
		const sogallery = [ 'is so', 'so', 'isnt so', 'soooo', 'is soooo', 'isnt soooo', 'isn\'t so'];
		const opening = [ 'fat', 'stupid', 'dumb', 'ugly', 'heavy', 'tall', 'short', 'old', 'young', 'smart', 'skinny'];
		const words = [ 'weather', 'twitter', 'facebook', 'money', 'street', 'block',
			'cube', 'instagram', 'cross', 'thunderstorm', 'radar', 'tornado',
			'hurricane', 'global', 'united', 'world', 'health', 'coin', 'iphone',
			'street', 'crosswalk', 'railroad', 'train', 'music', 'movie', 'game',
			'book', 'recycling', 'airplane', 'scrollbar', 'type', 'door',
			'chimney', 'joke', 'walk', 'run', 'bike', 'swim', 'hair', 'clean',
			'sleep', 'needle', 'mail', 'mailbox', 'pattern', 'draw', 'house',
			'home', 'sport', 'social', 'vehicle', 'motorcycle', 'septic', 'sewer',
			'yarn', 'code', 'mom', 'dad', 'duck', 'milk', 'porkchop', 'brother',
			'sister', 'kid', 'school', 'bus', 'menu', 'penguin', 'pillowcases',
			'clump', 'Moby', 'tickle', 'me', 'you', 'us', 'him', 'christmas',
			'corner', 'virus', 'corona', 'lol', 'walk', 'around', 'course',
			'make', 'cook', 'dog', 'cat', 'horse', 'stress', 'relax', 'do', 'did',
			'Millisecond', 'Second', 'Minute', 'Hour', 'Day', 'Week', 'Month',
			'Year', 'Decade', 'Century', 'Millenium', 'sunken', 'raised', 'groove',
			'ridge', 'red', 'orange', 'yellow', 'green', 'blue', 'purple',
			'pink', 'fat', '', 'stupid', 'dumb', 'ugly', 'heavy', 'tall', 'short',
			'old', 'young', 'smart', 'skinny', 'wipe', 'admission', 'no', 'key',
			'pee', 'poop', 'butt', 'kid', 'do', 'home', 'depot', 'warehouse', 'hourglass', 'aqua', 'beige'];
		const phrases = [ 'School Bus', 'Turns Around', 'High Heel', 'National Weather Agency', 'Job Application', 'Christmas Corner', 'Walk Around', 'Let\'s Ride', 'Yellow Raincoat'];
		const formatting = [ 's', 'ing', 'ed', 'er', 'less'];
		const punc = [ '.', '!', '?', '?!', '!?'];
		const randthings = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		// Selects a random mode
		const modeSelect = (Math.floor(Math.random() * 9));
		if (modeSelect === 1) {
			console.log('Joke mode selection: ' + chalk.yellow(`${modeSelect}`));
		}
		else if (modeSelect === 2) {
			console.log('Joke mode selection: ' + chalk.green(`${modeSelect}`));
		}
		else if (modeSelect === 3) {
			console.log('Joke mode selection: ' + chalk.blue(`${modeSelect}`));
		}
		else if (modeSelect === 4) {
			console.log('Joke mode selection: ' + chalk.cyan(`${modeSelect}`));
		}
		else if (modeSelect === 5) {
			console.log('Joke mode selection: ' + chalk.magenta(`${modeSelect}`));
		}
		else if (modeSelect === 6) {
			console.log('Joke mode selection: ' + chalk.yellow(`${modeSelect}`));
		}
		else if (modeSelect === 7) {
			console.log('Joke mode selection: ' + chalk.green(`${modeSelect}`));
		}
		else if (modeSelect === 8) {
			console.log('Joke mode selection: ' + chalk.blue(`${modeSelect}`));
		}
		else {
			console.log('Joke mode selection: ' + chalk.cyan(`${modeSelect}`));
		}
		// Makes variables constant
		let joke = 'joke';
		// Mode 1: Selects a random word
		if (modeSelect === 1) {
			joke = words[Math.floor(Math.random() * words.length)];
		}
		// Mode 2: Selects a random work and adds random formatting to the end of it
		if (modeSelect === 2) {
			const randomWord = words[Math.floor(Math.random() * words.length)];
			const randomFormatting = formatting[Math.floor(Math.random() * formatting.length)];
			joke = (`${randomWord}${randomFormatting}`);
		}
		// Mode 3: Combines 2 - 5 random words
		if (modeSelect === 3) {
			const wordCounter = (Math.floor(Math.random() * 4));
			const firstWord = words[Math.floor(Math.random() * words.length)];
			if (wordCounter === 1) {
				const randWord1 = words[Math.floor(Math.random() * words.length)];
				joke = `${firstWord} ${randWord1}`;
			}
			else if (wordCounter === 2) {
				const randWord1 = words[Math.floor(Math.random() * words.length)];
				const randWord2 = words[Math.floor(Math.random() * words.length)];
				joke = `${firstWord} ${randWord1} ${randWord2}`;
			}
			else if (wordCounter === 3) {
				const randWord1 = words[Math.floor(Math.random() * words.length)];
				const randWord2 = words[Math.floor(Math.random() * words.length)];
				const randWord3 = words[Math.floor(Math.random() * words.length)];
				joke = `${firstWord} ${randWord1} ${randWord2} ${randWord3}`;
			}
			else {
				const randWord1 = words[Math.floor(Math.random() * words.length)];
				const randWord2 = words[Math.floor(Math.random() * words.length)];
				const randWord3 = words[Math.floor(Math.random() * words.length)];
				const randWord4 = words[Math.floor(Math.random() * words.length)];
				joke = `${firstWord} ${randWord1} ${randWord2} ${randWord3} ${randWord4}`;
			}
		}
		// Mode 4: Generates a random regional specific company
		if (modeSelect === 4) {
			const locmods = [ 'Countrywide', 'State', 'United', 'Global', 'Agency'];
			const commods = [ 'Association', 'Service', 'Company', 'Agency'];
			const selectedLocMod = locmods[Math.floor(Math.random() * locmods.length)];
			const selectedComMod = commods[Math.floor(Math.random() * commods.length)];
			joke = `${selectedLocMod} ${selectedComMod}`;
		}
		// Mode 5: Selects a random phrase
		if (modeSelect === 5) {
			const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
			joke = `${selectedPhrase}`;
		}
		// Mode 6: Selects a random phrase and adds random formatting to the end of it
		if (modeSelect === 6) {
			const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
			const selectedFormatting = formatting[Math.floor(Math.random() * formatting.length)];
			joke = `${selectedPhrase}${selectedFormatting}`;
		}
		// Mode 7: Generates a string of random numbers and letters
		if (modeSelect === 7) {
			const letterOne = randthings[Math.floor(Math.random() * randthings.length)];
			const letterTwo = randthings[Math.floor(Math.random() * randthings.length)];
			const letterThree = randthings[Math.floor(Math.random() * randthings.length)];
			const letterFour = randthings[Math.floor(Math.random() * randthings.length)];
			const letterFive = randthings[Math.floor(Math.random() * randthings.length)];
			const letterSix = randthings[Math.floor(Math.random() * randthings.length)];
			const letterSeven = randthings[Math.floor(Math.random() * randthings.length)];
			const letterEight = randthings[Math.floor(Math.random() * randthings.length)];
			const letterNine = randthings[Math.floor(Math.random() * randthings.length)];
			const letterTen = randthings[Math.floor(Math.random() * randthings.length)];
			joke = `${letterOne}${letterTwo}${letterThree}${letterFour}${letterFive}${letterSix}${letterSeven}${letterEight}${letterNine}${letterTen}`;
		}
		// Mode 8: Generates something related to admission
		if (modeSelect === 8) {
			const admissionSymbols = [ '+', '-'];
			const admissionAllowed = [ 'No Admission', 'Admission Allowed'];
			const ageNumber = (Math.floor(Math.random() * 50));
			const selectedSymbol = admissionSymbols[Math.floor(Math.random() * admissionSymbols.length)];
			const selectedAllowed = admissionAllowed[Math.floor(Math.random() * admissionAllowed.length)];
			joke = `${ageNumber}${selectedSymbol} ${selectedAllowed}`;
		}
		// Mode 9: Selects a random color and a random word
		if (modeSelect === 9) {
			const selectedColor = colors[Math.floor(Math.random() * colors.length)];
			const selectedWord = words[Math.floor(Math.random() * words.length)];
			joke = `${selectedColor} ${selectedWord}`;
		}

		// Starts to generate more parts of the joke
		// Who is this directed at
		const selectedPerson = peoples[Math.floor(Math.random() * peoples.length)];
		// The grammer that is used in the joke
		const selectedGrammer = yogrammer[Math.floor(Math.random() * yogrammer.length)];
		// This part generates the different variations of where the blank is: 'Yo momma __ stupid'
		const selectedSo = sogallery[Math.floor(Math.random() * sogallery.length)];
		// This part generates the opening where the blank is: 'Yo momma so ____'
		const selectedOpening = opening[Math.floor(Math.random() * opening.length)];
		// Selects random punctuation
		const selectedPunctuation = punc[Math.floor(Math.random() * punc.length)];

		// Creates the final result
		const finalJokeOutput = `${selectedGrammer} ${selectedPerson} ${selectedSo} ${selectedOpening}... ${joke}${selectedPunctuation}`;
		message.channel.send(`${finalJokeOutput}`);
	},
};
