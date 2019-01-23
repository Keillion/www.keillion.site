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
			mybtn.innerHTML= "finish! check myResults. Restart?";//JSON.stringify(myResults);//"finish! check myResults";
			return;
		}
		document.querySelector(".search-word").children[0].click();
		setTimeout(function(){
			var ipt = document.querySelector("input");
			ipt.dispatchEvent(touchstartEvt);
			//ipt.focus();
			//ipt.click();
			setTimeout(function(){
				ipt.dispatchEvent(touchendEvt);
				setTimeout(function(){
					ipt.dispatchEvent(iptEvt);
					setTimeout(function(){
						ipt.value = myKeys[myKeysIndex];
						//ipt.dispatchEvent(iptEvt);
						//ipt.dispatchEvent(keyY);
						//document.dispatchEvent(keyY);
						//console.log("Y");
						//ipt.dispatchEvent(keyBack);
						setTimeout(function(){
							ipt.dispatchEvent(iptEvt);
							// ipt.blur();
							// var changeEvt = new Event("change",{"bubbles":true, "cancelable":false});
							// ipt.dispatchEvent(changeEvt);
							var btnS = document.querySelector(".search-cancle");
							// btnS.focus();
							setTimeout(function(){
								btnS.click();
								setTimeout(function(){
									//click to show during list
									document.querySelector(".filter-right-cont").click();
									setTimeout(function(){
										//change during
										// 0:24h, 1:7day, 2:30day, 3:90day
										document.querySelectorAll(".group-cont-item")[0].click();
										setTimeout(function(){
											myResults[myKeys[myKeysIndex]] = document.querySelector(".data").innerText;
											++myKeysIndex;
											setTimeout(circle, 5000);
										},1000);
									},1000);
								},2000);
							},1000);
						},100);
					},100);
				},100);
			},100);
		}, 500);
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
