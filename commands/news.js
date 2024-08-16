module.exports = {
	name: 'news',
	description: 'gives you the news',
	execute(message) {
		const newsTicker = [ 'You feel like making cookies. But nobody wants to eat your cookies', 'Your first batch goes in the trash. The neighborhood raccoon barely tocuhes it.', 'Your family accepts to try some of your cookies.', 'People are starting to talk about your cookies.', 'Your cookies are talked about for miles around.', 'Your cookies are renowed in the whole town!', 'Your cookies bring all the boys to the yard.', 'Your cookies now have their own website!', 'Your cookies are worth a lot of money.', 'Your cookies sell very well in distant countries.', 'People come from very far away to get a taste of your cookies.', 'Kings and queens from all over the world are enjoying your cookies.', 'There are now museums dedicated to your cookies.', 'A national day has been created in honor of your cookies.', 'History books now include a whole chapter about your coookies.', 'Your cookies have been placed under government surveillance.', 'The whole planet is enjoying your cookies!', 'Strange creatures from neighboring planets wish to try your cookies.', 'Elder gods from the whole cosmos have awoken to taste your cookies.', 'Beings from other dimensions lapse into existence just to get a taste of your cookies.', 'Your cookies have achieved sentience.', 'The universe has now turned into cookie dough, to the molecular level.', 'Your cookies are rewriting the fundamental laws of the universe.', 'A local news station runs a 10-minute segment about your cookies. Success!'];
		const tickerSelect = newsTicker[Math.floor(Math.random() * newsTicker.length)];
		message.channel.send(`${tickerSelect}`);
	},
};
