module.exports = {
	name: 'arraytest',
	description: 'tells you whats new with the bot',
	execute(message, args) {
		const testArray = [ 'giggle', 'goggle' ];
		const selectedTest = testArray[Math.floor(Math.random() * testArray.length)];
		message.channel.send(`${selectedTest}`);
	},
};
