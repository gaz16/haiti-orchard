firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      console.log("user is signed in!");
      getAssignments();
      getStudents();
      getOrchards();
    } else {
      console.log("user is not signed in!");
    }
});

var closedAssignments = [];
var openAssignments = [];
var orchards = [];
var lastKey = 0;

function getAssignments() {
    var url = 'https://haiti-orchard.firebaseio.com/assignments.json?auth=' + localStorage.getItem("idToken");
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          closedAssignments = [];
          openAssignments = [];
          orchards = [];
          response.json().then(function(json) {
            console.log("cached json: " + json);
            console.log(json);
            var users = Object.keys(json);
            for(var i = 0; i < users.length; i++) {
              var assignments = json[users[i]];
              var keys = Object.keys(assignments); 
              for(var j = 0; j < keys.length; j++) {
                lastKey = j;
                if(assignments[keys[j]].status == "open") {
                  openAssignments.push(assignments[keys[j]]);
                } else {
                  closedAssignments.push(assignments[keys[j]]);
                }
              }
            }
            console.log(openAssignments);
            console.log(closedAssignments);
            renderCards();
          });
        }
      });
    }
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200) {
          closedAssignments = [];
          openAssignments = [];
          orchards = [];
          var response = JSON.parse(request.response);
          console.log("http response: " + response);
          console.log(response);
          console.log("length: " + Object.keys(response).length);
          var users = Object.keys(response);
          for(var i = 0; i < users.length; i++) {
            var assignments = response[users[i]];
            for(var j = 0; j < assignments.length; j++) {
              lastKey = j;
              console.log(assignments[j]);
              if(assignments[j].status == "open") {
                console.log("add to open array!");
                openAssignments.push(assignments[j]);
                console.log(openAssignments);
              } else {
                console.log("add to closed array!");
                closedAssignments.push(assignments[j]);
                console.log(closedAssignments);
              }
            }
          }
          console.log(openAssignments);
          console.log(closedAssignments);
          renderCards();
        }
      }
    };
    request.open('GET', url);
    request.send();
}

function getOrchards() {
    var url = 'https://haiti-orchard.firebaseio.com/orchards.json?auth=' + localStorage.getItem("idToken");
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
            console.log("cached json: " + json);
            console.log(json);
            var html = '';
            for(var i = 0; i < json.length; i++) {
              orchards.push(json[i]);
              html += '<option>' + json[i].name + '</option>';
            }
            document.getElementById('orchard').innerHTML = html;
          });
        }
      });
    }
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200) {
          var response = JSON.parse(request.response);
          console.log("http response: " + response);
          console.log(response);
          console.log("length: " + Object.keys(response).length);
          var html = '';
          for(var i = 0; i < Object.keys(response).length; i++) {
            orchards.push(response[i]);
            html += '<option>' + response[i].name + '</option>';
          }
          document.getElementById('orchard').innerHTML = html;
          html = '';
          for (var i = 0; i < orchards[0].trees; i++) {
            console.log("inside for loop!");
            html += '<option>' + (i + 1) + '</option>';
          }  
          document.getElementById('firstTree').innerHTML = html;
          document.getElementById('lastTree').innerHTML = html;
        }
      }
    };
    request.open('GET', url);
    request.send();
}

function getStudents() {
    var url = 'https://haiti-orchard.firebaseio.com/users.json?auth=' + localStorage.getItem("idToken");
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
            console.log("cached json: " + json);
            console.log(json);
            var html = '';
            var keys = Object.keys(json);
            for(var i = 0; i < keys.length; i++) {
              if (json[keys[i]].role == "datacollector") {
                html += '<option>' + json[keys[i]].firstname + ' ' +  json[keys[i]].lastname + '</option>';
              }
            }
            document.getElementById('student').innerHTML = html;
          });
        }
      });
    }
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200) {
          var response = JSON.parse(request.response);
          console.log("http response: " + response);
          console.log(response); 
          console.log("length: " + Object.keys(response).length);
          var html = ''; 
          var keys = Object.keys(response);
          for(var i = 0; i < Object.keys(response).length; i++) {
            if(response[keys[i]].role == "datacollector") {
              html += '<option>' + response[keys[i]].firstname + ' ' + response[keys[i]].lastname  + '</option>';
            }
          }
          document.getElementById('student').innerHTML = html;
        }
      }
    };
    request.open('GET', url);
    request.send();
}

function renderCards() {
  var boxShadow = '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)';
  var margin = '24px';
  var padding = '16px';
  var openHtml = '';
  var closedHtml = '';
  document.getElementById('openAssignments').innerHTML = '';
  document.getElementById('closedAssignments').innerHTML = '';
  for(var i = 0; i < openAssignments.length; i++) {
    var treeList = '';
    for (var j = 0; j < openAssignments[i].trees.length; j++) {
      treeList += openAssignments[i].trees[j];
      if(j != openAssignments[i].trees.length - 1) {
        treeList += ", ";
      }
    }
    openHtml += '<div style="box-shadow: ' + boxShadow +  '; padding: ' + padding + '; margin: ' + margin + '; border-radius: 5px; background-color: #fff; color: #757575;">' +
              '<div style="display: inline-block; height: 64px; width: 64px; border-radius: 50%; background: #ddd; line-height: 64px; font-size: 30px; color: #555; text-align: center;">' + (i + 1) + '</div>' +
              '<div style="font-size: 22px; margin: 16px 0; color: #212121;">' + openAssignments[i].orchard + '</div>' +
              '<p style="font-size: 16px;">Status: ' + openAssignments[i].status + '</p>' +
              '<p style="font-size: 16px;">Deadline: ' + openAssignments[i].deadline + '</p>' +
              '<p style="font-size: 16px;">Trees: ' + treeList + '</p>' +
              '</div>';
  }
  document.getElementById('openAssignments').innerHTML = openHtml;

  for(var i = 0; i < closedAssignments.length; i++) {
   var treeList = '';
    for (var j = 0; j < openAssignments[i].trees.length; j++) {
      treeList += openAssignments[i].trees[j];
      if(j != openAssignments[i].trees.length - 1) {
        treeList += ", ";
      }
    }
    closedHtml += '<div style="box-shadow: ' + boxShadow +  '; padding: ' + padding + '; margin: ' + margin + '; border-radius: 5px; background-color: #fff; color: #757575;">' +
              '<div style="display: inline-block; height: 64px; width: 64px; border-radius: 50%; background: #ddd; line-height: 64px; font-size: 30px; color: #555; text-align: center;">' + (i + 1) + '</div>' +
              '<div style="font-size: 22px; margin: 16px 0; color: #212121;">' + closedAssignments[i].orchard + '</div>' +
              '<p style="font-size: 16px;">Status: ' + closedAssignments[i].status + '</p>' +
              '<p style="font-size: 16px;">Deadline: ' + closedAssignments[i].deadline + '</p>' +
              '<p style="font-size: 16px;">Trees: ' + treeList + '</p>' +
              '</div>';
  }
  document.getElementById('closedAssignments').innerHTML = closedHtml;
}

var modal = document.getElementById('myModal');
var assignmentBtn = document.getElementById('addAssignment');
var span = document.getElementsByClassName("close")[0];

assignmentBtn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var selectOrchard = document.getElementById('orchard');
selectOrchard.onchange = function() {
  console.log(selectOrchard.options[selectOrchard.selectedIndex].value);
  var orchard = orchards[selectOrchard.selectedIndex];
  var html = '';
  console.log(orchard);
  console.log(orchard.trees);
  for (var i = 0; i < orchard.trees; i++) {
    console.log("inside for loop!");
    html += '<option>' + (i + 1) + '</option>';
  }
  document.getElementById('firstTree').innerHTML = html;
  document.getElementById('lastTree').innerHTML = html;
}

document.getElementById('add').onclick = function() {
  var selectStudent = document.getElementById('student');
  var selectFirst = document.getElementById('firstTree');
  var selectLast = document.getElementById('lastTree');
  var student = selectStudent.options[selectStudent.selectedIndex].value;
  var orchard = selectOrchard.options[selectOrchard.selectedIndex].value;
  var deadline = document.getElementById('deadline').value;
  var firstTree = selectFirst.options[selectFirst.selectedIndex].value;
  var lastTree = selectLast.options[selectLast.selectedIndex].value;

  if (deadline == "" || (firstTree > lastTree)) {
    document.getElementById('warning').style.color = "red";
  } else {
    var trees = [];
    for(var i = parseInt(firstTree); i < parseInt(lastTree) + 1; i ++) {
      console.log("add tree!");
      trees.push(i);
    }
    var assignment = {
      "student": student,
      "orchard": orchard,
      "deadline": deadline,
      "trees": trees,
      "status": "open"
    }
    assignment = JSON.stringify(assignment);
    console.log(assignment);

    var url = 'https://haiti-orchard.firebaseio.com/assignments/123456/' + (lastKey + 1) + '.json?auth=' + localStorage.getItem("idToken");
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200) {
          var response = JSON.parse(request.response);
          console.log(response);
          getAssignments();
          modal.style.display = "none";
        }
      }
    };
    request.open("PUT", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(assignment);
  }
  
}
