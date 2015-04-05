//Debug mode
var debug = false;
var AllMembers = new Array();
//Minutes
var Min = 60;
//Second
var Sec = 1000;
//Limit
var Limit = 1;
function ShowMems() {
	for(var i in AllMembers) {
		log(i);
		var r = AllMembers[i];
		if( r instanceof Array) {
			for(var j in r) {
				log(r[j]);
			}
		} else {
			log(r);
		}
	}
}

function ChPrint() {
	for(var i in AllMembers) {// iはチャンネル名

		var Mems = 0;

		for(var j in AllMembers[i]) {// j はアドレス All Members[i][j] にはnick
			if(j == myAddress) {
				continue;
			}
			Mems += 1;
		}
		if(Mems == 0) {
			continue;
		}
		if(Mems <= Limit) {
			AllMembers[i] = new Array;
			continue;
		}
		var c = findChannel(i);
		if(!c)
			continue;
		c.print("分速 " + Mems + " users");
		AllMembers[i] = new Array;
	}
	//interbal
	setTimeout(SpeedCheck, Min * Sec);
}

var SpeedCheck = function() {
	ChPrint();
}
//メッセージ送受信時
function event::onChannelText(prefix, channel, text) {

	var address = prefix.address;
	if(address == myAddress){
		return;
	}
	if(AllMembers[channel] == null) {
		AllMembers[channel] = new Array;
	}
	AllMembers[channel][address] = prefix.nick;
}
//コマンド入力時
function event::onSendingCommand(command, text, context) {
	context.handled = true;
	switch (command) {
		case 'HOGE':
			ShowMems();
			break;

		default:
			context.handled = false;
			break;
	}
}

function event::onLoad() {
	if(debug) {
		AllMembers["#ukah"] = new Array();
		AllMembers["#ukah"]["hoge1"] = "hoge1";
		AllMembers["#ukah"]["hoge2"] = "hoge2";
		AllMembers["#ukah"]["hoge3"] = "hoge3";
	}
	setTimeout(SpeedCheck, Min * Sec);
}