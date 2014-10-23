////
// A set of custom add-ons for my Game of Life UI
////

gol.addons = {
  FRAMES_PER_SECOND_CONTAINER_ID:  "framesPerSecondContainer",
  FANCY_TRANSITIONS_STYLES_ID: "fancyTransitionsStyles",
  TRACK_AGES_STYLES_ID: "trackAgesStyles",

  addFramesPerSecondSlider: function (containerId) {
    var SLIDER_ID = "framesPerSecond";
    var OUTPUT_ID = SLIDER_ID + "Output";


    var addToContainerId = function (containerId) {

      var container = document.getElementById(containerId);
      if (typeof(container) === "undefined" || container === null) {
        throw new Error("The frames per second slider could not be added as a child of container with ID: " + containerId);
      }

      var fpsLabel = document.createElement("label");
      fpsLabel.setAttribute("for", SLIDER_ID);
      fpsLabel.innerHTML = "Frames/Second:";

      var fpsSlider = document.createElement("input");
      fpsSlider.setAttribute("id", SLIDER_ID);
      fpsSlider.setAttribute("type", "range");
      fpsSlider.setAttribute("min", "1");
      fpsSlider.setAttribute("max", "1000");
      fpsSlider.setAttribute("value", "6");

      var fpsOutput = document.createElement("output");
      fpsOutput.setAttribute("for", SLIDER_ID);
      fpsOutput.setAttribute("id", OUTPUT_ID);

      var fpsContainer = document.createElement("span");
      fpsContainer.setAttribute("id", gol.addons.FRAMES_PER_SECOND_CONTAINER_ID);

      fpsContainer.appendChild(fpsLabel);
      fpsContainer.appendChild(fpsSlider);
      fpsContainer.appendChild(fpsOutput);

      container.appendChild(fpsContainer);
    };

    var initSliderEvents = function () {
      var input = document.getElementById(SLIDER_ID);
      input.addEventListener('input', function (ev) {
        document.getElementById(OUTPUT_ID).innerHTML = ev.target.value;
      });
      input.addEventListener('change', function (ev) {
        var isRunning = (gol.engine.gameLoopInterval != null);
        var newFramesPerSecond = parseInt(ev.target.value);

        if (isRunning) gol.engine.stop("Changing frames per second to: " + newFramesPerSecond);
        gol.engine.framesPerSecond = newFramesPerSecond;

        if (isRunning) gol.engine.start();
      })

      input.dispatchEvent(new Event('input'));
    };

    addToContainerId(containerId);
    initSliderEvents();
  },

  removeFramesPerSecondSlider: function () {
    document.removeChild(gol.addons.FRAMES_PER_SECOND_CONTAINER_ID);
  },

  addFancyTransitions: function () {
    var fancyStyle = document.createElement("style");
    fancyStyle.setAttribute("type", "text/css");
    fancyStyle.setAttribute("id", gol.addons.FANCY_TRANSITIONS_STYLES_ID);
    fancyStyle.innerHTML = " \
      td { \
          opacity: 0.2; \
          transition: opacity 0.4s ease-in; \
          -ms-transition: opacity 0.4s ease-in; \
          -moz-transition: opacity 0.4s ease-in; \
          -webkit-transition: opacity 0.4s ease-in; \
      } \
      td.marked { \
          opacity: 1; \
          transition: opacity 0.4s ease-out; \
          -ms-transition: opacity 0.4s ease-out; \
          -moz-transition: opacity 0.4s ease-out; \
          -webkit-transition: opacity 0.4s ease-out; \
      } \
    ";
    document.body.appendChild(fancyStyle);
  },

  removeFancyTransitions: function () {
    document.removeChild(gol.addons.FANCY_TRANSITIONS_STYLES_ID);
  },

  addTrackAges: function () {

    var trackAgesStyle = document.createElement("style");
    trackAgesStyle.setAttribute("type", "text/css");
    trackAgesStyle.setAttribute("id", gol.addons.TRACK_AGES_STYLES_ID);
    trackAgesStyle.innerHTML = "td { color: #000000; } td.marked { color: #ffffff }";
    document.body.appendChild(trackAgesStyle);

    gol.engine.addEventListener(gol.engine.eventNames.UPDATE_CELL, function(ev) {
      var cell = ev.data;
      cell.displayBoardColumn.innerHTML = cell.generationsLive;
    });
  },


  removeTrackAges: function () {
    gol.engine.removeEventListener(gol.engine.eventNames.UPDATE_CELL, gol.addons.trackAgesUpdateCellEventListener);
    document.removeChild(gol.addons.TRACK_AGES_STYLES_ID);
    // TODO: Clear out ages text
  }

};
