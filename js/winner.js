var winner = function(game) {}

winner.prototype = {
    init: function(data)
    {
        this.levels = data;
    },
    preload: function()
    {
        this.game.load.image("winner", "assets/winScreen.png");
    },
    create: function()
    {
        var play = this.game.add.button(0, 0, "winner", this.endGame, this, null, null, null);
    },
    endGame: function()
    {
        // this.game.state.start("Boot", true, false, this.levels, 0);
    }

}