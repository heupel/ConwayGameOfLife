
if (typeof(gol) === "undefined") {
  throw new Error("The engine requires the Game of Life (gol) namespace to be previously defined.");
}

gol.engine = {

  gameLoopInterval: null,

  start: function(board) {
    var processGeneration = function(board) {
      console.log("doing work: " + Date.now());
    };

    this.gameLoopInterval = setInterval(function() {
      processGeneration(board);
    }, 16);

  },

  stop: function(reason) {
    clearInterval(this.gameLoopInterval);
    console.log("Stopping because: " + reason);
  }

}
