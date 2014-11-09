var boot = function(game){
	//console.log("%cStarting my awesome game", "color:white; background:red");
};
  
boot.prototype = {
  init: function(data){
    this.levels = data
  },
	preload: function(){
          //this.game.load.image("loading","assets/loading.png"); 
	},
  create: function(){
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.scale.setScreenSize();
      this.game.state.start("GameTitle", true, false, this.levels);
	}
}
