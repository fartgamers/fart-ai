const { prefix } = require('../config.json');
const chalk = require('chalk');
module.exports = {
	name: 'whatsnew',
	description: 'tells you whats new with the bot',
	execute(message) {
		const wnEmbed = {
			color: [255, 242, 0],
			title: 'whats new',
			description: 'new commands baby! use f.scratch to look at random scratch projects or studios (your choice) or use f.screenie to view a random screenshot! you can also use f.randmoji but who cares about that one? a lot more behind the scenes features are also coming, so hold onto your horses!',
			footer: {
				text: `requested by ${message.author.tag}`,
				icon_url: `${message.author.avatarURL()}`,
			},
		};
		message.channel.send({ embed: wnEmbed });
		message.channel.send(`remember, you can suggest something by using the \`${prefix}suggest\` feature!`);
		console.log(chalk.green('Sent what\'s new!'));
	},
};
