var Timer = function(startTime, endTime, rate, progress, callback){
	var timer = this;
	timer.startTime = startTime;
	timer.endTime = endTime;
	timer.rate = rate;
	timer.progress = progress;
	timer.callback = callback;
	var intervalId = null;
	var startJsTime = null;
	var _startTime = null;
	timer.run = function(){
		if(null == intervalId){
			_startTime = timer.startTime;
		}
		startJsTime = (new Date).getTime();
		intervalId = setInterval(function(){
			var curTime = _startTime + ((new Date).getTime() - startJsTime) * timer.rate;
			if((curTime - endTime) * rate < 0){
				progress(curTime);
			}else{
				curTime = 0;
				progress(curTime);
				clearInterval(intervalId);
				intervalId = null;
				if(callback){callback();}
			}
		}, 10);
	};
	timer.pause = function(){
		try{
			clearInterval(intervalId);
			_startTime += ((new Date).getTime() - startJsTime) * timer.rate;
			progress(_startTime);
		}catch(ex){}
	};
	timer.recover = function(){
		try{
			clearInterval(intervalId);
		}catch(ex){}
		intervalId = null;
	};
};