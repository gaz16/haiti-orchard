firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      console.log("user is signed in!");
      getUsers();
    } else {
      console.log("user is not signed in!");
    }
});


function getUsers() {
  var url = 'https://haiti-orchard.firebaseio.com/users.json?auth=' + localStorage.getItem("idToken");
  if ('caches' in window) {
      caches.match(url).then(function(response) {
        console.log("response in cache is a match!");
        console.log(response);
        if (response) {
          response.json().then(function(json) {
            console.log("cached json: " + json);
            console.log(json);
            var supervisorTable = document.getElementById("supervisorTable");
            var dataCollectorTable = document.getElementById("dataCollectorsTable");
            var keys = Object.keys(json);
            for(var i = 0; i < Object.keys(json).length; i++) {
              var user = json[keys[i]];
              if(user.role == "supervisor") {
                var row = supervisorTable.insertRow(1);
              } else {
                var row = dataCollectorTable.insertRow(1);
              }
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              cell1.innerHTML = user.firstname;
              cell2.innerHTML = user.lastname;
              cell3.innerHTML = user.email;
            }
          });
        }
      });
  }
  firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
    var url = 'https://haiti-orchard.firebaseio.com/users.json?auth=' + idToken;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200) {
          var response = JSON.parse(request.response);
          console.log("http response: " + response);
          console.log(response);
          console.log("length: " + Object.keys(response).length);
          var supervisorTable = document.getElementById("supervisorTable");
          var dataCollectorTable = document.getElementById("dataCollectorsTable");
          var keys = Object.keys(response);
          for(var i = 0; i < Object.keys(response).length; i++) {
            console.log("key: " + i);
            console.log(response[keys[i]]);
            var user = response[keys[i]];
            if(user.role == "supervisor") {
              var row = supervisorTable.insertRow(1);
            } else {
              var row = dataCollectorTable.insertRow(1);
            }
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = user.firstname;
            cell2.innerHTML = user.lastname;
            cell3.innerHTML = user.email;
          }
        }
      }
    };
    request.open('GET', url);
    request.send();
    }).
    catch(function(error) {
      console.log("error getUsers: " + error);
    });
}

var modal = document.getElementById('myModal');
var supervisorBtn = document.getElementById('addSupervisor');
var dataCollectorBtn = document.getElementById('addDataCollector');
var span = document.getElementsByClassName("close")[0];

supervisorBtn.onclick = function() {
  modal.style.display = "block";
  document.getElementById("supervisor").checked = true;
}

dataCollectorBtn.onclick = function() {
  modal.style.display = "block";
  document.getElementById("dataCollector").checked = true;
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.getElementById('add').onclick = function() {
  var email = document.getElementById('email').value;
  var firstname = document.getElementById('firstname').value;
  var lastname = document.getElementById('lastname').value;
  var role = document.querySelector('input[name="role"]:checked');

  if (email == "" || firstname == "" || lastname == "" || role == null) {
    document.getElementById('warning').style.color = "red";
  } else {
    var user = {
      "email": email,
      "firstname": firstname,
      "lastname": lastname,
      "role": role.value
    }
    user = JSON.stringify(user);
    console.log(user);
    modal.style.display = "none";
  }
}
