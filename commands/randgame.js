const chalk = require('chalk');

module.exports = {
	name: 'randgame',
	description: 'sends a random game from the digital gaming platform Steam. Steam is owned by Valve.',
	execute(message) {
		const randomnum = Math.floor(Math.random() * 150953);
		console.log('Sending random ' + chalk.magenta('Steam game') + ' with id ' + chalk.cyan(`${randomnum}0`));
		message.channel.send(`https://store.steampowered.com/app/${randomnum}0/ SORRY IT DONT ALWAYS WORK BECAUSE IM TOO LAZY TO FIGURE OUT DEM PATTERNS 5 LIKES AND I WILL DO IT!`);
	},
};
