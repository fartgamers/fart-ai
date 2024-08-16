# fart ai

welcome to the world's most awesome discord bot of all time! i made this bot in 2022, and its designed to be used exclusively in the fart gamers india discord server. however, there is no shame in going open source! it will be fun!

## setup

ok i don't really know local variables or whatever you kids call it that well. so some files are just... not there! but you need these files for the bot to run! so using the power of markdown, i will show you what you need to do to make the bot work!

### config

the biggest thing is that you will need to make a configuration file. this file should go in the root directory of the bot, and should be called `config.json`. make this file.

ok, great! now we are going to add this into the `config.json` file:

```json
{
	"prefix": "f.",
	"token": "YOUR_TOKEN_HERE",
	"wiichickenid": "257243821048463372",
	"nadekoid": "116275390695079945",
	"fartaiid": "707664386445279252",
	"pewdiepieid": "109867526166417408",
	"samid": "254662390866640897",
	"twitconsumer_key": "CONSUMER_KEY_HERE",
	"twitconsumer_secret": "CONSUMER_SECRET_HERE",
	"twitaccess_token": "ACCESS_TOKEN_HERE",
	"twitaccess_secret": "ACCESS_SECRET_HERE"
}
```

you will notice that some of these fields are placeholders. i know i noticed! this is what you need to fill in:

- `token`: this is where you put your discord bot token
- `twitconsumer_key`: put your twitter consumer key here
- `twitconsumer_secret`: put your twitter consumer secret here. i love consuming content!
- `twitaccess_token`: put your access token here, for twitter of course
- `twitaccess_secret`: and finally, this is your twitter access secret. can you keep a secret?

because of elon musk, i don't even know if the twitter features will still work, and to be frank, i don't care!

anyways, now duplicate this `config.json` file and put the new file in the `commands` folder. it should still be called `config.json`.

you should be ready to go i think, i don't know!

## undocumented features

this bot contains a whole bunch of undocumented features. exciting! also, im terrible at documentation! you can check out [this website](https://wiggle.monster/more/archive/websites/gsites/new/fartgamersindia/?z=/more/archive/websites/gsites/new/fartgamersindia/help/fartai/) for very basic, unfinished documentation for end users. yay!

including this, there are some features that i removed from the bot here because IDK HOW TO USE SECRETS!!! they're just commented out, but they rely on webhooks i deleted:

### logHook

this is used for audit logging features. they are obviously stolen from a discord.js tutorial

### generalHook

this would send a message to `#general` in the server this was made for. because i used to suck

### suggestHook

this would send suggestions to a private server i made