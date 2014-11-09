requirejs.config(
{
    baseUrl: 'js'
});



requirejs(['phaser', 'util', 'boot','gametitle','howto','preload','level'],
    function(phaser, util, boot,gametitle, howto, preload, level)
    {



        $(document).ready(function()
        {
            $.get('js/levels.json', function(data)
            {
                startGame(data);
              
            });
            
            function startGame(levels) {
              var game = new Phaser.Game(1024, 768, Phaser.AUTO, '');
              game.state.add("Boot", this.boot);
              game.state.add("Preload", this.preload);
              game.state.add("GameTitle", this.gametitle);
              game.state.add("HowTo", this.howto);
              game.state.add("Level", this.level);
              game.state.start("Boot", true, false, levels);
        
            }
        })

    })
