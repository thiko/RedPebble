/* global module */
var UI = require('ui');
var issueDetail = require('issue_detail');

var showIssues = function(relatedProject, issues) {
	
	var itemArr = [];
      for(var i = 0; i < issues.length; i++) {
        var current = issues[i];
        itemArr.push({
          title: current.subject,
          subtitle: current.status.name+"@"+current.tracker.name
        });
      }  
    
      var menu = new UI.Menu({
        sections: [{
          title: "Issues@" + relatedProject.name,
          items: itemArr
        }]
      });
      menu.on('select',function(e) {    
        var issue = issues[e.itemIndex];
        issueDetail.showIssueDetails(issue);
      });  
      menu.show();
};

module.exports = {showIssues: showIssues};