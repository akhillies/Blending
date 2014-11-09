
function Level (numPeople, people, goalColor, startColor ){
  this.numPeople = numPeople;
  this.people = people;
  this.goalColor = goalColor;
  this.startColor = startColor;
}

function Person(name, color, pos, spritesheet, dimensions, animations){
  this.color = color;
  this.pos = pos;
  this.spritesheet = spritesheet;
  this.dimesions = dimensions;
  this.name = name;
  this.animations = animations;
  
}

function Animation(name, order, framerate, loop, stillFrame){
  this.name = name;
  this.order = order;
  this.framerate = framerate;
  this.loop = loop;
  this.stillFrame = stillFrame;
  
}
