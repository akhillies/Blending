
$(document).ready(function(){
      var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload() {
      game.load.image('bg', 'assets/testbg.png');
      
    }
    function create() {
    }
    function update() {
    }
})
