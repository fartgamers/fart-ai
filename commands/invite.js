module.exports = {
	name: 'invite',
	description: 'gets an invite to the fart gamers india discord server!',
	guildOnly: true,
	execute(message) {
		message.reply('join the fart gamers india discord server today! https://discord.gg/aeYHWsw');
		console.log('sent invite to join fart gamers');
	},
};
