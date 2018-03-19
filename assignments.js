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

function getAssignments() {
  firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
    var url = 'https://haiti-orchard.firebaseio.com/assignments.json?auth=' + idToken;
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
            console.log("cached json: " + json);
            console.log(json);
            var users = json.length;
            for(var i = 0; i < users; i++) {
              var assignments = json[i];
              for(var j = 0; j < assignments.length; j++) {
                if(assignments[j].status == "open") {
                  openAssignments.push(assignments[j]);
                } else {
                  closedAssignments.push(assignments[j]);
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
          var response = JSON.parse(request.response);
          console.log("http response: " + response);
          console.log(response);
          console.log("length: " + Object.keys(response).length);
          var users = Object.keys(response);
          for(var i = 0; i < users.length; i++) {
            var assignments = response[users[i]];
            for(var j = 0; j < assignments.length; j++) {
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
    });
}

function getOrchards() {
  firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
    var url = 'https://haiti-orchard.firebaseio.com/orchards.json?auth=' + idToken;
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
    });
}

function getStudents() {
  firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
    var url = 'https://haiti-orchard.firebaseio.com/datacollectors.json?auth=' + idToken;
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
            console.log("cached json: " + json);
            console.log(json);
            var html = '';
            for(var i = 0; i < json.length; i++) {
              html += '<option>' + json[i].firstname + ' ' +  json[i].lastname + '</option>';
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
          for(var i = 0; i < Object.keys(response).length; i++) {
            html += '<option>' + response[i].firstname + ' ' + response[i].lastname  + '</option>';
          }
          document.getElementById('student').innerHTML = html;
        }
      }
    };
    request.open('GET', url);
    request.send();
    });
}

function renderCards() {
  var boxShadow = '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)';
  var margin = '24px';
  var padding = '16px';
  var openHtml = '';
  var closedHtml = '';
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
    modal.style.display = "none";
  }
  
}
