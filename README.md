This adds a listener to an element that allows the user to focus adjacent focusable items with the arrow keys. Handy for making dropdown menus or grids of buttons more accessible.

```js
var mainMenu = document.getElementById('main-menu');
var mainMenuFocuser = new FocusByArrow(mainMenu);
```

By default it focuses the usual focusable elements: inputs, buttons, links, etc. If you want to limit focusing by arrow to certain elements, you can specify a selector:

```js
var buttonsOnlyFocuser = new FocusByArrow(mainMenu, '.menu-button');
```

When you're done, remember to clean up:

```js
mainMenuFocuser.stopListening();
```

And then if you need to, you can re-start it:

```js
mainMenuFocuser.startListening();
```
