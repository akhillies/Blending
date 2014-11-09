var preload = function(game){}

preload.prototype = {
  init: function(data, curlvl){
    this.curlvl = curlvl
    this.levels = data;
  },
	preload: function(){ 
	},
  create: function(){
    this.game.state.start("Level", true, false, this.levels, this.curlvl );
	}
}
