// as score increases, player increases in size
// change size of enemies on each timeout

//create global variables: height and width; current and high score
var gameOptions = {
          height: 450,
          width: 700,
          nEnemies: 23,
          padding: 10
    };
var gameStats = {
          currScore: 0,
          highScore: 0
    };
var enemies = [];


//initialize svg off of page body element, passing in width and height
var gameboard=d3.selectAll('body').append('svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height);

gameboard.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#C3FFE7");

//create and place player icon in center of screen
var Player=function() {
  this.x=gameOptions.width/2;
  this.y=gameOptions.height/2;
  this.fill = '#FFC539';
  this.radius = 15;
  //create d3 node
  this.render();
  this.setupDrag();

};

Player.prototype.render=function() {

  //appends player on x, y coordinate on gameboard
  //adds path for shape
  //add fill prop
  //adds transorm object of  to use x, y coordinates
  this.element = gameboard.append('svg:circle')
                  .attr('transform', 'translate('+this.x+','+ this.y+')')
                  .attr('r', this.radius)
                  .attr('fill', this.fill);
};

Player.prototype.setupDrag = function(){
  // get mouse x, y coordinates from drag event
  var context = this;
  var drag=d3.behavior.drag().on('drag', function(){
    context.setCoord(d3.event.dx, d3.event.dy);
  });
  // set svg coordinates to be mouse coordinates
  this.element.call(drag);
};

Player.prototype.setCoord = function(mouseX, mouseY){
  if (this.x+mouseX-this.radius>=0 && this.x+mouseX+this.radius<gameOptions.width) {
    this.x += mouseX;
  }
  if (this.y+mouseY-this.radius>=0 && this.y+mouseY+this.radius<gameOptions.height) {
    this.y += mouseY;
  }
  this.element.attr('transform', 'translate('+this.x + ',' + this.y+')');
};

var Enemy = function(){
  this.x=Math.random()*gameOptions.width;
  this.y=Math.random()*gameOptions.height;
  this.fill = '#72537A';
  this.radius = 10;

  this.render();
};

Enemy.prototype.render=function() {
  this.element = gameboard.append('svg:circle')
                .attr('cx', this.x)
                .attr('cy', this.y)
                .attr('r', this.radius)
                .attr('fill', this.fill);

};

Enemy.prototype.move=function(){
  var oldX=this.x;
  var oldY=this.y;
  this.x=Math.random()*gameOptions.width;
  this.y=Math.random()*gameOptions.height;
  var context = this;
  this.element.transition().duration(2000)
                .attr('cx', this.x)
                .attr('cy', this.y);
};

var checkCollision = function() {
  //place in set interval loop
  //loop over all enemies
  for(var i = 0; i < enemies.length; i++){
    var enemy = enemies[i];
    var enemyX = parseFloat(enemy.element.attr('cx'));
    var enemyY = parseFloat(enemy.element.attr('cy'));
    if(Math.abs(player.x-enemyX) < (player.radius + enemy.radius)*0.9 && Math.abs(player.y - enemyY) < (player.radius + enemy.radius)*0.9){
      gameStats.currScore=0;
      console.log('crash');
    }

  }
    //pull x and y coordinates
    //compare with player coordinates (not forgetting radius of each)
      //reset current score if collision detected
};

var getCurrPos=function(startingPos, endingPos, totTime, currTime) {
  return startingPos+(((endingPos-startingPos)/totTime) * currTime);
};


var player = new Player();



for(var i = 0; i <= gameOptions.nEnemies; i++){
  enemies.push(new Enemy());
}



setInterval(function(){
  for(var i = 0; i < enemies.length; i++){
    enemies[i].move();
  }
}, 2500);

setInterval(function(){
  d3.select('span#current-score').text(gameStats.currScore++);
  if (gameStats.currScore>gameStats.highScore) {
    gameStats.highScore=gameStats.currScore;
    d3.select('span#high-score').text(gameStats.highScore);
  }
  checkCollision();
}, 100);

