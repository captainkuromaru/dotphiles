Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _lodashMap = require('lodash/map');

var _lodashMap2 = _interopRequireDefault(_lodashMap);

'use babel';

var calculateDecoration = function calculateDecoration(_ref) {
  var chosenColor = _ref.chosenColor;
  var opacity = _ref.opacity;
  var useCustomColors = _ref.useCustomColors;
  var customColors = _ref.customColors;
  var currentNumber = _ref.currentNumber;

  // The first thing to do is identify which approach to use according to Atom's API.
  // Style or class name.
  if (useCustomColors) {
    return {
      'class': 'nyan-indent',
      style: {
        opacity: opacity / 100,
        backgroundColor: customColors[currentNumber].toHexString()
      }
    };
  }

  return {
    'class': 'nyan-indent nyan-indent-' + currentNumber + ' ' + chosenColor,
    style: {
      opacity: opacity / 100
    }
  };
};

var isLineUsingTabulations = function isLineUsingTabulations(textEditor, _ref2) {
  var text = _ref2.text;
  return (/^\t/.test(text)
  );
};

var paintTextEditorLine = function paintTextEditorLine(textEditor, _ref3) {
  var tabLength = _ref3.tabLength;
  var line = _ref3.line;

  var preferences = _objectWithoutProperties(_ref3, ['tabLength', 'line']);

  var lineIndentation = textEditor.indentationForBufferRow(line);

  var text = textEditor.lineTextForBufferRow(line);
  var usedTabLength = isLineUsingTabulations(textEditor, { text: text }) ? 1 : tabLength;

  var indentationLimit = Math.floor(lineIndentation) * usedTabLength;

  // Create a Marker for each indentation
  for (var indentation = 0, counter = 0; indentation < indentationLimit; indentation += usedTabLength, counter += 1) {
    var initialPoint = [line, indentation];
    var finalPoint = [line, indentation + usedTabLength];
    var range = [initialPoint, finalPoint];

    var NUMBER_OF_COLORS = 5;
    var currentNumber = counter % NUMBER_OF_COLORS;
    var decorations = calculateDecoration(_extends({
      currentNumber: currentNumber
    }, preferences));

    var marker = textEditor.markBufferRange(range);

    marker.setProperties({
      nyanIndent: true,
      line: line,
      currentNumber: currentNumber,
      range: range
    });

    if (marker.isValid() && !marker.isDestroyed()) {
      textEditor.decorateMarker(marker, _extends({
        type: 'text'
      }, decorations));
    }
  }
};

var readTextEditorLines = function readTextEditorLines(textEditor, _ref4) {
  var tabLength = _ref4.tabLength;
  var numberOfLines = _ref4.numberOfLines;

  var preferences = _objectWithoutProperties(_ref4, ['tabLength', 'numberOfLines']);

  for (var line = 0; line < numberOfLines; line += 1) {
    paintTextEditorLine(textEditor, _extends({ tabLength: tabLength, line: line }, preferences));
  }
};

var removeMarkersFromRange = function removeMarkersFromRange(textEditor, range) {
  var markers = textEditor.findMarkers({
    nyanIndent: true,
    startBufferRow: range.start.row,
    endBufferRow: range.end.row
  });
  markers.forEach(function (marker) {
    return marker.destroy();
  });
};

var paintMultipleLines = function paintMultipleLines(textEditor, _ref5) {
  var tabLength = _ref5.tabLength;
  var fromLine = _ref5.fromLine;
  var toLine = _ref5.toLine;

  var preferences = _objectWithoutProperties(_ref5, ['tabLength', 'fromLine', 'toLine']);

  for (var line = fromLine; line <= toLine; line += 1) {
    paintTextEditorLine(textEditor, _extends({ tabLength: tabLength, line: line }, preferences));
  }
};

/**
 * Called when user modifies text. Cleans previous markers and repaints
 * on top of changes.
 * @param  {Object} textEditor
 * @param  {Array} changes
 */
var textDidChange = function textDidChange(textEditor, preferences, changes) {
  var tabLength = textEditor.getTabLength();
  return (0, _lodashMap2['default'])(changes.changes, function (change) {
    // Cleans previous markers before adding new ones.
    removeMarkersFromRange(textEditor, change.newRange);

    var fromLine = change.newRange.start.row;
    var toLine = change.newRange.end.row;

    if (fromLine === toLine) {
      return paintTextEditorLine(textEditor, _extends({
        tabLength: tabLength,
        line: fromLine
      }, preferences));
    }

    // Updates changes in different lines.
    return paintMultipleLines(textEditor, _extends({
      tabLength: tabLength,
      fromLine: fromLine,
      toLine: toLine
    }, preferences));
  });
};

exports.textDidChange = textDidChange;
var paint = function paint(textEditor, preferences) {
  var tabLength = textEditor.getTabLength();
  var numberOfLines = textEditor.getLineCount();

  // Check all the existing lines for text Editor
  readTextEditorLines(textEditor, _extends({ tabLength: tabLength, numberOfLines: numberOfLines }, preferences));
};

exports.paint = paint;
var clean = function clean(textEditor) {
  var markers = textEditor.findMarkers({
    nyanIndent: true
  });
  (0, _lodashMap2['default'])(markers, function (marker) {
    return marker.destroy();
  });
};
exports.clean = clean;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2t1cm9tYXJ1Ly5hdG9tL3BhY2thZ2VzL255YW4taW5kZW50L2xpYi9ueWFuLWluZGVudC1yZW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozt5QkFFZ0IsWUFBWTs7OztBQUY1QixXQUFXLENBQUM7O0FBSVosSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBSSxJQU01QixFQUFLO01BTEosV0FBVyxHQURnQixJQU01QixDQUxDLFdBQVc7TUFDWCxPQUFPLEdBRm9CLElBTTVCLENBSkMsT0FBTztNQUNQLGVBQWUsR0FIWSxJQU01QixDQUhDLGVBQWU7TUFDZixZQUFZLEdBSmUsSUFNNUIsQ0FGQyxZQUFZO01BQ1osYUFBYSxHQUxjLElBTTVCLENBREMsYUFBYTs7OztBQUliLE1BQUksZUFBZSxFQUFFO0FBQ25CLFdBQU87QUFDTCxlQUFPLGFBQWE7QUFDcEIsV0FBSyxFQUFFO0FBQ0wsZUFBTyxFQUFFLE9BQU8sR0FBRyxHQUFHO0FBQ3RCLHVCQUFlLEVBQUUsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsRUFBRTtPQUMzRDtLQUNGLENBQUM7R0FDSDs7QUFFRCxTQUFPO0FBQ0wsMENBQWtDLGFBQWEsU0FBSSxXQUFXLEFBQUU7QUFDaEUsU0FBSyxFQUFFO0FBQ0wsYUFBTyxFQUFFLE9BQU8sR0FBRyxHQUFHO0tBQ3ZCO0dBQ0YsQ0FBQztDQUNILENBQUM7O0FBRUYsSUFBTSxzQkFBc0IsR0FBRyxTQUF6QixzQkFBc0IsQ0FBSSxVQUFVLEVBQUUsS0FBUTtNQUFOLElBQUksR0FBTixLQUFRLENBQU4sSUFBSTtTQUFPLE1BQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOztDQUFBLENBQUM7O0FBRTFFLElBQU0sbUJBQW1CLEdBQUcsU0FBdEIsbUJBQW1CLENBQUksVUFBVSxFQUFFLEtBSXhDLEVBQUs7TUFISixTQUFTLEdBRDhCLEtBSXhDLENBSEMsU0FBUztNQUNULElBQUksR0FGbUMsS0FJeEMs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SyxJQUFNLEtBQUssR0FBRyxTQUFSLEtBQUssQ0FBSSxVQUFVLEVBQUUsV0FBVyxFQUFLO0FBQ2hELE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUM1QyxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7OztBQUdoRCxxQkFBbUIsQ0FBQyxVQUFVLGFBQUksU0FBUyxFQUFULFNBQVMsRUFBRSxhQUFhLEVBQWIsYUFBYSxJQUFLLFdBQVcsRUFBRyxDQUFDO0NBQy9FLENBQUM7OztBQUVLLElBQU0sS0FBSyxHQUFHLFNBQVIsS0FBSyxDQUFJLFVBQVUsRUFBSztBQUNuQyxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO0FBQ3JDLGNBQVUsRUFBRSxJQUFJO0dBQ2pCLENBQUMsQ0FBQztBQUNILDhCQUFJLE9BQU8sRUFBRSxVQUFBLE1BQU07V0FBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0dBQUEsQ0FBQyxDQUFDO0NBQzFDLENBQUMiLCJmaWxlIjoiL2hvbWUva3Vyb21hcnUvLmF0b20vcGFja2FnZXMvbnlhbi1pbmRlbnQvbGliL255YW4taW5kZW50LXJlbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgbWFwIGZyb20gJ2xvZGFzaC9tYXAnO1xuXG5jb25zdCBjYWxjdWxhdGVEZWNvcmF0aW9uID0gKHtcbiAgY2hvc2VuQ29sb3IsXG4gIG9wYWNpdHksXG4gIHVzZUN1c3RvbUNvbG9ycyxcbiAgY3VzdG9tQ29sb3JzLFxuICBjdXJyZW50TnVtYmVyLFxufSkgPT4ge1xuICAvLyBUaGUgZmlyc3QgdGhpbmcgdG8gZG8gaXMgaWRlbnRpZnkgd2hpY2ggYXBwcm9hY2ggdG8gdXNlIGFjY29yZGluZyB0byBBdG9tJ3MgQVBJLlxuICAvLyBTdHlsZSBvciBjbGFzcyBuYW1lLlxuICBpZiAodXNlQ3VzdG9tQ29sb3JzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsYXNzOiAnbnlhbi1pbmRlbnQnLFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgb3BhY2l0eTogb3BhY2l0eSAvIDEwMCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjdXN0b21Db2xvcnNbY3VycmVudE51bWJlcl0udG9IZXhTdHJpbmcoKSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3M6IGBueWFuLWluZGVudCBueWFuLWluZGVudC0ke2N1cnJlbnROdW1iZXJ9ICR7Y2hvc2VuQ29sb3J9YCxcbiAgICBzdHlsZToge1xuICAgICAgb3BhY2l0eTogb3BhY2l0eSAvIDEwMCxcbiAgICB9LFxuICB9O1xufTtcblxuY29uc3QgaXNMaW5lVXNpbmdUYWJ1bGF0aW9ucyA9ICh0ZXh0RWRpdG9yLCB7IHRleHQgfSkgPT4gL15cXHQvLnRlc3QodGV4dCk7XG5cbmNvbnN0IHBhaW50VGV4dEVkaXRvckxpbmUgPSAodGV4dEVkaXRvciwge1xuICB0YWJMZW5ndGgsXG4gIGxpbmUsXG4gIC4uLnByZWZlcmVuY2VzXG59KSA9PiB7XG4gIGNvbnN0IGxpbmVJbmRlbnRhdGlvbiA9IHRleHRFZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cobGluZSk7XG5cbiAgY29uc3QgdGV4dCA9IHRleHRFZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cobGluZSk7XG4gIGNvbnN0IHVzZWRUYWJMZW5ndGggPSBpc0xpbmVVc2luZ1RhYnVsYXRpb25zKHRleHRFZGl0b3IsIHsgdGV4dCB9KVxuICAgID8gMVxuICAgIDogdGFiTGVuZ3RoO1xuXG4gIGNvbnN0IGluZGVudGF0aW9uTGltaXQgPSBNYXRoLmZsb29yKGxpbmVJbmRlbnRhdGlvbikgKiB1c2VkVGFiTGVuZ3RoO1xuXG4gIC8vIENyZWF0ZSBhIE1hcmtlciBmb3IgZWFjaCBpbmRlbnRhdGlvblxuICBmb3IgKFxuICAgIGxldCBpbmRlbnRhdGlvbiA9IDAsIGNvdW50ZXIgPSAwO1xuICAgIGluZGVudGF0aW9uIDwgaW5kZW50YXRpb25MaW1pdDtcbiAgICBpbmRlbnRhdGlvbiArPSB1c2VkVGFiTGVuZ3RoLCBjb3VudGVyICs9IDFcbiAgKSB7XG4gICAgY29uc3QgaW5pdGlhbFBvaW50ID0gW2xpbmUsIGluZGVudGF0aW9uXTtcbiAgICBjb25zdCBmaW5hbFBvaW50ID0gW2xpbmUsIChpbmRlbnRhdGlvbiArIHVzZWRUYWJMZW5ndGgpXTtcbiAgICBjb25zdCByYW5nZSA9IFtpbml0aWFsUG9pbnQsIGZpbmFsUG9pbnRdO1xuXG4gICAgY29uc3QgTlVNQkVSX09GX0NPTE9SUyA9IDU7XG4gICAgY29uc3QgY3VycmVudE51bWJlciA9IGNvdW50ZXIgJSBOVU1CRVJfT0ZfQ09MT1JTO1xuICAgIGNvbnN0IGRlY29yYXRpb25zID0gY2FsY3VsYXRlRGVjb3JhdGlvbih7XG4gICAgICBjdXJyZW50TnVtYmVyLFxuICAgICAgLi4ucHJlZmVyZW5jZXMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtYXJrZXIgPSB0ZXh0RWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSk7XG5cbiAgICBtYXJrZXIuc2V0UHJvcGVydGllcyh7XG4gICAgICBueWFuSW5kZW50OiB0cnVlLFxuICAgICAgbGluZSxcbiAgICAgIGN1cnJlbnROdW1iZXIsXG4gICAgICByYW5nZSxcbiAgICB9KTtcblxuICAgIGlmIChtYXJrZXIuaXNWYWxpZCgpICYmICFtYXJrZXIuaXNEZXN0cm95ZWQoKSkge1xuICAgICAgdGV4dEVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAuLi5kZWNvcmF0aW9ucyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3QgcmVhZFRleHRFZGl0b3JMaW5lcyA9ICh0ZXh0RWRpdG9yLCB7IHRhYkxlbmd0aCwgbnVtYmVyT2ZMaW5lcywgLi4ucHJlZmVyZW5jZXMgfSkgPT4ge1xuICBmb3IgKGxldCBsaW5lID0gMDsgbGluZSA8IG51bWJlck9mTGluZXM7IGxpbmUgKz0gMSkge1xuICAgIHBhaW50VGV4dEVkaXRvckxpbmUodGV4dEVkaXRvciwgeyB0YWJMZW5ndGgsIGxpbmUsIC4uLnByZWZlcmVuY2VzIH0pO1xuICB9XG59O1xuXG5jb25zdCByZW1vdmVNYXJrZXJzRnJvbVJhbmdlID0gKHRleHRFZGl0b3IsIHJhbmdlKSA9PiB7XG4gIGNvbnN0IG1hcmtlcnMgPSB0ZXh0RWRpdG9yLmZpbmRNYXJrZXJzKHtcbiAgICBueWFuSW5kZW50OiB0cnVlLFxuICAgIHN0YXJ0QnVmZmVyUm93OiByYW5nZS5zdGFydC5yb3csXG4gICAgZW5kQnVmZmVyUm93OiByYW5nZS5lbmQucm93LFxuICB9KTtcbiAgbWFya2Vycy5mb3JFYWNoKG1hcmtlciA9PiBtYXJrZXIuZGVzdHJveSgpKTtcbn07XG5cbmNvbnN0IHBhaW50TXVsdGlwbGVMaW5lcyA9ICh0ZXh0RWRpdG9yLCB7XG4gIHRhYkxlbmd0aCxcbiAgZnJvbUxpbmUsXG4gIHRvTGluZSxcbiAgLi4ucHJlZmVyZW5jZXNcbn0pID0+IHtcbiAgZm9yIChsZXQgbGluZSA9IGZyb21MaW5lOyBsaW5lIDw9IHRvTGluZTsgbGluZSArPSAxKSB7XG4gICAgcGFpbnRUZXh0RWRpdG9yTGluZSh0ZXh0RWRpdG9yLCB7IHRhYkxlbmd0aCwgbGluZSwgLi4ucHJlZmVyZW5jZXMgfSk7XG4gIH1cbn07XG5cbi8qKlxuICogQ2FsbGVkIHdoZW4gdXNlciBtb2RpZmllcyB0ZXh0LiBDbGVhbnMgcHJldmlvdXMgbWFya2VycyBhbmQgcmVwYWludHNcbiAqIG9uIHRvcCBvZiBjaGFuZ2VzLlxuICogQHBhcmFtICB7T2JqZWN0fSB0ZXh0RWRpdG9yXG4gKiBAcGFyYW0gIHtBcnJheX0gY2hhbmdlc1xuICovXG5leHBvcnQgY29uc3QgdGV4dERpZENoYW5nZSA9ICh0ZXh0RWRpdG9yLCBwcmVmZXJlbmNlcywgY2hhbmdlcykgPT4ge1xuICBjb25zdCB0YWJMZW5ndGggPSB0ZXh0RWRpdG9yLmdldFRhYkxlbmd0aCgpO1xuICByZXR1cm4gbWFwKGNoYW5nZXMuY2hhbmdlcywgKGNoYW5nZSkgPT4ge1xuICAgIC8vIENsZWFucyBwcmV2aW91cyBtYXJrZXJzIGJlZm9yZSBhZGRpbmcgbmV3IG9uZXMuXG4gICAgcmVtb3ZlTWFya2Vyc0Zyb21SYW5nZSh0ZXh0RWRpdG9yLCBjaGFuZ2UubmV3UmFuZ2UpO1xuXG4gICAgY29uc3QgZnJvbUxpbmUgPSBjaGFuZ2UubmV3UmFuZ2Uuc3RhcnQucm93O1xuICAgIGNvbnN0IHRvTGluZSA9IGNoYW5nZS5uZXdSYW5nZS5lbmQucm93O1xuXG4gICAgaWYgKGZyb21MaW5lID09PSB0b0xpbmUpIHtcbiAgICAgIHJldHVybiBwYWludFRleHRFZGl0b3JMaW5lKHRleHRFZGl0b3IsIHtcbiAgICAgICAgdGFiTGVuZ3RoLFxuICAgICAgICBsaW5lOiBmcm9tTGluZSxcbiAgICAgICAgLi4ucHJlZmVyZW5jZXMsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGVzIGNoYW5nZXMgaW4gZGlmZmVyZW50IGxpbmVzLlxuICAgIHJldHVybiBwYWludE11bHRpcGxlTGluZXModGV4dEVkaXRvciwge1xuICAgICAgdGFiTGVuZ3RoLFxuICAgICAgZnJvbUxpbmUsXG4gICAgICB0b0xpbmUsXG4gICAgICAuLi5wcmVmZXJlbmNlcyxcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcGFpbnQgPSAodGV4dEVkaXRvciwgcHJlZmVyZW5jZXMpID0+IHtcbiAgY29uc3QgdGFiTGVuZ3RoID0gdGV4dEVkaXRvci5nZXRUYWJMZW5ndGgoKTtcbiAgY29uc3QgbnVtYmVyT2ZMaW5lcyA9IHRleHRFZGl0b3IuZ2V0TGluZUNvdW50KCk7XG5cbiAgLy8gQ2hlY2sgYWxsIHRoZSBleGlzdGluZyBsaW5lcyBmb3IgdGV4dCBFZGl0b3JcbiAgcmVhZFRleHRFZGl0b3JMaW5lcyh0ZXh0RWRpdG9yLCB7IHRhYkxlbmd0aCwgbnVtYmVyT2ZMaW5lcywgLi4ucHJlZmVyZW5jZXMgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgY2xlYW4gPSAodGV4dEVkaXRvcikgPT4ge1xuICBjb25zdCBtYXJrZXJzID0gdGV4dEVkaXRvci5maW5kTWFya2Vycyh7XG4gICAgbnlhbkluZGVudDogdHJ1ZSxcbiAgfSk7XG4gIG1hcChtYXJrZXJzLCBtYXJrZXIgPT4gbWFya2VyLmRlc3Ryb3koKSk7XG59O1xuIl19