module.exports = {
	name: 'promptlist',
	description: 'part of the fart ai waze integration. will give you a random prompt from the waze prompt list',
	execute(message) {
		const prmtList = [ '200meters', '200', '800meters', '800', '400meters', '400', '1000meters', '1000', '1500meters', '1500', 'alert_1', 'ApproachSpeedCam', 'Arrive', 'bonus', 'click_long', 'click', 'Exit', 'Fifth', 'First', 'Fourth', 'ft', 'KeepLeft', 'KeepRight', 'm', 'Police', 'rec_end', 'rec_start', 'reminder', 'Roundabout', 'Second', 'Seventh', 'Sixth', 'Straight', 'Third', 'Tickerpoints', 'TurnLeft', 'TurnRight', 'within', 'ping', 'ping2', 'message_ticker', 'AndThen', 'ApproachAccident', 'ApproachTraffic', 'ExitLeft', 'ExitRight', 'StartDrive1', 'StartDrive2', 'StartDrive3', 'StartDrive4', 'StartDrive5', 'StartDrive6', 'StartDrive7', 'StartDrive8', 'StartDrive9', 'ApproachRedLightCam', 'uturn'];
		const prListSelect = prmtList[Math.floor(Math.random() * prmtList.length)];
		message.channel.send(`${prListSelect}`);
	},
};
