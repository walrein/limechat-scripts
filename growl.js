/**
	@file	growl.js
	@brief	growl通知スクリプト LimeChat2 用
	@author	ukah & ro-soku & listener
	@since 2010-02-05
	
	改変、配布自由。悪用厳禁。
**/

/*_/_/_/_/_/_/_/_/_/_/_/設定項目_/_/_/_/_/_/_/_/_/_/_/_/*/


/**
表示したい画像のファイルパスを""の間に入れてください
\を\\と表記させることを忘れずに！
**/
var ImagePath = "";

/**
	変換される文字列

	%c	チャンネル名に置き換わります
	%u	発言者名に置き換わります
	%t	テキスト内容に置き換わります
**/
//Growl title = default "<channel>"
var titletext = "%c";
//Growl text = default "<Username>:<Massage>"
var textmessage = "%u：%t";

//自分の発言をGrowlに表示させるか（表示する場合:true,させない場合:false
var MyMsg = true;

//文字数オーバーしたときに付属する文字列
var foot = " (ry"
//表示する文字数
var MsgLmt = 100;






/*_/_/_/_/_/_/_/_/_/_/_/_/_/以下、スクリプト本体_/_/_/_/_/_/_/_/_/_/_/_/*/
var sGrowlCmd = null;
var oShell;
var oWmi;

//直接Growlnotify.exeを叩いてるのはこれ
function addGrowlTask(title, text) {
	if(sGrowlCmd == null) {
		findGrowl();
		if(sGrowlCmd == null) {
			log("growl.exeが見つからないのでスキップ-" + text);
			return;
		}
	}
	var title = ' /t:"'+title.replace("\""," ")+'"';
	var icon = ' /i:"'+ImagePath+'"';
	var app = ' /a:"LimeChat"';
	var appicon = ' /ai:"'+ userScriptFilePath +'\\limechat.png"';
	var types = ' /r:"General Notification"';
	var type = ' /n:"General Notification"';
	var message = ' "'+text.replace("\""," ")+'"';
	
	oShell.Run(sGrowlCmd+title+icon+app+appicon+types+type+message, 0, false);
}

function findGrowl() {
	var proc = oWmi.ExecQuery("Select * from Win32_Process Where Name = 'Growl.exe'");
	var e    = new Enumerator(proc);
	for(; !e.atEnd(); e.moveNext()) {
		var item = e.item();
		
		var path = item.ExecutablePath.replace("\\Growl.exe", "");
		sGrowlCmd = "\"" + path + "\\growlnotify.exe\"";
		
		log("Glowl for Windows検出:" + path);
	}
}
//テキスト送受信時
function event::onChannelText (prefix, channel, text) {

	if (prefix.address == myAddress && !MyMsg) return;

    if (text.length > MsgLmt) {
        text = text.slice(0, MsgLmt);
        text += foot;
    }

	var title = titletext;
	title = title.replace("%c", channel);
	title = title.replace("%u", prefix.nick);
	title = title.replace("%t", text);

	var msg = textmessage;
	msg = msg.replace("%c", channel);
	msg = msg.replace("%u", prefix.nick);
	msg = msg.replace("%t", text);
	
	addGrowlTask (title, msg);
}
//ロード時
function event::onLoad () {
	oShell = new ActiveXObject("Wscript.Shell");
	oWmi   = GetObject("winmgmts:\\\\.\\root\\cimv2");
	
	if(ImagePath == ""){
		ImagePath = userScriptFilePath +'\\limechat.png';
	}
    log (name + " でGrowlスクリプト起動");
	addGrowlTask("Title","ライムチャットとの連携を開始しました");
}
function event::onUnLoad() {
	oShell = null;
	oWmi   = null;
	
	//addTalkTask("ライムチャットとの連携を終了しました");
}
/*
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
*/