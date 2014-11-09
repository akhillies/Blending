$(document).ready(function()
{
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update
    });

    var youBlock;

    function preload()
    {
        game.load.image('bg', 'assets/testbg.png');
        game.load.image('youTile', 'assets/testbg.png', 10, 10);
    }

    function create()
    {
        youBlock = game.make.bitmapData();
        youBlock.load('youTile');
        youBlock.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5, 0.05, 0.05);
        youBlock.replaceRGB(0, 0, 0, 255, 200, 200, 200, 255);
    }

    function update()
    {}
})