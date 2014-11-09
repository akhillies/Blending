
var gametitle = function(game){}

gametitle.prototype = {
  init: function(data){
    this.levels = data;
  },
	preload: function(){ 
    this.game.load.image("title", "assets/title.png");
	},
  create: function(){
    var play = this.game.add.button(0,0,"title", this.playGame, this, null, null, null);
	},
  playGame: function(){
    this.game.state.start("HowTo", true, false, this.levels);
  }

}
