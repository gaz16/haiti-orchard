var orchardNum = window.location.href.split('#')[1];
orchardNum = parseInt(orchardNum);

var trees = JSON.parse(localStorage.getItem('trees'));
var orchardTrees = trees[orchardNum];

var orchards = JSON.parse(localStorage.getItem('orchards'));

console.log(orchardTrees);

var currentTree = orchardTrees[0];

console.log(currentTree);

document.getElementById('header').innerHTML += currentTree;

document.getElementById('continue').onclick = function() {
  var height = document.getElementById('height').value;
  var circumference = document.getElementById('circumference').value;
  var yield = document.getElementById('yield').value;
  var rating = document.querySelector('input[name="rating"]:checked');

  if (height == 0 || circumference == 0 || yield == 0 || rating == null) {
    document.getElementById('warning').style.color = "red";
  } else {

    var n = new Date();
    var y = n.getFullYear();
    var m = n.getMonth();
    var d = n.getDate();
    var date = (y * 100) +(m * 10) + d;
    date = parseInt(date);
    var formattedDate = m + "/" + "d" + "y";

    var treesurvey = {
      "height": height,
      "circumference": circumference,
      "yield": yield,
      "rating": rating.value,
      "date": formattedDate
    };
    treesurvey = JSON.stringify(treesurvey);

    var key = 'trees/' + currentTree + '/' + date;

    localStorage.setItem(key, treesurvey);
    var uploads = localStorage.getItem('upload');
    uploads = JSON.parse(uploads);
    uploads.push(key);
    localStorage.setItem('uploads', JSON.stringify(uploads));

    console.log(orchardTrees);
    orchardTrees.shift();
    console.log(orchardTrees);
    trees[orchardNum] = orchardTrees;
    console.log(trees);
    localStorage.setItem('trees', JSON.stringify(trees));
    if (orchardTrees.length > 0) {
      location.reload();
    } else {
      alert("The orchard and tree surveys for " + orchards[orchardNum] + " have been stored and will be uploaded to the network.");
      window.location.href = "../../index.html";
    }
  }
}
