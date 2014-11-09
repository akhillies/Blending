
var level = function(game){}
            var lvl; 
            var people;
            var guard; 
            var player;

            var youBlock;
            var arrowKeys;
            var thePeople;
            var goalBlock;
            var youRGB;
            var goalRGB;
            var bgmusic

preload.prototype = {
  init: function(levels, curlvl){
    console.log(curlvl);
    this.levels = levels;
    this.curlvl = curlvl;
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
                console.log(people);
                console.log(player);
                console.log(guard);
            },

            create: function()
            {
                bgmusic = this.game.add.audio('bgaudio', 1, true);
                bgmusic.play();

                var bg = this.game.add.sprite(0, 0, "bg");
                arrowKeys = this.game.input.keyboard.createCursorKeys();

                youRGB = this.game.add.text(25,
                    250,
                    "Your RGB Values\nRed: " + player.color[0] + "\nGreen: " + player.color[1] + "\nBlue: " + player.color[2],
                    {
                        font: "15px Arial",
                        fill: "#" + Phaser.Color.getColor(player.color[0], player.color[1], player.color[2]).toString(16),
                        align: "center"
                    });
                goalRGB = this.game.add.text(850,
                    250,
                    "Guard's RGB Values\nRed: " + guard.color[0] + "\nGreen: " + guard.color[1] + "\nBlue: " + guard.color[2],
                    {
                        font: "15px Arial",
                        fill: "#" + Phaser.Color.getColor(guard.color[0], guard.color[1], guard.color[2]).toString(16),
                        align: "center"
                    });

                thePeople = this.game.add.group();
                thePeople.enableBody = true;

                for (var i = 0; i < lvl.numPeople; i++)
                {
                    var thePerson = thePeople.create(people[i].pos[0], people[i].pos[1], people[i].name);
                    thePerson.tint = Phaser.Color.getColor(people[i].color[0], people[i].color[1], people[i].color[2]);
                    thePerson.scale.x = people[i].scale;
                    thePerson.scale.y = people[i].scale;
                    thePerson.tintTaken = [0, 0, 0];
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
                youRGB.style.fill = "#" + Phaser.Color.getColor(Phaser.Color.getRed(youBlock.tint), Phaser.Color.getGreen(youBlock.tint), Phaser.Color.getBlue(youBlock.tint)).toString(16);
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
                var dudeR = Phaser.Color.getRed(dude.tint);
                var dudeG = Phaser.Color.getGreen(dude.tint);
                var dudeB = Phaser.Color.getBlue(dude.tint);
                var diffR = 0;
                if (dude.tintTaken[0] <= dudeR)
                {
                    diffR += dudeR / 255 * player.colorConstant;
                    dude.tintTaken[0] += diffR;
                    you.rgb[0] += diffR;
                }
                var diffG = 0;
                if (dude.tintTaken[1] <= dudeG)
                {
                    diffG += dudeG / 255 * player.colorConstant;
                    dude.tintTaken[1] += diffG;
                    you.rgb[1] += diffG;
                }
                var diffB = 0;
                if (dude.tintTaken[2] <= dudeB)
                {
                    diffB += dudeB / 255 * player.colorConstant;
                    dude.tintTaken[2] += diffB;
                    you.rgb[2] += diffB;
                }
                var newR = Math.min(255, you.rgb[0] + diffR);
                var newG = Math.min(255, you.rgb[1] + diffG);
                var newB = Math.min(255, you.rgb[2] + diffB);
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
                    thePeople.callAll('kill');
                    youBlock.kill();
                    goalBlock.kill();
                    bgmusic.destroy();
                    this.game.state.restart(true, false, this.levels, this.curlvl+1)
                }
            }
}
