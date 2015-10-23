/* global module */
var UI = require('ui');
var ajax = require('ajax');
var issueList = require('issue_list');

var showProjects = function(memberships) {
	
	var itemArr = [];
	for(var i = 0; i < memberships.length; i++) {
		var current = memberships[i].project;
		itemArr.push({
			title: current.name
//			subtitle: current.description
		});
	}
  
  var menu = new UI.Menu({
    sections: [{
      title:  "Projekte ("+memberships.length+")",
      items: itemArr
    }]
  });
	
  menu.on('select', function(e) {
    var project = memberships[e.itemIndex].project;
    console.log('Selected Project: '+project.name);
    showIssues(project);    

  });  
	
  menu.show();
};


function showIssues(project) {
	
  var url = appConfiguration.rest.base_redmine_url + "projects/" + project.id+"/issues.json?key="+appConfiguration.rest.redmine_api_key;
	console.log("Try to load..:"+url);
  ajax(
	{
    url: url,
    type: 'json'
  },
  function(data) {
    // Success!
		issueList.showIssues(project, data.issues);
  },
  function(error) {
    // Failure!
    console.log('Failed loading project issues: ' + error);
  });	
}


module.exports = {showProjects: showProjects};