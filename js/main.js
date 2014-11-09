requirejs.config({
  baseUrl:'js' 
});

var levelno=0;


requirejs(['phaser', 'util'],
  function(phaser, util){

  

  $(document).ready(function(){
    $.get('js/levels.json', function(data){
      console.log(data);
      startGame(data);
      
    });
    })

    
    function startGame(levels){
      var game = new Phaser.Game(1024, 768, Phaser.AUTO, '',
      {
          preload: preload,
          create: create,
          update: update
      });

      var lvl = levels[levelno];
      var people = lvl.people;
      var guard = lvl.guard;
      var player = lvl.player;
      


      var colorConstant = .5;
      var moveSpeed = 2;

      var youBlock;
      var arrowKeys;
      var thePeople;
      var goalBlock;

      function preload()
      {
          game.load.image("bg", lvl.background);
          game.load.spritesheet(guard.name, guard.spritesheet, guard.dimensions[0], guard.dimensions[1]);
          game.load.spritesheet(player.name, player.spritesheet, player.dimensions[0], player.dimensions[1]);
          for(var i = 0; i < lvl.numPeople; i++){
            game.load.spritesheet(people[i].name, people[i].spritesheet, people[i].dimensions[0], people[i].dimensions[1]);
          }
      }

      function create()
      {
          var bg = game.add.sprite(0,0,"bg");
          arrowKeys = game.input.keyboard.createCursorKeys();

          thePeople = game.add.group();
          thePeople.enableBody = true;

          for (var i = 0; i < lvl.numPeople; i++)
          {
              var thePerson = thePeople.create(people[i].pos[0], people[i].pos[1], people[i].name);
              thePerson.tint = Phaser.Color.getColor(people[i].color[0], people[i].color[1], people[i].color[2]);
              thePerson.scale.x = people[i].scale;
              thePerson.scale.y = people[i].scale;
              thePerson.tintTaken = [0, 0, 0];
          }

          goalBlock = game.add.sprite(guard.pos[0], guard.pos[1], guard.name);
          goalBlock.tint = Phaser.Color.getColor(guard.color[0], guard.color[1], guard.color[2]);
          goalBlock.scale.x = guard.scale;
          goalBlock.scale.y = guard.scale;
          game.physics.arcade.enable(goalBlock)

          youBlock = game.add.sprite(player.pos[0], player.pos[1], player.name);
          youBlock.tint = Phaser.Color.getColor(player.color[0], player.color[1], player.color[2]);
          youBlock.scale.x = player.scale;
          youBlock.scale.y = player.scale;
          youBlock.anchor.setTo(0.5, 0);
          youBlock.rgb = [player.color[0], player.color[1], player.color[2]];
          game.physics.arcade.enable(youBlock)
          youBlock.body.collideWorldBounds = true;

          for(var i = 0; i < player.animations.length; i++){
            youBlock.animations.add(player.animations[i].name, player.animations[i].order,player.animations[i].framerate, player.animations[i].loop);
          }
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
              youBlock.scale.x = -player.scale;
          }
          else if (arrowKeys.right.isDown)
          {
              youBlock.x += moveSpeed;
              youBlock.animations.play('walk');
              youBlock.scale.x = player.scale;
          }
          else
          {
              youBlock.animations.stop();
              youBlock.frame = player.stillFrame;
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
              create();
          }
      }
  }
})
