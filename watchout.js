// as score increases, player increases in size
// change size of enemies on each timeout

//create global variables: height and width; current and high score
var gameOptions = {
          height: 600,
          //width: 900,
          width: window.innerWidth,
          nEnemies: 23,
          padding: 10,
          enemyR: 8
    };
var gameStats = {
          currScore: 0,
          highScore: 0,
          collisions: 0
    };
var enemyData = [];
var enemies;


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


var checkCollision = function() {
  for (var i=0; i< enemies[0].length; i++) {
    var enemy=enemies[0][i];
    var X=enemy.cx.animVal.value;
    var Y=enemy.cy.animVal.value;
    var R=enemy.r.animVal.value;

    if(Math.abs(player.x-X) < (player.radius+R)*0.9 && Math.abs(player.y - Y) < (player.radius + R)*0.9) {
      //reset score
      gameStats.currScore=0;
      //increment collisions
      gameStats.collisions+=1;

      gameOptions.enemyR=8;
      enemies
      .attr('r', gameOptions.enemyR);

    } else {
      gameOptions.enemyR*=1.0002;
      enemies
      .attr('r', gameOptions.enemyR);
    }

  }
};

var createEnemies = function(){
  for(var i = 0; i <= gameOptions.nEnemies; i++){
    enemyData[i] ={
      x : Math.random()*gameOptions.width,
      y : Math.random()*gameOptions.height
    };
  }
};


var player = new Player();

//initial enemy placement
createEnemies();
enemies = gameboard.selectAll('circle.enemy')
            .data(enemyData);
enemies.enter()
  .append('svg:circle')
  .attr('class', 'enemy')
  .attr('fill', '#72537A')
  .attr('cx', function(enemy){ return enemy.x;})
  .attr('cy', function(enemy){ return enemy.y;})
  .attr('r', gameOptions.enemyR);

setInterval(function(){
  createEnemies();
  enemies = gameboard.selectAll('circle.enemy')
              .data(enemyData);

  enemies
    .transition()
    .duration(1000)
    .attr('class', 'enemy')
    .attr('cx', function(enemy){ return enemy.x;})
    .attr('cy', function(enemy){ return enemy.y;})
    .attr('r', gameOptions.enemyR);

}, 2000);


setInterval(function(){
  d3.select('span#current-score').text(gameStats.currScore++);
  if (gameStats.currScore>gameStats.highScore) {
    gameStats.highScore=gameStats.currScore;
    d3.select('span#high-score').text(gameStats.highScore);
  }
  d3.select('span#collision-count').text(gameStats.collisions);
  checkCollision();
}, 100);



