module.exports = {
	name: 'suggest',
	description: 'allows you to make a suggestion for the fart ai',
	cooldown: 15,
	execute(message) {
		const Discord = require('discord.js');
		const chalk = require('chalk');
		try {
			const suggestHook = new Discord.WebhookClient('753975368075051078', 'AsdiVdcus_y4TaO2VPqj2rk8iRuKVnfD1sd5FLfpiSUcbzaJHzbLVtskdOsJeuzIRxVM');
			let sentence = message.content.split(' ');
			sentence.shift();
			sentence = sentence.join(' ');
			const suggestionEmbed = {
				color: '#fffb00',
				title: 'New suggestion',
				description: `${sentence}`,
				timestamp: new Date(),
				footer: {
					text: `Requested by ${message.author.tag}`,
					icon_url: `${message.author.avatarURL()}`,
				},
			};
			suggestHook.send('<@257243821048463372>', {
				username: 'fart ai suggestions',
				avatarURL: 'https://cdn.discordapp.com/avatars/707664386445279252/f289c3e623477241fac004221c6545a4.png?size=4096',
				embeds: [suggestionEmbed],
			});
			message.channel.send('YEAH BABY! your suggestion was successfully sent! thanks for the feedback!');
			console.log(chalk.greenBright('New suggestion from'), chalk.magenta(`${message.author.tag}!`));
		}
		catch (error) {
			message.channel.send('sorry but there was an error trying to suggest dat');
			console.error(chalk.red('Error sending a suggestion'));
		}
	},
};
