function event::onSendingCommand(command, param, context){
	if(command.match(/MD/)){
		mode(selectedChannel.name, param);
		context.handled = true;
	}
	if(command.match(/URL/)){
		var req = new ActiveXObject("Microsoft.XMLHTTP");
		if (req) {
			req.onreadystatechange = function() {
			if (req.readyState == 4) {
				log('GET OK: ' + req.responseText);
			}
		}
			req.open('GET', 'http://infith.com/system/access/vba_xmlhttp/', true);
			req.send('');
		}
		context.handled = true;
	}
}
function event::onLoad(){
	print("(=ﾟωﾟ)ﾉぃょぅ");
	showBalloon("Title", "( ﾟдﾟ)ﾊｯ!");
}