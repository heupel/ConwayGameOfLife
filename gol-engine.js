
if (typeof(gol) === "undefined") {
  throw new Error("The engine requires the Game of Life (gol) namespace to be previously defined.");
}

gol.engine = {

  gameLoopInterval: null,

  start: function(displayBoard, framesPerSecond) {
    var translateDisplayBoardToWorkingBoard = function(displayBoard) {

      var processRow = function(displayBoardRow) {
        var processColumn = function(displayBoardColumn) {
          return {
            marked: displayBoardColumn.classList.contains("marked"),
            displayBoardColumn: displayBoardColumn
          };

        };
        var workingRow = [];
        var displayBoardColumns = displayBoardRow.getElementsByTagName("td");

        for (var columnIndex = 0; columnIndex < displayBoardColumns.length; columnIndex++) {
          var workingColumn = processColumn(displayBoardColumns[columnIndex]);
          workingRow.push(workingColumn);
        }
        return workingRow;
      };

      var workingBoard = [];

      var displayBoardRows = displayBoard.getElementsByTagName("tr");

      for (var rowIndex = 0; rowIndex < displayBoardRows.length; rowIndex++) {
        var workingRow = processRow(displayBoardRows[rowIndex]);
        workingBoard.push(workingRow);
      }

      return workingBoard;
    };


    var workingBoard = translateDisplayBoardToWorkingBoard(displayBoard);

    var renderInterval = Math.floor(1000/framesPerSecond);

    var processGeneration = function(workingBoard) {
      console.log("doing work: " + Date.now());
      workingBoard[5][2].marked = true; // Just test updating marked property
      console.log(workingBoard);
    };

    var updateDisplayBoard = function(workingBoard) {
      var updateColumn = function (workingColumn) {
        var markFunction = workingColumn.marked ? gol.utility.markCell : gol.utility.clearCell;
        markFunction(workingColumn.displayBoardColumn);
      }

      for (var rowIndex = 0; rowIndex < workingBoard.length; rowIndex++) {
        var workingRow = workingBoard[rowIndex];
        for (var columnIndex = 0; columnIndex < workingRow.length; columnIndex++) {
          updateColumn(workingRow[columnIndex]);
        }
      }
    }

    this.gameLoopInterval = setInterval(function() {
      processGeneration(workingBoard);
      updateDisplayBoard(workingBoard);
    }, renderInterval);

  },

  stop: function(reason) {
    clearInterval(this.gameLoopInterval);
    console.log("Stopping because: " + reason);
  }

}
