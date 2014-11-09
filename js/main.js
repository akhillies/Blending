$(document).ready(function()
{
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update
    });

    var numPeople = 9;
    var peopleColors = [
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff]
    ];
    var goalColor = [255, 255, 255];
    var startColor = [100, 100, 100];
    var range = 0;

    var colorConstant = 1;
    var blockW = 50;
    var blockH = 50;
    var moveSpeed = 2;

    var youBlock;
    var arrowKeys;
    var thePeople;
    var goalBlock;
    var startBlock;

    function preload()
    {
        game.load.image('youTile', 'assets/testbg.png');
    }

    function create()
    {
        arrowKeys = game.input.keyboard.createCursorKeys();

        thePeople = game.add.group();
        thePeople.enableBody = true;

        for (var i = 0; i < numPeople; i++)
        {
            var thePerson = thePeople.create(i * 100, Math.random() * 450, 'youTile');
            thePerson.tint = Phaser.Color.getColor(peopleColors[i][0], peopleColors[i][1], peopleColors[i][2]);
            thePerson.width = blockW;
            thePerson.height = blockH;
            thePerson.tintTaken = [0, 0, 0];
        }

        startBlock = game.add.sprite(0, 0, 'youTile');
        startBlock.tint = Phaser.Color.getColor(startColor[0], startColor[1], startColor[2]);
        startBlock.width = blockW;
        startBlock.height = blockH;

        goalBlock = game.add.sprite(950, 250, 'youTile');
        goalBlock.tint = Phaser.Color.getColor(goalColor[0], goalColor[1], goalColor[2]);
        goalBlock.width = blockW;
        goalBlock.height = blockH;
        game.physics.arcade.enable(goalBlock)

        youBlock = game.add.sprite(0, 0, 'youTile');
        youBlock.tint = Phaser.Color.getColor(startColor[0], startColor[1], startColor[2]);
        youBlock.width = blockW;
        youBlock.height = blockH;
        youBlock.rgb = [startColor[0], startColor[1], startColor[2]];
        game.physics.arcade.enable(youBlock)
        youBlock.body.collideWorldBounds = true;
    }

    function update()
    {
        game.physics.arcade.overlap(youBlock, thePeople, shiftColor, null, this);
        game.physics.arcade.overlap(youBlock, goalBlock, finishColor, null, this);

        if (arrowKeys.up.isDown)
        {
            youBlock.y -= moveSpeed;
        }
        else if (arrowKeys.down.isDown)
        {
            youBlock.y += moveSpeed;
        }

        if (arrowKeys.left.isDown)
        {
            youBlock.x -= moveSpeed;
        }
        else if (arrowKeys.right.isDown)
        {
            youBlock.x += moveSpeed;
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

    function finishColor(you, goal)
    {
        if (you.tint >= goal.tint - range && you.tint <= goal.tint + range)
        {
            game.destroy();
        }
    }
})