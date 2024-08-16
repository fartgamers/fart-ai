const chalk = require('chalk');
module.exports = {
	name: 'screenie',
	description: 'hopefully returns a random screenshot',
	cooldown: 1,
	execute(message) {
		const randthings = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		let builtscreenie = randthings[Math.floor(Math.random() * randthings.length)];
		for (let index = 0; index < 5; index++) {
			builtscreenie = builtscreenie + randthings[Math.floor(Math.random() * randthings.length)];
		}
		message.channel.send(`https://prnt.sc/${builtscreenie}`);
		console.log('Sent screenshot with id ' + chalk.cyan(`${builtscreenie}`));
	},
};