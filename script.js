//variables
userSeq = [];
simonSeq = [];
const NUM_OF_LEVELS = 20;
var id, color, level = 0;
var strict = false;
var error = false;
var gameOn = false //switch to turn game on or off
var boardSound = [
  "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", //green
  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", //red
  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", //yellow
  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3" //blue
];

//1- start board sequence
$(document).ready(function() {
  $(".display").text("");
  $(".start").click(function() {
    strict = false;
    error = false;
    level = 0;
    level++;
    simonSeq = []
    userSeq = [];
    simonSequence();
  })

  //user pad listener
  $(".pad").click(function() {
    id = $(this).attr("id");
    color = $(this).attr("class").split(" ")[1];
    userSequence();
  });

  //strict mode listener
  $(".strict").click(function() {
    level = 0;
    level++;
    simonSeq = []
    userSeq = [];
    strict = true;
    simonSequence();
  })

  //listener for switch button
  $(".switch").click(function() {
    gameOn = (gameOn == false) ? true : false;
    console.log(gameOn);
    if(gameOn) {
      $(".inner-switch").addClass("inner-inactive");
      $(".switch").addClass("outter-active");
      $(".display").text("00")
    }
    else {
      $(".inner-switch").removeClass("inner-inactive");
      $(".switch").removeClass("outter-active");
      $(".display").text("");
    }
  })
})

//user sequence
function userSequence() {
  userSeq.push(id);
    console.log(id+" "+color);
    addClassSound(id, color);
    //check user sequence
    if(!checkUserSeq()) {
      //if playing strict mode reset everything lol
      if(strict) {
        console.log("strict");
        simonSeq = [];
        level = 1;
      }
      error = true;
      displayError();
      userSeq = [];
      simonSequence();
    }
    //checking end of sequence
    else if(userSeq.length == simonSeq.length && userSeq.length < NUM_OF_LEVELS) {
      level++;
      userSeq = [];
      error = false;
      console.log("start simon")
      simonSequence();
    }
    //checking for winners
    if(userSeq.length == NUM_OF_LEVELS) {
      displayWinner();
      resetGame();
    }

}

/* simon sequence */
function simonSequence() {
  console.log("level "+level);
  $(".display").text(level);
  if(!error) {
    getRandomNum();
  }
  if(error && strict) {
    getRandomNum();
  }
  var i = 0;
  var myInterval = setInterval(function() {
    id = simonSeq[i];
    color = $("#"+id).attr("class");
    color = color.split(" ")[1];
    console.log(id+" "+color);
    addClassSound(id, color);
    i++;
    if(i == simonSeq.length) {
      clearInterval(myInterval);
    }
  }, 1000);
}

//generate random number
function getRandomNum() {
  var random = Math.floor(Math.random() * 4);
  simonSeq.push(random);
}

/* add temporary class and sound  */
function addClassSound(id, color) {
  $("#"+id).addClass(color+"-active");
  playSound(id)
  setTimeout(function(){
    $("#"+id).removeClass(color+"-active");
  }, 500);
}

/* checking user seq against simon's */
function checkUserSeq() {
  for(var i = 0; i < userSeq.length; i++) {
    if(userSeq[i] != simonSeq[i]) {
      return false;
    }
  }
  return true;
}

/* display error  */
function displayError() {
  console.log("error");
  var counter = 0;
  var myError = setInterval(function() {
    $(".display").text("!!");
    counter++;
    if(counter == 3) {
      $(".display").text(level);
      clearInterval(myError);
      userSeq = [];
      counter = 0;
    }
  }, 500);
}

//display winner
function displayWinner() {
  var count = 0;
  var winInterval = setInterval(function() {
    count++;
    $(".display").text("Win");
    if(count == 5) {
      clearInterval(winInterval);
      $(".display").text("00");
      count = 0;
    }
  }, 500);
}

/* play board sound */
function playSound(id) {
  var sound = new Audio(boardSound[id]);
  sound.play();
}

/* reset game */
function resetGame() {
  userSeq = [];
  simonSeq = [];
  level = 0;
  $(".display").text("00");
}
