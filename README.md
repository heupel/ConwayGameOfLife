# Conway's Game of Life

HTML scaffolding for implementing Conway's Game of Life in JavaScript.

## What do I do?

**index.html** provides a simple Game of Life cell grid and a set of UI controls. The grid can be painted upon to set live and dead cells using the mouse.

There are basic utility methods `gol.utility.markCell()` and `gol.utility.clearCell()` to set and clear cell state. Everything else is up to you!

## Wait I do what? What is happening?

Oh, you're supposed to implement the Game of Life in JavaScript. If you don't know what that means go read [this](http://en.wikipedia.org/wiki/Conway's_Game_of_Life)!

## Hmm anything else I should know?

Yeah the current **index.html** doesn't work in Internet Explorer (tested on IE 11). IE renders range inputs really strangely and doesn't fire the 'input' and 'change' events the same way as other browsers (wasn't browser fragmentation solved with IE 9?). This project is too small and narrowly focused to bother fixing this so use Firefox, Safari, or Chrome instead.

Also if Game of Life bores you there are a couple variants listed [here](http://en.wikipedia.org/wiki/Langton's_ant).