firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      console.log("user is signed in!");
      getOrchards();
    } else {
      console.log("user is not signed in!");
    }
});

var orchards =[];

function getOrchards() {
  firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
    var url = 'https://haiti-orchard.firebaseio.com/orchards.json?auth=' + idToken;
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
            console.log("cached json: " + json);
            console.log(json);
            var orchardNames = [];
            var list = document.getElementById("myUL");
            list.innerHTML = '';
            var html = '';
            for(var i = 0; i < json.length; i++) {
              orchardNames.push(json[i].name);
              html += '<li><a href="#">' + json[i].name + '</a></li>';
            }
            list.innerHTML = html;
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
          var orchardNames = [];
          var list = document.getElementById("myUL");
          list.innerHTML = '';
          var html = '';
          for(var i = 0; i < Object.keys(response).length; i++) {
            console.log("key: " + i);
            orchardNames.push(response[i].name);
            orchards.push(response[i]);
            html += '<li><a id="' + i + '">' + response[i].name + '</a></li>';
          }
          list.innerHTML = html;
          clickList();
        }
      }
    };
    request.open('GET', url);
    request.send();
    });
}

document.getElementById("myInput").onkeyup = function() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
    } else {
        li[i].style.display = "none";
    }
  }
}

function clickList() {
  console.log("adding click function");
  document.getElementById("myUL").addEventListener("click", function(e) {
    console.log("orchard has been clicked");
    console.log(e.target);
    console.log(e.target.id);
    var id = e.target.id;
    var html = '<div style="box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); padding: 16px; margin: 24px; border-radius: 5px; background-color: #fff; color: #757575;">' +
              '<button id="closeCard" type="button" style="float:right; border: none;"><img src="../../images/cross.png"></button>' +
              '<div style="font-size: 22px; margin: 16px 0; color: #212121;">' + orchards[id].name + '</div>' +
              '<p style="font-size: 16px;">Location: ' + orchards[id].latitude + ', ' + orchards[id].longitude + '</p>' +
              '<p style="font-size: 16px;">Soil: ' + orchards[id].soil + '</p>' +
              '<p style="font-size: 16px;">Trees: ' + orchards[id].trees + '</p>' +
              '<p style="font-size: 16px;">Direct Benefitors: ' + orchards[id].benefitors + '</p>' +
              '<p style="font-size: 16px;">Total Yield: ' + orchards[id].yield + '</p>' +
              '</div>';
    document.getElementById("card").innerHTML = html;
    document.getElementById("closeCard").onclick = function() {
      document.getElementById("card").innerHTML = '';
    }
  });
}

var modal = document.getElementById('myModal');
var orchardBtn = document.getElementById('addOrchard');
var span = document.getElementsByClassName("close")[0];

orchardBtn.onclick = function() {
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

document.getElementById('add').onclick = function() {
  var name = document.getElementById('name').value;
  var latitude = document.getElementById('latitude').value;
  var longitude = document.getElementById('longitude').value;
  var soil = document.querySelector('input[name="soil"]:checked');
  var benefitors = document.getElementById('benefitors').value;
  var trees = document.getElementById('trees').value;
  var yield = 0;

  if (name == "" || latitude == 0 || longitude == 0 || soil == null || benefitors == 0 || trees == 0) {
    document.getElementById('warning').style.color = "red";
  } else {
    var orchard = {
      "name": name,
      "latitude": latitude,
      "longitude": longitude,
      "soil": soil.value,
      "benefitors": benefitors,
      "trees": trees,
      "yield": yield
    };
    orchard = JSON.stringify(orchard);
    console.log(orchard);
    modal.style.display = "none";
  }
}
