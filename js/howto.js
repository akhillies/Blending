
var howto = function(game){}

howto.prototype = {
  init: function(data){
    this.levels = data;
  },
	preload: function(){ 
    this.game.load.image("howtoplay", "assets/HowToPlay.png");
	},
  create: function(){
    var play = this.game.add.button(0,0,"howtoplay", this.playGame, this, null, null, null);
	},
  playGame: function(){
    this.game.state.start("Preload", true, false, this.levels, 0);
  }

}
