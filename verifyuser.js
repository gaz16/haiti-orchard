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
    window.location.href = "src/haiti-orchard-app/my-assignments.html";
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
              window.location.href = "src/haiti-orchard-app/my-assignments.html";
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
