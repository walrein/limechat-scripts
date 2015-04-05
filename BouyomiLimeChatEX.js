////////////////////////////////////////////////////////////////////////////////////////////////////
// BouyomiLimeChat.js ～ 棒読みちゃん・LimeChat連携スクリプト
////////////////////////////////////////////////////////////////////////////////////////////////////
//■導入方法
// 1.当ファイルをLimeChatのscriptsフォルダに配置する
//   例）C:\【LimeChatインストール先】\users\【アカウント名】\scripts
//
// 2.LimeChat側でスクリプトを有効にする
//   ・LimeChatのメニューから「設定→スクリプトの設定」を開く。
//   ・スクリプトの設定画面で、「BouyomiLimeChatEX.js」の行を右クリックし、○を付ける。
//   ・スクリプトの設定画面の閉じるボタンを押す。
//
////////////////////////////////////////////////////////////////////////////////////////////////////
//■設定
var conf = {
	//チャンネル制限をするか
	limit:false,
	//制限をした場合のチャンネル指定
	mychannel:"#",
	
	/*読み上げ設定*/
	//発言者の名前を読み上げる
	plusname:false,
	//自分の発言を読み上げる
	mymsg:false,
	//自分と同じホストアドレスの発言を読み上げる
	myipmsg:true,
	//接続時
	connect:false,
	//切断時
	disconnect:false,
	//チャンネル参加時
	join:false,
	//チャンネル退出時
	part:false,
	//他人の切断時
	quit:false,
	//チャットを読み上げる
	text:true,
	//トークの読み上げる
	talk:false
};

////////////////////////////////////////////////////////////////////////////////////////////////////

var sRemoteTalkCmd = null;
var oShell;
var oWmi;

function addTalkTask(text) {
	if(sRemoteTalkCmd == null) {
		findRemoteTalk();
		if(sRemoteTalkCmd == null) {
			log("RemoteTalkが見つからないのでスキップ-" + text);
			return;
		}
	}
	
	oShell.Run(sRemoteTalkCmd + " \"" + text.replace("\"", " ") + "\"", 0, false);
}

function talkChat(prefix, text) {
	if (conf.plusname){
		addTalkTask(prefix.nick + "。" + text);
	} else {
		addTalkTask(text);
	}
}
function channelMsg(prefix, text){
	var nick = prefix.nick;
	var address = prefix.address;
	if(!conf.mymsg && nick == myNick) return;
	if(!conf.myipmsg && address == myAddress && nick != myNick) return;
	if(conf.text){
		talkChat(prefix, text)
	}
}
function talkMsg(prefix, text){
	if(conf.talk){
		talkChat(prefix, text)
	}
}

function findRemoteTalk() {
	var proc = oWmi.ExecQuery("Select * from Win32_Process Where Name = 'BouyomiChan.exe'");
	var e    = new Enumerator(proc);
	for(; !e.atEnd(); e.moveNext()) {
		var item = e.item();
		
		var path = item.ExecutablePath.replace("\\BouyomiChan.exe", "");
		sRemoteTalkCmd = "\"" + path + "\\RemoteTalk\\RemoteTalk.exe\" /T";
		
		log("棒読みちゃん検出:" + path);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function event::onLoad() {
	oShell = new ActiveXObject("Wscript.Shell");
	oWmi   = GetObject("winmgmts:\\\\.\\root\\cimv2");
	
	addTalkTask("ライムチャットとの連携を開始しました");
}

function event::onUnLoad() {
	oShell = null;
	oWmi   = null;
	
	//addTalkTask("ライムチャットとの連携を終了しました");
}

/*_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/*/
function event::onConnect(){
	if(conf.connect){
		addTalkTask(name + "サーバに接続しました");
	}
}

function event::onDisconnect(){
	if(conf.disconnect){
		addTalkTask(name + "サーバから切断しました");
	}
}

function event::onJoin(prefix, channel) {
	if (conf.join) {
		addTalkTask(prefix.nick + "さんが " + channel + " に入りました");
	}
}

function event::onPart(prefix, channel, comment) {
	if (conf.part) {
		addTalkTask(prefix.nick + "さんが " + channel + " から出ました。");
	}
}

function event::onQuit(prefix, comment) {
	if (conf.quit) {
		addTalkTask(prefix.nick + "さんがサーバから切断しました。");
	}
}

function event::onChannelText(prefix, channel, text) {
	channelMsg(prefix, text);
	//log("CnannelText[" + channel + "]" + text);
}

function event::onChannelNotice(prefix, channel, text) {
	channelMsg(prefix, text);
	//log("CnannelNotice[" + channel + "]" + text);
}

function event::onChannelAction(prefix, channel, text) {
	channelMsg(prefix, text);
	//log("CnannelAction[" + channel + "]" + text);
}

function event::onTalkText(prefix, targetNick, text) {
	talkMsg(prefix, text);
	//log("TalkText[" + prefix.nick + "]" + text);
}

function event::onTalkNotice(prefix, targetNick, text) {
	talkMsg(prefix, text);
	//log("TalkNotice[" + prefix.nick + "]" + text);
}

function event::onTalkAction(prefix, targetNick, text) {
	talkMsg(prefix, text);
	//log("TalkAction[" + prefix.nick + "]" + text);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//@ukah
//コマンド送信時
function event::onSendingCommand(command, param, context){
	context.handled = true;

	if(command == 'BOUYOMI'){
		if(param == ""){
			
		}
		if(param.match(/^START$/i)){
			log('hogehoge')
		}
		return;
	}
	
    context.handled = false;
}