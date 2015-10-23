/* global module */
var UI = require('ui');

var start = null;

var showIssueDetails = function(issue) {
	var detailBody = issue.description;
	if(!detailBody) {
		detailBody = "-- no data available --";
	}
	var detailCard = new UI.Card({
    title: issue.subject,
    subtitle: issue.tracker.name + "-" + issue.status.name,
    body: detailBody,
		style: "small",
		scrollable: true
  });
	
	detailCard.on('click','select', function(e) {
		console.log("starting longSelect");

		var fromStorage = localStorage.getItem(buildCurrentWorkItemId(issue));
		if(fromStorage) {
			console.log("fromStorage retrieved. Start date: "+ fromStorage);
			//Start for this issue is already saved in storage.
			start = new Date(fromStorage);
		}
		
		if(start){
			var end = new Date();
			var duration = end.getTime()-start.getTime();			
//			detailCard.body();
			Pebble.showSimpleNotificationOnPebble("Task time:", "Saved "+getHumanReadableTimeString(duration)+ " on issue #"+issue.id+" "+issue.subject);

			start = null;
			localStorage.removeItem(buildCurrentWorkItemId(issue));
		} else {
			start = new Date();
			storeCurrentWork(start, issue); 
		}
		
	});
	detailCard.on('longClick ','select', function() {
		console.log("longClick select");
		localStorage.clear();
		console.log("localstorage cleared");
		
	});
  detailCard.show();
	
};


// store the given start date in localStorage.
// the key were created by concatinate the global current_work_item_data_key with the id of given issue.
function storeCurrentWork(startDate, issue) {
	console.log("storeCurrentWork");
	localStorage.setItem(buildCurrentWorkItemId(issue), startDate.toUTCString());	
}

function buildCurrentWorkItemId(issue) {
	return appConfiguration.storage.current_work_item_data_key+"_"+issue.id;
}

function saveRemoteTimeEntry() {
	ajax(
{
  url: URL,
  method: 'post',
  type: 'json',
  data: {
    auth : 'test'
  }
},
function(data) {
  // Success!
  console.log(JSON.stringify(data));
},
function(error) {
  // Failure!
  console.log('no response');
}
);
}


function getLeadingZeroDigit(value) {
	
	var fixedValue = value.toFixed();
	if(fixedValue < 10) {
		return "0"+fixedValue;
	}
	
	return fixedValue;
}

/**
	x = ms / 1000
seconds = x % 60
x /= 60
minutes = x % 60
x /= 60
hours = x % 24
x /= 24
days = x
**/
function getHumanReadableTimeString(milliseconds) {
	
	var x = milliseconds / 1000;
	var seconds = x % 60;
	x = x / 60;
	var minutes = x % 60;
	x = x / 60;
	var hours = x % 24;
	x = x / 24;
	var days = x;
	
	var returnStr = getLeadingZeroDigit(hours)+":"+getLeadingZeroDigit(minutes)+":"+getLeadingZeroDigit(seconds);
	if(days >= 1) {
		returnStr = days+" Tage "+returnStr;
	}
	
	return returnStr;	
}

module.exports = {showIssueDetails: showIssueDetails};