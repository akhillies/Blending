var level = function(game) {};

// var lvl;
// var people;
// var guard;
// var player;

// var arrowKeys;

// var youBlock;
// var thePeople;
// var goalBlock;
// var youRGB;
// var goalRGB;
// var bgmusic;
// var restartButton;
// var resetButton;
// var lvlUpButton;
// var lvlTime;
// var threshold;
// var startTime;
// var lvlText;
// var nextLvlButton;
// var prevLvlButton;

level.prototype = {
    info: {
        numlvls: 25,
        lvl: null,
        people: null,
        guard: null,
        player: null,
        arrowKeys: null,
        youBlock: null,
        thePeople: null,
        goalBlock: null,
        youRGB: null,
        goalRGB: null,
        bgmusic: null,
        restartButton: null,
        resetButton: null,
        lvlUpButton: null,
        lvlTime: null,
        threshold: null,
        startTime: null,
        lvlText: null,
        prevLvlButton: null,
        nextLvlButton: null,
        killAll: function() {
            this.youBlock.kill();
            this.thePeople.callAll('kill');
            this.goalBlock.kill();
            this.youRGB.destroy();
            this.goalRGB.destroy();
            this.bgmusic.destroy();
            this.restartButton.destroy();
            this.resetButton.destroy();
            this.lvlUpButton.destroy();
            this.lvlTime.destroy();
            this.lvlText.destroy();
            this.prevLvlButton.destroy();
            this.nextLvlButton.destroy();
        }
    },

    init: function(lvls, curlvl)
    {
        // console.log(curlvl);
        this.levels = lvls;
        this.curlvl = curlvl;
        // if (curlvl + 1 >= levels.length)
        // {
        //     this.game.state.start("Boot", true, false, this.levels, 0);
        // }
        this.info.arrowKeys = this.game.input.keyboard.createCursorKeys();
    },

    preload: function()
    {
        this.info.lvl = this.levels[this.curlvl];
        this.info.people = this.info.lvl.people;
        this.info.guard = this.info.lvl.guard;
        this.info.player = this.info.lvl.player;
        this.game.load.image("bg", this.info.lvl.background);
        this.game.load.image("options", "assets/gear.png");
        this.game.load.image("restart", "assets/restart.png");
        this.game.load.image("nextarrow", "assets/rightarrow.png");
        this.game.load.spritesheet(this.info.guard.name, this.info.guard.spritesheet, this.info.guard.dimensions[0], this.info.guard.dimensions[1]);
        this.game.load.spritesheet(this.info.player.name, this.info.player.spritesheet, this.info.player.dimensions[0], this.info.player.dimensions[1]);
        for (var i = 0; i < this.info.lvl.numPeople; i++)
        {
            this.game.load.spritesheet(this.info.people[i].name, this.info.people[i].spritesheet, this.info.people[i].dimensions[0], this.info.people[i].dimensions[1]);
        }
        this.game.load.audio('bgaudio', this.info.lvl.audio);
        // console.log(this.info.people);
        // console.log(this.info.player);
        // console.log(this.info.guard);
    },

    create: function()
    {
        this.info.bgmusic = this.game.add.audio('bgaudio', 1, true);
        this.info.bgmusic.play();

        var bg = this.game.add.sprite(0, 0, "bg");
        // console.log(bg)
        this.game.stage.backgroundColor = '#ffffff';
        bg.scale.x = 1
        bg.scale.y = .38

        this.info.lvlText = this.game.add.text(518, 10, this.curlvl + 1);
        this.info.lvlText.font = "Comic Sans";
        this.info.lvlText.setShadow(0, 0, 'rgba(123,45,6,.7)', 8);
        this.info.lvlText.strokeThickness = 3;
        this.info.lvlText.fill = "#ffffff";
        this.info.lvlText.align = "center";
        if(this.curlvl < 9)
        {
            this.info.lvlText.x += 7;
        }

        this.info.prevLvlButton = this.game.add.button(515, 0, 'nextarrow', this.lastLvl, this);
        this.info.prevLvlButton.scale.x = -.1;
        this.info.prevLvlButton.scale.y = .1;
        
        this.info.nextLvlButton = this.game.add.button(555, 0, 'nextarrow', this.lvlUp, this);
        this.info.nextLvlButton.scale.x = .1;
        this.info.nextLvlButton.scale.y = .1;

        if(this.curlvl == 0)
        {
            this.info.prevLvlButton.input.enabled = false;
        }
        else
        {
            this.info.prevLvlButton.tint = '#000000';
        }
        if(!this.info.lvl.completed)
        {
            this.info.nextLvlButton.input.enabled = false;
        }
        else
        {
            this.info.nextLvlButton.tint = '#000000';
        }


        this.info.restartButton = this.game.add.button(0, 0, 'restart', this.restartLevel, this);
        this.info.restartButton.scale.x = .1;
        this.info.restartButton.scale.y = .1;
        this.info.resetButton = this.game.add.button(950, 0, 'options', this.resetGame, this);
        this.info.resetButton.scale.x = .1;
        this.info.resetButton.scale.y = .1;
        this.info.lvlUpButton = this.game.add.button(425, 350, '', this.lvlUp, this);
        
        this.info.startTime = this.game.time.now;
        this.info.lvlTime = new Phaser.Text(this.game, 0, 0, "Time on this level = 00:00:00");
        this.info.lvlTime.align = "center";
        this.info.lvlTime.font = "Arial";
        this.info.lvlTime.setShadow(1, 1, 'rgba(0,0,0,1)', 0);
        this.info.lvlUpButton.addChild(this.info.lvlTime);

        this.info.threshold = this.game.add.text(450, 60, "Threshold: " + this.info.lvl.threshold);
        if (this.curlvl ==0){
          this.info.threshold.fill="#FFFFFF";
        }
        this.info.threshold.align = "center";
        this.info.threshold.font = "Arial";

        this.info.youRGB = this.game.add.text(25, 300,
            "Your RGB Values\nRed: " + this.info.player.color[0] + "\nGreen: " + this.info.player.color[1] + "\nBlue: " + this.info.player.color[2]);
        this.info.youRGB.fill = "#" + Phaser.Color.getColor(this.info.player.color[0], this.info.player.color[1], this.info.player.color[2]).toString(16);
        this.info.youRGB.align = "center";
        this.info.youRGB.setShadow(0, 1, 'rgba(50,50,50,1)', 3);
        this.info.youRGB.font = "Arial";

        this.info.goalRGB = this.game.add.text(700, 300,
            "Guard's RGB Values\nRed: " + this.info.guard.color[0] + "\nGreen: " + this.info.guard.color[1] + "\nBlue: " + this.info.guard.color[2]);
        this.info.goalRGB.fill = "#" + Phaser.Color.getColor(this.info.guard.color[0], this.info.guard.color[1], this.info.guard.color[2]).toString(16),
        this.info.goalRGB.align = "center";
        this.info.goalRGB.setShadow(1, 0, 'rgba(50,50,50,1)', 3);
        this.info.goalRGB.font = "Arial";

        this.info.thePeople = this.game.add.group();
        this.info.thePeople.enableBody = true;

        for (var i = 0; i < this.info.lvl.numPeople; i++)
        {
            var thePerson = this.info.thePeople.create(this.info.people[i].pos[0], this.info.people[i].pos[1], this.info.people[i].name);
            thePerson.tint = Phaser.Color.getColor(this.info.people[i].color[0], this.info.people[i].color[1], this.info.people[i].color[2]);
            thePerson.scale.x = this.info.people[i].scale;
            thePerson.scale.y = this.info.people[i].scale;
            thePerson.tintTaken = [0, 0, 0];
            thePerson.additive = this.info.people[i].additive;

            thePerson.graphics = this.game.add.graphics(this.info.people[i].pos[0], this.info.people[i].pos[1] - 100);
            thePerson.graphics.beginFill(0x000000);
            thePerson.graphics.lineStyle(2, 0x990000, 1);
            thePerson.graphics.drawRect(-11, 55, 50, 10);
            thePerson.graphics.lineStyle(2, 0x009900, 1);
            thePerson.graphics.drawRect(-11, 70, 50, 10);
            thePerson.graphics.lineStyle(2, 0x000099, 1);
            thePerson.graphics.drawRect(-11, 85, 50, 10);
            thePerson.graphics.lineStyle(0, 0x000000, 0);
            thePerson.graphics.beginFill(0xFF0000);
            thePerson.graphics.drawRect(-11, 55, 50 * this.info.people[i].color[0] / 255, 10);
            thePerson.graphics.beginFill(0x00FF00);
            thePerson.graphics.drawRect(-11, 70, 50 * this.info.people[i].color[1] / 255, 10);
            thePerson.graphics.beginFill(0x0000FF);
            thePerson.graphics.drawRect(-11, 85, 50 * this.info.people[i].color[2] / 255, 10);
            thePerson.graphics.endFill();
        }

        this.info.goalBlock = this.game.add.sprite(this.info.guard.pos[0], this.info.guard.pos[1], this.info.guard.name);
        this.info.goalBlock.tint = Phaser.Color.getColor(this.info.guard.color[0], this.info.guard.color[1], this.info.guard.color[2]);
        this.info.goalBlock.scale.x = this.info.guard.scale;
        this.info.goalBlock.scale.y = this.info.guard.scale;
        this.game.physics.arcade.enable(this.info.goalBlock);
        
        this.info.youBlock = this.game.add.sprite(this.info.player.pos[0], this.info.player.pos[1], this.info.player.name);
        this.info.youBlock.tint = Phaser.Color.getColor(this.info.player.color[0], this.info.player.color[1], this.info.player.color[2]);
        this.info.youBlock.scale.x = this.info.player.scale;
        this.info.youBlock.scale.y = this.info.player.scale;
        this.info.youBlock.anchor.setTo(0.5, 0);
        this.info.youBlock.rgb = [this.info.player.color[0], this.info.player.color[1], this.info.player.color[2]];
        this.game.physics.arcade.enable(this.info.youBlock)
        this.info.youBlock.body.collideWorldBounds = true;

        for (var i = 0; i < this.info.player.animations.length; i++)
        {
            this.info.youBlock.animations.add(this.info.player.animations[i].name, this.info.player.animations[i].order, this.info.player.animations[i].framerate, this.info.player.animations[i].loop);
        }
    },

    update: function()
    {   
        this.setLvlTime(this.game.time.now) 
        this.game.physics.arcade.overlap(this.info.youBlock, this.info.thePeople, this.shiftColor, null, this);
        this.game.physics.arcade.overlap(this.info.youBlock, this.info.goalBlock, this.finishColor, null, this);

        this.info.youRGB.setText("Your RGB Values\nRed: " + Phaser.Color.getRed(this.info.youBlock.tint) +
            "\nGreen: " + Phaser.Color.getGreen(this.info.youBlock.tint) +
            "\nBlue: " + Phaser.Color.getBlue(this.info.youBlock.tint));
        this.info.youRGB.fill = "#" + Phaser.Color.getColor(Phaser.Color.getRed(this.info.youBlock.tint), Phaser.Color.getGreen(this.info.youBlock.tint), Phaser.Color.getBlue(this.info.youBlock.tint)).toString(16);
        
        if (this.info.arrowKeys.up.isDown)
        {
            this.info.player.moveSpeed = Math.max(this.info.player.moveSpeed + .1, 4);
        }
        else if (this.info.arrowKeys.down.isDown)
        {
            this.info.player.moveSpeed = Math.max(this.info.player.moveSpeed - .1, 1);
        }

        if (this.info.arrowKeys.left.isDown)
        {
            this.info.youBlock.x -= this.info.player.moveSpeed;
            this.info.youBlock.animations.play('walk');
            this.info.youBlock.scale.x = -this.info.player.scale;
        }
        else if (this.info.arrowKeys.right.isDown)
        {
            this.info.youBlock.x += this.info.player.moveSpeed;
            this.info.youBlock.animations.play('walk');
            this.info.youBlock.scale.x = this.info.player.scale;
        }
        else
        {
            this.info.youBlock.animations.stop();
            this.info.youBlock.frame = this.info.player.stillFrame;
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
                diffR += Math.min(255 - you.rgb[0], dudeR / 255 * this.info.player.colorConstant);
                dude.tintTaken[0] += diffR;
                you.rgb[0] += diffR;
                percentR = 1 - (dudeR - dude.tintTaken[0]) / 255;
            }
            if (dude.tintTaken[1] < dudeG)
            {
                diffG += Math.min(255 - you.rgb[1], dudeG / 255 * this.info.player.colorConstant);
                dude.tintTaken[1] += diffG;
                you.rgb[1] += diffG;
                percentG = 1 - (dudeG - dude.tintTaken[1]) / 255;
            }
            if (dude.tintTaken[2] < dudeB)
            {
                diffB += Math.min(255 - you.rgb[2], dudeB / 255 * this.info.player.colorConstant);
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
                diffR += Math.max(0 - you.rgb[0], dudeR / 255 * this.info.player.colorConstant);
                dude.tintTaken[0] += diffR;
                you.rgb[0] += diffR;
                percentR = (255 + dude.tintTaken[0] - dudeR) / 255;
            }
            if (dude.tintTaken[1] > dudeG)
            {
                diffG += Math.max(0 - you.rgb[1], dudeG / 255 * this.info.player.colorConstant);
                dude.tintTaken[1] += diffG;
                you.rgb[1] += diffG;
                percentG = (255 + dude.tintTaken[1] - dudeG) / 255;
            }
            if (dude.tintTaken[2] > dudeB)
            {
                diffB += Math.max(0 - you.rgb[2], dudeB / 255 * this.info.player.colorConstant);
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

        if (youR >= goalR - this.info.lvl.threshold && youR <= goalR + this.info.lvl.threshold && youG >= goalG - this.info.lvl.threshold && youG <= goalG + this.info.lvl.threshold && youB >= goalB - this.info.lvl.threshold && youB <= goalB + this.info.lvl.threshold)
        {
            this.info.lvl.completed = true;
            this.lvlUp();
        }
    },

    goToLevel: function(ll)
    {
        // thePeople.callAll('kill');
        // youBlock.kill();
        // goalBlock.kill();
        // lvlUpButton.destroy();
        // restartButton.destroy();
        // resetButton.destroy();
        // youRGB.destroy();
        // goalRGB.destroy();
        // bgmusic.destroy();
        // prevLvlButton.destroy();
        // nextLvlButton.destroy();
        
        while(ll >= this.levels.length)
        {
            this.createLvl(this.state.numlvls);
        }
        this.info.killAll();
        
        this.game.state.restart(true, false, this.levels, ll)
    },

    lvlUp: function()
    {
        if(this.curlvl > this.state.numlvls)
        {
            this.game.state.start("Winner", true, false, this.levels);
        }
        else 
        {
            if (this.curlvl + 1 >= this.levels.length)
            {
                this.createLvl(this.state.numlvls - this.curlvl);
            }
            this.goToLevel(this.curlvl + 1);
        }
    },

    lastLvl: function()
    {
        this.goToLevel(this.curlvl - 1);
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
        var elapsed = new Date(now - this.info.startTime);
        var min = ("0" + elapsed.getMinutes()).slice(-2);
        var sec = ("0" + elapsed.getSeconds()).slice(-2);
        var centsec = ("0" + Math.round(elapsed.getMilliseconds() / 10)).slice(-2);

        if(min > 99)
        {
            this.restartLevel()
        }

        this.info.lvlTime.text = min + ":" + sec + ":" + centsec;
    },
    
    createLvl: function(howrand)
    {
        var r = Math.min(Math.max(Phaser.Color.getRed(this.info.youBlock.tint) - Math.floor(Math.random() * 50)-25, 0), 255);
        var b = Math.min(Math.max(Phaser.Color.getGreen(this.info.youBlock.tint) - Math.floor(Math.random() * 50)-25, 0), 255);
        var g = Math.min(Math.max(Phaser.Color.getBlue(this.info.youBlock.tint) - Math.floor(Math.random() * 50)-25, 0), 255);
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
       
        
        var curri = people.length;
        howrand = Math.max(howrand, 0);
        while (curri >= howrand)
        {
            var randi = Math.floor(Math.random() * curri);
            curri -= 1;
            
            var tmpv = array[curri];
            array[curri] = array[randi];
            array[randi] = tmpv;
        }
        

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
