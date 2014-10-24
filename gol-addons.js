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
    var fancyTransitionsStyle = document.getElementById(gol.addons.FANCY_TRANSITIONS_STYLES_ID);
    fancyTransitionsStyle.parentNode.removeChild(fancyTransitionsStyle);
  },


  addFancyTransitionsControls: function (containerId) {
    var fancyTransitionsContainer = document.createElement("span");
    fancyTransitionsContainer.setAttribute("id", "fancyTransitionsContainer");

    var fancyTransitionsLabel = document.createElement("label");
    fancyTransitionsLabel.setAttribute("for", "fancyTransitions");
    fancyTransitionsLabel.innerHTML = "Fancy transitions: ";

    var fancyTransitionsCheckbox = document.createElement("input");
    fancyTransitionsCheckbox.setAttribute("type", "checkbox");
    fancyTransitionsCheckbox.addEventListener("change", function (ev) {
      var isChecked = ev.target.checked;
      if (isChecked) {
        gol.addons.addFancyTransitions();
      } else {
        gol.addons.removeFancyTransitions();
      }
    });

    var outerContainer = document.getElementById(containerId);
    if (typeof(outerContainer) === "undefined" || outerContainer === null) {
      throw new Error("cannot add the fancy transition controls inside of container: " + containerId);
    }

    fancyTransitionsContainer.appendChild(fancyTransitionsLabel);
    fancyTransitionsContainer.appendChild(fancyTransitionsCheckbox);

    outerContainer.appendChild(fancyTransitionsContainer);

  },


  trackAgesUpdateCellEventListener: function (ev) {
      var cell = ev.data;
      var displayCell = cell.displayBoardColumn;
      var ageSpans = displayCell.getElementsByClassName("age");
      var ageSpan;

      if (typeof(ageSpans) === "undefined" || ageSpans.length === 0) {
        return;
      }
      ageSpan = ageSpans[0];
      ageSpan.innerHTML = cell.generationsLive > 0 ? cell.generationsLive : "";
  },


  addTrackAges: function () {
    var addAgeDisplayElements = function () {
      var displayCells = document.getElementsByTagName("td");
      for (var cellIndex = 0; cellIndex < displayCells.length; cellIndex += 1) {
        var displayCell = displayCells[cellIndex];

        var ageSpan = document.createElement("span");
        ageSpan.classList.add("age");
        displayCell.appendChild(ageSpan);
      }
    };

    addAgeDisplayElements();

    var trackAgesStyle = document.createElement("style");
    trackAgesStyle.setAttribute("type", "text/css");
    trackAgesStyle.setAttribute("id", gol.addons.TRACK_AGES_STYLES_ID);
    trackAgesStyle.innerHTML = "td .age { color: #ff0000; }";
    document.body.appendChild(trackAgesStyle);

    gol.engine.addEventListener(gol.engine.eventNames.UPDATE_CELL, gol.addons.trackAgesUpdateCellEventListener);
  },


  removeTrackAges: function () {
    var removeAgeDisplayElements = function () {
      var ages = document.getElementsByClassName("age");
      if (ages != null) {
        var numAges = ages.length;
        var numAgesRemoved = 0;

        for (var ageIndex = 0; ageIndex < ages.length; ageIndex += 1) {
          var ageElement = ages[ageIndex];
          //console.log("removing age index: " + ageIndex);
          ageElement.parentNode.removeChild(ageElement);
          numAgesRemoved += 1;
        }
        console.log("total ages removed: " + numAgesRemoved);
        //ages = document.getElementsByClassName("age");
      }
    };

    removeAgeDisplayElements();

    gol.engine.removeEventListener(gol.engine.eventNames.UPDATE_CELL, gol.addons.trackAgesUpdateCellEventListener);
    var trackAgesStyle = document.getElementById(gol.addons.TRACK_AGES_STYLES_ID);
    trackAgesStyle.parentNode.removeChild(trackAgesStyle);
  },

  addTrackAgesControls: function (containerId) {
    var trackAgesContainer = document.createElement("span");
    trackAgesContainer.setAttribute("id", "trackAgesContainer");

    var trackAgesLabel = document.createElement("label");
    trackAgesLabel.setAttribute("for", "trackAges");
    trackAgesLabel.innerHTML = "Track ages: ";

    var trackAgesCheckbox = document.createElement("input");
    trackAgesCheckbox.setAttribute("type", "checkbox");
    trackAgesCheckbox.addEventListener("change", function (ev) {
      var isChecked = ev.target.checked;
      if (isChecked) {
        gol.addons.addTrackAges();
      } else {
        gol.addons.removeTrackAges();
      }
    });

    var outerContainer = document.getElementById(containerId);
    if (typeof(outerContainer) === "undefined" || outerContainer === null) {
      throw new Error("cannot add the track ages controls inside of container: " + containerId);
    }

    trackAgesContainer.appendChild(trackAgesLabel);
    trackAgesContainer.appendChild(trackAgesCheckbox);

    outerContainer.appendChild(trackAgesContainer);
  }
};
