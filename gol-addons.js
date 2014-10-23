////
// A set of custom add-ons for my Game of Life UI
////

gol.addons = {
  framesPerSecondSlider: function (containerId) {
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

      container.appendChild(fpsLabel);
      container.appendChild(fpsSlider);
      container.appendChild(fpsOutput);
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
  }
};
