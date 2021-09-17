Object.defineProperty(exports, '__esModule', {
  value: true
});

var getJSHintVersion = _asyncToGenerator(function* (config) {
  var execPath = config.executablePath !== '' ? config.executablePath : _path2['default'].join(__dirname, '..', 'node_modules', 'jshint', 'bin', 'jshint');

  if (debugCache.has(execPath)) {
    return debugCache.get(execPath);
  }

  // NOTE: Yes, `jshint --version` gets output on STDERR...
  var jshintVersion = yield atomlinter.execNode(execPath, ['--version'], { stream: 'stderr' });
  debugCache.set(execPath, jshintVersion);
  return jshintVersion;
});

var getDebugInfo = _asyncToGenerator(function* () {
  var linterJSHintVersion = getPackageMeta().version;
  var config = atom.config.get('linter-jshint');
  var jshintVersion = yield getJSHintVersion(config);
  var hoursSinceRestart = Math.round(process.uptime() / 3600 * 10) / 10;
  var editorScopes = getEditorScopes();

  return {
    atomVersion: atom.getVersion(),
    linterJSHintVersion: linterJSHintVersion,
    linterJSHintConfig: config,
    jshintVersion: jshintVersion,
    hoursSinceRestart: hoursSinceRestart,
    platform: process.platform,
    editorScopes: editorScopes
  };
});

exports.getDebugInfo = getDebugInfo;

var generateDebugString = _asyncToGenerator(function* () {
  var debug = yield getDebugInfo();
  var details = ['Atom version: ' + debug.atomVersion, 'linter-jshint version: v' + debug.linterJSHintVersion, 'JSHint version: ' + debug.jshintVersion, 'Hours since last Atom restart: ' + debug.hoursSinceRestart, 'Platform: ' + debug.platform, 'Current file\'s scopes: ' + JSON.stringify(debug.editorScopes, null, 2), 'linter-jshint configuration: ' + JSON.stringify(debug.linterJSHintConfig, null, 2)];
  return details.join('\n');
}

/**
 * Finds the oldest open issue of the same title in this project's repository.
 * Results are cached for 1 hour.
 * @param  {string} issueTitle The issue title to search for
 * @return {string|null}       The URL of the found issue or null if none is found.
 */
);

exports.generateDebugString = generateDebugString;

var findSimilarIssue = _asyncToGenerator(function* (issueTitle) {
  if (debugCache.has(issueTitle)) {
    var oldResult = debugCache.get(issueTitle);
    if (new Date().valueOf() < oldResult.expires) {
      return oldResult.url;
    }
    debugCache['delete'](issueTitle);
  }

  var oneHour = 1000 * 60 * 60; // ms * s * m
  var tenMinutes = 1000 * 60 * 10; // ms * s * m
  var repoUrl = getPackageMeta().repository.url;
  var repo = repoUrl.replace(/https?:\/\/(\d+\.)?github\.com\//gi, '');
  var query = encodeURIComponent('repo:' + repo + ' is:open in:title ' + issueTitle);
  var githubHeaders = new Headers({
    accept: 'application/vnd.github.v3+json',
    contentType: 'application/json'
  });
  var queryUrl = 'https://api.github.com/search/issues?q=' + query + '&sort=created&order=asc';

  var url = null;
  try {
    var rawResponse = yield fetch(queryUrl, { headers: githubHeaders });
    if (!rawResponse.ok) {
      // Querying GitHub API failed, don't try again for 10 minutes.
      debugCache.set(issueTitle, {
        expires: new Date().valueOf() + tenMinutes,
        url: url
      });
      return null;
    }
    var data = yield rawResponse.json();
    if ((data !== null ? data.items : null) !== null) {
      if (Array.isArray(data.items) && data.items.length > 0) {
        var issue = data.items[0];
        if (issue.title.includes(issueTitle)) {
          url = repoUrl + '/issues/' + issue.number;
        }
      }
    }
  } catch (e) {
    // Do nothing
  }
  debugCache.set(issueTitle, {
    expires: new Date().valueOf() + oneHour,
    url: url
  });
  return url;
});

var generateInvalidTrace = _asyncToGenerator(function* (msgLine, msgCol, file, textEditor, error) {
  var errMsgRange = msgLine + 1 + ':' + msgCol;
  var rangeText = 'Requested point: ' + errMsgRange;
  var packageRepoUrl = getPackageMeta().repository.url;
  var issueURL = packageRepoUrl + '/issues/new';
  var titleText = 'Invalid position given by \'' + error.code + '\'';
  var invalidMessage = {
    severity: 'error',
    description: 'Original message: ' + error.code + ' - ' + error.reason + '  \n' + rangeText + '.',
    location: {
      file: file,
      position: atomlinter.generateRange(textEditor)
    }
  };
  var similarIssueUrl = yield findSimilarIssue(titleText);
  if (similarIssueUrl !== null) {
    invalidMessage.excerpt = titleText + '. This has already been reported, see message link!';
    invalidMessage.url = similarIssueUrl;
    return invalidMessage;
  }

  var title = encodeURIComponent(titleText);
  var body = encodeURIComponent(['JSHint returned a point that did not exist in the document being edited.', 'Rule: `' + error.code + '`', rangeText, '', '', '<!-- If at all possible, please include code to reproduce this issue! -->', '', '', 'Debug information:', '```', yield generateDebugString(), '```'].join('\n'));
  var newIssueURL = issueURL + '?title=' + title + '&body=' + body;
  invalidMessage.excerpt = titleText + '. Please report this using the message link!';
  invalidMessage.url = newIssueURL;
  return invalidMessage;
});

exports.generateInvalidTrace = generateInvalidTrace;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _shelljs = require('shelljs');

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _atomLinter = require('atom-linter');

var atomlinter = _interopRequireWildcard(_atomLinter);

var _fs = require('fs');

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies
'use babel';

var homeConfigPath = undefined;
var debugCache = new Map();

var readFile = _asyncToGenerator(function* (filePath) {
  return new Promise(function (resolve, reject) {
    (0, _fs.readFile)(filePath, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
});

var isIgnored = _asyncToGenerator(function* (filePath, ignorePath) {
  var fileDir = _path2['default'].dirname(filePath);
  var rawIgnoreList = (yield readFile(ignorePath)).split(/[\r\n]/);

  // "Fix" the patterns in the same way JSHint does
  var ignoreList = rawIgnoreList.filter(function (line) {
    return !!line.trim();
  }).map(function (pattern) {
    if (pattern.startsWith('!')) {
      return '!' + _path2['default'].resolve(fileDir, pattern.substr(1).trim());
    }
    return _path2['default'].join(fileDir, pattern.trim());
  });

  // Check the modified patterns
  // NOTE: This is what JSHint actually does, not what the documentation says
  return ignoreList.some(function (pattern) {
    // Check the modified pattern against the path using minimatch
    if ((0, _minimatch2['default'])(filePath, pattern, { nocase: true })) {
      return true;
    }

    // Check if a pattern matches filePath exactly
    if (_path2['default'].resolve(filePath) === pattern) {
      return true;
    }

    // Check using `test -d` for directory exclusions
    if ((0, _shelljs.test)('-d', filePath) && pattern.match(/^[^/\\]*[/\\]?$/) && filePath.match(new RegExp('^' + pattern + '.*'))) {
      return true;
    }

    return false;
  });
});

exports.isIgnored = isIgnored;
var fileExists = _asyncToGenerator(function* (checkPath) {
  return new Promise(function (resolve) {
    (0, _fs.access)(checkPath, function (err) {
      if (err) {
        resolve(false);
      }
      resolve(true);
    });
  });
});

var hasHomeConfig = _asyncToGenerator(function* () {
  if (!homeConfigPath) {
    homeConfigPath = _path2['default'].join((0, _os.homedir)(), '.jshintrc');
  }
  return fileExists(homeConfigPath);
});

exports.hasHomeConfig = hasHomeConfig;
function getPackageMeta() {
  // NOTE: This is using a non-public property of the Package object
  // The alternative to this would basically mean re-implementing the parsing
  // that Atom is already doing anyway, and as this is unlikely to change this
  // is likely safe to use.
  return atom.packages.getLoadedPackage('linter-jshint').metadata;
}

function getEditorScopes() {
  var textEditor = atom.workspace.getActiveTextEditor();
  var editorScopes = undefined;
  if (atom.workspace.isTextEditor(textEditor)) {
    editorScopes = textEditor.getLastCursor().getScopeDescriptor().getScopesArray();
  } else {
    // Somehow this can be called with no active TextEditor, impossible I know...
    editorScopes = ['unknown'];
  }
  return editorScopes;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2t1cm9tYXJ1Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2hpbnQvbGliL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQXFGZSxnQkFBZ0IscUJBQS9CLFdBQWdDLE1BQU0sRUFBRTtBQUN0QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsY0FBYyxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUMsY0FBYyxHQUNqRSxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFMUUsTUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzVCLFdBQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNqQzs7O0FBR0QsTUFBTSxhQUFhLEdBQUcsTUFBTSxVQUFVLENBQUMsUUFBUSxDQUM3QyxRQUFRLEVBQ1IsQ0FBQyxXQUFXLENBQUMsRUFDYixFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FDckIsQ0FBQztBQUNGLFlBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3hDLFNBQU8sYUFBYSxDQUFDO0NBQ3RCOztJQWNxQixZQUFZLHFCQUEzQixhQUE4QjtBQUNuQyxNQUFNLG1CQUFtQixHQUFHLGNBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUNyRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoRCxNQUFNLGFBQWEsR0FBRyxNQUFNLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxBQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFFLE1B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QUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUN4RCxNQUFJLFlBQTJCLFlBQUEsQ0FBQztBQUNoQyxNQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQzNDLGdCQUFZLEdBQUcsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDakYsTUFBTTs7QUFFTCxnQkFBWSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDNUI7QUFDRCxTQUFPLFlBQVksQ0FBQztDQUNyQiIsImZpbGUiOiIvaG9tZS9rdXJvbWFydS8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNoaW50L2xpYi9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgaG9tZWRpciB9IGZyb20gJ29zJztcbmltcG9ydCB7IHRlc3QgYXMgc2hqc1Rlc3QgfSBmcm9tICdzaGVsbGpzJztcbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCAqIGFzIGF0b21saW50ZXIgZnJvbSAnYXRvbS1saW50ZXInO1xuaW1wb3J0IHsgcmVhZEZpbGUgYXMgZnNSZWFkRmlsZSwgYWNjZXNzIH0gZnJvbSAnZnMnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9leHRlbnNpb25zLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nO1xuXG5sZXQgaG9tZUNvbmZpZ1BhdGg7XG5jb25zdCBkZWJ1Z0NhY2hlID0gbmV3IE1hcCgpO1xuXG5jb25zdCByZWFkRmlsZSA9IGFzeW5jIChmaWxlUGF0aCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICBmc1JlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcsIChlcnIsIGRhdGEpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9XG4gICAgcmVzb2x2ZShkYXRhKTtcbiAgfSk7XG59KTtcblxuZXhwb3J0IGNvbnN0IGlzSWdub3JlZCA9IGFzeW5jIChmaWxlUGF0aCwgaWdub3JlUGF0aCkgPT4ge1xuICBjb25zdCBmaWxlRGlyID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgY29uc3QgcmF3SWdub3JlTGlzdCA9IChhd2FpdCByZWFkRmlsZShpZ25vcmVQYXRoKSkuc3BsaXQoL1tcXHJcXG5dLyk7XG5cbiAgLy8gXCJGaXhcIiB0aGUgcGF0dGVybnMgaW4gdGhlIHNhbWUgd2F5IEpTSGludCBkb2VzXG4gIGNvbnN0IGlnbm9yZUxpc3QgPSByYXdJZ25vcmVMaXN0LmZpbHRlcigobGluZSkgPT4gISFsaW5lLnRyaW0oKSkubWFwKChwYXR0ZXJuKSA9PiB7XG4gICAgaWYgKHBhdHRlcm4uc3RhcnRzV2l0aCgnIScpKSB7XG4gICAgICByZXR1cm4gYCEke3BhdGgucmVzb2x2ZShmaWxlRGlyLCBwYXR0ZXJuLnN1YnN0cigxKS50cmltKCkpfWA7XG4gICAgfVxuICAgIHJldHVybiBwYXRoLmpvaW4oZmlsZURpciwgcGF0dGVybi50cmltKCkpO1xuICB9KTtcblxuICAvLyBDaGVjayB0aGUgbW9kaWZpZWQgcGF0dGVybnNcbiAgLy8gTk9URTogVGhpcyBpcyB3aGF0IEpTSGludCBhY3R1YWxseSBkb2VzLCBub3Qgd2hhdCB0aGUgZG9jdW1lbnRhdGlvbiBzYXlzXG4gIHJldHVybiBpZ25vcmVMaXN0LnNvbWUoKHBhdHRlcm4pID0+IHtcbiAgICAvLyBDaGVjayB0aGUgbW9kaWZpZWQgcGF0dGVybiBhZ2FpbnN0IHRoZSBwYXRoIHVzaW5nIG1pbmltYXRjaFxuICAgIGlmIChtaW5pbWF0Y2goZmlsZVBhdGgsIHBhdHRlcm4sIHsgbm9jYXNlOiB0cnVlIH0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBhIHBhdHRlcm4gbWF0Y2hlcyBmaWxlUGF0aCBleGFjdGx5XG4gICAgaWYgKHBhdGgucmVzb2x2ZShmaWxlUGF0aCkgPT09IHBhdHRlcm4pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIENoZWNrIHVzaW5nIGB0ZXN0IC1kYCBmb3IgZGlyZWN0b3J5IGV4Y2x1c2lvbnNcbiAgICBpZiAoXG4gICAgICBzaGpzVGVzdCgnLWQnLCBmaWxlUGF0aClcbiAgICAgICYmIHBhdHRlcm4ubWF0Y2goL15bXi9cXFxcXSpbL1xcXFxdPyQvKVxuICAgICAgJiYgZmlsZVBhdGgubWF0Y2gobmV3IFJlZ0V4cChgXiR7cGF0dGVybn0uKmApKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbn07XG5cbmNvbnN0IGZpbGVFeGlzdHMgPSBhc3luYyAoY2hlY2tQYXRoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICBhY2Nlc3MoY2hlY2tQYXRoLCAoZXJyKSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgfVxuICAgIHJlc29sdmUodHJ1ZSk7XG4gIH0pO1xufSk7XG5cbmV4cG9ydCBjb25zdCBoYXNIb21lQ29uZmlnID0gYXN5bmMgKCkgPT4ge1xuICBpZiAoIWhvbWVDb25maWdQYXRoKSB7XG4gICAgaG9tZUNvbmZpZ1BhdGggPSBwYXRoLmpvaW4oaG9tZWRpcigpLCAnLmpzaGludHJjJyk7XG4gIH1cbiAgcmV0dXJuIGZpbGVFeGlzdHMoaG9tZUNvbmZpZ1BhdGgpO1xufTtcblxuZnVuY3Rpb24gZ2V0UGFja2FnZU1ldGEoKSB7XG4gIC8vIE5PVEU6IFRoaXMgaXMgdXNpbmcgYSBub24tcHVibGljIHByb3BlcnR5IG9mIHRoZSBQYWNrYWdlIG9iamVjdFxuICAvLyBUaGUgYWx0ZXJuYXRpdmUgdG8gdGhpcyB3b3VsZCBiYXNpY2FsbHkgbWVhbiByZS1pbXBsZW1lbnRpbmcgdGhlIHBhcnNpbmdcbiAgLy8gdGhhdCBBdG9tIGlzIGFscmVhZHkgZG9pbmcgYW55d2F5LCBhbmQgYXMgdGhpcyBpcyB1bmxpa2VseSB0byBjaGFuZ2UgdGhpc1xuICAvLyBpcyBsaWtlbHkgc2FmZSB0byB1c2UuXG4gIHJldHVybiBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ2xpbnRlci1qc2hpbnQnKS5tZXRhZGF0YTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0SlNIaW50VmVyc2lvbihjb25maWcpIHtcbiAgY29uc3QgZXhlY1BhdGggPSBjb25maWcuZXhlY3V0YWJsZVBhdGggIT09ICcnID8gY29uZmlnLmV4ZWN1dGFibGVQYXRoXG4gICAgOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2pzaGludCcsICdiaW4nLCAnanNoaW50Jyk7XG5cbiAgaWYgKGRlYnVnQ2FjaGUuaGFzKGV4ZWNQYXRoKSkge1xuICAgIHJldHVybiBkZWJ1Z0NhY2hlLmdldChleGVjUGF0aCk7XG4gIH1cblxuICAvLyBOT1RFOiBZZXMsIGBqc2hpbnQgLS12ZXJzaW9uYCBnZXRzIG91dHB1dCBvbiBTVERFUlIuLi5cbiAgY29uc3QganNoaW50VmVyc2lvbiA9IGF3YWl0IGF0b21saW50ZXIuZXhlY05vZGUoXG4gICAgZXhlY1BhdGgsXG4gICAgWyctLXZlcnNpb24nXSxcbiAgICB7IHN0cmVhbTogJ3N0ZGVycicgfSxcbiAgKTtcbiAgZGVidWdDYWNoZS5zZXQoZXhlY1BhdGgsIGpzaGludFZlcnNpb24pO1xuICByZXR1cm4ganNoaW50VmVyc2lvbjtcbn1cblxuZnVuY3Rpb24gZ2V0RWRpdG9yU2NvcGVzKCkge1xuICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICBsZXQgZWRpdG9yU2NvcGVzOiBBcnJheTxzdHJpbmc+O1xuICBpZiAoYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKHRleHRFZGl0b3IpKSB7XG4gICAgZWRpdG9yU2NvcGVzID0gdGV4dEVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0U2NvcGVEZXNjcmlwdG9yKCkuZ2V0U2NvcGVzQXJyYXkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBTb21laG93IHRoaXMgY2FuIGJlIGNhbGxlZCB3aXRoIG5vIGFjdGl2ZSBUZXh0RWRpdG9yLCBpbXBvc3NpYmxlIEkga25vdy4uLlxuICAgIGVkaXRvclNjb3BlcyA9IFsndW5rbm93biddO1xuICB9XG4gIHJldHVybiBlZGl0b3JTY29wZXM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREZWJ1Z0luZm8oKSB7XG4gIGNvbnN0IGxpbnRlckpTSGludFZlcnNpb24gPSBnZXRQYWNrYWdlTWV0YSgpLnZlcnNpb247XG4gIGNvbnN0IGNvbmZpZyA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzaGludCcpO1xuICBjb25zdCBqc2hpbnRWZXJzaW9uID0gYXdhaXQgZ2V0SlNIaW50VmVyc2lvbihjb25maWcpO1xuICBjb25zdCBob3Vyc1NpbmNlUmVzdGFydCA9IE1hdGgucm91bmQoKHByb2Nlc3MudXB0aW1lKCkgLyAzNjAwKSAqIDEwKSAvIDEwO1xuICBjb25zdCBlZGl0b3JTY29wZXMgPSBnZXRFZGl0b3JTY29wZXMoKTtcblxuICByZXR1cm4ge1xuICAgIGF0b21WZXJzaW9uOiBhdG9tLmdldFZlcnNpb24oKSxcbiAgICBsaW50ZXJKU0hpbnRWZXJzaW9uLFxuICAgIGxpbnRlckpTSGludENvbmZpZzogY29uZmlnLFxuICAgIGpzaGludFZlcnNpb24sXG4gICAgaG91cnNTaW5jZVJlc3RhcnQsXG4gICAgcGxhdGZvcm06IHByb2Nlc3MucGxhdGZvcm0sXG4gICAgZWRpdG9yU2NvcGVzLFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVEZWJ1Z1N0cmluZygpIHtcbiAgY29uc3QgZGVidWcgPSBhd2FpdCBnZXREZWJ1Z0luZm8oKTtcbiAgY29uc3QgZGV0YWlscyA9IFtcbiAgICBgQXRvbSB2ZXJzaW9uOiAke2RlYnVnLmF0b21WZXJzaW9ufWAsXG4gICAgYGxpbnRlci1qc2hpbnQgdmVyc2lvbjogdiR7ZGVidWcubGludGVySlNIaW50VmVyc2lvbn1gLFxuICAgIGBKU0hpbnQgdmVyc2lvbjogJHtkZWJ1Zy5qc2hpbnRWZXJzaW9ufWAsXG4gICAgYEhvdXJzIHNpbmNlIGxhc3QgQXRvbSByZXN0YXJ0OiAke2RlYnVnLmhvdXJzU2luY2VSZXN0YXJ0fWAsXG4gICAgYFBsYXRmb3JtOiAke2RlYnVnLnBsYXRmb3JtfWAsXG4gICAgYEN1cnJlbnQgZmlsZSdzIHNjb3BlczogJHtKU09OLnN0cmluZ2lmeShkZWJ1Zy5lZGl0b3JTY29wZXMsIG51bGwsIDIpfWAsXG4gICAgYGxpbnRlci1qc2hpbnQgY29uZmlndXJhdGlvbjogJHtKU09OLnN0cmluZ2lmeShkZWJ1Zy5saW50ZXJKU0hpbnRDb25maWcsIG51bGwsIDIpfWAsXG4gIF07XG4gIHJldHVybiBkZXRhaWxzLmpvaW4oJ1xcbicpO1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBvbGRlc3Qgb3BlbiBpc3N1ZSBvZiB0aGUgc2FtZSB0aXRsZSBpbiB0aGlzIHByb2plY3QncyByZXBvc2l0b3J5LlxuICogUmVzdWx0cyBhcmUgY2FjaGVkIGZvciAxIGhvdXIuXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGlzc3VlVGl0bGUgVGhlIGlzc3VlIHRpdGxlIHRvIHNlYXJjaCBmb3JcbiAqIEByZXR1cm4ge3N0cmluZ3xudWxsfSAgICAgICBUaGUgVVJMIG9mIHRoZSBmb3VuZCBpc3N1ZSBvciBudWxsIGlmIG5vbmUgaXMgZm91bmQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGZpbmRTaW1pbGFySXNzdWUoaXNzdWVUaXRsZSkge1xuICBpZiAoZGVidWdDYWNoZS5oYXMoaXNzdWVUaXRsZSkpIHtcbiAgICBjb25zdCBvbGRSZXN1bHQgPSBkZWJ1Z0NhY2hlLmdldChpc3N1ZVRpdGxlKTtcbiAgICBpZiAoKG5ldyBEYXRlKCkudmFsdWVPZigpKSA8IG9sZFJlc3VsdC5leHBpcmVzKSB7XG4gICAgICByZXR1cm4gb2xkUmVzdWx0LnVybDtcbiAgICB9XG4gICAgZGVidWdDYWNoZS5kZWxldGUoaXNzdWVUaXRsZSk7XG4gIH1cblxuICBjb25zdCBvbmVIb3VyID0gMTAwMCAqIDYwICogNjA7IC8vIG1zICogcyAqIG1cbiAgY29uc3QgdGVuTWludXRlcyA9IDEwMDAgKiA2MCAqIDEwOyAvLyBtcyAqIHMgKiBtXG4gIGNvbnN0IHJlcG9VcmwgPSBnZXRQYWNrYWdlTWV0YSgpLnJlcG9zaXRvcnkudXJsO1xuICBjb25zdCByZXBvID0gcmVwb1VybC5yZXBsYWNlKC9odHRwcz86XFwvXFwvKFxcZCtcXC4pP2dpdGh1YlxcLmNvbVxcLy9naSwgJycpO1xuICBjb25zdCBxdWVyeSA9IGVuY29kZVVSSUNvbXBvbmVudChgcmVwbzoke3JlcG99IGlzOm9wZW4gaW46dGl0bGUgJHtpc3N1ZVRpdGxlfWApO1xuICBjb25zdCBnaXRodWJIZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgIGFjY2VwdDogJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIudjMranNvbicsXG4gICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgfSk7XG4gIGNvbnN0IHF1ZXJ5VXJsID0gYGh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vc2VhcmNoL2lzc3Vlcz9xPSR7cXVlcnl9JnNvcnQ9Y3JlYXRlZCZvcmRlcj1hc2NgO1xuXG4gIGxldCB1cmwgPSBudWxsO1xuICB0cnkge1xuICAgIGNvbnN0IHJhd1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2gocXVlcnlVcmwsIHsgaGVhZGVyczogZ2l0aHViSGVhZGVycyB9KTtcbiAgICBpZiAoIXJhd1Jlc3BvbnNlLm9rKSB7XG4gICAgICAvLyBRdWVyeWluZyBHaXRIdWIgQVBJIGZhaWxlZCwgZG9uJ3QgdHJ5IGFnYWluIGZvciAxMCBtaW51dGVzLlxuICAgICAgZGVidWdDYWNoZS5zZXQoaXNzdWVUaXRsZSwge1xuICAgICAgICBleHBpcmVzOiAobmV3IERhdGUoKS52YWx1ZU9mKCkpICsgdGVuTWludXRlcyxcbiAgICAgICAgdXJsLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJhd1Jlc3BvbnNlLmpzb24oKTtcbiAgICBpZiAoKGRhdGEgIT09IG51bGwgPyBkYXRhLml0ZW1zIDogbnVsbCkgIT09IG51bGwpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEuaXRlbXMpICYmIGRhdGEuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBpc3N1ZSA9IGRhdGEuaXRlbXNbMF07XG4gICAgICAgIGlmIChpc3N1ZS50aXRsZS5pbmNsdWRlcyhpc3N1ZVRpdGxlKSkge1xuICAgICAgICAgIHVybCA9IGAke3JlcG9Vcmx9L2lzc3Vlcy8ke2lzc3VlLm51bWJlcn1gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gRG8gbm90aGluZ1xuICB9XG4gIGRlYnVnQ2FjaGUuc2V0KGlzc3VlVGl0bGUsIHtcbiAgICBleHBpcmVzOiAobmV3IERhdGUoKS52YWx1ZU9mKCkpICsgb25lSG91cixcbiAgICB1cmwsXG4gIH0pO1xuICByZXR1cm4gdXJsO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVJbnZhbGlkVHJhY2UoXG4gIG1zZ0xpbmU6IG51bWJlciwgbXNnQ29sOiBudW1iZXIsIGZpbGU6IHN0cmluZywgdGV4dEVkaXRvcjogVGV4dEVkaXRvcixcbiAgZXJyb3I6IE9iamVjdCxcbikge1xuICBjb25zdCBlcnJNc2dSYW5nZSA9IGAke21zZ0xpbmUgKyAxfToke21zZ0NvbH1gO1xuICBjb25zdCByYW5nZVRleHQgPSBgUmVxdWVzdGVkIHBvaW50OiAke2Vyck1zZ1JhbmdlfWA7XG4gIGNvbnN0IHBhY2thZ2VSZXBvVXJsID0gZ2V0UGFja2FnZU1ldGEoKS5yZXBvc2l0b3J5LnVybDtcbiAgY29uc3QgaXNzdWVVUkwgPSBgJHtwYWNrYWdlUmVwb1VybH0vaXNzdWVzL25ld2A7XG4gIGNvbnN0IHRpdGxlVGV4dCA9IGBJbnZhbGlkIHBvc2l0aW9uIGdpdmVuIGJ5ICcke2Vycm9yLmNvZGV9J2A7XG4gIGNvbnN0IGludmFsaWRNZXNzYWdlID0ge1xuICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgIGRlc2NyaXB0aW9uOiBgT3JpZ2luYWwgbWVzc2FnZTogJHtlcnJvci5jb2RlfSAtICR7ZXJyb3IucmVhc29ufSAgXFxuJHtyYW5nZVRleHR9LmAsXG4gICAgbG9jYXRpb246IHtcbiAgICAgIGZpbGUsXG4gICAgICBwb3NpdGlvbjogYXRvbWxpbnRlci5nZW5lcmF0ZVJhbmdlKHRleHRFZGl0b3IpLFxuICAgIH0sXG4gIH07XG4gIGNvbnN0IHNpbWlsYXJJc3N1ZVVybCA9IGF3YWl0IGZpbmRTaW1pbGFySXNzdWUodGl0bGVUZXh0KTtcbiAgaWYgKHNpbWlsYXJJc3N1ZVVybCAhPT0gbnVsbCkge1xuICAgIGludmFsaWRNZXNzYWdlLmV4Y2VycHQgPSBgJHt0aXRsZVRleHR9LiBUaGlzIGhhcyBhbHJlYWR5IGJlZW4gcmVwb3J0ZWQsIHNlZSBtZXNzYWdlIGxpbmshYDtcbiAgICBpbnZhbGlkTWVzc2FnZS51cmwgPSBzaW1pbGFySXNzdWVVcmw7XG4gICAgcmV0dXJuIGludmFsaWRNZXNzYWdlO1xuICB9XG5cbiAgY29uc3QgdGl0bGUgPSBlbmNvZGVVUklDb21wb25lbnQodGl0bGVUZXh0KTtcbiAgY29uc3QgYm9keSA9IGVuY29kZVVSSUNvbXBvbmVudChbXG4gICAgJ0pTSGludCByZXR1cm5lZCBhIHBvaW50IHRoYXQgZGlkIG5vdCBleGlzdCBpbiB0aGUgZG9jdW1lbnQgYmVpbmcgZWRpdGVkLicsXG4gICAgYFJ1bGU6IFxcYCR7ZXJyb3IuY29kZX1cXGBgLFxuICAgIHJhbmdlVGV4dCxcbiAgICAnJywgJycsXG4gICAgJzwhLS0gSWYgYXQgYWxsIHBvc3NpYmxlLCBwbGVhc2UgaW5jbHVkZSBjb2RlIHRvIHJlcHJvZHVjZSB0aGlzIGlzc3VlISAtLT4nLFxuICAgICcnLCAnJyxcbiAgICAnRGVidWcgaW5mb3JtYXRpb246JyxcbiAgICAnYGBgJyxcbiAgICBhd2FpdCBnZW5lcmF0ZURlYnVnU3RyaW5nKCksXG4gICAgJ2BgYCcsXG4gIF0uam9pbignXFxuJykpO1xuICBjb25zdCBuZXdJc3N1ZVVSTCA9IGAke2lzc3VlVVJMfT90aXRsZT0ke3RpdGxlfSZib2R5PSR7Ym9keX1gO1xuICBpbnZhbGlkTWVzc2FnZS5leGNlcnB0ID0gYCR7dGl0bGVUZXh0fS4gUGxlYXNlIHJlcG9ydCB0aGlzIHVzaW5nIHRoZSBtZXNzYWdlIGxpbmshYDtcbiAgaW52YWxpZE1lc3NhZ2UudXJsID0gbmV3SXNzdWVVUkw7XG4gIHJldHVybiBpbnZhbGlkTWVzc2FnZTtcbn1cbiJdfQ==