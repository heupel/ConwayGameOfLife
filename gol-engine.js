
if (typeof(gol) === "undefined") {
  throw new Error("The engine requires the Game of Life (gol) namespace to be previously defined.");
}

gol.engine = {

  eventNames  : {
    UPDATE_CELL: "updateCell"
  },

  gameLoopInterval: null,

  framesPerSecond: 6,

  displayBoard: null,

  updateEventListeners: [],

  addEventListener: function (eventName, callback) {
    switch (eventName) {
      case (gol.engine.eventNames.UPDATE_CELL):
        gol.engine.updateEventListeners.push(callback);
        break;

    default:
      throw new Error("unreconized event name: " + eventName);
    }
  },

  removeEventListener: function (eventName, callback) {
    var callbacks = [];
    switch (eventName) {
      case (gol.engine.eventNames.UPDATE_CELL):
        callbacks = gol.engine.updateEventListeners;
        break;
      default:
        throw new Error("unrecognized event name: " + eventName);
    }

    var callbackIndex = callbacks.indexOf(callback);
    if (callbackIndex >= 0) {
      callbacks.splice(callbackIndex, 1);
    } else {
      throw new Error("listener not found");
    }
  },

  dispatchEvent: function (eventName, eventData) {
    var callbacks = [];
    switch (eventName) {
      case (gol.engine.eventNames.UPDATE_CELL):
        callbacks = gol.engine.updateEventListeners;
        break;
      default:
        throw new Error("unrecognized event name: " + eventName);
    }

    for (var callbackIndex = 0; callbackIndex < callbacks.length; callbackIndex += 1) {
      var callback = callbacks[callbackIndex];
      callback( { target: gol.engine, data: eventData });
    }
  },

  init: function (displayBoard, framesPerSecond) {
    if ((typeof(displayBoard) === "undefined" || displayBoard === null) &&
        gol.engine.displayBoard === null) {
      throw new Error("displayBoard is required to be set to start the game engine");
    } else if (!(typeof(displayBoard) === "undefined" || displayBoard === null)) {
      gol.engine.displayBoard = displayBoard;
    }

    if (typeof(framesPerSecond) === "undefined" || framesPerSecond === null) {
      // Use what's already set
    } else {
      gol.engine.framesPerSecond = framesPerSecond;
    }
  },

  start: function() {
    var existingCellIsMarked = function (displayBoardCell) {
      return displayBoardCell.classList.contains("marked");
    };

    var translateDisplayBoardToWorkingBoard = function(displayBoard) {

      var processRow = function(displayBoardRow) {
        var processColumn = function(displayBoardColumn) {
          var isAlive = existingCellIsMarked(displayBoardColumn);
          return {
            marked: isAlive,
            displayBoardColumn: displayBoardColumn,
            generationsLive: isAlive ? 1 : 0
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

      var displayBoardRows = gol.engine.displayBoard.getElementsByTagName("tr");

      for (var rowIndex = 0; rowIndex < displayBoardRows.length; rowIndex++) {
        var workingRow = processRow(displayBoardRows[rowIndex]);
        workingBoard.push(workingRow);
      }

      return workingBoard;
    };


    var workingBoard = translateDisplayBoardToWorkingBoard(gol.engine.displayBoard);

    var renderInterval = Math.floor(1000/gol.engine.framesPerSecond);

    var processGeneration = function(workingBoard) {
      console.log("doing work: " + Date.now());

	  var processCellGeneration = function (rowIndex, columnIndex) {
		  // ---RULES---
		  // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
		  // Any live cell with two or three live neighbours lives on to the next generation.
		  // Any live cell with more than three live neighbours dies, as if by overcrowding.
		  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
		  var getLiveNeighborCount = function () {
			  var getLiveMembersInRowColumnRange = function (currentRowIndex, startColumnIndex, endColumnIndex) {
				  var liveCells = 0;

				  for (var currentColumnIndex = startColumnIndex; currentColumnIndex <= endColumnIndex; currentColumnIndex += 1) {
					  if ((rowIndex != currentRowIndex || columnIndex != currentColumnIndex) &&
					      (existingCellIsMarked(workingBoard[currentRowIndex][currentColumnIndex].displayBoardColumn))) {
						  liveCells += 1;
					  }
				  }

				  return liveCells;
			  };
			  var totalLiveNeighbors = 0;
			  var startRowIndex = rowIndex > 0 ? rowIndex - 1 : rowIndex;
			  var endRowIndex = rowIndex < workingBoard.length - 1 ? rowIndex + 1 : rowIndex;
			  var startColumnIndex = columnIndex > 0 ? columnIndex - 1 : columnIndex;
			  var endColumnIndex = columnIndex < workingBoard[rowIndex].length - 1 ? columnIndex + 1 : columnIndex;
			  var liveNeighborsCount = 0;

			  for (var currentRowIndex = startRowIndex; currentRowIndex <= endRowIndex; currentRowIndex += 1) {
				  liveNeighborsCount += getLiveMembersInRowColumnRange(currentRowIndex, startColumnIndex, endColumnIndex);
			  }

			  return liveNeighborsCount;

		  };

		  var liveNeighborCount = getLiveNeighborCount();

		  var isUnderpopulated = function () {
			  return liveNeighborCount < 2;
		  };

		  var isStatic = function () {
			  return liveNeighborCount >= 2 && liveNeighborCount <= 3;
		  };

		  var isOvercrowded = function () {
			  return liveNeighborCount > 3;
		  };

		  var isBornByReproduction = function () {
			  return liveNeighborCount == 3;
		  };

		  var liveCellDies = function () {
			  return isUnderpopulated() || isOvercrowded();
		  };

		  var liveCellLives = function() {
			  return isStatic();
		  };

		  var deadCellRevives = function () {
			  return isBornByReproduction();
		  };

		  var currentCell = workingBoard[rowIndex][columnIndex];
      if (typeof(currentCell) === "undefined") {
        throw new Error("undefined cell. [" + rowIndex + ", " + columnIndex + "]");
      } else {
        var isLiveCell = currentCell.marked;
        var marked;

        if (isLiveCell) {
            marked = !liveCellDies();
        } else {
          marked = isBornByReproduction();
        }

        var updateCellOnWorkingBoard = function (rowIndex, columnIndex, isLiveCell, isMarked) {
          var cell = workingBoard[rowIndex][columnIndex];
          cell.marked = isMarked;
          cell.generationsLive = isMarked ? cell.generationsLive + 1 : 0;
          gol.engine.dispatchEvent(gol.engine.eventNames.UPDATE_CELL, cell);
        };

        updateCellOnWorkingBoard(rowIndex, columnIndex, isLiveCell, marked);

      }
	  };

    for (var rowIndex = 0; rowIndex < workingBoard.length; rowIndex++) {
      var workingBoardRow = workingBoard[rowIndex];

      for (var columnIndex = 0; columnIndex < workingBoardRow.length; columnIndex += 1) {
        processCellGeneration(rowIndex, columnIndex);
      }
	  }
    };

    var updateDisplayBoard = function(workingBoard) {
      var updateColumn = function (workingColumn) {
        var markFunction = workingColumn.marked ? gol.utility.markCell : gol.utility.clearCell;
        markFunction(workingColumn.displayBoardColumn);
      }

      for (var rowIndex = 0; rowIndex < workingBoard.length; rowIndex++) {
        var workingRow = workingBoard[rowIndex];
        for (var columnIndex = 0; columnIndex < workingRow.length; columnIndex += 1) {
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
    this.gameLoopInterval = null;
    console.log("Stopping because: " + reason);
  }

}
