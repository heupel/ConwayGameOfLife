# Conway's Game of Life

HTML scaffolding for implementing Conway's Game of Life in JavaScript.

## What do I do?

**index.html** provides a simple Game of Life cell grid and a set of UI controls. Your goal is to implement the Game of Life simulation logic.

**index.html** is a very simple starting point. There are basic utility methods `gol.utility.markCell()` and `gol.utility.clearCell()` to set and clear cell state. These functions take a `td` element and either mark it or clear it and are intended to be used by your game logic to refresh the board draw state.

**index.html** also has code that draws the board and wires up a set of adjustment and reset controls. The board can be painted on using the mouse to set an intial board state. You should not have to care about the drawing code as long as you use the provided utility methods to update the UI.

Finally there is a start button that currently does nothing. That's your job!

## Wait I do what? What is happening?

Oh, you're supposed to implement the Game of Life in JavaScript. If you don't know what that means go read [this](http://en.wikipedia.org/wiki/Conway's_Game_of_Life).

## What should my code look like? Can I just throw everything into one function?

NO! The goal of this workshop is to exercise some of the JavaScript best practices we've been studying while implementing a visually interesting simulation. Some practices to keep in mind:

- don't pollute the global space! the `gol` root object on which the utilities are defined can be used for this, or you can define your own encapsulation
- avoid using the constructor invocation pattern
- despite the previous point, use proper logical encapsulation and abstraction; create modules and objects that make sense and model the problem clearly
- remember closures allow you both to simulate object construction and encapsulation (privately accessible members)
- functions are first-class citizens! some abstractions may more naturally be modelled as a function instead of an object with methods

## Hmm anything else I should know?

Yeah, **index.html** doesn't work in Internet Explorer (tested on IE 11). I didn't bother to put any IE-specific shims into the event handling of the UI and this project is too small and narrowly focused to bother fixing so use Firefox, Safari, or Chrome instead.

If Game of Life bores you there are a couple variants listed [here](http://en.wikipedia.org/wiki/Langton's_ant).