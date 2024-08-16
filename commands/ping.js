module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
    message.channel.send('yo yo yo da fart ai is currently workin!');
    console.log('Ping successfully recieved!');
	},
};
