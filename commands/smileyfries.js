module.exports = {
	name: 'smileyfries',
	description: 'will send some smiley fries to the chat. 🙂 smiles save the day',
	execute(message, args) {
		message.channel.send('https://cdn.discordapp.com/attachments/544692207853240323/727644061443293294/smiley_fries.jpg');
		message.channel.send('smiles save the day 🙂');
	},
};
