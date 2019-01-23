var myKeys = ["tfboy","小米","iphone"];
var myKeysIndex = 0;
var myResults = {};
var myprocess = function(){
	var touchstartEvt = new Event("touchstart",{"bubbles":true, "cancelable":false});
	var touchendEvt = new Event("touchend",{"bubbles":true, "cancelable":false});
	var keyY = new KeyboardEvent("keyup",{"bubbles":true, "cancelable":false, code:"KeyY", isComposing:true});
	var keyBack = new KeyboardEvent("keyup",{"bubbles":true, "cancelable":false, code:"BracketLeft"});
	var iptEvt = new Event("input",{"bubbles":true, "cancelable":false});
	
	var circle = function(){
		if(myKeysIndex >= myKeys.length){
			myKeysIndex = 0;
			mybtn.innerHTML= "finish! check myResults. Restart?";
			return;
		}
		document.querySelector(".search input").value = myKeys[myKeysIndex];
		document.querySelector(".search button").click()
		setTimeout(function(){
			var tds = document.querySelectorAll("#overview_wrap td");
			myResults[myKeys[myKeysIndex]] = [tds[1].innerText,tds[2].innerText,tds[3].innerText].join(",");
			++myKeysIndex;
			setTimeout(circle, 5000);
		},2000);
	};
	circle();
};
var mybtn = document.getElementById("mybtn");
if(mybtn){
	document.body.removeChild(mybtn);
}
var mybtn = document.createElement("button");
mybtn.id = "mybtn";
mybtn.innerHTML = "start"
mybtn.style.position = "fixed";
mybtn.style.right = "0";
mybtn.style.top = "60px";
mybtn.onclick = myprocess;
document.body.appendChild(mybtn);