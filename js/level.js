var level = function(game) {}
var lvl;
var people;
var guard;
var player;

var arrowKeys;

var youBlock;
var thePeople;
var goalBlock;
var youRGB;
var goalRGB;
var bgmusic;
var restartButton;
var resetButton;
var lvlUpButton;
var threshold;

level.prototype = {
    init: function(levels, curlvl)
    {
        // console.log(curlvl);
        this.levels = levels;

        this.curlvl = curlvl;
        arrowKeys = this.game.input.keyboard.createCursorKeys();

    },

    preload: function()
    {
        lvl = this.levels[this.curlvl];
        people = lvl.people;
        guard = lvl.guard;
        player = lvl.player;
        this.game.load.image("bg", lvl.background);
        this.game.load.spritesheet(guard.name, guard.spritesheet, guard.dimensions[0], guard.dimensions[1]);
        this.game.load.spritesheet(player.name, player.spritesheet, player.dimensions[0], player.dimensions[1]);
        for (var i = 0; i < lvl.numPeople; i++)
        {
            this.game.load.spritesheet(people[i].name, people[i].spritesheet, people[i].dimensions[0], people[i].dimensions[1]);
        }
        this.game.load.audio('bgaudio', lvl.audio);
        // console.log(people);
        // console.log(player);
        // console.log(guard);
    },

    create: function()
    {
        bgmusic = this.game.add.audio('bgaudio', 1, true);
        bgmusic.play();

        var bg = this.game.add.sprite(0, 0, "bg");

        restartButton = this.game.add.button(0, 0, '', this.restartLevel, this);
        resetButton = this.game.add.button(1000, 0, '', this.resetGame, this);
        lvlUpButton = this.game.add.button(500, 250, '', this.lvlUp, this);

        threshold = this.game.add.text(500, 60, "Threshold: " + lvl.threshold);
        threshold.align = "center";
        threshold.font = "Arial";

        youRGB = this.game.add.text(25, 275,
            "Your RGB Values\nRed: " + player.color[0] + "\nGreen: " + player.color[1] + "\nBlue: " + player.color[2]);
        youRGB.fill = "#" + Phaser.Color.getColor(player.color[0], player.color[1], player.color[2]).toString(16);
        youRGB.align = "center";
        youRGB.setShadow(0, 0, 'rgba(50,50,50,1)', 5);
        youRGB.font = "Arial";

        goalRGB = this.game.add.text(700, 275,
            "Guard's RGB Values\nRed: " + guard.color[0] + "\nGreen: " + guard.color[1] + "\nBlue: " + guard.color[2]);
        goalRGB.fill = "#" + Phaser.Color.getColor(guard.color[0], guard.color[1], guard.color[2]).toString(16),
        goalRGB.align = "center";
        goalRGB.setShadow(0, 0, 'rgba(50,50,50,1)', 5);
        goalRGB.font = "Arial";

        thePeople = this.game.add.group();
        thePeople.enableBody = true;

        for (var i = 0; i < lvl.numPeople; i++)
        {
            var thePerson = thePeople.create(people[i].pos[0], people[i].pos[1], people[i].name);
            thePerson.tint = Phaser.Color.getColor(people[i].color[0], people[i].color[1], people[i].color[2]);
            thePerson.scale.x = people[i].scale;
            thePerson.scale.y = people[i].scale;
            thePerson.tintTaken = [0, 0, 0];
            thePerson.additive = people[i].additive;

            thePerson.graphics = this.game.add.graphics(people[i].pos[0], people[i].pos[1] - 100);
            thePerson.graphics.beginFill(0x000000);
            thePerson.graphics.lineStyle(2, 0x990000, 1);
            thePerson.graphics.drawRect(-11, 60, 50, 10);
            thePerson.graphics.lineStyle(2, 0x009900, 1);
            thePerson.graphics.drawRect(-11, 75, 50, 10);
            thePerson.graphics.lineStyle(2, 0x000099, 1);
            thePerson.graphics.drawRect(-11, 90, 50, 10);
            thePerson.graphics.lineStyle(0, 0x000000, 0);
            thePerson.graphics.beginFill(0xFF0000);
            thePerson.graphics.drawRect(-11, 60, 50 * people[i].color[0] / 255, 10);
            thePerson.graphics.beginFill(0x00FF00);
            thePerson.graphics.drawRect(-11, 75, 50 * people[i].color[1] / 255, 10);
            thePerson.graphics.beginFill(0x0000FF);
            thePerson.graphics.drawRect(-11, 90, 50 * people[i].color[2] / 255, 10);
            thePerson.graphics.endFill();
        }

        goalBlock = this.game.add.sprite(guard.pos[0], guard.pos[1], guard.name);
        goalBlock.tint = Phaser.Color.getColor(guard.color[0], guard.color[1], guard.color[2]);
        goalBlock.scale.x = guard.scale;
        goalBlock.scale.y = guard.scale;
        this.game.physics.arcade.enable(goalBlock)

        youBlock = this.game.add.sprite(player.pos[0], player.pos[1], player.name);
        youBlock.tint = Phaser.Color.getColor(player.color[0], player.color[1], player.color[2]);
        youBlock.scale.x = player.scale;
        youBlock.scale.y = player.scale;
        youBlock.anchor.setTo(0.5, 0);
        youBlock.rgb = [player.color[0], player.color[1], player.color[2]];
        this.game.physics.arcade.enable(youBlock)
        youBlock.body.collideWorldBounds = true;

        for (var i = 0; i < player.animations.length; i++)
        {
            youBlock.animations.add(player.animations[i].name, player.animations[i].order, player.animations[i].framerate, player.animations[i].loop);
        }
    },

    update: function()
    {
        this.game.physics.arcade.overlap(youBlock, thePeople, this.shiftColor, null, this);
        this.game.physics.arcade.overlap(youBlock, goalBlock, this.finishColor, null, this);

        youRGB.setText("Your RGB Values\nRed: " + Phaser.Color.getRed(youBlock.tint) +
            "\nGreen: " + Phaser.Color.getGreen(youBlock.tint) +
            "\nBlue: " + Phaser.Color.getBlue(youBlock.tint));
        youRGB.fill = "#" + Phaser.Color.getColor(Phaser.Color.getRed(youBlock.tint), Phaser.Color.getGreen(youBlock.tint), Phaser.Color.getBlue(youBlock.tint)).toString(16);
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
            youBlock.x -= player.moveSpeed;
            youBlock.animations.play('walk');
            youBlock.scale.x = -player.scale;
        }
        else if (arrowKeys.right.isDown)
        {
            youBlock.x += player.moveSpeed;
            youBlock.animations.play('walk');
            youBlock.scale.x = player.scale;
        }
        else
        {
            youBlock.animations.stop();
            youBlock.frame = player.stillFrame;
        }
    },

    shiftColor: function(you, dude)
    {
        var youR = Phaser.Color.getRed(you.tint);
        var youG = Phaser.Color.getGreen(you.tint);
        var youB = Phaser.Color.getBlue(you.tint);
        var dudeR = 0;
        var dudeG = 0;
        var dudeB = 0;
        var diffR = 0;
        var diffG = 0;
        var diffB = 0;

        if (dude.additive)
        {
            dudeR += Phaser.Color.getRed(dude.tint);
            dudeG += Phaser.Color.getGreen(dude.tint);
            dudeB += Phaser.Color.getBlue(dude.tint);

            var percentR = 1;
            var percentG = 1;
            var percentB = 1;

            if (dude.tintTaken[0] < dudeR)
            {
                diffR += Math.min(255 - you.rgb[0], dudeR / 255 * player.colorConstant);
                dude.tintTaken[0] += diffR;
                you.rgb[0] += diffR;
                percentR = 1 - (dudeR - dude.tintTaken[0]) / 255;
            }
            if (dude.tintTaken[1] < dudeG)
            {
                diffG += Math.min(255 - you.rgb[1], dudeG / 255 * player.colorConstant);
                dude.tintTaken[1] += diffG;
                you.rgb[1] += diffG;
                percentG = 1 - (dudeG - dude.tintTaken[1]) / 255;
            }
            if (dude.tintTaken[2] < dudeB)
            {
                diffB += Math.min(255 - you.rgb[2], dudeB / 255 * player.colorConstant);
                dude.tintTaken[2] += diffB;
                you.rgb[2] += diffB;
                percentB = 1 - (dudeB - dude.tintTaken[2]) / 255;
            }

            dude.graphics.beginFill(0x000000);
            dude.graphics.lineStyle(2, 0x990000, 1);
            dude.graphics.drawRect(39 - percentR * 50, 60, percentR * 50, 10);
            dude.graphics.lineStyle(2, 0x009900, 1);
            dude.graphics.drawRect(39 - percentG * 50, 75, percentG * 50, 10);
            dude.graphics.lineStyle(2, 0x000099, 1);
            dude.graphics.drawRect(39 - percentB * 50, 90, percentB * 50, 10);
            dude.graphics.endFill();
        }
        else
        {
            dudeR += Phaser.Color.getRed(dude.tint) - 255;
            dudeG += Phaser.Color.getGreen(dude.tint) - 255;
            dudeB += Phaser.Color.getBlue(dude.tint) - 255;

            var percentR = 1;
            var percentG = 1;
            var percentB = 1;

            if (dude.tintTaken[0] > dudeR)
            {
                diffR += Math.max(0 - you.rgb[0], dudeR / 255 * player.colorConstant);
                dude.tintTaken[0] += diffR;
                you.rgb[0] += diffR;
                percentR = (255 + dude.tintTaken[0]) / 255;
            }
            if (dude.tintTaken[1] > dudeG)
            {
                diffG += Math.max(0 - you.rgb[1], dudeG / 255 * player.colorConstant);
                dude.tintTaken[1] += diffG;
                you.rgb[1] += diffG;
                percentG = (255 + dude.tintTaken[1]) / 255;
            }
            if (dude.tintTaken[2] > dudeB)
            {
                diffB += Math.max(0 - you.rgb[2], dudeB / 255 * player.colorConstant);
                dude.tintTaken[2] += diffB;
                you.rgb[2] += diffB;
                percentB = (255 + dude.tintTaken[2]) / 255;
            }

            dude.graphics.beginFill(0xFF0000);
            dude.graphics.lineStyle(2, 0x990000, 1);
            dude.graphics.drawRect(-11, 60, 50 - percentR * 50, 10);
            dude.graphics.beginFill(0x00FF00);
            dude.graphics.lineStyle(2, 0x099000, 1);
            dude.graphics.drawRect(-11, 75, 50 - percentG * 50, 10);
            dude.graphics.beginFill(0x0000FF);
            dude.graphics.lineStyle(2, 0x000099, 1);
            dude.graphics.drawRect(-11, 90, 50 - percentB * 50, 10);
            dude.graphics.endFill();
        }

        you.rgb[0] = Math.max(0, Math.min(255, you.rgb[0]));
        you.rgb[1] = Math.max(0, Math.min(255, you.rgb[1]));
        you.rgb[2] = Math.max(0, Math.min(255, you.rgb[2]));

        var newR = Math.max(0, Math.min(255, you.rgb[0] + diffR));
        var newG = Math.max(0, Math.min(255, you.rgb[1] + diffG));
        var newB = Math.max(0, Math.min(255, you.rgb[2] + diffB));
        you.tint = Phaser.Color.getColor(newR, newG, newB);
    },

    finishColor: function(you, goal)
    {
        var youR = Phaser.Color.getRed(you.tint);
        var youG = Phaser.Color.getGreen(you.tint);
        var youB = Phaser.Color.getBlue(you.tint);
        var goalR = Phaser.Color.getRed(goal.tint);
        var goalG = Phaser.Color.getGreen(goal.tint);
        var goalB = Phaser.Color.getBlue(goal.tint);

        if (youR >= goalR - lvl.threshold && youR <= goalR + lvl.threshold && youG >= goalG - lvl.threshold && youG <= goalG + lvl.threshold && youB >= goalB - lvl.threshold && youB <= goalB + lvl.threshold)
        {
            this.goToLevel(this.curlvl + 1);
        }
    },

    goToLevel: function(ll)
    {
        thePeople.callAll('kill');
        youBlock.kill();
        goalBlock.kill();
        restartButton.destroy();
        resetButton.destroy();
        youRGB.destroy();
        goalRGB.destroy();
        bgmusic.destroy();
        this.game.state.restart(true, false, this.levels, ll)
    },

    lvlUp: function()
    {
        this.goToLevel(this.curlvl + 1);
    },

    restartLevel: function()
    {
        this.goToLevel(this.curlvl);
    },

    resetGame: function()
    {
        this.goToLevel(0);
    }
}