(function() {
  var DEFAULT_ROOT = document;

  var DEFAULT_ITEMS_SELECTOR = [
    'a',
    'button',
    'input',
    'label', // Handled specially
    'select',
    'textarea',
    '[tabindex]'
  ].join(',');

  var DEFAULT_CONFIG = {
    step: 5,
    keys: {
      '37': 'LEFT',
      '38': 'UP',
      '39': 'RIGHT',
      '40': 'DOWN'
    }
  };

  function FocusByArrow(root, itemsSelector, config) {
    this.root = root;
    if (this.root === undefined) {
      this.root = DEFAULT_ROOT;
    }

    this.itemsSelector = itemsSelector;
    if (this.itemsSelector === undefined) {
      this.itemsSelector = DEFAULT_ITEMS_SELECTOR;
    }

    this.config = Object.assign({}, DEFAULT_CONFIG, config);

    this.startListening();
  }

  Object.assign(FocusByArrow.prototype, {
    startListening: function() {
      this.root.addEventListener('keydown', this);
    },

    stopListening: function() {
      this.root.removeEventListener('keydown', this);
    },

    handleEvent: function(event) {
      var direction = this.config.keys[event.which];

      if (direction === undefined) {
        return;
      }

      var canInputText;
      try {
        canInputText = document.activeElement.selectionStart !== null && document.activeElement.selectionStart !== undefined;
      } catch (error) {
        // Chrome throws when accessing invalid `selectionStart`s. No worries.
        canInputText = false;
      }

      if (canInputText && !document.activeElement.readOnly) {
        return;
      }

      var onAnItem = document.activeElement.matches(this.itemsSelector);

      if (!onAnItem) {
        return;
      }

      var nextInLine = this.getAdjacent(document.activeElement, direction);
      if (nextInLine !== null) {
        // Normally, radio buttons change on arrow-key-press and select menus open.
        event.preventDefault();
        nextInLine.focus();
      }
    },

    _matchesItem: function(element) {
      return element.matches(this.itemsSelector);
    },

    getAdjacent: function(target, direction) {
      var targetRect = target.getBoundingClientRect();
      var x = targetRect.left + target.offsetWidth / 2;
      var y = targetRect.top + target.offsetHeight / 2;

      var parentLabel = target.parentNode;
      while (parentLabel !== null && parentLabel.nodeName !== 'LABEL') {
        parentLabel = parentLabel.parentNode;
      }

      var next;
      while (true) {
        if (direction === 'LEFT') {
          x -= this.config.step;
        } else if (direction === 'UP') {
          y -= this.config.step;
        } else if (direction === 'RIGHT') {
          x += this.config.step;
        } else if (direction === 'DOWN') {
          y += this.config.step;
        }

        if (x < 0 || y < 0 || x > pageXOffset + innerWidth || y > pageYOffset + innerHeight) {
          return null;
        }

        next = document.elementsFromPoint(x, y).filter(this._matchesItem, this)[0];
        if (next !== undefined && next !== target && next !== parentLabel) {
          break;
        }
      }

      if (next.nodeName === 'LABEL') {
        if (next.hasAttribute('for')) {
          next = document.getElementById(next.getAttribute('for'));
        } else {
          next = next.querySelector(this.itemsSelector);
        }
      }

      return next;
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = FocusByArrow;
  } else if (typeof window !== undefined) {
    window.FocusByArrow = FocusByArrow;
  }
}());
