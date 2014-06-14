// as score increases, player increases in size
// change size of enemies on each timeout

//create global variables: height and width; current and high score
var gameOptions = {
          height: 600,
          width: window.innerWidth,
          nEnemies: 30,
          padding: 10
    };
var gameStats = {
          currScore: 0,
          highScore: 0,
          collisions: 0
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
  this.path = 'M272.3,256.9c0.1,0,0.2,0.1,0.2,0.2c5,4.2,10.7,7.1,16.6,9c2.9-5,8.4-7.5,13.9-7.5c5.5,0,11.1,2.6,14,7.7  c6.3-1.8,12.2-4.8,17.3-9.2c0.1-0.1,0.2-0.1,0.2-0.1c-7-18.9-18.3-37-31.2-37C290.7,220,279.3,238,272.3,256.9z M344.2,364.8l0,36.8  c0,0,23.2,8,8.8,33.6c0,0,5.6,17.6,13.6,8.8C374.6,435.2,401,394.4,344.2,364.8z M261.4,364.8c-56.8,29.6-30.4,70.4-22.4,79.2  c8,8.8,13.6-8.8,13.6-8.8c-14.4-25.6,8.8-33.6,8.8-33.6L261.4,364.8z M317,402.4l-25.6,0l1.6,44c0,0,10.8,12,21.6,0L317,402.4z   M265.1,288.8L265.1,288.8l0,1.6l0,95.4l16-11.4l7.2-84.8l1.6,2.4l-5.6,85.6L265,400l0,0.8l6.1,0l17.9-22.4l4.8-86.4l5.6,3.2  l-2.4,86.4l-12.6,19.2l38,0l-12.6-19.2l-2.4-86.4l5.6-3.2l4.8,86.4l17.9,22.4l6.1,0l0-0.8l-19.2-22.4l-5.6-85.6l1.6-2.4l7.2,84.8  l16,11.4l0-95.4l0-1.6h0c-0.2-5.1-1.2-11.5-3-18.4c-6.3,4.4-13.3,7.5-20.6,9.3c-2.2,7-8.8,10.5-15.2,10.5c-6.5,0-13.2-3.6-15.3-10.7  c-7-1.8-13.6-4.8-19.7-9.1C266.4,277.3,265.3,283.7,265.1,288.8z M337.7,269.3c-0.9-3.5-2-6.9-3.2-10.2c-4.6,3.6-9.7,6.4-15.1,8.1  l-3,0c-2.6-4.8-7.6-8-13.4-8c-5.8,0-10.8,3.2-13.4,8l-2.2,0c-5.4-1.8-10.5-4.5-15.1-8.1c-1.2,3.4-2.2,6.8-3.2,10.2  c5.3,3.7,11.1,6.4,17.1,8.2l2,1c1.8,6.4,7.7,11.1,14.6,11.1c7.1,0,13-4.8,14.7-11.3l1-0.3C325.5,276.2,331.9,273.3,337.7,269.3z   M303.1,284.8l-3.1-6.2l-6.8-1l4.9-4.8L297,266l6.1,3.2l6.1-3.2l-1.2,6.8l4.9,4.8l-6.8,1L303.1,284.8z';
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
  this.fill = '#8667A3';
  this.radius = 8;
  this.path = 'M265,361.5c0,3.6,2.9,6.5,6.5,6.5c3.6,0,6.5-2.9,6.5-6.5c0-3.6-2.9-6.5-6.5-6.5  C267.9,355,265,357.9,265,361.5z M335,361.5c0,3.6,2.9,6.5,6.5,6.5c3.6,0,6.5-2.9,6.5-6.5c0-3.6-2.9-6.5-6.5-6.5  C337.9,355,335,357.9,335,361.5z M297.1,354.5c0,5.2,4.2,9.4,9.4,9.4c5.2,0,9.4-4.2,9.4-9.4c0-5.2-4.2-9.4-9.4-9.4  C301.3,345.1,297.1,349.3,297.1,354.5z M273.5,424.7v40.5c0,6.2,4,10.2,10.2,10.2c5.6,0,10.2-4,10.2-10.2v-40.3l1.7,0v40.3  c0,6.2,4,10.2,10.2,10.2c5.6,0,10.2-4,10.2-10.2v-40.1l1.7,0v40.1c0,6.2,4,10.2,10.2,10.2c5.6,0,10.2-4,10.2-10.2v-40l7.5,0l18,31  c3.1,5.4,8.7,6.9,14.1,3.8c5-2.8,7-8.5,3.9-13.8l-12.3-21.1c6.3-0.1,11.6-0.2,15.4-0.4c1.7-6.5,2.6-13.2,2.6-20.2  c0-33.3-20.3-62-49.2-74.2v-4.2c0-6.2-4.6-10.2-10.2-10.2c-5.7,0-9.5,3.4-10.1,8.8c-0.6-0.1-1.2-0.2-1.8-0.2  c-0.7-5.2-5-8.5-10.1-8.5c-5.7,0-9.5,3.4-10.1,8.7c-0.6,0.1-1.2,0.2-1.8,0.3c-0.5-5.5-4.9-9-10.1-9c-6.2,0-10.2,4-10.2,10.2v4.9  c-28,12.6-47.5,40.8-47.5,73.5c0,6.8,0.8,13.3,2.4,19.6l15.8,0.2l-12.7,21.9c-3.1,5.4-1.1,11.1,3.9,13.8c5.5,3,11,1.5,14.1-3.8  l18.4-31.6L273.5,424.7z M257.5,399.5c0-5.8,4.7-10.5,10.5-10.5c0,5.5,4.5,10,10,10c5.2,0,9.4-3.1,10-8h0.1c0.5,4.9,4.8,8,10,8  s9.4-3.1,10-8h0.1c0.5,4.9,4.8,8,10,8s9.4-3.1,10-8h0.1c0.5,4.9,4.8,8,10,8c5.3,0,9.6-4.1,10-9.4c4,1.5,6.9,5.3,6.9,9.9  c0,5.8-4.7,10.5-10.5,10.5H268C262.2,410,257.5,405.3,257.5,399.5z M262,363.5c0-5.8,4.7-10.5,10.5-10.5s10.5,4.7,10.5,10.5  c0,5.8-4.7,10.5-10.5,10.5S262,369.3,262,363.5z M330,363.5c0-5.8,4.7-10.5,10.5-10.5s10.5,4.7,10.5,10.5c0,5.8-4.7,10.5-10.5,10.5  S330,369.3,330,363.5z M290,357.5c0-9.1,7.4-16.5,16.5-16.5s16.5,7.4,16.5,16.5c0,9.1-7.4,16.5-16.5,16.5S290,366.6,290,357.5z';
  this.render();
};

//console.log(d3.selectAll('#alien'));
Enemy.prototype.render=function() {
  // this.element = gameboard.append('svg:circle')
  this.element = gameboard.append('svg:path')
                .attr('d', this.path)
                .attr('transform', 'scale(.2) ' + 'translate('+this.x+','+ this.y+')')
                .attr('cx', this.x)
                .attr('cy', this.y)
                // .attr('r', this.radius)
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
                .attr('cy', this.y)
                .attr('transform', 'scale(.2) ' + 'translate('+this.x+','+ this.y+')');
};

var checkCollision = function() {
  //place in set interval loop
  //loop over all enemies
  for(var i = 0; i < enemies.length; i++){
    var enemy = enemies[i];
    var enemyX = parseFloat(enemy.element.attr('cx'));
    var enemyY = parseFloat(enemy.element.attr('cy'));
    var enemyRadius=parseFloat(enemy.element.attr('r'));
    if(Math.abs(player.x-enemyX) < (player.radius + enemyRadius)*0.9 && Math.abs(player.y - enemyY) < (player.radius + enemyRadius)*0.9){
      //reset score
      gameStats.currScore=0;
      //increment collisions
      gameStats.collisions+=1;
      //reset enemy radius
      for (var j=0; j<enemies.length; j++) {
        enemies[j].element.attr('r', 8);
      }
    } else {
      enemy.element.attr('r', enemyRadius*1.005);
    }


  }
    //pull x and y coordinates
    //compare with player coordinates (not forgetting radius of each)
      //reset current score if collision detected
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
  d3.select('span#collision-count').text(gameStats.collisions);
  checkCollision();
}, 100);

