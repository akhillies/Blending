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
    var wasdKeys;

    function preload()
    {
        // game.load.image('bg', 'assets/testbg.png');
        game.load.image('youTile', 'assets/testbg.png');
    }

    function create()
    {
        youBlock = game.add.sprite(0, 0, 'youTile');
        youBlock.tint = 0x111111;
        youBlock.width = 50;
        youBlock.height = 50;
        game.physics.arcade.enable(youBlock)
        youBlock.body.collideWorldBounds = true;

        arrowKeys = game.input.keyboard.createCursorKeys();
        wasdKeys = [game.input.keyboard.addKey(Phaser.Keyboard.W), game.input.keyboard.addKey(Phaser.Keyboard.A), game.input.keyboard.addKey(Phaser.Keyboard.S), game.input.keyboard.addKey(Phaser.Keyboard.D)];
    }

    function update()
    {
        if (arrowKeys.up.isDown)
        {
            youBlock.y -= 1;
        }
        else if (arrowKeys.down.isDown)
        {
            youBlock.y += 1;
        }

        if (arrowKeys.left.isDown)
        {
            youBlock.x -= 1;
        }
        else if (arrowKeys.right.isDown)
        {
            youBlock.x += 1;
        }

        if (wasdKeys[0].isDown) //w
        {
            console.log("\nbefore w: 0x" + youBlock.tint.toString(16));
            youBlock.tint += 0x111111;
            console.log("after w: 0x" + youBlock.tint.toString(16));
        }
        else if (wasdKeys[1].isDown) //a
        {
            console.log("\nbefore a: 0x" + youBlock.tint.toString(16));
            youBlock.tint -= 0x010101;
            console.log("after a: 0x" + youBlock.tint.toString(16));
        }
        else if (wasdKeys[2].isDown) //s
        {
            console.log("\nbefore s: 0x" + youBlock.tint.toString(16));
            youBlock.tint -= 0x111111;
            console.log("after s: 0x" + youBlock.tint.toString(16));
        }
        else if (wasdKeys[3].isDown) //d
        {
            console.log("\nbefore d: 0x" + youBlock.tint.toString(16));
            youBlock.tint += 0x010101;
            console.log("after d: 0x" + youBlock.tint.toString(16));
        }
    }
})