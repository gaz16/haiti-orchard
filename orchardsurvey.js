var orchardNum = window.location.href.split('#')[1];
console.log(orchardNum);

var orchardNames = JSON.parse(localStorage.getItem('orchards'));
console.log(orchardNames);

document.getElementById('header').innerHTML += orchardNames[parseInt(orchardNum)];

document.getElementById('continue').onclick = function () {
  var fence = document.querySelector('input[name="hasfence"]:checked');
  var pesticides = document.querySelector('input[name="usepesticides"]:checked');
  var fertilizers = document.querySelector('input[name="usefertilizers"]:checked');
  var infested = document.querySelector('input[name="infested"]:checked');
  var pruned = document.querySelector('input[name="pruned"]:checked');
  var shape = document.querySelector('input[name="shape"]:checked');
  var crops = document.querySelector('input[name="crops"]:checked');

  if (fence == null || pesticides == null || fertilizers == null || infested == null || pruned == null || shape == null || crops == null) {
    document.getElementById('warning').style.color = "red";
  } else {
    console.log("fence: " + fence.value);
    console.log("pesticides: " + pesticides.value);
    console.log("fertilizers: " + fertilizers.value);
    console.log("infested: " + infested.value);
    console.log("pruned: " + pruned.value);
    console.log("shape: " + shape.value);
    console.log("crops: " + crops.value);

    var n = new Date();
    var y = n.getFullYear();
    var m = n.getMonth();
    var d = n.getDate();
    var date = (y * 100) +(m * 10) + d;
    date = parseInt(date);
    var formattedDate = m + "/" + "d" + "y";

    var orchardsurvey = {
      "hasfence": fence.value,
      "usepesticides": pesticides.value,
      "usefertilizers": fertilizers.value,
      "infested": infested.value,
      "pruned": pruned.value,
      "shape": shape.value,
      "crops": crops.value,
      "date": formattedDate
    };

    var n = new Date();
    var y = n.getFullYear();
    var m = n.getMonth();
    var d = n.getDate();
    var date = (y * 100) +(m * 10) + d;
    date = parseInt(date);

    var key = 'orchards/' + orchardNames[parseInt(orchardNum)] + '/' + date;    

    localStorage.setItem(key, JSON.stringify(orchardsurvey));
    if (localStorage.getItem('upload') == null) {
      localStorage.setItem('upload', JSON.stringify([key]));
    } else {
      var uploads = localStorage.getItem('upload');
      uploads = JSON.parse(uploads);
      uploads.push(key);
      localStorage.setItem('uploads', JSON.stringify(uploads));
    }
    window.location.href = "tree-survey.html#" + orchardNum;   
  }
}

