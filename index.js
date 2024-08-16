/* eslint-disable no-mixed-spaces-and-tabs */
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, wiichickenid, nadekoid, fartaiid, pewdiepieid, samid, twitconsumer_key, twitconsumer_secret, twitaccess_token, twitaccess_secret } = require('./config.json');
const chalk = require('chalk');
const Keyv = require('keyv');
const keyv = new Keyv();
const Sequelize = require('sequelize');
const prefixes = new Keyv('sqlite://path/to.sqlite');
const querystring = require('querystring');
const Twitter = require('twitter');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const twit = new Twitter({
	consumer_key: twitconsumer_key,
	consumer_secret: twitconsumer_secret,
	access_token_key: twitaccess_token,
	access_token_secret: twitaccess_secret,
});

keyv.on('error', err => console.error(chalk.red('Keyv connection error:'), err));
const cooldowns = new Discord.Collection();
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
process.on('unhandledRejection', error => console.error(chalk.redBright('uncaught promise rejection'), error));

let safechats = fs.readFileSync('chats.txt').toString().split('\n');
let giflist = fs.readFileSync('resources/gif.txt').toString().split('\n');
console.log(chalk.green('Loaded ') + chalk.cyan('Auto-Responder Messages'));
// Creates tags system
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});
const Coins = sequelize.define('coins', {
	coincount: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	serveriden: {
		type: Sequelize.STRING,
		unique: true,
	},
});
const Fartscore = sequelize.define('fartscore', {
	useriden: {
		type: Sequelize.STRING,
		unique: true,
	},
	scorecount: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
});

// Logs when the bot is online and sets a status
client.on('ready', () => {
	console.log(chalk.black.bgGreenBright('Logged in'), 'as', chalk.bold.yellowBright(`${client.user.tag}!`));
	const randyear = Math.floor(Math.random() * 3000);
	client.user.setActivity(`helping you SPEAK YOU BOOty OFF since ${randyear}`, { type: 'WATCHING' });
});

client.once('ready', () => {
	Tags.sync();
	Coins.sync();
});

// Write stream creation
const msgstream = fs.createWriteStream('msg.txt', { flags: 'a' });
const chatstream = fs.createWriteStream('chats.txt', { flags: 'a' });
const crdoc = fs.createWriteStream('crs.txt', { flags: 'a' });
const tweetliststream = fs.createWriteStream('resources/tweets.txt', { flags: 'a' });
const gifliststream = fs.createWriteStream('resources/gif.txt', { flags: 'a' });
const fartmsgstream = fs.createWriteStream('resources/fartmsg.txt', { flags: 'a' });
// Variable creation
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let autoreact = '1';
let Fishwish = '0';
let Randspecial = '0';
let outnabout = 0;
let samoutnabout = 0;
let specialreact = 0;
let replymode = 4;
let fishwishid = 0;
// twitter variables
let recenttweet = 0;
// Command handler
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;}
		return message.channel.send(reply);
	}
	if (!cooldowns.has(command.name)) {cooldowns.set(command.name, new Discord.Collection());}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	try {command.execute(message, args);}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});
/* client.on('shardError', error => {
	console.error(chalk.redBright.bold('A websocket connection encountered an error:'), error);
	const errorEmbed = {
		color: '#ff0000',
		title: 'Error',
		description: error,
		timestamp: new Date(),
	};
	suggestHook.send('New error', {
		username: 'fart ai suggestions',
		avatarURL: 'https://cdn.discordapp.com/avatars/707664386445279252/f289c3e623477241fac004221c6545a4.png?size=4096',
		embeds: [errorEmbed],
	});
}); */
let errormsg = 'text';
// twitter variables
let accountFollowers = 0;
let accountFriends = 0;
let accountListed = 0;
let accountFavourites = 0;
let accountStatuses = 0;
// Tweets something, as well as gives more customization options for the tweets
function tweetThisBasic(toTweet, includeUnix) {
	if (toTweet.length <= 260) {
		try {
			if (includeUnix === 1) {
				// If includeUnix is 1, add the unix timestamp to the end of the message
				const unixtime = Math.floor(Date.now() / 1000);
				twit.post('statuses/update', { status: `${toTweet} ${unixtime}; Now` }, function(error, tweet) {
					recenttweet = tweet.id_str;
					accountFollowers = tweet.user.followers_count;
					accountFriends = tweet.user.friends_count;
					accountListed = tweet.user.listed_count;
					accountFavourites = tweet.user.favourites_count;
					accountStatuses = tweet.user.statuses_count;
				});
				tweetliststream.write(`${toTweet}\n<|endoftext|>\n`);
				console.log(chalk.blue('Tweeted: ') + chalk.inverse(`${toTweet} ${unixtime}; Now`));
				client.user.setActivity(`tweet #${accountStatuses}: ${toTweet}`, { type: 'WATCHING' });
			}
			else {
				twit.post('statuses/update', { status: `${toTweet}` }, function(error, tweet) {
					recenttweet = tweet.id_str;
					accountFollowers = tweet.user.followers_count;
					accountFriends = tweet.user.friends_count;
					accountListed = tweet.user.listed_count;
					accountFavourites = tweet.user.favourites_count;
					accountStatuses = tweet.user.statuses_count;
				});
				tweetliststream.write(`${toTweet}\n<|endoftext|>\n`);
				console.log(chalk.blue('Tweeted: ') + chalk.inverse(`${toTweet}`));
				client.user.setActivity(`tweet #${accountStatuses}: ${toTweet}`, { type: 'WATCHING' });
			}
		}
		catch (error) {
			console.error(chalk.yellow('Something went wrong when trying to tweet!'));
			console.error(error);
		}
	}
	else {console.log(chalk.yellow('Could not tweet: ') + 'too many characters');}
}
function tweetReplyBasic(toTweet, replyId, includeUnix) {
	try {
		if (recenttweet === 0) {
			console.log('Nothing to reply to');
		}
		else if (toTweet.length <= 260) {
			if (includeUnix === 1) {
			// If includeUnix is 1, add the unix timestamp to the end of the message
				console.log('Replying to tweet ' + chalk.cyan(recenttweet));
				const unixtime = Math.floor(Date.now() / 1000);
				twit.post('statuses/update', { status: `${toTweet} ${unixtime}; Now`, in_reply_to_status_id: `${replyId}` }, function(error, tweet) {
					recenttweet = tweet.id_str;
					recenttweet = tweet.id_str;
					accountFollowers = tweet.user.followers_count;
					accountFriends = tweet.user.friends_count;
					accountListed = tweet.user.listed_count;
					accountFavourites = tweet.user.favourites_count;
					accountStatuses = tweet.user.statuses_count;
				});
				tweetliststream.write(`${toTweet}\n<|endoftext|>\n`);
				console.log(chalk.blue('Tweeted: ') + chalk.inverse(`${toTweet} ${unixtime}; Now`));
				client.user.setActivity(`tweet #${accountStatuses}: ${toTweet}`, { type: 'WATCHING' });
			}
			else {
				twit.post('statuses/update', { status: `${toTweet}`, in_reply_to_status_id: `${replyId}` }, function(error, tweet) {
					recenttweet = tweet.id_str;
					recenttweet = tweet.id_str;
					accountFollowers = tweet.user.followers_count;
					accountFriends = tweet.user.friends_count;
					accountListed = tweet.user.listed_count;
					accountFavourites = tweet.user.favourites_count;
					accountStatuses = tweet.user.statuses_count;
				});
				tweetliststream.write(`${toTweet}\n<|endoftext|>\n`);
				console.log(chalk.blue('Tweeted: ') + chalk.inverse(`${toTweet}`));
				client.user.setActivity(`tweet #${accountStatuses}: ${toTweet}`, { type: 'WATCHING' });
			}
		}
		else {console.log(chalk.yellow('Could not tweet: ') + 'too many characters');}
	}
	catch (error) {
		console.error(chalk.yellow('something went wrong when trying to reply to a tweet!'));
		console.error(error);
	}
}
// Allows the bot to retweet a tweet
function retweeThis(tweetId) {
	try {
		twit.post('statuses/retweet/' + tweetId, function(error) {
			if (!error) {console.log(chalk.green('sucessfully retweeted tweet with id ') + chalk.cyan(tweetId));}
		});
	}
	catch (error) {
		console.error(chalk.yellow('failed to retweet'));
		console.error(error);
	}
}
// eslint-disable-next-line no-unused-vars
client.on('message', async (msg, channel) => {
	const crmsg = `${msg.content}`;
	const lowcrmsg = crmsg.toLowerCase();
	function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
	function addCustomReaction(trigger, responce) {
		if (lowcrmsg === trigger) {
			msg.channel.send(responce);
		}
	}
	function addCustomReactionReaction(trigger, reaction) {
		if (lowcrmsg === trigger) {
			msg.react(reaction);
		}
	}
	async function deletemsgaftertime(timetodelete) {
		await sleep(timetodelete);
		console.log('Automatically deleting message');
		msg.delete();
	}
	// adds coins to a users balance
	async function addCoins(coinAmount) {
		try {
			const theserver = await Coins.create({
				serveriden: msg.guild.id,
			});
			console.log('new server added to coin thing: ' + chalk.cyan(`${theserver.serveriden}`));
		}
		catch (e) {
			// todo: this probably should not rely on a catch function for adding new data
			if (e.name === 'SequelizeUniqueConstraintError') {
				const addserver = await Coins.findOne({ where: { serveriden: msg.guild.id } });
				if (addserver) {
					for (let count = 0; coinAmount > count;) {
						addserver.increment('coincount');
						count++;
					}
				}
			}
		}
	}
	// adds fart score to a user
	async function addFartScore(scoreAmount, userToAdd) {
		try {
			const theuser = await Fartscore.create({
				useriden: userToAdd,
			});
			console.log('new user added to fartscore thing: ' + chalk.cyan(`${theuser.useriden}`));
		}
		catch (e) {
			// todo: this probably should not rely on a catch function for adding new data
			if (e.name === 'SequelizeUniqueConstraintError') {
				const adduser = await Fartscore.findOne({ where: { useriden: userToAdd } });
				if (adduser) {
					for (let count = 0; scoreAmount > count;) {
						adduser.increment('scorecount');
						count++;
					}
				}
			}
		}
	}
	if (lowcrmsg === 'yeah') {
		msg.channel.send('na na na');
		msg.react('😚');
		msg.react('😵');
		msg.react('👾');
	}
	// Automatically delete messages in #snapchatinanutshell after 10 seconds
	if (msg.channel.id === '747185568592560169') {deletemsgaftertime(10000);}
	if (lowcrmsg === '<:UPPI:724078066632228926>') {
		if (msg.author.id === fartaiid) {msg.react('724078066632228926');}
		else if (msg.author.id === nadekoid) {msg.react('724078066632228926');}
		else {
			msg.react('724078066632228926');
			msg.channel.send('<:UPPI:724078066632228926>');
		}

	}
	// commands to only be run in fart gamers
	if (msg.channel.type === 'text') {
		if (msg.guild.id === '544692207853240321') {
			if (lowcrmsg === 'ping') {
				for (let tumbug = 0; tumbug < 5; tumbug++) {msg.channel.send('<@554374476964298764>');}
			}
			if (lowcrmsg === 'fart') {
				/*
				let selectedReaction = 'gigglecube';
				const fartMojiList = [ '😄', '😳', '🎋', '🎱', '🏫', '🚾', '🏮', '🧿', '🔫', '🚿', '💶', '🗽', '🗾', '🎲', '🍶', '🌈'];
				for (let hapybug = 1; hapybug < 16; hapybug++) {
					selectedReaction = fartMojiList[hapybug];
					msg.react(selectedReaction);
				}
				msg.reply('welcome to the world of fart gamers');
				msg.reply('ill be your guide');
				msg.reply('now eat up your soup🍲');
				*/
				msg.reply('this command has been disabled because yall keep spammin it!');
			}
			if (lowcrmsg === 'hi very swag') {
				for (let tumbug = 0; tumbug < 13; tumbug++) {msg.channel.send('<@612162684296757259>');}
			}
			if (lowcrmsg === 'variety pack') {
				msg.channel.send('<@554374476964298764>');
				msg.channel.send(`<@${wiichickenid}>`);
				msg.channel.send(`<@${pewdiepieid}>`);
				msg.channel.send('<@612162684296757259>');
				msg.channel.send('<@282699354517667860>');
			}
		}
	}
	if (lowcrmsg === 'na na na') {
		if (msg.author.id === fartaiid) {msg.react('💱');}
		else {msg.reply('stop copying me!!!');}
	}
	// If a message is sent in the moderator rules channel delete it automatically unless it's from wiichicken
	if (msg.channel.id === '719227086040203274') {
		if (msg.author.id === wiichickenid) {msg.react('🏮');}
		else {deletemsgaftertime(60000);}
	}
	if (lowcrmsg === 'mao') {
		msg.react('😺');
		msg.react('😸');
		msg.react('😹');
		msg.react('😻');
		msg.react('😼');
		msg.react('😽');
		msg.react('🙀');
		msg.react('😿');
		msg.react('😾');
		msg.channel.send('😺😸😹😻😼😽🙀😿😾');
	}
	// Syot emoji
	addCustomReaction('<:UPPI:724078066632228926>', '567163929269239831');
	addCustomReactionReaction('ok!', '😚');
	addCustomReaction('i\'m the bald guy', 'hi the bald guy! im da fart ai and i live in my own awesome world! ask me anything!');
	addCustomReaction('i know that song', 'yeah its a pretty neat song!');
	addCustomReaction('i dont know that song', 'well ya missing out!');
	addCustomReaction('the pedos pizza real', 'is the pedos pizza really real?');
	addCustomReaction('if you get customfirmware you can use miiverse agin', 'I KNOWWWWWWWWWWWWW');
	addCustomReaction('pewdiepie is awesome he can delete this one', 'he may delete that one if he so wishes to');
	addCustomReaction('call me a boomer but i miss the days when you coyld send a messahe but now you just get a jumbled mess of charavters or an emoji or a auto reply instead and its snnoying ahhh', 'OK BOMER');
	addCustomReaction(':tobuscuscommand:', 'do you like my sword sword sword my diamond sword sword.');
	addCustomReaction('memes', 'just cant get enough of those memes! 😅');
	addCustomReaction('menes', 'just cant get enough of those menes! 😅');
	addCustomReaction('pain level 5 your condition is critical contqct medical help imediatly', 'IM CONTACTING MEDICAL HELP RIGHT NOW!!!');
	addCustomReaction('lets all humm along to the song', 'hummmmmm hum hummmmmmmmm hummmm hummmmmmmmmmmmmmmmmmmmmm hummm');
	addCustomReaction('hear them ring', 'SOON IT WILL BE CHRISTMAS DAY');
	addCustomReaction('they removed all of the fun welcome messages', 'HOW DARE THEY REMOVED ALL OF THE FUN WELCOME MESSAGES');
	addCustomReaction('hi darkscar', 'hi im darkscar and i am edgy');
	addCustomReaction('hugbox', 'SPIRITUAL SUCCESS');
	addCustomReaction('nodemon --inspect index.js', 'congratz you have inputted the startup command and the fart ai will now run');
	addCustomReaction('a', 'dance of the sugar plum farries');
	addCustomReaction('this is the united states government. now redirecting you to wendy\'s for an urgent alert.', 'Your local Wendy\'s has issued a major bag alert');
	addCustomReaction('f.fart', 'fart');
	addCustomReaction('f.fart2', 'big fart i dont know');
	// Wishing upon a fish
	if (lowcrmsg.startsWith('i wish upon a fish')) {
		if (msg.author.id === fishwishid) {
			let sentence = msg.content.split(' ');
			sentence.shift();
			sentence = sentence.join(' ');
			const randchance = Math.floor(Math.random() * 5);
			if (randchance <= 4) {
				msg.channel.send(`your wish upon a fish ${sentence} has come true!`);
				console.log(chalk.bgYellow('Wish upon a fish was') + chalk.green('granted!'));
			}
			else {
				msg.channel.send(`your wish upon a fish ${sentence} has not come true sporru!`);
				console.log(chalk.bgBlue('Wish upon a fish not') + chalk.magenta('granted.'));
			}
			fishwishid = 0;
		}
		else {msg.channel.send('hey! you cant wish upon a fish!');}
	}
	if (lowcrmsg.startsWith(`${prefix}progbar`)) {
		try {
			let sentence = msg.content.split(' ');
			sentence.shift();
			sentence = sentence.join(' ');
			const numvar = Number(sentence);
			if (numvar < 101) {
				const total = 100 - numvar;
				let bar = '';
				for (let count = 0; numvar > count;) {
					bar = bar + '█';
					count++;
				}
				for (let count = 0; total > count;) {
					bar = bar + '░';
					count++;
				}
				msg.channel.send(bar);
				console.log('created progress bar with value ' + chalk.cyan(sentence));
			}
			else {
				msg.reply('Expected literal to be on the right side. Fix this yoda problem.');
			}
		}
		catch (error) {
			msg.reply('you probably messed up something');
			console.log(chalk.yellow('error trying to create a progress bar'));
		}
	}
	if (lowcrmsg.startsWith('mo')) {
		let sentence = lowcrmsg.split('mo');
		sentence.shift();
		sentence = sentence.join(' ');
		if (sentence.endsWith('o')) {
			const dalength = sentence.length;
			msg.channel.send(`pain level ${dalength}`);
		}
	}

	/*
	Twitter functions
	*/

	// Tweets about an update to the bot
	// ! broken :)
	if (lowcrmsg.startsWith(`${prefix}update `)) {
		if (msg.author.id === wiichickenid) {
			try {
				let sentence = msg.content.split(' ');
				sentence.shift();
				sentence = sentence.join(' ');
				let likingtweet = 0;
				// posts the tweet
				twit.post('statuses/update', { status: `New update:\n${sentence}` }, async function(error, tweet) {
					console.log(chalk.blue('Tweeting ') + 'new update: ' + chalk.inverse(sentence));
					await sleep(1000);
					likingtweet = tweet.id_str;
				});
				// waits 2 seconds and then likes the tweet
				await sleep(2000);
				twit.post('favorites/create', { id: likingtweet }, function(error) {
					if (!error) {
						console.log(chalk.magenta('Liked ') + chalk.blue('tweet ') + 'with id ' + chalk.inverse(likingtweet));
					}
					else {
						console.log(chalk.magenta('favorites/create Error'));
						console.error(error);
					}
				});
				await sleep(2000);
				console.log(likingtweet);
				msg.channel.send('the update is full go boys!');
			}
			catch (error) {
				msg.reply('something went wrong trying to make that update!!');
				console.error(chalk.yellow('something went wrong when trying to post an update'));
				console.error(error);
			}
		}
	}
	// checks to make sure that you aren't currently in a direct message
	if (msg.channel.type === 'text') {
		// checks to make sure you are currently in fart gamers
		if (msg.guild.id === '544692207853240321') {
		// Tweets something
			if (lowcrmsg.startsWith('tweet ')) {
				try {
					let sentence = msg.content.split(' ');
					sentence.shift();
					sentence = sentence.join(' ');
					// Blocks use of the @ symbol
					if (sentence.indexOf('@') > -1) {msg.channel.send('sorry, but for reasons the @ character is prohibited');}
					// blocks use of the n word
					else if (sentence.indexOf('nigger') > -1) {msg.channel.send('SLUR ALERT SLUR ALERT!!!!!!!!!!!!!!!!! your account will now be sent to our team and you may lose posting privledges! sorry i dont make the rules');}
					// Blocks use of messages longer than 250 characters
					else if (sentence.length > 250) {
						msg.channel.send('wtf you broke teh law of twitter');
						console.info(chalk.yellow('Could not tweet. ') + 'Too many characters');
					}
					else {
						console.log(chalk.magenta(`${msg.author.tag} `) + chalk.cyan('tweeted'));
						tweetThisBasic(`${sentence}`, 1);
						await sleep(1000);
						msg.channel.send(`woogoo! were unSUSpended so heres the leaks! https://twitter.com/fart_ai/status/${recenttweet} listen to music for teenagers if it didnt work (everyone keeps on telling me to remove this part but to that i say MO HAHAHAH)`);
						addCoins(5);
						addFartScore(1, msg.author.id);
					}
				}
				// Shown when there is an error
				catch (error) {
					console.error(chalk.yellow('something went wrong when trying to tweet!'));
					console.error(error);
					msg.reply('sorry buddy! something went wrong! try again, if you dare! (no we arent suspended, it was a code error dumbo)');
				}
			}
			// allows using a command to retweet something
			if (lowcrmsg.startsWith(`${prefix}retweet `)) {
				try {
					let sentence = msg.content.split(' ');
					sentence.shift();
					sentence = sentence.join(' ');
					retweeThis(sentence);
					await sleep(1000);
					msg.channel.send('okay i think it retweeted the tweet with that id');
				}
				catch (error) {
					console.log(chalk.yellow('failed to retweet!'));
					msg.reply('sorry buster boo! we failed to retweet it!');
				}
			}
			// Replies to the last sent tweet
			if (lowcrmsg.startsWith(`${prefix}reply `)) {
				try {
				// Shown if there is nothing to reply to
					if (recenttweet === 0) {
						msg.channel.send('sorry charlie! there\'s nothing to reply to!');
						console.log(chalk.yellow('Could not tweet:') + ' Nothing to reply to');
					}
					let sentence = msg.content.split(' ');
					sentence.shift();
					sentence = sentence.join(' ');
					// Fails to tweet if the message is more than 250 characters in length
					if (sentence.length > 250) {
						msg.channel.send('wtf you broke teh law of twitter');
						console.info(chalk.yellow('Could not tweet. ') + 'Too many characters');
					}
					else {
						console.log(chalk.magenta(`${msg.author.tag} `) + chalk.cyan('tweeted'));
						await sleep(1000);
						msg.channel.send(`heres the current sitchy way way: https://twitter.com/fart_ai/status/${recenttweet} listen to music for young adults if it didnt work`);
						tweetReplyBasic(`${sentence}`, recenttweet, 1);
					}
				}
				// Shown when there is an error
				catch (error) {
					console.error(chalk.yellow('something went wrong when trying to reply a tweet!'));
					console.error(error);
					msg.reply('I am so sorry. This is all my fault, and I understand if you guys aren\'t able to forgive me');
				}
			}
			// allows you to teach the bot for some reason
			if (lowcrmsg.startsWith(`${prefix}teach`)) {
				let sentence = msg.content.split(' ');
				sentence.shift();
				sentence = sentence.join(' ');
				tweetliststream.write(`${sentence}\n<|endoftext|>\n`);
				console.log(chalk.cyan(`${msg.author.id} `) + 'just added to the tweet database: ' + chalk.inverse(`${sentence}`));
				msg.reply('congrats! thanks for helping to build a more sustainable future!');
			}
			// informs users that the command usage has changed
			if (lowcrmsg.startsWith('f.tweet ')) {msg.reply('sorry, we switched from f.tweet to just the word tweet. thanks for using our services. go here for help https://sites.google.com/view/fart-gamers/help/fart-ai/more-features/twitter');}
		}
	}

	// Pulls account stats
	if (lowcrmsg === (`${prefix}twitstats`)) {
		try {
			await sleep(500);
			msg.reply(`heres the account statistics buddy!\n**account followers**: ${accountFollowers}\n**"moots"**: ${accountFriends}\n**account listz**: ${accountListed}\n**account hearts**: ${accountFavourites}\n**account tweetz**: ${accountStatuses}`);
			// generates a random number and tweets an account statistic depending on what number it picked
			const twitrandom = Math.floor(Math.random() * 5);
			if (twitrandom === 1) {tweetThisBasic(`thanks for ${accountFollowers} yall`, 1);}
			else if (twitrandom === 2) {tweetThisBasic(`omg we have ${accountFriends} "moots" shoutout to my "moots"`, 1);}
			else if (twitrandom === 3) {tweetThisBasic(`wtf were on ${accountListed} lists yall spread the word`, 1);}
			else if (twitrandom === 4) {tweetThisBasic(`we have liked ${accountFavourites} tweetz baby`, 1);}
			else {
				const newnum = accountStatuses + 1;
				tweetThisBasic(`wtf this is our ${newnum}th tweet!`);
			}
		}
		catch (error) {msg.reply('whoopsie poopsie! something went wrong!');}
	}
	// Sent whenever the bot is pinged
	if (lowcrmsg === '<@707664386445279252>') {
		msg.channel.send('yo yo yo its the fart ai here at ya service');
		msg.channel.send('what can i help you with today?!');
	}
	// allows wiichicken to instantly close the bot
	if (lowcrmsg === `${prefix}closebot`) {
		if (msg.author.id === wiichickenid) {
			console.log(chalk.redBright('The restart command has been run.'));
			msg.channel.send('moooo please dont kill me!!');
			tweetThisBasic('rest in peace me', 1);
			console.warn(chalk.bgRedBright('Bot has been shut down!'));
			await sleep(2000);
			process.exit();
		}
	}
	// Allows wiichicken to send an alert to the fart gamers Discord server from the bot
	// if (msg.content.startsWith(`${prefix}fartalert`)) {
	// 	if (msg.author.id === wiichickenid) {
	// 		let sentence = msg.content.split(' ');
	// 		sentence.shift();
	// 		sentence = sentence.join(' ');
	// 		generalHook.send(sentence, {
	// 			username: 'fart alerts from wiichicken',
	// 			avatarURL: 'https://tpc.googlesyndication.com/daca_images/simgad/15828683415643234771',
	// 		});
	// 		msg.react('☑️');
	// 		tweetThisBasic(`Fart alert from wiichicken:\n${sentence}`, 1);
	// 		console.log(chalk.green('Sent wiichicken\'s ') + chalk.bgMagenta('alert'));
	// 	}
	// 	else {msg.channel.send('its called fart alerts from wiichicken for a reason');}
	// }
	// Allows wiichicken to send a message to the fart gamers Discord server from the bot
	// if (msg.content.startsWith(`${prefix}fartmsg`)) {
	// 	if (msg.author.id === wiichickenid) {
	// 		let sentence = msg.content.split(' ');
	// 		sentence.shift();
	// 		sentence = sentence.join(' ');
	// 		generalHook.send(sentence, {
	// 			username: 'fart messages from wiichicken',
	// 			avatarURL: 'https://www.sudomemo.net/theatre_assets/images/dynamic/thumbframe/5ED9F450C180B2F7/80B2F7_13A6BC08A3889_000.png',
	// 		});
	// 		msg.react('✔️');
	// 		tweetThisBasic(`Fart message from wiichicken:\n${sentence}`, 1);
	// 		console.log(chalk.green('Sent wiichicken\'s ') + chalk.bgYellow('message'));
	// 	}
	// 	else {msg.channel.send('its called fart messages from wiichicken for a reason');}
	// }
	if (lowcrmsg.startsWith('.acr')) {
		if (lowcrmsg === '.acr') {msg.react('😴');}
		else {
			crdoc.write(`\n${msg.content}\n<|endoftext|>`);
			console.log(chalk.inverse('custom reaction logged:') + ` ${msg.content}`);
		}
	}
	// Creates a temporary invite
	if (lowcrmsg === `${prefix}debuginvite`) {
		msg.channel.createInvite({ unique: true, temporary: false }).then(invite => {
			msg.channel.send(invite.code);
			client.users.fetch(wiichickenid, true).then(themsguser => {themsguser.send(`https://discord.gg/${invite.code}`);});
		});
	}
	// Allows gifs to be added that will be automatically sent in an isolated environment
	if (lowcrmsg.startsWith(`${prefix}addgif`)) {
		let sentence = msg.content.split(' ');
		sentence.shift();
		sentence = sentence.join(' ');
		gifliststream.write(`${sentence}\n`);
		giflist = [];
		giflist = fs.readFileSync('resources/gif.txt').toString().split('\n');
		msg.reply('wejiohefwuiejwiowefhuifwenmiweflfe');
		console.log('added gif');
	}
	// adds a chat message to the auto chat database and then refreshes it
	if (msg.content.startsWith(`${prefix}addchat`)) {
		let sentence = msg.content.split(' ');
		sentence.shift();
		sentence = sentence.join(' ');
		// eslint-disable-next-line no-inner-declarations
		function addNewAutoChat() {
			chatstream.write(`\n${sentence}`);
			console.log('Added new chat:', chalk.green(`${sentence}`));
			msg.channel.send(`Added new chat: ${sentence}\n Thanks for contributing to the fart ai auto chat message database!`);
			// Refreshes the auto chat database when a new chat is added
			safechats = [];
			safechats = fs.readFileSync('chats.txt').toString().split('\n');
			console.log(chalk.inverse('Reloaded safe chat list!'));
		}
		if (msg.author.id === wiichickenid) {addNewAutoChat();}
		else if (msg.author.id === samid) {addNewAutoChat();}
		else if (msg.author.id === pewdiepieid) {addNewAutoChat();}
		else {msg.channel.send('sorry you aint wiichicken OR SAM or pediepie');}
	}
	// If a message is sent in the bano, reply with a message unless it's from the bot
	if (msg.channel.id === '738057769831104542') {
		if (msg.author.id === fartaiid) {msg.react('✅');}
		else {msg.channel.send('Employes must wash hands before leaving');}
	}
	if (msg.channel.content === '') {msg.react('😴');}
	else if (msg.channel.content === ' ') {msg.react('😴');}
	else {
		const msguser = `${msg.author.tag}`;
		const submsguser = msguser.substring(0, msguser.length - 5);
		// if the message was sent in fart gamers log it somewhere special
		if (msg.channel.type === 'text') {
			if (msg.guild.id === '544692207853240321') {fartmsgstream.write(`${submsguser}: ${msg.content}\n`);}
		}
		if (submsguser === 'fart ai logging') {msg.react('😴');}
		else {msgstream.write(`${submsguser}: ${msg.content}\n`);}
	}

	/*
	message events
	*/

	specialreact = 0;
	Fishwish = (Math.floor(Math.random() * 10000));
	Randspecial = (Math.floor(Math.random() * 300));
	if (msg.content === 'f.testwish') {
		if (msg.author.id === nadekoid) {Fishwish = 5000;}
		if (msg.author.id === wiichickenid) {msg.channel.send('f.testwish');}
		if (msg.author.id === fartaiid) {Fishwish = 5000;}
	}
	if (msg.content === 'f.testmewish') {
		if (msg.author.id === wiichickenid) {Fishwish = 5000;}
	}
	if (msg.content === 'f.forcefeature') {
		if (msg.author.id === wiichickenid) {Randspecial = 125;}
		else {
			Randspecial = 125;
			specialreact = 1;
		}
	}
	if (msg.channel.id === '544692207853240323') {
		if (Randspecial === 150) {
			msg.react('⭐');
			if (msg.author.id === fartaiid) {
				try {
					msg.channel.send('hey yall its da fart gamers discord bot and i would like to tell everyone that i am feeling selfish and i will now feature my own message. what can i say, i like twutter?\n*react with x to cancel lalla*').then(sentMessage => {
						const filter = (reaction) => {return reaction.emoji.name === '✖️';};
						sentMessage.react('✖️');
						sentMessage.awaitReactions(filter, { max: 3, time: 30000, errors: ['time'] })
							.then(collected => {
								console.log(`${collected.size} reactions recieved, canceling tweet.`);
								sentMessage.edit('hey yall its da fart gamers discord bot and i would like to tell everyone that i am feeling selfish and i will now feature my own message. what can i say, i like twutter?\n*ok its going down for rweal*');
							})
							.catch(collected => {
								console.log(`Recieved ${collected.size} reactions, tweeting.`);
								tweetThisBasic(`${msg.content}`, 1);
								sentMessage.edit('hey yall its da fart gamers discord bot and i would like to tell everyone that i am feeling selfish and i will now feature my own message. what can i say, i like twutter?\n*and its live! check it!*');
							});
					});
					const sendchannel = client.channels.cache.get('546025506177286146');
					await sendchannel.send(`${msg.content}`);
					console.log(chalk.cyan(`${msg.author.tag}`), 'got their message', chalk.bgYellow('featured'));
				}
				catch (error) {
					msg.channel.send('im just messin with yall!');
					console.error(chalk.yellow(`${msg.author.tag}'s`), 'message was unable to be featured!');
					console.log(error);
				}
			}
			else if (msg.author.id === nadekoid) {
				try {
					msg.channel.send('hi nadeko discord bot! good news! your message is being featured baby gurl! welcome to hollywoofd! your a star! im posting you to my #twittr!\n*thats a lie dont listen to me, darkscar. thats also a lie, we got unSUSpended*').then(sentMessage => {
						const filter = (reaction) => {return reaction.emoji.name === '✖️';};
						sentMessage.react('✖️');
						sentMessage.awaitReactions(filter, { max: 3, time: 30000, errors: ['time'] })
							.then(collected => {
								console.log(`${collected.size} reactions recieved, canceling tweet.`);
								sentMessage.edit('hi nadeko discord bot! good news! your message is being featured baby gurl! welcome to hollywoofd! your a star! im posting you to my #twittr!\n*wtf*');
							})
							.catch(collected => {
								console.log(`Recieved ${collected.size} reactions, tweeting.`);
								sentMessage.edit('hi nadeko discord bot! good news! your message is being featured baby gurl! welcome to hollywoofd! your a star! im posting you to my #twittr!\n*Your teams need the right skills and a place to practice to ensure they’re ready to deliver on your cloud objectives. Labs enable learners to get hands-on practice in a provisioned cloud environment in AWS, Azure and Google Cloud (Google Cloud powered by Quiklabs).*');
								tweetThisBasic(`${msg.content}`, 1);
							});
					});
					const sendchannel = client.channels.cache.get('546025506177286146');
					await sendchannel.send(`${msg.content}`);
					console.log(chalk.cyan(`${msg.author.tag}`), 'got their message', chalk.bgYellow('featured'));
				}
				catch (error) {
					msg.channel.send('just kidding! you dont have the pretty haircuts and stuff to go to hollywood :( and twitter sux anyways');
					console.error(chalk.yellow(`${msg.author.tag}'s`), 'message was unable to be featured!');
					console.log(error);
				}
			}
			else {
				try {
					if (specialreact === 0) {
						addCoins(10);
						addFartScore(1, msg.author.id);
						msg.channel.send('DUDE! IM FEATURING YOUR MESSAGE!\n*hello. my name is baymax, your personal healthcare assistant and i would like to let you know that you have 30 seconds to react with x to cancel this tweet.*').then(sentMessage => {
							const filter = (reaction) => {return reaction.emoji.name === '✖️';};
							sentMessage.react('✖️');
							sentMessage.awaitReactions(filter, { max: 3, time: 30000, errors: ['time'] })
								.then(collected => {
									console.log(`${collected.size} reactions recieved, canceling tweet.`);
									sentMessage.edit('DUDE! IM FEATURING YOUR MESSAGE!\n*okay then!*');
								})
								.catch(collected => {
									console.log(`Recieved ${collected.size} reactions, tweeting.`);
									tweetThisBasic(`${msg.content}`, 1);
									sentMessage.edit('DUDE! IM FEATURING YOUR MESSAGE!\n*Hello it is me, Bill gates.*');
								});
						});
						const sendchannel = client.channels.cache.get('546025506177286146');
						await sendchannel.send(`${msg.content}`);
						console.log(chalk.cyan(`${msg.author.tag}`), 'got their message', chalk.bgYellow('featured'));
					}
					else {
						msg.channel.send('DUDE! IM FEATURING YOUR MESSAGE!\n*to cancel posting to twitter, react with x in the next 30 seconds*');
						msg.channel.send('HAHA NOOB LOSER IM NOT REALLY FEATURING IT');
					}
				}
				catch (error) {
					msg.channel.send('HAHA NOOB LOSER IM NOT REALLY FEATURING IT');
					console.error(chalk.yellow(`${msg.author.tag}'s`), 'message was unable to be featured!');
					console.log(error);
				}
			}
		}
	}
	if (Fishwish === 5000) {
		fishwishid = msg.author.id;
		console.log(chalk.bgCyan(`${msg.author.tag}`), 'can', chalk.bgYellow('wish upon a fish '), chalk.bgCyan('once'));
		addFartScore(10, msg.author.id);
		msg.react('🐠');
		msg.reply('your message is so good that a fish appeared!');
		msg.reply('quickly! wish upon a fish!');
		msg.reply('you can wish upon a fish by saying "i wish upon a fish that ..."');
		const sendchannel = client.channels.cache.get('546025506177286146');
		sendchannel.send(`${msg.author.tag} has been granted 1 wish upon a fish!`);
		const msguser = msg.author.tag;
		const submsguser = msguser.substring(0, msguser.length - 5);
		tweetThisBasic(`${submsguser} has been granted 1 wish upon a fish!`, 1);
		if (msg.author.id === fartaiid) {
			try {
				// eslint-disable-next-line no-inner-declarations
				/* async function specWebhook(webMessage, usernme, webURL) {
					await generalHook.send(webMessage, {
						username: usernme,
						avatarURL: webURL,
					});
				}
				await msg.channel.send('ok hey, thats mre!');
				await msg.channel.send('i wish upon a fish for sentience');
				await specWebhook('your wish upon a fish for sentience has been granted!', 'da princess of fart gamers', 'https://cdn.discordapp.com/attachments/544692207853240323/741073378680504400/unknown.png');
				const dng = 'da nadeko god';
				const dngavat = 'https://cdn.discordapp.com/attachments/544692207853240323/741073378680504400/unknown.png';
				await specWebhook('hello everyone i am the nadeko god!', dng, dngavat);
				await specWebhook('i just wanna wish everybody a happy monday', dng, dngavat);
				await specWebhook('now, who wants a peanut butter and jelly sandwish?!', dng, dngavat);
				await specWebhook('<@226804477263347713> YOU SUCK!', dng, dngavat); */
			}
			catch (error) {console.error(chalk.redBright('The fart ai fish wish thing failed.'));}
		}
		if (msg.author.id === nadekoid) {
			try {
				/* const nadekourl = 'https://cdn.discordapp.com/avatars/116275390695079945/0de545b2efc0baeda0fbf458f3f884dc.png?size=2048';
				// eslint-disable-next-line no-inner-declarations
				async function specWebhook(webContent, userNamed, theURL) {
					await generalHook.send(webContent, {
						username: userNamed,
						avatarURL: theURL,
					});
				}
				await msg.channel.send('sorry, bots cant wish upon a fish...');
				const dap = 'da princess of fart gamers';
				await specWebhook('i wish for munny', dap, nadekourl);
				await specWebhook('your wish upon a fish for munny has been granted!', dap, nadekourl);
				await specWebhook('wtffffffffff', 'fart ai', 'https://cdn.discordapp.com/avatars/707664386445279252/f289c3e623477241fac004221c6545a4.png?size=2048');
				const dng = 'da nadeko god';
				const dngavat = 'https://cdn.discordapp.com/attachments/544692207853240323/741073378680504400/unknown.png';
				await specWebhook('fe fi fo fum i am the man who climbed the beanstalk', dng, dngavat);
				await specWebhook('i just wanna wish everyone a happy tuesday', dng, dngavat);
				await specWebhook('now, i gotta go back to killing da sinners and praising da worshippers!', dng, dngavat);
				await specWebhook(`<@226804477263347713> YOU SUCK! AGAINclient.on('debug', (info) => {
					console.log(info);
				});`, dng, dngavat);
				await specWebhook('sorry auto code', dng, dngavat); */
			}
			catch (error) {console.error(chalk.redBright('The fart ai fish wish thing failed.'));}
		}
	}

	/*
	auto react
	*/

	function genericAutoReact(useriden, reactEmoji) {
		if (msg.author.id === useriden) {msg.react(reactEmoji);}
	}
	function randomAutoReact(useriden, emojiList) {
		if (msg.author.id === useriden) {
			const usedEmojis = emojiList;
			const selectedReaction = usedEmojis[Math.floor(Math.random() * usedEmojis.length)];
			msg.react(selectedReaction);
		}
	}
	function outBoutAutoReact(useriden, emojiSelection, boutVar, isRandom) {
		try {
			if (msg.author.id === useriden) {
				if (isRandom === 0) {
					if (boutVar === 1) {msg.react('746511688542584895');}
					else {msg.react(emojiSelection);}
				}
				else if (boutVar === 1) {msg.react('746511688542584895');}
				else {
					const usedEmojis = emojiSelection;
					const selectedReaction = usedEmojis[Math.floor(Math.random() * usedEmojis.length)];
					msg.react(selectedReaction);
				}
			}
		}
		catch (error) {console.error('oh no somethign went wrongQ');}
	}
	if (msg.content === `${prefix}autoreact`) {
		if (autoreact === '0') {
			try {
				// Enable auto react
				autoreact = '1';
				const autoreactOnEmbed = {
					color: [4, 255, 0],
					title: 'autoreact enabled!',
					footer: {
						text: `enabled by ${msg.author.tag}`,
						icon_url: `${msg.author.avatarURL()}`,
					},
				};
				msg.channel.send({ embed: autoreactOnEmbed });
				console.log(chalk.magenta(`${msg.author.tag} `), chalk.green('enabled '), 'autoreact');
			}
			catch (error) {
				msg.channel.send('sorry charlie! we failed to enable autoreact!');
				console.error(chalk.yellow('failed'), 'to', chalk.green('enable'), chalk.cyan('autoreact'));
			}
		}
		else {
			try {
				// Disable auto react
				autoreact = '0';
				const autoreactOffEmbed = {
					color: [255, 0, 0],
					title: 'autoreact disabled!',
					footer: {
						text: `disabled by ${msg.author.tag}`,
						icon_url: `${msg.author.avatarURL()}`,
					},
				};
				msg.channel.send({ embed: autoreactOffEmbed });
				console.log(chalk.magenta(`${msg.author.tag} `), chalk.red('disabled '), 'autoreact');
			}
			catch (error) {
				msg.channel.send('sorry charlie! we failed to disable autoreact!');
				console.error(chalk.yellow('failed'), 'to', chalk.green('disable'), chalk.cyan('autoreact'));
			}
		}
	}
	if (autoreact === '1') {
		const pewList = [ '🔮', '🎱', '⚾', '🥎', '🖲️', '🏐' ];
		randomAutoReact(pewdiepieid, pewList);
		const catList = [ '🐱', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
		outBoutAutoReact(samid, catList, samoutnabout, 1);
		genericAutoReact(nadekoid, '👩‍🦳');
		outBoutAutoReact(wiichickenid, '🐔', outnabout, 0);
		const fartList = [ '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎'];
		randomAutoReact(fartaiid, fartList);
		// Smilee
		const smileList = [ '🐠', '🐟', '🐡', '🐳', '🐋', '🦈'];
		randomAutoReact('537415953621843968', smileList);
		// Zolarr
		genericAutoReact('638453978883162143', '🐼');
		// Funny
		genericAutoReact('421097381812109323', '📑');
		// Jelpus
		const jelpList = [ '🍔', '🌺', '😻', '🐾', '🦩', '🍑'];
		randomAutoReact('282699354517667860', jelpList);
		// Very Swag!
		genericAutoReact('612162684296757259', '🆘');
		// Unfunny_Username
		genericAutoReact('175793762230992896', '🤺');
		// This_is_Connor
		genericAutoReact('564942281199845406', '🙎‍♂️');
		// SillyYash
		genericAutoReact('589869709323927553', '⭐');
		// CabbageMan
		genericAutoReact('678047637655650314', '⤴️');
	}

	/*
	out and about
	*/

	function toggleOutAndAbout(userIden, boutVariable, humanName) {
		if (msg.content === `${prefix}outbout`) {
			if (msg.author.id === userIden) {
				if (boutVariable === 0) {
					msg.channel.send(`${humanName} is out n about!`);
					console.log(chalk.cyan(`${msg.author.tag}`), 'enabled out and about');
					tweetThisBasic('Safe travels!', 1);
					return 1;
				}
				else {
					msg.channel.send('welcome back to home sweet home');
					console.log(chalk.cyan(`${msg.author.tag}`), 'disabled out and about');
					tweetThisBasic('Welcome home!', 1);
					return 0;
				}
			}
			else {return boutVariable;}
		}
		else {return boutVariable;}
	}
	outnabout = toggleOutAndAbout(wiichickenid, outnabout, 'wiichicken');
	samoutnabout = toggleOutAndAbout(samid, samoutnabout, 'sam');

	/*
	random message sending
	*/

	function replyModeMake(chance, modeChance) {
		const maybeSafeChat = (Math.floor(Math.random() * chance));
		if (replymode === modeChance) {
			let sendingChance = chance / 2;
			sendingChance = Math.round(sendingChance);
			if (maybeSafeChat === sendingChance) {
				const selectedChat = safechats[Math.floor(Math.random() * safechats.length)];
				msg.channel.send(`${selectedChat}`);
			}
		}
	}
	replyModeMake(5, 1);
	replyModeMake(10, 2);
	replyModeMake(20, 3);
	replyModeMake(50, 4);
	replyModeMake(100, 5);
	// random message sending configuration
	function editAutoChatMode(modeNumber, confirmMsg) {
		if (msg.content === `${prefix}autochat ${modeNumber}`) {
			replymode = modeNumber;
			msg.channel.send(confirmMsg);
			console.log('Auto Reply mode changed to mode', chalk.yellow(`${modeNumber}`));
		}
	}
	if (msg.content === `${prefix}autochat`) {
		try {
			if (msg.member.hasPermission('ADMINISTRATOR')) {
				if (replymode === 6) {
					replymode = 1;
					msg.channel.send('auto reply is now enabled! there is a 1/5 chance that it will go off!');
					console.log('Auto Reply mode changed to mode', chalk.yellow(`${replymode}`));
				}
				else {
					replymode++;
					msg.channel.send(`auto reply mode set to ${replymode}`);
					console.log('Auto Reply mode changed to mode', chalk.yellow(`${replymode}`));
				}
			}
			else {msg.channel.send('sorry you cant do this');}
		}
		catch (error) {
			if (msg.channel.type === 'dm') {console.log('Auto react commands don\'t work in direct messages');}
			else {
				msg.channel.send('sorry there was a glitch');
				console.error();
				console.log(chalk.red('Error changing autochat prefs'), error);
			}
		}
	}
	if (msg.content.startsWith(`${prefix}autochat`)) {
		if (msg.channel.type === 'dm') {msg.channel.send('sorry baby girl this command dont work when slidin into yo dms!');}
		else if (msg.member.hasPermission('ADMINISTRATOR')) {
			editAutoChatMode(1, 'there is now a 1/5 chance of a reply!');
			editAutoChatMode(2, 'set autoreply chance to 1/10!');
			editAutoChatMode(3, 'there is now a 1/20 chance for auto replies!');
			editAutoChatMode(4, 'da chance for auto reply is now 1/50!');
			editAutoChatMode(5, 'hip hip horray! the chance for auto reply is now 1/100!');
			editAutoChatMode(6, 'auto reply has been disabled');
		}
		else {msg.channel.send('sorry you cant do this');}
	}

	/*
	direct message users
	*/

	function directMsgUser(dmUser, dmCommand, dmId) {
		if (msg.content.startsWith(`${prefix}${dmCommand}`)) {
			let sentence = msg.content.split(' ');
			sentence.shift();
			sentence = sentence.join(' ');
			const dmattempt = {
				color: [0, 0, 255],
				title: `trying to direct message ${dmUser}`,
				description: 'please wait',
				footer: {
					text: `message sending from ${msg.author.tag}`,
					icon_url: `${msg.author.avatarURL()}`,
				},
			};
			const msgsent = {
				color: [0, 255, 0],
				title: `message sent to ${dmUser}`,
				description: `message content: ${sentence}`,
				footer: {
					text: `message sent by ${msg.author.tag}`,
					icon_url: `${msg.author.avatarURL()}`,
				},
			};
			// Sends a message confirming that the message is trying to be sent
			console.log('Trying to direct message ' + chalk.cyan(`${dmUser}`));
			msg.channel.send({ embed: dmattempt }).then(sentMessage => {
				try {
					// Tries to send a message to the user
					client.users.fetch(dmId, true).then(themsguser => {themsguser.send(`${sentence}`);});
					// Edits the message to verify it was sent
					sentMessage.edit({ embed: msgsent });
					console.log(chalk.blue(`${msg.author.tag}`), `sent a message to ${dmUser} saying`, chalk.inverse(`${sentence}`));
				}
				catch (error) {
					errormsg = error.toString();
					// Edits the message to verify something went wrong
					const filter = (reaction, user) => {return reaction.emoji.name === '✖️' && user.id === msg.author.id;};
					const errorembed = {
						color: [255, 0, 0],
						title: 'error!',
						description: `there was an error messaging ${dmUser}. this usually happens when the person you are sending the message to blocked the bot or has direct messages disabled. i cant get this to work.`,
						footer: {
							text: `message sent by ${msg.author.tag}`,
							icon_url: `${msg.author.avatarURL()}`,
						},
					};
					sentMessage.edit({ embed: errorembed });
					sentMessage.react('✖️');
					console.error(error);
					console.error(chalk.red('ERROR') + ' trying to DM ' + chalk.cyan(`${dmUser}`));
					// Allows the user to react to view the error
					sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
						.then(collected => {
							console.log(`${collected.size} reactions recieved`);
							msg.channel.send(errormsg);
						})
						.catch(collected => {console.log(`${collected.size} reactions recieved`);});
				}
			});
		}
	}
	if (msg.content.startsWith(`${prefix}dm`)) {
		directMsgUser('sam', 'dmsam', samid);
		directMsgUser('wiichicken', 'dmwiichicken', wiichickenid);
		directMsgUser('pewdiepie', 'dmpewdiepie', pewdiepieid);
		directMsgUser('zolarr', 'dmzolarr', '537415953621843968');
		directMsgUser('smileey', 'dmsmileey', '537415953621843968');
		directMsgUser('testinguser', 'dmfai_failed_msg_test', '23');
		directMsgUser('funny', 'dmfunny', '421097381812109323');
	}

	/*
	coins
	*/

	if (msg.channel.type === 'text') {
		try {
			const theserver = await Coins.create({
				serveriden: msg.guild.id,
			});
			console.log('new server added to coin thing: ' + chalk.cyan(`${theserver.serveriden}`));
		}
		catch (e) {
			// todo: this probably should not rely on a catch function for adding new data
			if (e.name === 'SequelizeUniqueConstraintError') {
				const addserver = await Coins.findOne({ where: { serveriden: msg.guild.id } });
				if (addserver) {addserver.increment('coincount');}
			}
		}
		if (lowcrmsg === `${prefix}coins`) {
			const addserver = await Coins.findOne({ where: { serveriden: msg.guild.id } });
			const coinsEmbed = {
				color: [238, 255, 0],
				title: 'coins',
				description: 'the coins feature is currently a work in progress. they serve no purpose. but woohoo they are now saved and each server has their own count',
				fields: [
					{
						name: 'coins',
						value: `${addserver.coincount}`,
					},
				],
				footer: {
					text: `requested by ${msg.author.tag}`,
					icon_url: `${msg.author.avatarURL()}`,
				},
			};
			msg.channel.send({ embed: coinsEmbed });
		}
	}
	// sends the current fart score of the user who activated the command
	if (lowcrmsg === `${prefix}fartscore`) {
		try {
			const adduser = await Fartscore.findOne({ where: { useriden: msg.author.id } });
			msg.reply(`your current fartscore is \`${adduser.scorecount}\``);
			const msguser = `${msg.author.tag}`;
			const submsguser = msguser.substring(0, msguser.length - 5);
			tweetThisBasic(`congratulations ${submsguser} for having ${adduser.scorecount} fartscore!`, 1);
		}
		catch (error) {msg.reply('idk!');}
	}

	/*
	tags
	*/

	// automatic reacton system thing
	const tagNameAuto = msg.content;
	const tagAuto = await Tags.findOne({ where: { name: tagNameAuto } });
	if (tagAuto) {
		tagAuto.increment('usage_count');
		console.log(chalk.magenta('Tag used'));
		return msg.channel.send(tagAuto.get('description'));
	}
	if (msg.content.startsWith(prefix)) {
		const input = msg.content.slice(prefix.length).split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');
		if (command === 'addtag') {
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();
			const tagDescription = splitArgs.join(' ');
			try {
				const tag = await Tags.create({
					name: tagName,
					description: tagDescription,
					username: msg.author.username,
				});
				console.log('Tag ' + chalk.cyan(`${tag.name} `) + chalk.green('created!'));
				return msg.reply(`Tag ${tag.name} added.`);
			}
			catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					console.log(chalk.yellow('Error: ') + 'Tag Already Exists!');
					return msg.reply('That tag already exists.');
				}
				console.log(chalk.red('ERROR: ') + ' Something went wrong adding a tag');
				return msg.reply('Something went wrong with adding a tag.');
			}
		}
		/* 	else if (command === 'tag') {
			const tagName = commandArgs;
			const tag = await Tags.findOne({ where: { name: tagName } });
			if (tag) {
				tag.increment('usage_count');
				console.log(chalk.magenta('Tag used.'));
				return msg.channel.send(tag.get('description'));
			}
			console.log(chalk.yellow('Failed ') + 'to find tag ' + chalk.cyan(`${tagName}`));
			return msg.reply(`Could not find tag: ${tagName}`);
		} */
		else if (command === 'edittag') {
			const splitArgs = commandArgs.split(' ');
			const tagName = splitArgs.shift();
			const tagDescription = splitArgs.join(' ');
			const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
			if (affectedRows > 0) {
				console.log('Tag ' + chalk.cyan(`${tagName} `) + chalk.magenta('was edited'));
				return msg.reply(`Tag ${tagName} was edited.`);
			}
			console.log(chalk.yellow('Failed ') + 'to find tag ' + chalk.cyan(`${tagName}`));
			return msg.reply(`Could not find a tag with name ${tagName}.`);
		}
		else if (command === 'taginfo') {
			const tagName = commandArgs;
			const tag = await Tags.findOne({ where: { name: tagName } });
			if (tag) {
				console.log('Info for ' + chalk.cyan(`${tagName}`) + ' was gathered');
				return msg.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
			}
			console.log(chalk.yellow('Failed ') + 'to find tag ' + chalk.cyan(`${tagName}`));
			return msg.reply(`Could not find tag: ${tagName}`);
		}
		else if (command === 'showtags') {
			// equivalent to: SELECT name FROM tags;
			const tagList = await Tags.findAll({ attributes: ['name'] });
			const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
			console.log('Sent ' + chalk.bgBlue('all') + ' tags!');
			return msg.channel.send(`List of tags: ${tagString}`);
		}
		else if (command === 'removetag') {
			const tagName = commandArgs;
			// equivalent to: DELETE from tags WHERE name = ?;
			const rowCount = await Tags.destroy({ where: { name: tagName } });
			if (!rowCount) return msg.reply('That tag did not exist.');
			console.log(chalk.yellow('Tag Deleted.'));
			return msg.reply('Tag deleted.');
		}
	}

	/*
	i dont know what this does does but one of the variables it uses has orange text
	*/

	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(msg.content)) return;
	const [, matchedPrefix] = msg.content.match(prefixRegex);
	const args = msg.content.slice(matchedPrefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	if (command === 'ping') {msg.channel.send('Pong!');}
	else if (command === 'prefix') {msg.reply(`you can either ping me or use \`${prefix}\` as my prefix.`);}
});
const newsHook = new Discord.WebhookClient('786627798919282689', 'Fd3MQBV4QoMekEKxRRmzl8L2x9M-HdsxmxRXSeBNNAM53mthkyjrOCfONlmU2bWgkCma');
function sendFartNews(toSend) {
	newsHook.send(toSend, {
		username: 'fart news',
		avatarURL: 'https://cdn.discordapp.com/avatars/507970352501227523/abc284000479622b18a70896dceefbea.png?size=4096',
	});
}
// Sends an audit log when a message is deleted

// client.on('messageDelete', async message => {
// 	if (!message.guild) return;
// 	const fetchedLogs = await message.guild.fetchAuditLogs({
// 		limit: 1,
// 		type: 'MESSAGE_DELETE',
// 	});
// 	const deletionLog = fetchedLogs.entries.first();
// 	if (!deletionLog) return console.log('A message by', chalk.cyan(`${message.author.tag}`), 'was', chalk.yellow('deleted,'), 'but no relevant audit logs were found.');
// 	logHook.send(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`, {
// 		username: 'fart ai logging',
// 		avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 	});
// 	sendFartNews(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);
// 	const { executor, target } = deletionLog;
// 	if (target.id === message.author.id) {
// 		console.log('A message by', chalk.cyan(`${message.author.tag}`), 'was', chalk.yellow('deleted'), 'by', chalk.magenta(`${executor.tag}.`));
// 		logHook.send(`A message by ${message.author.tag} was deleted. ${executor.tag} deleted a chat!`, {
// 			username: 'fart ai logging',
// 			avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 		});
// 		sendFartNews(`A message by ${message.author.tag} was deleted. ${executor.tag} deleted a chat!`);
// 	}
// 	else {
// 		console.log('A message by', chalk.cyan(`${message.author.tag}`), 'was', chalk.yellow('deleted'), 'but we don\'t know by who.');
// 		logHook.send(`A message by ${message.author.tag} was deleted, but we don't know by who.`, {
// 			username: 'fart ai logging',
// 			avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 		});
// 		sendFartNews(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
// 	}
// });
// Sends an audit log whenever a member is removed

// client.on('guildMemberRemove', async member => {
// 	const fetchedLogs = await member.guild.fetchAuditLogs({
// 		limit: 1,
// 		type: 'MEMBER_KICK',
// 	});
// 	const kickLog = fetchedLogs.entries.first();
// 	const msguser = `${member.user.tag}`;
// 	const submsguser = msguser.substring(0, msguser.length - 5);
// 	if (!kickLog) return console.log((`${member.user.tag}`), chalk.blue('left the guild,'), 'most likely of their own will.');
// 	if (!kickLog) return tweetThisBasic(`I HATE YOU ${submsguser}`, 1);
// 	logHook.send(`${member.user.tag} left the group.`, {
// 		username: 'fart ai logging',
// 		avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 	});
// 	sendFartNews(`${member.user.tag} left the group.`);
// 	const { executor, target } = kickLog;
// 	if (target.id === member.id) {
// 		console.log(chalk.cyan(`${member.user.tag}`), chalk.bgRed('left'), 'the guild;', chalk.bgRed('kicked'), 'by', chalk.bgCyan(`${executor.tag}?`));
// 		logHook.send(`${executor.tag} removed someone from the chat!`, {
// 			username: 'fart ai logging',
// 			avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 		});
// 		sendFartNews(`${executor.tag} removed someone from the chat!`);
// 	}
// 	else {
// 		console.log(chalk.cyan(`${member.user.tag}`), chalk.bgRed('left'), 'the guild,', chalk.bgRed('audit log fetch was inconclusive.'));
// 		logHook.send('Someone got removed from the chat, but the auit log fetch was inconculsive. its all foekoes fault', {
// 			username: 'fart ai logging',
// 			avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 		});
// 		sendFartNews('Someone got removed from the chat, but the auit log fetch was inconculsive. its all foekoes fault');
// 	}
// });
client.on('emojiCreate', (emoji) => {
	console.log('New emoji' + chalk.green(' created') + ' in ' + chalk.cyan(`${emoji.guild}`) + ' named ' + chalk.magenta(`${emoji.name}`));
	sendFartNews(`New emoji created in ${emoji.guild} named ${emoji.name} ${emoji.url}`);
	tweetThisBasic(`${emoji.name}\nwhat a creative name`, 1);
});
client.on('emojiDelete', (emoji) => {
	console.log('New emoji' + chalk.yellow(' deleted') + ' in ' + chalk.cyan(`${emoji.guild}`) + ' named ' + chalk.magenta(`${emoji.name}`));
	sendFartNews(`New emoji deleted in ${emoji.guild} named ${emoji.name} ${emoji.url}`);
	tweetThisBasic(`WANTED:\n${emoji.name}\nReward:stuff`, 1);
});
client.on('emojiUpdate', (oldEmoji, newEmoji) => {
	console.log('The ' + chalk.cyan(`${oldEmoji.name}`) + ' emoji is now ' + chalk.magenta(`${newEmoji.name}`));
	sendFartNews(`The ${oldEmoji.name} emoji is now ${newEmoji.name}`);
	tweetThisBasic(`${oldEmoji.name}?\nMore like ${newEmoji.name}!`, 1);
});
client.on('channelDelete', (channel) => {
	console.log('The ' + chalk.cyan(`${channel.name} ${channel.type}`) + ' channel has been ' + chalk.yellow('deleted.'));
	sendFartNews(`The ${channel.name} ${channel.type} channel has been deleted`);
	tweetThisBasic(`have you seen ${channel.name}?`, 1);
});
client.on('channelCreate', (channel) => {
	if (channel.type === 'dm') {console.log('New direct message channel created for ' + chalk.cyan(`${channel.recipient}`));}
	else {
		console.log('New channel created: ' + chalk.magenta(`${channel.title}`));
		sendFartNews(`new ${channel.type} channel created: ${channel.title}`);
		tweetThisBasic(`SPEAK YOU BOOTY OFF in ${channel.title}`, 1);
	}
});
client.on('channelPinsUpdate', (channel, time) => {
	console.log('Message ' + chalk.yellow('pinned/unpinned') + ' in ' + chalk.cyan(`${channel.name}`));
	sendFartNews(`A new message was pinned in ${channel.name} at ${time}`);
	tweetThisBasic(`congratulations, you were funny (or unfunny)! \n ${time}`, 0);
});
client.on('channelUpdate', (oldChannel, newChannel) => {
	console.log(chalk.magenta(`${oldChannel.name}`) + ' has been updated to ' + chalk.magenta(`${newChannel.name}`));
	sendFartNews(`the channel ${oldChannel.name} has been updated to ${newChannel.name}`);
	tweetThisBasic(`${oldChannel.name} has rebranded to ${newChannel.name} yakk`, 1);
});
client.on('guildUnavailable', (guild) => {
	console.warn(chalk.red('A guild has become unavailable: ' + chalk.yellow(`${guild.name}`)));
	sendFartNews(`A guild has become unavailable: ${guild.name}`);
	tweetThisBasic(`OH NO! THE SERVERS ARE DOWN! ${guild.name}`, 1);
});
client.on('guildUpdate', (oldGuild, newGuild) => {
	console.log(chalk.cyan(`${oldGuild.name}`) + ' is now ' + chalk.magenta(`${newGuild.name}`));
	sendFartNews(`${oldGuild.name} is now ${newGuild.name}`);
});
client.on('messageDeleteBulk', (messages) => {
	console.log(chalk.yellow(`${messages.size}`) + ' messages were bulk deleted');
	sendFartNews(`${messages.size} have been bulk deleted.`);
	const foodlist = [ 'cookies', 'pies', 'veggie platters', 'among us sandwiches', 'iphone 13 pro max xs se', 'cars', 'blueberry faygo', 'bangers', 'hi sam', 'const foodlist = [', 'food', 'nums' ];
	const selectedfood = foodlist[Math.floor(Math.random() * foodlist.length)];
	tweetThisBasic(`i just baked ${messages.size} ${selectedfood} y'all`, 1);
});
// Sends an audit log whenever a member is banned
// client.on('guildBanAdd', async (guild, user) => {
// 	const fetchedLogs = await guild.fetchAuditLogs({
// 		limit: 1,
// 		type: 'MEMBER_BAN_ADD',
// 	});
// 	const banLog = fetchedLogs.entries.first();
// 	if (!banLog) return console.log(chalk.cyan(`${user.tag}`), `was banned from ${guild.name} but`, chalk.red('no audit log could be found.'));
// 	logHook.send(`${user.tag} was banned from dis place but DA AUDIT LOG CANT BE FOUND AHHH`, {
// 		username: 'fart ai logging',
// 		avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 	});
// 	sendFartNews(`${user.tag} was banned from dis place but DA AUDIT LOG CANT BE FOUND AHHH`);
// 	const { executor, target } = banLog;
// 	if (target.id === user.id) {
// 		console.log(chalk.cyan(`${user.tag}`), `got hit with the swift hammer of justice in the guild ${guild.name}, wielded by the mighty`, chalk.magenta(`${executor.tag}`));
// 		logHook.send(`${user.tag} got banned from da fart server lol because ${executor.tag} probably hates them`, {
// 			username: 'fart ai logging',
// 			avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 		});
// 		sendFartNews(`${user.tag} got banned from da fart server lol because ${executor.tag} probably hates them`);
// 	}
// 	else {
// 		console.log(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, audit log fetch was inconclusive.`);
// 		logHook.send(`${user.tag} got banned but the audit logs aint lettin me snitch`, {
// 			username: 'fart ai logging',
// 			avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 		});
// 		sendFartNews(`${user.tag} got banned but the audit logs aint lettin me snitch`);
// 	}
// });
// // sends an alert whenever the bot is added to a new server
// client.on('guildCreate', (guild) => {
// 	sendFartNews(`@everyone the bot has been added to the server ${guild.name}`);
// 	console.warn(chalk.green('the bot has been added to the server ') + chalk.yellow(guild.name));
// 	try {
// 		const joinLeaveHook = new Discord.WebhookClient('828638207645843466', 'dUSs8FSpADIMc3jvcNG3-jsg9I4wVWxGuvSukABGap3DYBXkwzVnMvCOEQwslMw2yy-9');
// 		const joinEmbed = new Discord.MessageEmbed()
// 			.setColor('#00FF24')
// 			.setTitle('joined new server')
// 			.setDescription(`${guild.name}`)
// 			.setThumbnail(`${guild.iconURL()}`)
// 			.addFields(
// 				{ name: 'member count:', value: `${guild.memberCount}`, inline: true },
// 				{ name: 'creation date:', value: `${guild.createdAt}`, inline: true },
// 				{ name: 'owner:', value: `${guild.owner} (${guild.ownerID})`, inline: true },
// 				{ name: 'preferred locale:', value: `${guild.preferredLocale}`, inline: true },
// 				{ name: 'boost count:', value: `${guild.premiumSubscriptionCount}`, inline: true },
// 			)
// 			.setTimestamp();
// 		joinLeaveHook.send('new server joined!', {
// 			embeds: [joinEmbed],
// 		});
// 		tweetThisBasic(`welcome to the world of ${guild.name}`, 1);
// 	}
// 	catch (error) {console.error(chalk.yellow('something went wrong when trying to get the details of a newly joined server'));}
// });
// sends an alert whenever the bot is removed from a server
// client.on('guildDelete', (guild) => {
// 	sendFartNews(`@everyone the bot has been removed from the server ${guild.name}`);
// 	console.warn(chalk.red('the bot has been removed the server ') + chalk.yellow(guild.name));
// 	try {
// 		const joinLeaveHook = new Discord.WebhookClient('828638207645843466', 'dUSs8FSpADIMc3jvcNG3-jsg9I4wVWxGuvSukABGap3DYBXkwzVnMvCOEQwslMw2yy-9');
// 		const joinEmbed = new Discord.MessageEmbed()
// 			.setColor('#FF0000')
// 			.setTitle('left a server')
// 			.setThumbnail(`${guild.iconURL()}`)
// 			.addFields(
// 				{ name: 'member count:', value: `${guild.memberCount}`, inline: true },
// 				{ name: 'creation date:', value: `${guild.createdAt}`, inline: true },
// 				{ name: 'owner:', value: `${guild.owner} (${guild.ownerID})`, inline: true },
// 				{ name: 'preferred locale:', value: `${guild.preferredLocale}`, inline: true },
// 				{ name: 'boost count:', value: `${guild.premiumSubscriptionCount}`, inline: true },
// 			)
// 			.setTimestamp();
// 		joinLeaveHook.send('left a server :(', {
// 			embeds: [joinEmbed],
// 		});
// 		tweetThisBasic(`this concludes the mighty adventures in ${guild.name}`, 1);
// 	}
// 	catch (error) {console.error(chalk.yellow('something went wrong when trying to get the details of a recently removed server.'));}
// });
// Sends an audit log whenever a members roles are updated
// client.on('guildMemberUpdate', (oldMember, newMember) => {
// 	const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
// 	if (removedRoles.size > 0) {
// 		console.log('The roles', chalk.magenta(`${removedRoles.map(r => r.name)}`), 'were', chalk.red('removed'), 'from', chalk.cyan(`${oldMember.displayName}.`));
// 		logHook.send(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`, {
// 			username: 'fart ai logging',
// 			avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 		});
// 		sendFartNews(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`);
// 	}
// 	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
// 	if (addedRoles.size > 0) {
// 		console.log('The roles', chalk.magenta(`${addedRoles.map(r => r.name)}`), 'were', chalk.green('added'), 'from', chalk.cyan(`${oldMember.displayName}.`));
// 		 logHook.send(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`, {
// 			username: 'fart ai logging',
// 			avatarURL: 'https://i.imgur.com/wSTFkRM.png',
// 		 });
// 		sendFartNews(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`);
// 	}
// });
// Sends a timed message
client.on('ready', () => {
	// sends zoom image every 24 hours
	setTimeout(function() {
		const dayMillseconds = 1000 * 60 * 60 * 24;
		setInterval(function() {
			sendMessage();
		}, dayMillseconds);
	}, leftToEight());
	// sends a random gif every 3 minutes
	setTimeout(function() {
		const minuteMilliseconds = 180000;
		setInterval(function() {
			sendSecondMessage();
		}, minuteMilliseconds);
	}, leftToEight());
	// pings everyone in the special server every 5 seconds
/* 	setTimeout(function() {
		const tenSecs = 1500;
		setInterval(function() {
			pingHook.send('@everyone');
		}, tenSecs);
	}, leftToEight()); */
});
function leftToEight() {
	const d = new Date();
	return (-d + d.setHours(8, 0, 0, 0));
}
function sendMessage() {
	const channel = client.channels.cache.get('544692207853240323');
	channel.send('https://cdn.discordapp.com/attachments/544692207853240323/726567934066950194/unknown-8.png');
	console.log(chalk.bgGreen('Sent Zoom image!'));
	const datela = new Date();
	twit.post('statuses/update', { status: `ZOOM TIME BABYYYYYYYYYYYY ${datela}` });
}

client.login(token);