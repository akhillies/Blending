var level = function(game) {};
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
var lvlTime;
var threshold;
var startTime;
var lvlText;

level.prototype = {
    init: function(levels, curlvl)
    {
        // console.log(curlvl);
        this.levels = levels;
        this.curlvl = curlvl;
        // if (curlvl + 1 >= levels.length)
        // {
        //     this.game.state.start("Boot", true, false, this.levels, 0);
        // }
        arrowKeys = this.game.input.keyboard.createCursorKeys();
    },

    preload: function()
    {
        lvl = this.levels[this.curlvl];
        people = lvl.people;
        guard = lvl.guard;
        player = lvl.player;
        this.game.load.image("bg", lvl.background);
        this.game.load.image("options", "assets/gear.png");
        this.game.load.image("restart", "assets/restart.png");
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
        // console.log(bg)
        this.game.stage.backgroundColor = '#ffffff';
        bg.scale.x = 1
        bg.scale.y = .38

        lvlText = this.game.add.text(520, 10, this.curlvl + 1);
        lvlText.font = "Comic Sans";
        lvlText.setShadow(0, 0, 'rgba(123,45,6,.7)', 8);
        lvlText.strokeThickness = 3;
        lvlText.fill = "#ffffff";
        lvlText.align = "center";

        restartButton = this.game.add.button(0, 0, 'restart', this.restartLevel, this);
        restartButton.scale.x = .1
        restartButton.scale.y = .1
        resetButton = this.game.add.button(950, 0, 'options', this.resetGame, this);
        resetButton.scale.x = .1;
        resetButton.scale.y = .1;
        lvlUpButton = this.game.add.button(425, 350, '', this.lvlUp, this);
        
        startTime = this.game.time.now;
        lvlTime = new Phaser.Text(this.game, 0, 0, "Time on this level = 00:00:00");
        lvlTime.align = "center";
        lvlTime.font = "Arial";
        lvlTime.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
        lvlUpButton.addChild(lvlTime);

        threshold = this.game.add.text(450, 60, "Threshold: " + lvl.threshold);
        if (this.curlvl ==0){
          threshold.fill="#FFFFFF";
        }
        threshold.align = "center";
        threshold.font = "Arial";

        youRGB = this.game.add.text(25, 300,
            "Your RGB Values\nRed: " + player.color[0] + "\nGreen: " + player.color[1] + "\nBlue: " + player.color[2]);
        youRGB.fill = "#" + Phaser.Color.getColor(player.color[0], player.color[1], player.color[2]).toString(16);
        youRGB.align = "center";
        youRGB.setShadow(0, 1, 'rgba(50,50,50,1)', 3);
        youRGB.font = "Arial";

        goalRGB = this.game.add.text(700, 300,
            "Guard's RGB Values\nRed: " + guard.color[0] + "\nGreen: " + guard.color[1] + "\nBlue: " + guard.color[2]);
        goalRGB.fill = "#" + Phaser.Color.getColor(guard.color[0], guard.color[1], guard.color[2]).toString(16),
        goalRGB.align = "center";
        goalRGB.setShadow(1, 0, 'rgba(50,50,50,1)', 3);
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
            thePerson.graphics.drawRect(-11, 55, 50, 10);
            thePerson.graphics.lineStyle(2, 0x009900, 1);
            thePerson.graphics.drawRect(-11, 70, 50, 10);
            thePerson.graphics.lineStyle(2, 0x000099, 1);
            thePerson.graphics.drawRect(-11, 85, 50, 10);
            thePerson.graphics.lineStyle(0, 0x000000, 0);
            thePerson.graphics.beginFill(0xFF0000);
            thePerson.graphics.drawRect(-11, 55, 50 * people[i].color[0] / 255, 10);
            thePerson.graphics.beginFill(0x00FF00);
            thePerson.graphics.drawRect(-11, 70, 50 * people[i].color[1] / 255, 10);
            thePerson.graphics.beginFill(0x0000FF);
            thePerson.graphics.drawRect(-11, 85, 50 * people[i].color[2] / 255, 10);
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
        this.setLvlTime(this.game.time.now) 
        this.game.physics.arcade.overlap(youBlock, thePeople, this.shiftColor, null, this);
        this.game.physics.arcade.overlap(youBlock, goalBlock, this.finishColor, null, this);

        youRGB.setText("Your RGB Values\nRed: " + Phaser.Color.getRed(youBlock.tint) +
            "\nGreen: " + Phaser.Color.getGreen(youBlock.tint) +
            "\nBlue: " + Phaser.Color.getBlue(youBlock.tint));
        youRGB.fill = "#" + Phaser.Color.getColor(Phaser.Color.getRed(youBlock.tint), Phaser.Color.getGreen(youBlock.tint), Phaser.Color.getBlue(youBlock.tint)).toString(16);
        
        if (arrowKeys.up.isDown)
        {
            player.moveSpeed = Math.max(player.moveSpeed + .1, 4);
        }
        else if (arrowKeys.down.isDown)
        {
            player.moveSpeed = Math.max(player.moveSpeed - .1, 1);
        }

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
            dude.graphics.drawRect(39 - percentR * 50, 55, percentR * 50, 10);
            dude.graphics.lineStyle(2, 0x009900, 1);
            dude.graphics.drawRect(39 - percentG * 50, 70, percentG * 50, 10);
            dude.graphics.lineStyle(2, 0x000099, 1);
            dude.graphics.drawRect(39 - percentB * 50, 85, percentB * 50, 10);
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
                percentR = (255 + dude.tintTaken[0] - dudeR) / 255;
            }
            if (dude.tintTaken[1] > dudeG)
            {
                diffG += Math.max(0 - you.rgb[1], dudeG / 255 * player.colorConstant);
                dude.tintTaken[1] += diffG;
                you.rgb[1] += diffG;
                percentG = (255 + dude.tintTaken[1] - dudeG) / 255;
            }
            if (dude.tintTaken[2] > dudeB)
            {
                diffB += Math.max(0 - you.rgb[2], dudeB / 255 * player.colorConstant);
                dude.tintTaken[2] += diffB;
                you.rgb[2] += diffB;
                percentB = (255 + dude.tintTaken[2] - dudeB) / 255;
            }

            dude.graphics.beginFill(0xFF0000);
            dude.graphics.lineStyle(2, 0x990000, 1);
            dude.graphics.drawRect(-11, 55, 100 - percentR * 50, 10);
            dude.graphics.beginFill(0x00FF00);
            dude.graphics.lineStyle(2, 0x099000, 1);
            dude.graphics.drawRect(-11, 70, 100 - percentG * 50, 10);
            dude.graphics.beginFill(0x0000FF);
            dude.graphics.lineStyle(2, 0x000099, 1);
            dude.graphics.drawRect(-11, 85, 100 - percentB * 50, 10);
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
            this.lvlUp();
        }
    },

    goToLevel: function(ll)
    {
        thePeople.callAll('kill');
        youBlock.kill();
        goalBlock.kill();
        lvlUpButton.destroy();
        restartButton.destroy();
        resetButton.destroy();
        youRGB.destroy();
        goalRGB.destroy();
        bgmusic.destroy();
        this.game.state.restart(true, false, this.levels, ll)
    },

    lvlUp: function()
    {
        if(this.curlvl > 25)
        {
            this.game.state.start("Winner", true, false, this.levels);
        }
        else 
        {
            if (this.curlvl + 1 >= this.levels.length)
            {
                this.createLvl();
            }
            this.goToLevel(this.curlvl + 1);
        }
    },

    restartLevel: function()
    {
        this.goToLevel(this.curlvl);
    },

    resetGame: function()
    {
        this.goToLevel(0);
    },

    setLvlTime: function(now)
    {
        var elapsed = new Date(now - startTime);
        var min = ("0" + elapsed.getMinutes()).slice(-2);
        var sec = ("0" + elapsed.getSeconds()).slice(-2);
        var centsec = ("0" + Math.round(elapsed.getMilliseconds() / 10)).slice(-2);

        if(min > 99)
        {
            this.restartLevel()
        }

        lvlTime.text = min + ":" + sec + ":" + centsec;
    },
    
    createLvl: function()
    {
        var r = Math.min(Math.max(Phaser.Color.getRed(youBlock.tint) - Math.floor(Math.random() * 50)-25, 0), 255);
        var b = Math.min(Math.max(Phaser.Color.getGreen(youBlock.tint) - Math.floor(Math.random() * 50)-25, 0), 255);
        var g = Math.min(Math.max(Phaser.Color.getBlue(youBlock.tint) - Math.floor(Math.random() * 50)-25, 0), 255);
        var color = [r,g,b];
        
        var numpeops = Math.min(Math.round(Math.random()*this.curlvl/2) + 1, 10);
        var newplaya = util.Person("player",
                                    color,
                                    [0, 150],
                                    "player",
                                    2);

        var people = [];
        var numAdds = 0;
        for(var i = 0; i < numpeops; i++)
        {
            var additive = Math.random() * numpeops / (numAdds+1) + Math.random()/2;
            var newpeop;
            var pos = [Math.round(900/numpeops*i + 90), 150];
            
            if(additive >= 1)
            {
                numAdds++;
                r = Math.floor(Math.random() * 256);
                g = Math.floor(Math.random() * 256);
                b = Math.floor(Math.random() * 256);
                color = [Math.min(color[0] + r, 255), Math.min(color[1] + g, 255), Math.min(color[2] + b, 255)];
                newpeop = util.Person("addingDude" + numAdds,
                                        [r + (8*Math.random()-4), g + (8*Math.random()-4), b + (8*Math.random()-4)],
                                        pos,
                                        "personAdd",
                                        0);
            }
            else
            {
                r = Math.floor(Math.random() * 256);
                g = Math.floor(Math.random() * 256);
                b = Math.floor(Math.random() * 256);
                color = [Math.max(color[0] - r, 0), Math.max(color[1] - g, 0), Math.max(color[2] - b, 0)];
                newpeop = util.Person("subingDude" + (i - numAdds),
                                        [r + (8*Math.random()-4), g + (8*Math.random()-4), b + (8*Math.random()-4)],
                                        pos,
                                        "personSub",
                                        0);
            }
            people.push(newpeop);
        }
        
        var thres = Math.round(Math.random() * 7 + 4);
        var guard = util.Person("grumpy",
                                color,
                                [],
                                "guard",
                                0);
        
        var newLvl = util.Level(numpeops,
                                this.curLvl + 1,
                                newplaya,
                                people,
                                "assets/testbg.png",
                                guard,
                                thres);
        this.levels.push(newLvl);
    }
}
