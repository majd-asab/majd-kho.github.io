var ttc_195 = "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&stopId=11924&routeTag=195";
var ttc_196 = "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&stopId=11280&routeTag=196";
var ttc_41  = "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&stopId=11279&routeTag=41";
var ttc_60  = "http://webservices.nextbus.com/service/publicJSONFeed?command=predictions&a=ttc&stopId=14277&routeTag=60";

var goB_45  = "https://abrupt-desire-2009.nanoscaleapi.io/go-45.json";
var goB_46  = "https://abrupt-desire-2009.nanoscaleapi.io/go-46.json";
var goB_47  = "https://abrupt-desire-2009.nanoscaleapi.io/go-47.json";
var goB_48  = "https://abrupt-desire-2009.nanoscaleapi.io/go-48.json";
var goB_51  = "https://abrupt-desire-2009.nanoscaleapi.io/go-51.json";
var goB_52  = "https://abrupt-desire-2009.nanoscaleapi.io/go-52.json";
var goB_54  = "https://abrupt-desire-2009.nanoscaleapi.io/go-54.json";

function setTime(){
	var date = new Date().toString().split(" ");
	var timeAndTitleContainer = document.getElementById("time-title-container"); 
	var time = document.createElement("div");
	timeAndTitleContainer.appendChild(time);
	time.id = "time";
	time.innerHTML = date[0]+" "+date[1]+" "+
	date[2] +"<br/>"+date[4];
}

function getDay(){
	var d = new Date();
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

	return weekday[d.getDay()];
}

function variableAggregator(...a){
	return a;
}

function spanTimeCreation(string, fontPercent, opacity){
	var span = "<span style=\"font-size:"+fontPercent+"px;opacity:"+opacity+
	";margin-right:10px;\">" + string + "</span>"; 
	return span;
}






function xhrCall(busFeedUrl,cb){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", busFeedUrl, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			return cb(xhr.responseText)
			
		} else {
			console.error(xhr.statusText);
			return cb(false)
		}
	};
	xhr.onerror = function (e) {
		return cb(false);
	};
	xhr.send(null);
}


function addRouteRow(table,dataElements,agencyTitle,routeTitle){
	var newRow = document.createElement("tr");
	table.appendChild(newRow);
	var tName   = document.createElement("td");
	var tNumber = document.createElement("td");
	var rName   = document.createElement("td");
	var vTime   = document.createElement("td");

	newRow.appendChild(tName);
	newRow.appendChild(tNumber);
	newRow.appendChild(rName);
	newRow.appendChild(vTime);

	var divInTd = document.createElement("div");
	tName.appendChild(divInTd);
	divInTd.className="tNameClass"
	if(agencyTitle === "Toronto Transit Commission"){
		divInTd.innerHTML = "<img src=\"images/TTC-LOGO.png\" alt=\"TTC\" height=\"20\" width=\"50\">"
		rName.innerHTML   = routeTitle;

		var dataPerVehical; 
		if(dataElements.direction !== undefined){
			dataPerVehical = dataElements.direction.prediction;
		}else{
			dataPerVehical = dataElements.prediction;
		}

			if((dataPerVehical.length >= 2) === true){
				vTime.innerHTML = spanTimeCreation(dataPerVehical[0].minutes,23,1)+
					" " + spanTimeCreation(dataPerVehical[1].minutes,18,0.9);
				
				tNumber.innerHTML = dataPerVehical[1].branch;

			}else if(dataPerVehical.minutes !== undefined){
				vTime.innerHTML = dataPerVehical.minutes;
				vTime.style.fontSize = "23px";
				tNumber.innerHTML = dataPerVehical.branch;
				
			}else{
				vTime.innerHTML  = "No available times";
				tNumber.innerHTML = "Not available";
			}
			vTime.innerHTML += " min";
		}
		else if (agencyTitle === "GO Transit"){
			divInTd.innerHTML = "<img src=\"images/GO_Transit_logo.svg.png\" alt=\"GO Transit\" height=\"20\" width=\"45\">";
			divInTd.className += "GoTransit";
			tNumber.innerHTML = routeTitle; 
      switch (routeTitle){
        case "45": rName.innerHTML   = "Streetsville GO"; break;
        case "46": rName.innerHTML   = "Oakville GO"; break;
        case "47": rName.innerHTML   = "Hamilton GO"; break;
        case "48": rName.innerHTML   = "U of Guelph GO"; break;
        case "51": rName.innerHTML   = "Pickering GO"; break;
        case "52": rName.innerHTML   = "Oshawa Terminal GO"; break;
        case "54": rName.innerHTML   = "Mount Joy GO"; break;
        default  : rName.innerHTML   = "Go Bus";
			}
			if(dataElements.length >= 2){
				vTime.innerHTML   = spanTimeCreation(dataElements[0],23,1)+
						" " + spanTimeCreation(dataElements[1],18,0.9) + " min";
			}else{
				vTime.innerHTML   = spanTimeCreation(dataElements[0],23,1)+ " min"
			}
			
		}
	}
	
	

function getNextBusTime(jsonTimeArray,cb){
	var date          = new Date();
	var currentMinute = date.getMinutes().toString();
	var currentHour   = date.getHours().toString();
	var times 		  = [];
	for (var i = 0; i < jsonTimeArray.length; i++){
		var hourElement = (jsonTimeArray[i].split(":")[0].split("")[0] === "0" )? jsonTimeArray[i].split(":")[0].split("")[1]:jsonTimeArray[i].split(":")[0];
		var minuteElement = jsonTimeArray[i].split(":")[1];

		if(hourElement === currentHour){
			if(minuteElement > currentMinute){
				var num = new Number(minuteElement) - new Number(currentMinute);
				times.push(num);
			}
		}
		else if(hourElement === (new Number(currentHour)+1).toString()){
			console.log(hourElement)
			if(minuteElement < currentMinute){
				var minutesLeft = (59 - new Number(currentMinute)) + new Number(minuteElement);
				times.push(minutesLeft);
			}else if( minuteElement === currentMinute){
				times.push(60);
			}else if(minuteElement > currentMinute){
				var timeLeftFromTheHourPlusTheMinutes = (59 - new Number(currentMinute)) + new Number(minuteElement);
				times.push(timeLeftFromTheHourPlusTheMinutes);
			}
		}
		else{
		}
		if(i == jsonTimeArray.length-1){
			var sorted =times.sort(function(a,b){return a-b})
			return cb(sorted)
		}

	}
	

}






function insertTable() {
	var table = document.createElement("table");
	document.getElementById("table-container").appendChild(table);
			
	var firstRow = document.createElement("tr");
	table.appendChild(firstRow);
			
	var transitName = document.createElement("th");
	var transitNumber = document.createElement("th");
	var transitRouteName = document.createElement("th");
	var transitVehicalTime = document.createElement("th");
			
	firstRow.appendChild(transitName);
	firstRow.appendChild(transitNumber);
	firstRow.appendChild(transitRouteName);
	firstRow.appendChild(transitVehicalTime);
			
	transitName.innerHTML = "Transit";
	transitNumber.innerHTML = "Number";
	transitRouteName.innerHTML = "Route";
	transitVehicalTime.innerHTML = "Departure";

	 var ttcBusArray = variableAggregator(ttc_41,ttc_60,ttc_106,ttc_195,ttc_196,ttc_199);
	 for(var i =0; i< ttcBusArray.length;i++){
		
		xhrCall(ttcBusArray[i],function(info){
			var data = JSON.parse(info);
			if(data !== false){
				if(data.predictions[0] == undefined && data.predictions.direction == undefined){ 
					console.log("case 0: no data");
				}
				else if(data.predictions[0] == undefined && data.predictions.direction[0] == undefined){ 
					if(data.predictions.dirTitleBecauseNoPredictions == undefined){
					var dataAccessPoint	= data.predictions;
					var agencyTitle 		= dataAccessPoint.agencyTitle;
					var routeTitle 			= dataAccessPoint.routeTitle
					var dataPerVehical	= dataAccessPoint.direction.prediction;
					addRouteRow(table,dataAccessPoint,agencyTitle,routeTitle);
				}
					console.log("case 1: neither predictions or direction are an array");
				}
				
				else if(data.predictions[0] !== undefined && data.predictions.direction == undefined){
					var dataAccessPoint	= data.predictions;
					for(var i = 0; i < dataAccessPoint.length; i++ ){
						var dataElements 		= dataAccessPoint[i];
						if(dataElements.dirTitleBecauseNoPredictions == undefined){ 
							var agencyTitle 		= dataElements.agencyTitle;
							var routeTitle 			= dataElements.routeTitle
							addRouteRow(table,dataElements,agencyTitle,routeTitle,dataPerVehical);
						}
					}
					console.log("case 2: predictions is the array"); 
				}

				else if(data.predictions[0] == undefined && data.predictions.direction[0] !== undefined){
					var predictions = data.predictions;
					var dataAccessPoint = predictions.direction;
					for(var i = 0; i < dataAccessPoint.length; i++ ){
						var dataElements = dataAccessPoint[i];
						var agencyTitle  = predictions.agencyTitle;
						var routeTitle	 = predictions.routeTitle;
						if(dataElements.dirTitleBecauseNoPredictions == undefined){ 
							addRouteRow(table,dataElements,agencyTitle,routeTitle);
					}
						console.log("case 3: direction is an array only");
					}
				}
				else{
					console.log("data set does not match for" + ttcBusArray[i]);
				}

			}
		
			else{
				console.log("information not available for the route.")
			}
		});
	}

	var goBusArray = variableAggregator(goB_45,goB_46,goB_47,goB_48,goB_51,goB_52,goB_54);

	for(var i =0; i < goBusArray.length; i++){
		xhrCall(goBusArray[i],function(data){
			var jsObject = JSON.parse(data);
			var scheduleDay;
			if(getDay() === "Sunday" || getDay() === "Saturday"){
			 scheduleDay = jsObject.Sunday;
			}else{
			 scheduleDay = jsObject.Friday;
			}
			if(scheduleDay !== undefined){
				getNextBusTime(scheduleDay,function(info){
					if (info.length !== 0 ){
						addRouteRow(table,info,"GO Transit",jsObject.route,"goTransit");
					}
				});
			}

		});
	}
 }	



function update(){
	setInterval(function(){
		document.getElementById("table-container").innerHTML =""; 
		insertTable();
	},60000)
}

function controller(){
	insertTable();
	update();


} 
