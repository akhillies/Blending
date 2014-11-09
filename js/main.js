$(document).ready(function()
{
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update
    });

    var youBlock;
    var arrowKeys;

    function preload()
    {
        // game.load.image('bg', 'assets/testbg.png');
        // game.load.image('youTile', 'assets/testbg.png', 10, 10);
    }

    function create()
    {
        // youBlock = game.add.sprite(100, 100, 'youTile');
        // youBlock.tint = 0x999999;
        arrowKeys = [game.input.keyboard.addKey(Phaser.Keyboard.UP), game.input.keyboard.addKey(Phaser.Keyboard.DOWN), game.input.keyboard.addKey(Phaser.Keyboard.LEFT), game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)];
    }

    function update()
    {
        if (arrowKeys[0].isDown)
        {
            youBlock.setTransform(0, 1, 1, 1, 0, 0);
        }
        else if (arrowKeys[1].isDown)
        {
            youBlock.setTransform(0, -1, 1, 1, 0, 0);
        }

        if (arrowKeys[2].isDown)
        {
            youBlock.setTransform(1, 0, 1, 1, 0, 0);
        }
        else if (arrowKeys[3].isDown)
        {
            youBlock.setTransform(-1, 0, 1, 1, 0, 0);
        }
    }
})