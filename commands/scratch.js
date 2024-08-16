const { prefix } = require('../config.json');
const chalk = require('chalk');
module.exports = {
	name: 'scratch',
	description: 'gives you a scratch project or scratch stdio choose',
	usage: 'use either "project" or "studio"',
	execute(message, args) {
		function randInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		const inputmode = args[0].toLowerCase();
		if (inputmode === 'project') {
			const selectednumber = randInt(1000000, 1999999);
			message.channel.send(`https://scratch.mit.edu/projects/${selectednumber}`);
			console.log('Scratch' + chalk.cyan(' project ') + 'generated with ID ' + chalk.bgCyan(selectednumber));
		}
		else if (inputmode === 'studio') {
			const selectednumber = randInt(10000, 99999);
			message.channel.send(`https://scratch.mit.edu/studios/${selectednumber}`);
			console.log('Scratch' + chalk.green(' studio ') + 'generated with ID ' + chalk.bgMagenta(selectednumber));
		}
		else {
			message.channel.send(`sorry you did it wrong. its either "${prefix}scratch project" for a project or "${prefix} studio" for a studio`);
			console.log('Tried generating a Scratch studio/project but failed because of an args error');
		}
	},
};
