const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token } = require('./config.json');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

 client.on('message', message => {
   if (!message.content.startsWith(prefix) || message.author.bot) return;

   const args = message.content.slice(prefix.length).split(' ');
   const command = args.shift().toLowerCase();
   if (message.content === `${prefix}ping`) {
     message.channel.send('yo yo yo da fart ai is currently workin!');
     console.log('Ping successfully recieved!');
  } else if (message.content === `${prefix}beep`) {
    message.channel.send('Boop.');
  } else if (message.content === `${prefix}restart`)
    if (msg.author.id === '257243821048463372') {
      console.log('The restart command has been run.');
      msg.channel.send('moooo please dont kill me!!');
      process.exit();
  } else if (message.content === `${prefix}server`) {
    message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  } else if (message.content === `${prefix}user-info`) {
    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  }
});

client.on('message', msg => {
 if (msg.content === 'ping') {
   msg.channel.send('<@554374476964298764>');
   msg.channel.send('<@554374476964298764>');
   msg.channel.send('<@554374476964298764>');
   msg.channel.send('<@554374476964298764>');
   msg.channel.send('<@554374476964298764>');
 }


 if (msg.content === 'yeah') {
   msg.channel.send('na na na');
   msg.react('😚');
   msg.react('😵');
   msg.react('👾');
   msg.channel.send('yeah its a pretty neat song!');
 }

 if (msg.content === 'ok!') {
   msg.react('😚');
 }

 if (msg.content === 'mao') {
   msg.react('😺');
   msg.react('😸');
   msg.react('😹');
   msg.react('😻');
   msg.react('😼');
   msg.react('😽');
   msg.react('🙀');
   msg.react('😿');
   msg.react('😾');
 }

 if (msg.content === ':tobuscuscommand:') {
 msg.channel.send('do you like my sword sword sword my diamond sword sword.');
 }

 if (msg.content === 'hi very swag') {
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@612162684296757259>');
 }

 if (msg.content === 'HUGBOX') {
 msg.channel.send('SPIRITUAL SUCCESS');
 }

 if (msg.content === 'variety pack') {
 msg.channel.send('<@554374476964298764>');
 msg.channel.send('<@254662390866640897>');
 msg.channel.send('<@109867526166417408>');
 msg.channel.send('<@612162684296757259>');
 msg.channel.send('<@282699354517667860>');
 msg.channel.send('<@257243821048463372>');
 }

 if (msg.content === 'a') {
 msg.channel.send('dance of the sugar plum farries');
 }

 if (msg.content === '<@707664386445279252>') {
 msg.channel.send('yo yo yo its the fart ai here at ya service');
 msg.channel.send('what can i help you with today?!');
 }

 const user = client.users.cache.get('421097381812109323');
 user.send(`${msg.content}`);

});

client.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // If the message content starts with "!kick"
  if (message.content.startsWith('!kick')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        member
          .kick('Optional reason that will display in the audit logs')
          .then(() => {
            // We let the message author know we were able to kick the person
            message.reply(`Successfully kicked ${user.tag}`);
          })
          .catch(err => {
            // An error happened
            // This is generally due to the bot not being able to kick the member,
            // either due to missing permissions or role hierarchy
            message.reply('I was unable to kick the member');
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        message.reply("That user isn't in this guild!");
      }
      // Otherwise, if no user was mentioned
    } else {
      message.reply("You didn't mention the user to kick!");
    }
  }
});

client.on('message', message => {
  // Ignore messages that aren't from a guild
  if (!message.guild) return;

  // if the message content starts with "!ban"
  if (message.content.startsWith('!ban')) {
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         * Read more about what ban options there are over at
         * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
         */
        member
          .ban({
            reason: 'They were bad!',
          })
          .then(() => {
            // We let the message author know we were able to ban the person
            message.reply(`Successfully banned ${user.tag}`);
          })
          .catch(err => {
            // An error happened
            // This is generally due to the bot not being able to ban the member,
            // either due to missing permissions or role hierarchy
            message.reply('I was unable to ban the member');
            // Log the error
            console.error(err);
          });
      } else {
        // The mentioned user isn't in this guild
        message.reply("That user isn't in this guild!");
      }
    } else {
      // Otherwise, if no user was mentioned
      message.reply("You didn't mention the user to ban!");
    }
  }
});

client.on('message', message => {
	if (message.content === 'fart') {
		message.react('😄');
    message.react('😳');
    message.react('🎋');
    message.react('🎱');
    message.react('🏫');
    message.react('🚾');
    message.react('🏮');
    message.react('🖲');
    message.react('🍱');
    message.react('🍇');
    message.react('🐲');
    message.react('🧿');
    message.react('🔫');
    message.react('🚿');
    message.react('💶');
    message.react('🗽');
    message.react('🗾');
    message.react('🎲');
    message.react('🍶');
    message.react('🌈');
    message.reply("welcome to the world of fart gamers");
    message.reply("ill be your guide");
    message.reply("now eat up your soup🍲");
	} else if (message.content === '!react-custom') {
		message.react('396548322053062656');
	} else if (message.content === '!fruits') {
		message.react('🍎')
			.then(() => message.react('🍊'))
			.then(() => message.react('🍇'))
			.catch(() => console.error('One of the emojis failed to react.'));
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});


const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

client.on('message', message => {
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send('Pong!');
	} else if (command === 'prefix') {
		message.reply(`you can either ping me or use \`${prefix}\` as my prefix.`);
	}
});

client.on('messageDelete', async message => {
	// ignore direct messages
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Let's perform a sanity check here and make sure we got *something*
	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	// We now grab the user object of the person who deleted the message
	// Let us also grab the target of this action to double check things
	const { executor, target } = deletionLog;


	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same author's message
	if (target.id === message.author.id) {
		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
    message.channel.send(`${executor.tag} deleted a chat!`);
	}	else {
		console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
    message.channel.send('Someone deleted a chat!');
	}
});

client.on('guildMemberRemove', async member => {
	const fetchedLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_KICK',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const kickLog = fetchedLogs.entries.first();

	// Let's perform a sanity check here and make sure we got *something*
	if (!kickLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);
  message.channel.send(`${member.user.tag} left the group.`);

	// We now grab the user object of the person who kicked our member
	// Let us also grab the target of this action to double check things
	const { executor, target } = kickLog;

	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same kicked member
	if (target.id === member.id) {
		console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}?`);
    message.channel.send(`${executor.tag} removed a user from the chat!`);
	} else {
		console.log(`${member.user.tag} left the guild, audit log fetch was inconclusive.`);
    message.channel.send('Someone got removed from the chat!');
	}
});

client.on('guildBanAdd', async (guild, user) => {
	const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_ADD',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const banLog = fetchedLogs.entries.first();

	// Let's perform a sanity check here and make sure we got *something*
	if (!banLog) return console.log(`${user.tag} was banned from ${guild.name} but no audit log could be found.`);
  message.channel.send('Someone got kicked from the chat!');

	// We now grab the user object of the person who banned the user
	// Let us also grab the target of this action to double check things
	const { executor, target } = banLog;

	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same kicked member
	if (target.id === user.id) {
		console.log(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, wielded by the mighty ${executor.tag}`);
    message.channel.send(`${executor.tag} just banned a user!`);
	} else {
		console.log(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, audit log fetch was inconclusive.`);
    message.channel.send('Someone just banned a user!');
	}
});



// We start by declaring a guildMemberUpdate listener
// This code should be placed outside of any other listener callbacks to prevent listener nesting
client.on('guildMemberUpdate', (oldMember, newMember) => {
	// If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
	const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
	if (removedRoles.size > 0) console.log(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`);
	// If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
	if (addedRoles.size > 0) console.log(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`);
});





const emojiCharacters = require('./emojiCharacters');

client.login(token);
