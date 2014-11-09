$(document).ready(function()
{
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update
    });

    var numPeople = 5;
    var peopleColors = [
        [Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff],
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
    var peopleXPos = [
        125,
        900 / numPeople + 125,
        1800 / numPeople + 125,
        2700 / numPeople + 125,
        3600 / numPeople + 125,
        4500 / numPeople + 125,
        5400 / numPeople + 125,
        6300 / numPeople + 125,
        7200 / numPeople + 125,
        8100 / numPeople + 125
    ];
    var peopleYPos = 150;
    var goalColor = [255, 255, 255];
    var startColor = [100, 100, 100];
    var range = 0;

    var colorConstant = .5;
    var chScale = .1;
    var moveSpeed = 2;
    var stopAnim = 2;
    var animOrder = [4, 3, 2, 1, 0];
    var framesPerWalk = 18;

    var youBlock;
    var arrowKeys;
    var thePeople;
    var goalBlock;

    function preload()
    {
        game.load.image('goalTile', 'assets/testbg.png');
        game.load.spritesheet('youTile', 'assets/characterSheet/characterSheet.png', 311, 772);
    }

    function create()
    {
        arrowKeys = game.input.keyboard.createCursorKeys();

        thePeople = game.add.group();
        thePeople.enableBody = true;

        for (var i = 0; i < numPeople; i++)
        {
            var thePerson = thePeople.create(peopleXPos[i], peopleYPos, 'youTile');
            thePerson.tint = Phaser.Color.getColor(peopleColors[i][0], peopleColors[i][1], peopleColors[i][2]);
            thePerson.scale.x = chScale;
            thePerson.scale.y = chScale;
            thePerson.tintTaken = [0, 0, 0];
        }

        goalBlock = game.add.sprite(1000, peopleYPos, 'goalTile');
        goalBlock.tint = Phaser.Color.getColor(goalColor[0], goalColor[1], goalColor[2]);
        goalBlock.scale.x = chScale;
        goalBlock.scale.y = chScale;
        game.physics.arcade.enable(goalBlock)

        youBlock = game.add.sprite(0, peopleYPos, 'youTile');
        youBlock.tint = Phaser.Color.getColor(startColor[0], startColor[1], startColor[2]);
        youBlock.scale.x = chScale;
        youBlock.scale.y = chScale;
        youBlock.anchor.setTo(0.5, 0);
        youBlock.rgb = [startColor[0], startColor[1], startColor[2]];
        game.physics.arcade.enable(youBlock)
        youBlock.body.collideWorldBounds = true;

        youBlock.animations.add('walk', animOrder, framesPerWalk, true);
    }

    function update()
    {
        game.physics.arcade.overlap(youBlock, thePeople, shiftColor, null, this);
        game.physics.arcade.overlap(youBlock, goalBlock, finishColor, null, this);

        // if (arrowKeys.up.isDown)
        // {
        //     youBlock.y -= moveSpeed;
        // }
        // else if (arrowKeys.down.isDown)
        // {
        //     youBlock.y += moveSpeed;
        // }

        if (arrowKeys.left.isDown)
        {
            youBlock.x -= moveSpeed;
            youBlock.animations.play('walk');
            youBlock.scale.x = -chScale;
        }
        else if (arrowKeys.right.isDown)
        {
            youBlock.x += moveSpeed;
            youBlock.animations.play('walk');
            youBlock.scale.x = chScale;
        }
        else
        {
            youBlock.animations.stop();
            youBlock.frame = stopAnim;
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