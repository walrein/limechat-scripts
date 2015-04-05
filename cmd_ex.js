/*
	拡張commandスクリプト
	
    *スクリプトフォルダ表示
    *再コネクト
    *etc...
*/

var Head = "System : ";

//チャ民の情報表示
function MemDump (){
    var c = selectedChannel;
    c.print ("-member status::");

    for (var i in c.members) {
        var user = c.members[i];
        if (user.address == myAddress){
            continue;
        }else{
            c.print(user.nick + " ( " + user.address + " )");
        }
    }
    c.print ("-------------------");    
}

//スクリプトフォルダを開く
function OpenScriptFolder(){
    var c = selectedChannel;
    c.print(Head + "スクリプトフォルダを開きます。");
    shellExplore(userScriptPath);
}

//再接続
function ReConnect(){
    disconnect();
    setTimeout(function(){connect();},10)
}

//ブラウザの視聴ページを開く（今のところUstのみ）
function OpenStream(){
    var c = selectedChannel;
    if(!c) return;
    var channel = c.name.replace(/^#/, "");
    var url = "http://www.ustream.tv/channel-popup/";
    c.print(Head + "ブラウザで視聴ページを開きます。");
    browseUrl(url + channel);
}

//コマンド受信時
function event::onSendingCommand(command, text, context){
	context.handled = true;

		if(command == "SRC"){
			OpenScriptFolder();
		}else if(command == "RCNT"){
			ReConnect();
		}else if(command == "MEMS"){
			MemDump();
		}else if(command == "MIN"){
			window.minimize();
		}else if(command == "BYE"){
			part(selectedChannel.name);
		}else if(command == "OPEN"){
			OpenStream();
		}else if(command == "TP"){
			topic(selectedChannel.name,text);
		}else if(command == "MD"){
			mode(selectedChannel.name,text);
		}else if (command.match(/^#(.+)/)){
        join (command);
        context.handled = true;
    }else{
			context.handled = false;
		}
}