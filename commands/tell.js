module.exports = {
	name: 'tell',
	description: 'have da bot tell you somefing!',
	execute(message, args) {
		let sentence = message.content.split(" ");
		sentence.shift();
		sentence = sentence.join(" ");
    message.channel.send(sentence);
	},
};
