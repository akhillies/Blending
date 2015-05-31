var util = {
    Level: function(numPeople, numLvl, player, people, background, guard, threshold)
    {
        return {
            "numPeople": numPeople,
            "numlevel": numLvl,
            "player": player,
            "people": people,
            "background": background,
            "guard": guard,
            "threshold": threshold,
            "audio": ["assets/audio/bgMusic.mp3", "assets/audio/bgMusic.ogg"],
            "completed": false
        }
    },
    
    Person: function(name, color, pos, type, moveSpeed)
    {
        var dimensions;
        var animations;
        var spritesheet;
        var additive;
        if(type == "player")
        {
            dimensions = [311, 772];
            spritesheet = "assets/characterSheet/characterSheet.png",
            additive = false;
            animations = [this.Animation("walk", [4, 3, 2, 1, 0], 18, true, 2)];

        }
        else if(type == "personAdd")
        {
            dimensions = [311, 772];
            spritesheet = "assets/characterSheet/characterSheet.png",
            additive = true;
            animations = [];
        }
        else if(type == "personSub")
        {
            dimensions = [311, 772];
            spritesheet = "assets/hatman.png",
            additive = false;
            animations = [];
        }
        else if(type == "guard")
        {
            dimensions = [309, 768];
            pos = [975, 150];
            spritesheet = "assets/guard.png",
            additive = false;
            animations = [];
        }
        else
        {
            console.log("gave a type of person that does not exist!!!");
        }

        return {
            "name": name,
            "color": color,
            "pos": pos,
            "spritesheet": spritesheet,
            "dimensions": dimensions,
            "scale": 0.1,
            "colorConstant": 0.5,
            "moveSpeed": moveSpeed,
            "additive": additive,
            "animations": animations
        }
    },

    Animation: function(name, order, framerate, loop, stillFrame)
    {
        return {
            "name": name,
            "order": order,
            "framerate": framerate,
            "loop": loop,
            "stillFrame": stillFrame
        };
    }
};
