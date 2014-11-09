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
    var thePeople;
    var colorConstant;

    function preload()
    {
        game.load.image('youTile', 'assets/testbg.png');
    }

    function create()
    {
        arrowKeys = game.input.keyboard.createCursorKeys();

        colorConstant = 1;

        thePeople = game.add.group();
        thePeople.enableBody = true;

        for (var i = 0; i < 9; i++)
        {
            var thePerson = thePeople.create(i * 100, 150, 'youTile');
            thePerson.tint = Math.random() * 0xffffff;
            thePerson.width = 50;
            thePerson.height = 50;
            thePerson.tintTaken = [0, 0, 0];
        }

        youBlock = game.add.sprite(0, 0, 'youTile');
        youBlock.tint = 0x000000;
        youBlock.width = 50;
        youBlock.height = 50;
        youBlock.rgb = [0, 0, 0];
        game.physics.arcade.enable(youBlock)
        youBlock.body.collideWorldBounds = true;
    }

    function update()
    {
        game.physics.arcade.overlap(youBlock, thePeople, shiftColor, null, this);

        if (arrowKeys.up.isDown)
        {
            youBlock.y -= 2;
        }
        else if (arrowKeys.down.isDown)
        {
            youBlock.y += 2;
        }

        if (arrowKeys.left.isDown)
        {
            youBlock.x -= 2;
        }
        else if (arrowKeys.right.isDown)
        {
            youBlock.x += 2;
        }
    }

    function shiftColor(you, dude)
    {
        var youR = Phaser.Color.getRed(you.tint);
        var youG = Phaser.Color.getGreen(you.tint);
        var youB = Phaser.Color.getBlue(you.tint);
        var dudeR = Phaser.Color.getRed(dude.tint);
        var dudeG = Phaser.Color.getGreen(dude.tint);
        var dudeB = Phaser.Color.getBlue(dude.tint);
        var diffR = 0;
        if (dude.tintTaken[0] <= dudeR)
        {
            diffR += dudeR / 255 * colorConstant;
            dude.tintTaken[0] += diffR;
            you.rgb[0] += diffR;
        }
        var diffG = 0;
        if (dude.tintTaken[1] <= dudeG)
        {
            diffG += dudeG / 255 * colorConstant;
            dude.tintTaken[1] += diffG;
            you.rgb[1] += diffG;
        }
        var diffB = 0;
        if (dude.tintTaken[2] <= dudeB)
        {
            diffB += dudeB / 255 * colorConstant;
            dude.tintTaken[2] += diffB;
            you.rgb[2] += diffB;
        }
        var newR = Math.min(255, you.rgb[0] + diffR);
        var newG = Math.min(255, you.rgb[1] + diffG);
        var newB = Math.min(255, you.rgb[2] + diffB);
        you.tint = Phaser.Color.getColor(newR, newG, newB);
    }
})