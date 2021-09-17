function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

/* eslint-disable import/extensions, import/no-extraneous-dependencies */

var _atom = require('atom');

/* eslint-enable import/extensions, import/no-extraneous-dependencies */

// Dependencies
'use babel';

var helpers = undefined;
var atomlinter = undefined;
var Reporter = undefined;

function loadDeps() {
  if (!helpers) {
    helpers = require('./helpers');
  }
  if (!atomlinter) {
    atomlinter = require('atom-linter');
  }
  if (!Reporter) {
    Reporter = require('jshint-json');
  }
}

module.exports = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterJSHintDeps = function installLinterJSHintDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-jshint');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterJSHintDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.scopes = [];

    this.subscriptions = new _atom.CompositeDisposable();
    var scopeEmbedded = 'source.js.embedded.html';

    this.subscriptions.add(atom.config.observe('linter-jshint.executablePath', function (value) {
      if (value === '') {
        _this.executablePath = _path2['default'].join(__dirname, '..', 'node_modules', 'jshint', 'bin', 'jshint');
      } else {
        _this.executablePath = value;
      }
    }), atom.config.observe('linter-jshint.disableWhenNoJshintrcFileInPath', function (value) {
      _this.disableWhenNoJshintrcFileInPath = value;
    }), atom.config.observe('linter-jshint.jshintFileName', function (value) {
      _this.jshintFileName = value;
    }), atom.config.observe('linter-jshint.jshintignoreFilename', function (value) {
      _this.jshintignoreFilename = value;
    }), atom.config.observe('linter-jshint.lintInlineJavaScript', function (value) {
      _this.lintInlineJavaScript = value;
      if (value) {
        _this.scopes.push(scopeEmbedded);
      } else if (_this.scopes.indexOf(scopeEmbedded) !== -1) {
        _this.scopes.splice(_this.scopes.indexOf(scopeEmbedded), 1);
      }
    }), atom.config.observe('linter-jshint.scopes', function (value) {
      // NOTE: Subscriptions are created in the order given to add() so this
      // is safe at the end.

      // Remove any old scopes
      _this.scopes.splice(0, _this.scopes.length);
      // Add the current scopes
      Array.prototype.push.apply(_this.scopes, value);
      // Re-check the embedded JS scope
      if (_this.lintInlineJavaScript && _this.scopes.indexOf(scopeEmbedded) !== -1) {
        _this.scopes.push(scopeEmbedded);
      }
    }), atom.commands.add('atom-text-editor', {
      'linter-jshint:debug': _asyncToGenerator(function* () {
        loadDeps();
        var debugString = yield helpers.generateDebugString();
        var notificationOptions = { detail: debugString, dismissable: true };
        atom.notifications.addInfo('linter-jshint:: Debugging information', notificationOptions);
      })
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'JSHint',
      grammarScopes: this.scopes,
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var results = [];
        var filePath = textEditor.getPath();
        var fileDir = _path2['default'].dirname(filePath);
        var fileContents = textEditor.getText();
        loadDeps();
        var parameters = ['--reporter', Reporter, '--filename', filePath];

        var configFile = yield atomlinter.findCachedAsync(fileDir, _this2.jshintFileName);

        if (configFile) {
          if (_this2.jshintFileName !== '.jshintrc') {
            parameters.push('--config', configFile);
          }
        } else if (_this2.disableWhenNoJshintrcFileInPath && !(yield helpers.hasHomeConfig())) {
          return results;
        }

        // JSHint completely ignores .jshintignore files for STDIN on it's own
        // so we must re-implement the functionality
        var ignoreFile = yield atomlinter.findCachedAsync(fileDir, _this2.jshintignoreFilename);
        if (ignoreFile) {
          var isIgnored = yield helpers.isIgnored(filePath, ignoreFile);
          if (isIgnored) {
            return [];
          }
        }

        if (_this2.lintInlineJavaScript && textEditor.getGrammar().scopeName.indexOf('text.html') !== -1) {
          parameters.push('--extract', 'always');
        }
        parameters.push('-');

        var execOpts = {
          stdin: fileContents,
          ignoreExitCode: true,
          cwd: fileDir
        };
        var result = yield atomlinter.execNode(_this2.executablePath, parameters, execOpts);

        if (textEditor.getText() !== fileContents) {
          // File has changed since the lint was triggered, tell Linter not to update
          return null;
        }

        var parsed = undefined;
        try {
          parsed = JSON.parse(result);
        } catch (_) {
          // eslint-disable-next-line no-console
          console.error('[Linter-JSHint]', _, result);
          atom.notifications.addWarning('[Linter-JSHint]', { detail: 'JSHint return an invalid response, check your console for more info' });
          return results;
        }

        Object.keys(parsed.result).forEach(function (entryID) {
          var message = undefined;
          var entry = parsed.result[entryID];

          var error = entry.error;

          var errorType = error.code.substr(0, 1);
          var severity = 'info';
          if (errorType === 'E') {
            severity = 'error';
          } else if (errorType === 'W') {
            severity = 'warning';
          }
          var line = error.line > 0 ? error.line - 1 : 0;
          var character = error.character > 0 ? error.character - 1 : 0;
          try {
            var position = atomlinter.generateRange(textEditor, line, character);
            message = {
              severity: severity,
              excerpt: error.code + ' - ' + error.reason,
              location: {
                file: filePath,
                position: position
              }
            };
          } catch (e) {
            message = helpers.generateInvalidTrace(line, character, filePath, textEditor, error);
          }

          results.push(message);
        });

        // Make sure any invalid traces have resolved
        return Promise.all(results);
      })
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2t1cm9tYXJ1Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2hpbnQvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFJaUIsTUFBTTs7Ozs7O29CQUVhLE1BQU07Ozs7O0FBTjFDLFdBQVcsQ0FBQzs7QUFXWixJQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osSUFBSSxVQUFVLFlBQUEsQ0FBQztBQUNmLElBQUksUUFBUSxZQUFBLENBQUM7O0FBRWIsU0FBUyxRQUFRLEdBQUc7QUFDbEIsTUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLFdBQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDaEM7QUFDRCxNQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsY0FBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztHQUNyQztBQUNELE1BQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixZQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0dBQ25DO0NBQ0Y7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQy9CLFFBQUksY0FBYyxZQUFBLENBQUM7QUFDbkIsUUFBTSx1QkFBdUIsR0FBRyxTQUExQix1QkFBdUIsR0FBUztBQUNwQyxZQUFLLGFBQWEsVUFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdEIsZUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO09BQ3ZEO0FBQ0QsY0FBUSxFQUFFLENBQUM7S0FDWixDQUFDO0FBQ0Ysa0JBQWMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNyRSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FB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QUM7V0FDSCxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsbUJBQU8sR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1dBQ3RGOztBQUVELGlCQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZCLENBQUMsQ0FBQzs7O0FBR0gsZUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQzdCLENBQUE7S0FDRixDQUFDO0dBQ0g7Q0FDRixDQUFDIiwiZmlsZSI6Ii9ob21lL2t1cm9tYXJ1Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2hpbnQvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyogQGZsb3cgKi9cblxuaW1wb3J0IFBhdGggZnJvbSAncGF0aCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJztcbi8qIGVzbGludC1lbmFibGUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuXG4vLyBEZXBlbmRlbmNpZXNcbmxldCBoZWxwZXJzO1xubGV0IGF0b21saW50ZXI7XG5sZXQgUmVwb3J0ZXI7XG5cbmZ1bmN0aW9uIGxvYWREZXBzKCkge1xuICBpZiAoIWhlbHBlcnMpIHtcbiAgICBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJyk7XG4gIH1cbiAgaWYgKCFhdG9tbGludGVyKSB7XG4gICAgYXRvbWxpbnRlciA9IHJlcXVpcmUoJ2F0b20tbGludGVyJyk7XG4gIH1cbiAgaWYgKCFSZXBvcnRlcikge1xuICAgIFJlcG9ydGVyID0gcmVxdWlyZSgnanNoaW50LWpzb24nKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzID0gbmV3IFNldCgpO1xuICAgIGxldCBkZXBzQ2FsbGJhY2tJRDtcbiAgICBjb25zdCBpbnN0YWxsTGludGVySlNIaW50RGVwcyA9ICgpID0+IHtcbiAgICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5kZWxldGUoZGVwc0NhbGxiYWNrSUQpO1xuICAgICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1qc2hpbnQnKTtcbiAgICAgIH1cbiAgICAgIGxvYWREZXBzKCk7XG4gICAgfTtcbiAgICBkZXBzQ2FsbGJhY2tJRCA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKGluc3RhbGxMaW50ZXJKU0hpbnREZXBzKTtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKGRlcHNDYWxsYmFja0lEKTtcblxuICAgIHRoaXMuc2NvcGVzID0gW107XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIGNvbnN0IHNjb3BlRW1iZWRkZWQgPSAnc291cmNlLmpzLmVtYmVkZGVkLmh0bWwnO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2hpbnQuZXhlY3V0YWJsZVBhdGgnLCAodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlID09PSAnJykge1xuICAgICAgICAgIHRoaXMuZXhlY3V0YWJsZVBhdGggPSBQYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2pzaGludCcsICdiaW4nLCAnanNoaW50Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5leGVjdXRhYmxlUGF0aCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2hpbnQuZGlzYWJsZVdoZW5Ob0pzaGludHJjRmlsZUluUGF0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmRpc2FibGVXaGVuTm9Kc2hpbnRyY0ZpbGVJblBhdGggPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzaGludC5qc2hpbnRGaWxlTmFtZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmpzaGludEZpbGVOYW1lID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2hpbnQuanNoaW50aWdub3JlRmlsZW5hbWUnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5qc2hpbnRpZ25vcmVGaWxlbmFtZSA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNoaW50LmxpbnRJbmxpbmVKYXZhU2NyaXB0JywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMubGludElubGluZUphdmFTY3JpcHQgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5zY29wZXMucHVzaChzY29wZUVtYmVkZGVkKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNjb3Blcy5pbmRleE9mKHNjb3BlRW1iZWRkZWQpICE9PSAtMSkge1xuICAgICAgICAgIHRoaXMuc2NvcGVzLnNwbGljZSh0aGlzLnNjb3Blcy5pbmRleE9mKHNjb3BlRW1iZWRkZWQpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNoaW50LnNjb3BlcycsICh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBOT1RFOiBTdWJzY3JpcHRpb25zIGFyZSBjcmVhdGVkIGluIHRoZSBvcmRlciBnaXZlbiB0byBhZGQoKSBzbyB0aGlzXG4gICAgICAgIC8vIGlzIHNhZmUgYXQgdGhlIGVuZC5cblxuICAgICAgICAvLyBSZW1vdmUgYW55IG9sZCBzY29wZXNcbiAgICAgICAgdGhpcy5zY29wZXMuc3BsaWNlKDAsIHRoaXMuc2NvcGVzLmxlbmd0aCk7XG4gICAgICAgIC8vIEFkZCB0aGUgY3VycmVudCBzY29wZXNcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5zY29wZXMsIHZhbHVlKTtcbiAgICAgICAgLy8gUmUtY2hlY2sgdGhlIGVtYmVkZGVkIEpTIHNjb3BlXG4gICAgICAgIGlmICh0aGlzLmxpbnRJbmxpbmVKYXZhU2NyaXB0ICYmIHRoaXMuc2NvcGVzLmluZGV4T2Yoc2NvcGVFbWJlZGRlZCkgIT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5zY29wZXMucHVzaChzY29wZUVtYmVkZGVkKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsIHtcbiAgICAgICAgJ2xpbnRlci1qc2hpbnQ6ZGVidWcnOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbG9hZERlcHMoKTtcbiAgICAgICAgICBjb25zdCBkZWJ1Z1N0cmluZyA9IGF3YWl0IGhlbHBlcnMuZ2VuZXJhdGVEZWJ1Z1N0cmluZygpO1xuICAgICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbk9wdGlvbnMgPSB7IGRldGFpbDogZGVidWdTdHJpbmcsIGRpc21pc3NhYmxlOiB0cnVlIH07XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ2xpbnRlci1qc2hpbnQ6OiBEZWJ1Z2dpbmcgaW5mb3JtYXRpb24nLCBub3RpZmljYXRpb25PcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2tJRCkgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnSlNIaW50JyxcbiAgICAgIGdyYW1tYXJTY29wZXM6IHRoaXMuc2NvcGVzLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRzT25DaGFuZ2U6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcjogVGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGZpbGVEaXIgPSBQYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCBmaWxlQ29udGVudHMgPSB0ZXh0RWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgbG9hZERlcHMoKTtcbiAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IFsnLS1yZXBvcnRlcicsIFJlcG9ydGVyLCAnLS1maWxlbmFtZScsIGZpbGVQYXRoXTtcblxuICAgICAgICBjb25zdCBjb25maWdGaWxlID0gYXdhaXQgYXRvbWxpbnRlci5maW5kQ2FjaGVkQXN5bmMoZmlsZURpciwgdGhpcy5qc2hpbnRGaWxlTmFtZSk7XG5cbiAgICAgICAgaWYgKGNvbmZpZ0ZpbGUpIHtcbiAgICAgICAgICBpZiAodGhpcy5qc2hpbnRGaWxlTmFtZSAhPT0gJy5qc2hpbnRyYycpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1jb25maWcnLCBjb25maWdGaWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoICYmICEoYXdhaXQgaGVscGVycy5oYXNIb21lQ29uZmlnKCkpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBKU0hpbnQgY29tcGxldGVseSBpZ25vcmVzIC5qc2hpbnRpZ25vcmUgZmlsZXMgZm9yIFNURElOIG9uIGl0J3Mgb3duXG4gICAgICAgIC8vIHNvIHdlIG11c3QgcmUtaW1wbGVtZW50IHRoZSBmdW5jdGlvbmFsaXR5XG4gICAgICAgIGNvbnN0IGlnbm9yZUZpbGUgPSBhd2FpdCBhdG9tbGludGVyLmZpbmRDYWNoZWRBc3luYyhmaWxlRGlyLCB0aGlzLmpzaGludGlnbm9yZUZpbGVuYW1lKTtcbiAgICAgICAgaWYgKGlnbm9yZUZpbGUpIHtcbiAgICAgICAgICBjb25zdCBpc0lnbm9yZWQgPSBhd2FpdCBoZWxwZXJzLmlzSWdub3JlZChmaWxlUGF0aCwgaWdub3JlRmlsZSk7XG4gICAgICAgICAgaWYgKGlzSWdub3JlZCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxpbnRJbmxpbmVKYXZhU2NyaXB0XG4gICAgICAgICAgJiYgdGV4dEVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lLmluZGV4T2YoJ3RleHQuaHRtbCcpICE9PSAtMVxuICAgICAgICApIHtcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tZXh0cmFjdCcsICdhbHdheXMnKTtcbiAgICAgICAgfVxuICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0nKTtcblxuICAgICAgICBjb25zdCBleGVjT3B0cyA9IHtcbiAgICAgICAgICBzdGRpbjogZmlsZUNvbnRlbnRzLFxuICAgICAgICAgIGlnbm9yZUV4aXRDb2RlOiB0cnVlLFxuICAgICAgICAgIGN3ZDogZmlsZURpcixcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgYXRvbWxpbnRlci5leGVjTm9kZSh0aGlzLmV4ZWN1dGFibGVQYXRoLCBwYXJhbWV0ZXJzLCBleGVjT3B0cyk7XG5cbiAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0VGV4dCgpICE9PSBmaWxlQ29udGVudHMpIHtcbiAgICAgICAgICAvLyBGaWxlIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsaW50IHdhcyB0cmlnZ2VyZWQsIHRlbGwgTGludGVyIG5vdCB0byB1cGRhdGVcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJzZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdbTGludGVyLUpTSGludF0nLCBfLCByZXN1bHQpO1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICAgICAgJ1tMaW50ZXItSlNIaW50XScsXG4gICAgICAgICAgICB7IGRldGFpbDogJ0pTSGludCByZXR1cm4gYW4gaW52YWxpZCByZXNwb25zZSwgY2hlY2sgeW91ciBjb25zb2xlIGZvciBtb3JlIGluZm8nIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5rZXlzKHBhcnNlZC5yZXN1bHQpLmZvckVhY2goKGVudHJ5SUQpID0+IHtcbiAgICAgICAgICBsZXQgbWVzc2FnZTtcbiAgICAgICAgICBjb25zdCBlbnRyeSA9IHBhcnNlZC5yZXN1bHRbZW50cnlJRF07XG5cbiAgICAgICAgICBjb25zdCB7IGVycm9yIH0gPSBlbnRyeTtcbiAgICAgICAgICBjb25zdCBlcnJvclR5cGUgPSBlcnJvci5jb2RlLnN1YnN0cigwLCAxKTtcbiAgICAgICAgICBsZXQgc2V2ZXJpdHkgPSAnaW5mbyc7XG4gICAgICAgICAgaWYgKGVycm9yVHlwZSA9PT0gJ0UnKSB7XG4gICAgICAgICAgICBzZXZlcml0eSA9ICdlcnJvcic7XG4gICAgICAgICAgfSBlbHNlIGlmIChlcnJvclR5cGUgPT09ICdXJykge1xuICAgICAgICAgICAgc2V2ZXJpdHkgPSAnd2FybmluZyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGxpbmUgPSBlcnJvci5saW5lID4gMCA/IGVycm9yLmxpbmUgLSAxIDogMDtcbiAgICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSBlcnJvci5jaGFyYWN0ZXIgPiAwID8gZXJyb3IuY2hhcmFjdGVyIC0gMSA6IDA7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gYXRvbWxpbnRlci5nZW5lcmF0ZVJhbmdlKHRleHRFZGl0b3IsIGxpbmUsIGNoYXJhY3Rlcik7XG4gICAgICAgICAgICBtZXNzYWdlID0ge1xuICAgICAgICAgICAgICBzZXZlcml0eSxcbiAgICAgICAgICAgICAgZXhjZXJwdDogYCR7ZXJyb3IuY29kZX0gLSAke2Vycm9yLnJlYXNvbn1gLFxuICAgICAgICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBtZXNzYWdlID0gaGVscGVycy5nZW5lcmF0ZUludmFsaWRUcmFjZShsaW5lLCBjaGFyYWN0ZXIsIGZpbGVQYXRoLCB0ZXh0RWRpdG9yLCBlcnJvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBNYWtlIHN1cmUgYW55IGludmFsaWQgdHJhY2VzIGhhdmUgcmVzb2x2ZWRcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdHMpO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==