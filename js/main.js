requirejs.config(
{
    baseUrl: 'js'
});

var levelno = 0;


requirejs(['phaser', 'util', 'boot','preload','level'],
    function(phaser, util, boot, preload, level)
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
              //game.state.add("GameTitle", gametitle);
              game.state.add("Level", this.level);
              game.state.start("Boot", true, false, levels);
        
            }
        })

    })
