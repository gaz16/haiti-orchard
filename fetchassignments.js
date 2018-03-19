var orchards = [];
var trees = [];
var token = '';
var result = '';
var credential = '';

if(localStorage.getItem('upload') != null) {
  console.log("there is data to upload!!!");
}


firebase.auth().onAuthStateChanged(function(user) {
  if (user == undefined) {
    console.log("undefined user, wahoo!");
    var provider = new firebase.auth.GoogleAuthProvider();
    //provider.addScope("https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email");
    // To apply the default browser preference instead of explicitly setting it.
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
      credential = result.credential;
      if(result.credential) {
        console.log("inside result!");
        result = result.credential;
        token = result.credential.accessToken;
        localStorage.setItem('access_token', JSON.stringify(token));
        console.log("token: ");
        console.log(token);
      }
      console.log("user: ");
      var user = result.user;
      console.log(user);
      checkUser();
    }).catch(function(error) {
      var errorCode = error.code;
      console.log("error code: " + errorCode);
      var errorMessage = error.message;
      console.log('error message: ' + errorMessage);
      var email = error.email;
      console.log("error email: " + email);
    });
  } else {
    console.log("defined user, wahoo!");
    //window.user = user;
    console.log(user);    
    result = user;
    user.getIdToken().then(function(token) {
      localStorage.setItem("idToken", token);
    });
    checkUser();
  }
});

function checkUser() {
  console.log(localStorage.getItem("userType"));
  if (localStorage.getItem("userType") == "supervisor") {
    console.log("This user is a supervisor!");
    window.location.href = "src/haiti-orchard-app/supervisor-home.html";
  }
  else if (localStorage.getItem("userType") == "datacollector") {
    console.log("This user is a data collector!");
    fetchAssignments();
  }
  else {
    getUserType();
  }
}

function checkAuthorization() {
  // User is not authorized
  if (localStorage.getItem("userType") == null) {
    console.log("This user is not authorized to use this app!!!");
    var html = '';
    html +=
             '<div style="box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); padding: 16px; margin: 24px; border-radius: 5px; background-color: #fff; color: #757575;">' +
              '<div style="font-size: 22px; margin: 16px 0; color: #212121;">This email is not authorized to use the Haiti Orchard App.</div>' +
              '<p style="font-size: 16px;">Please contact a supervisor at haitiorchardapp@gmail.com for more information.</p>' +
              '</div>';
    document.getElementById("assignmentsSection").innerHTML = '';
    document.getElementById("assignmentsSection").innerHTML = html;
  }
}

function getUserType() {
  var userKey = Object.keys(window.localStorage).filter(it => it.startsWith('firebase:authUser'))[0];
  var user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
  var email = user.email;

  var key = email.split("@")[0];
  console.log(key);

  // Check to see if the user is a data collector
  firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      var url = 'https://haiti-orchard.firebaseio.com/users/' + key + '.json?auth=' + idToken;
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE) {
          if(request.status === 200) {
            var response = JSON.parse(request.response);
            console.log("http response: " + response);
            console.log(response);
            if (response == null) {
              checkAuthorization();
            }
            else if (response.role == "datacollector") {
              localStorage.setItem("userType", "datacollector");
              fetchAssignments();
            }
            else {
              localStorage.setItem("userType", "supervisor");
              window.location.href = "src/haiti-orchard-app/supervisor-home.html";
            }
          }
        }
      };
      request.open('GET', url);
      request.send();
  });
}

function fetchAssignments() {
document.getElementById("header").innerHTML = '';
document.getElementById("header").innerHTML = '<div style="position: fixed; right: 0px; left: 0px; width: 100%; height: 100px; top: 0px; vertical-align: middle; line-height: 100px; font-size: 32px; color: #fff; background-color: #3D2077;"><span style="padding-left: 32px;">My Assignments</span></div>';
var userKey = Object.keys(window.localStorage).filter(it => it.startsWith('firebase:authUser'))[0];
var user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
var url = 'https://haiti-orchard.firebaseio.com/assignments/123456.json?auth=' + localStorage.getItem("idToken") + '&orderBy="status"&equalTo="open"';
if ('caches' in window) {
  caches.match(url).then(function(response) {
    if (response) {
      document.getElementById('assignmentsSection').innerHTML = "";
      response.json().then(function(json) {
        console.log("cached json: " + json);
        console.log(json);
        for(var i = 0; i < Object.keys(json).length; i++) {
        var key = i;
        var boxShadow = '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)';
        var margin = '24px';
        var padding = '16px';
        orchards.push(json[i].orchard);
        trees.push(json[i].trees);
        renderCard(key, json[i].orchard, json[i].status, json[i].deadline, json[i].trees, padding, margin, boxShadow);
      }
      });
    }
  });
}
firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
//localStorage.setItem("idToken", idToken);
var url = 'https://haiti-orchard.firebaseio.com/assignments/123456.json?auth=' + idToken + '&orderBy="status"&equalTo="open"';
var request = new XMLHttpRequest();
request.onreadystatechange = function() {
  if(request.readyState === XMLHttpRequest.DONE) {
    if(request.status === 200) {
      document.getElementById('assignmentsSection').innerHTML = "";
      var response = JSON.parse(request.response);
      console.log("http response: " + response);
      console.log(response);
      console.log("length: " + Object.keys(response).length);
      for(var i = 0; i < Object.keys(response).length; i++) {
        console.log("key: " + i);
        var key = i;
        var boxShadow = '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)';
        var margin = '24px';
        var padding = '16px';
        orchards.push(response[i].orchard);
        trees.push(response[i].trees);
        renderCard(key, response[i].orchard, response[i].status, response[i].deadline, response[i].trees, padding, margin, boxShadow); 
      }
    }
  }
};
request.open('GET', url);
request.send();
})
.catch(function(error) {
  console.log("error firebase.auth().currentUser: " + error);
});
}

function renderCard(key, orchard, status, deadline, trees, padding, margin, boxShadow) {
  console.log("inside render card!");
  if (orchard !== undefined) {
    console.log(trees);
    var treeList = '';
    for (var i = 0; i < trees.length; i++) {
      treeList += trees[i];
      if(i != trees.length - 1) {
        treeList += ", ";
      }
    }
    var html = '';
    if(key == 0) {
      html += '<div style="height: 100px"></div>';
    }
    html +=
             '<div style="box-shadow: ' + boxShadow +  '; padding: ' + padding + '; margin: ' + margin + '; border-radius: 5px; background-color: #fff; color: #757575;">' +
              '<div style="display: inline-block; height: 64px; width: 64px; border-radius: 50%; background: #ddd; line-height: 64px; font-size: 30px; color: #555; text-align: center;">' + (parseInt(key) + 1) + '</div>' +
              '<button id="button' + key + '"type="button" style="float: right; border:none;" onclick="hideMe(' + key + ')"><img src="images/right-arrow.png" width="50%" height="50%"></button>' +
              '<div style="font-size: 22px; margin: 16px 0; color: #212121;">' + orchard + '</div>' +
              '<p style="font-size: 16px;">Status: ' + status + '</p>' +
              '<p style="font-size: 16px;">Deadline: ' + deadline + '</p>' +
              '<p style="font-size: 16px;">Trees: ' + treeList + '</p>' +
              '</div>';
    console.log(document.getElementById('assignmentsSection'));
    document.getElementById('assignmentsSection').innerHTML += html;
  }
}

function renderOrchardQuestions() {
  var boxShadow = '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)';
  var margin = '24px';
  var padding = '16px';
  var html = 
             '<div style="height: 100px"></div>' + 
             '<div style="box-shadow: ' + boxShadow +  '; padding: ' + padding + '; margin: ' + margin + '; border-radius: 5px; background-color: #fff; color: #757575;">' +      
             '<div style="font-size: 22px; margin: 16px 0; color: #212121;">Does the orchard have a fence around it?</div>' +
             '<input type="radio" name="hasfence" value="0">No<br>' +
             '<input type="radio" name="hasfence" value="1">Yes<br>' +
             '</div>' +
            
             '<div style="box-shadow: ' + boxShadow +  '; padding: ' + padding + '; margin: ' + margin + '; border-radius: 5px; background-color: #fff; color: #757575;">' +
             '<div style="font-size: 22px; margin: 16px 0; color: #212121;">Are chemical pesticides used in the orchard?</div>' +
             '<input type="radio" name="usepesticides" value="0">No<br>' +
             '<input type="radio" name="usepesticides" value="1">Yes<br>' +
             '</div>' +

             '<div style="box-shadow: ' + boxShadow +  '; padding: ' + padding + '; margin: ' + margin + '; border-radius: 5px; background-color: #fff; color: #757575;">' +
             '<div style="font-size: 22px; margin: 16px 0; color: #212121;">Are chemical fertilizers used in the orchard?</div>' +
             '<input type="radio" name="usefertilizers" value="0">No<br>' +
             '<input type="radio" name="usefertilizers" value="1">Yes<br>' +
             '</div>' + 

             '<div style="box-shadow: ' + boxShadow +  '; padding: ' + padding + '; margin: ' + margin + '; border-radius: 5px; background-color: #fff; color: #757575;">' +
             '<div style="font-size: 22px; margin: 16px 0; color: #212121;">Continue</div>' +
             '<div style="font-size: 16px; margin: 16px 0;">All fields must be filled in before continuing!</div>' +
             '<button id="continue" type="button">Continue</button>' +
             '</div>';

  document.getElementById('orchardQuestions').innerHTML = html;
}

function hideMe(assignmentNum) {
  console.log("hide me!");
  console.log(assignmentNum);
  localStorage.setItem('orchards', JSON.stringify(orchards));
  localStorage.setItem('trees', JSON.stringify(trees));
  //document.getElementById('assignmentsSection').style.display = 'none';
  //renderOrchardQuestions();
  window.location.href = "src/haiti-orchard-app/orchard-survey.html#" + assignmentNum;
}

