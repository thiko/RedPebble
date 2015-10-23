/* global module */
var UI = require('ui');
var ajax = require('ajax');
var issueList = require('issue_list');

var showProjects = function(projects) {
	
	var itemArr = [];
	for(var i = 0; i < projects.length; i++) {
		var current = projects[i];
		itemArr.push({
			title: current.name
//			subtitle: current.description
		});
	}
  
  var menu = new UI.Menu({
    sections: [{
      title:  "Projekte ("+projects.length+")",
      items: itemArr
    }]
  });
	
  menu.on('select', function(e) {
    var project = projects[e.itemIndex];
    console.log('Selected Project: '+project.name);
    showIssues(project);    

  });  
	
  menu.show();
};


function showIssues(project) {
	
  var url = appConfiguration.rest.base_redmine_url + "projects/" + project.id+"/issues.json";
  
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
    console.log('Failed fetching weather data: ' + error);
  });	
}


module.exports = {showProjects: showProjects};