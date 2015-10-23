/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
* note fullscreen: width: 144, height: 168.
 Beispiel fuer Item:
 {
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }
 */
var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var projectList = require('project_list');

appConfiguration = {
	rest: {		
		redmine_api_key: "YOUR_API_KEY",
		base_redmine_url: "https://www.hostedredmine.com/", //example: https://www.hostedredmine.com/
		request_projects_url_part: "projects.json",
		request_current_user_url_part: "users/current.json",
		request_membership_parameter: "memberships",
		request_key_parameter: "key="
	},
	storage: {
		current_work_item_data_key: "storage.cwidk",
	}
};

var splashWindow = new UI.Window();
var txtLoadingdata = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Loading data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(txtLoadingdata);
splashWindow.show();

Pebble.addEventListener("ready", function() {
  console.log("JS VM loaded. Perform network connection.");
	callProjectList();
});


function callProjectList() {
	var url = buildMembershipsUrl();
	console.log('Url: '+url);
	ajax(
	{
		url: url,
		type: 'json',
		method: 'get',
	},
	function(data) {
		// Success!
		console.log('Successfully fetched redmine projects!');
		splashWindow.hide();
		projectList.showProjects(data.user.memberships);
	},
	function(error) {
			// Failure!
			console.log('Failed fetching redmine projects: ' + JSON.stringify(error));
			txtLoadingdata.text("something went wrong.");  
	});
}


function buildMembershipsUrl() {
	var baseUrl = appConfiguration.rest.base_redmine_url;
	var requestPart = appConfiguration.rest.request_current_user_url_part;
	var membershipParameter = appConfiguration.rest.request_membership_parameter;
	var requestKeyParamName = appConfiguration.rest.request_key_parameter;
	var redmineApiKey = appConfiguration.rest.redmine_api_key;
  //return baseUrl + requestPart;
  return baseUrl  + requestPart + "?include="+membershipParameter+"&"+requestKeyParamName+redmineApiKey;
}
