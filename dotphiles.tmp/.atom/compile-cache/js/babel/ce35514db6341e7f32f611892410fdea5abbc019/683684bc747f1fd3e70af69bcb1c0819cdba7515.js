'use babel';
/* global atom */

var _require = require('process-communication');

var forkFile = _require.forkFile;

var path = require('path');
var findRoot = require('find-root');
var communication = forkFile(require.resolve('./worker'));

var prettierStandardFormatter = {
  format: function format(source) {
    return communication.request('format', { source: source });
  }
};

module.exports = {
  style: null,
  fileTypes: ['.js', '.jsx'],
  fileSupported: function fileSupported(file) {
    // Ensure file is a supported file type.
    var ext = path.extname(file);
    return !! ~this.fileTypes.indexOf(ext);
  },
  activate: function activate() {
    this.commands = atom.commands.add('atom-workspace', 'prettier-standard-formatter:format', (function () {
      this.format();
    }).bind(this));

    this.editorObserver = atom.workspace.observeTextEditors(this.handleEvents.bind(this));
  },
  deactivate: function deactivate() {
    this.commands.dispose();
    this.editorObserver.dispose();
  },
  format: function format(options) {
    if (options === undefined) {
      options = {};
    }
    var selection = typeof options.selection === 'undefined' ? true : !!options.selection;
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      // Return if the current active item is not a `TextEditor`
      return;
    }
    var selectedText = selection ? editor.getSelectedText() : null;
    var text = selectedText || editor.getText();
    var cursorPosition = editor.getCursorScreenPosition();

    return prettierStandardFormatter.format(text).then(function (transformed) {
      if (selectedText) {
        editor.setTextInBufferRange(editor.getSelectedBufferRange(), transformed);
      } else {
        editor.setText(transformed);
      }
      editor.setCursorScreenPosition(cursorPosition);
    })['catch'](function (e) {
      console.log('Error transforming using prettier:', e);
    });
  },
  handleEvents: function handleEvents(editor) {
    editor.getBuffer().onWillSave((function () {
      var path = editor.getPath();
      if (!path) {
        return;
      }

      if (!editor.getBuffer().isModified()) {
        return;
      }

      var formatOnSave = atom.config.get('prettier-standard-formatter.formatOnSave', { scope: editor.getRootScopeDescriptor() });
      if (!formatOnSave) {
        return;
      }

      // Set the relative path based on the file's nearest package.json.
      // If no package.json is found, use path verbatim.
      var relativePath;
      try {
        var projectPath = findRoot(path);
        relativePath = path.replace(projectPath, '').substring(1);
      } catch (e) {
        relativePath = path;
      }

      if (this.fileSupported(relativePath)) {
        this.format({ selection: false });
      }
    }).bind(this));
  },
  config: { formatOnSave: { type: 'boolean', 'default': false } }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2t1cm9tYXJ1Ly5hdG9tL3BhY2thZ2VzL3ByZXR0aWVyLXN0YW5kYXJkLWZvcm1hdHRlci9saWIvcHJldHRpZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7ZUFHVSxPQUFPLENBQUMsdUJBQXVCLENBQUM7O0lBQTdDLFFBQVEsWUFBUixRQUFROztBQUVoQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDMUIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ25DLElBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7O0FBRXpELElBQUkseUJBQXlCLEdBQUc7QUFDOUIsUUFBTSxFQUFFLGdCQUFBLE1BQU0sRUFBSTtBQUNoQixXQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDLENBQUE7R0FDbkQ7Q0FDRixDQUFBOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixPQUFLLEVBQUUsSUFBSTtBQUNYLFdBQVMsRUFBRSxDQUFFLEtBQUssRUFBRSxNQUFNLENBQUU7QUFDNUIsZUFBYSxFQUFFLHVCQUFVLElBQUksRUFBRTs7QUFFN0IsUUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUM1QixXQUFPLENBQUMsRUFBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0dBQ3RDO0FBQ0QsVUFBUSxFQUFFLG9CQUFZO0FBQ3BCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQy9CLGdCQUFnQixFQUNoQixvQ0FBb0MsRUFDcEMsQ0FBQSxZQUFZO0FBQ1YsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0tB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LFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO09BQ2xDO0tBQ0YsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDYixDQUFBO0dBQ0Y7QUFDRCxRQUFNLEVBQUUsRUFBRSxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFdBQVMsS0FBSyxFQUFFLEVBQUU7Q0FDOUQsQ0FBQSIsImZpbGUiOiIvaG9tZS9rdXJvbWFydS8uYXRvbS9wYWNrYWdlcy9wcmV0dGllci1zdGFuZGFyZC1mb3JtYXR0ZXIvbGliL3ByZXR0aWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8qIGdsb2JhbCBhdG9tICovXG5cbmNvbnN0IHsgZm9ya0ZpbGUgfSA9IHJlcXVpcmUoJ3Byb2Nlc3MtY29tbXVuaWNhdGlvbicpXG5cbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZmluZFJvb3QgPSByZXF1aXJlKCdmaW5kLXJvb3QnKVxudmFyIGNvbW11bmljYXRpb24gPSBmb3JrRmlsZShyZXF1aXJlLnJlc29sdmUoJy4vd29ya2VyJykpXG5cbnZhciBwcmV0dGllclN0YW5kYXJkRm9ybWF0dGVyID0ge1xuICBmb3JtYXQ6IHNvdXJjZSA9PiB7XG4gICAgcmV0dXJuIGNvbW11bmljYXRpb24ucmVxdWVzdCgnZm9ybWF0JywgeyBzb3VyY2UgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3R5bGU6IG51bGwsXG4gIGZpbGVUeXBlczogWyAnLmpzJywgJy5qc3gnIF0sXG4gIGZpbGVTdXBwb3J0ZWQ6IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgLy8gRW5zdXJlIGZpbGUgaXMgYSBzdXBwb3J0ZWQgZmlsZSB0eXBlLlxuICAgIHZhciBleHQgPSBwYXRoLmV4dG5hbWUoZmlsZSlcbiAgICByZXR1cm4gISF+dGhpcy5maWxlVHlwZXMuaW5kZXhPZihleHQpXG4gIH0sXG4gIGFjdGl2YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb21tYW5kcyA9IGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdwcmV0dGllci1zdGFuZGFyZC1mb3JtYXR0ZXI6Zm9ybWF0JyxcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5mb3JtYXQoKVxuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKVxuXG4gICAgdGhpcy5lZGl0b3JPYnNlcnZlciA9IGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhcbiAgICAgIHRoaXMuaGFuZGxlRXZlbnRzLmJpbmQodGhpcylcbiAgICApXG4gIH0sXG4gIGRlYWN0aXZhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbW1hbmRzLmRpc3Bvc2UoKVxuICAgIHRoaXMuZWRpdG9yT2JzZXJ2ZXIuZGlzcG9zZSgpXG4gIH0sXG4gIGZvcm1hdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbiA9IHR5cGVvZiBvcHRpb25zLnNlbGVjdGlvbiA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gdHJ1ZVxuICAgICAgOiAhIW9wdGlvbnMuc2VsZWN0aW9uXG4gICAgdmFyIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSB7XG4gICAgICAvLyBSZXR1cm4gaWYgdGhlIGN1cnJlbnQgYWN0aXZlIGl0ZW0gaXMgbm90IGEgYFRleHRFZGl0b3JgXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIHNlbGVjdGVkVGV4dCA9IHNlbGVjdGlvbiA/IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSA6IG51bGxcbiAgICB2YXIgdGV4dCA9IHNlbGVjdGVkVGV4dCB8fCBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgdmFyIGN1cnNvclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvclNjcmVlblBvc2l0aW9uKClcblxuICAgIHJldHVybiBwcmV0dGllclN0YW5kYXJkRm9ybWF0dGVyXG4gICAgICAuZm9ybWF0KHRleHQpXG4gICAgICAudGhlbih0cmFuc2Zvcm1lZCA9PiB7XG4gICAgICAgIGlmIChzZWxlY3RlZFRleHQpIHtcbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoXG4gICAgICAgICAgICBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpLFxuICAgICAgICAgICAgdHJhbnNmb3JtZWRcbiAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWRpdG9yLnNldFRleHQodHJhbnNmb3JtZWQpXG4gICAgICAgIH1cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKGN1cnNvclBvc2l0aW9uKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHRyYW5zZm9ybWluZyB1c2luZyBwcmV0dGllcjonLCBlKVxuICAgICAgfSlcbiAgfSxcbiAgaGFuZGxlRXZlbnRzOiBmdW5jdGlvbiAoZWRpdG9yKSB7XG4gICAgZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBpZiAoIXBhdGgpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZWRpdG9yLmdldEJ1ZmZlcigpLmlzTW9kaWZpZWQoKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZvcm1hdE9uU2F2ZSA9IGF0b20uY29uZmlnLmdldChcbiAgICAgICAgICAncHJldHRpZXItc3RhbmRhcmQtZm9ybWF0dGVyLmZvcm1hdE9uU2F2ZScsXG4gICAgICAgICAgeyBzY29wZTogZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKSB9XG4gICAgICAgIClcbiAgICAgICAgaWYgKCFmb3JtYXRPblNhdmUpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCB0aGUgcmVsYXRpdmUgcGF0aCBiYXNlZCBvbiB0aGUgZmlsZSdzIG5lYXJlc3QgcGFja2FnZS5qc29uLlxuICAgICAgICAvLyBJZiBubyBwYWNrYWdlLmpzb24gaXMgZm91bmQsIHVzZSBwYXRoIHZlcmJhdGltLlxuICAgICAgICB2YXIgcmVsYXRpdmVQYXRoXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHByb2plY3RQYXRoID0gZmluZFJvb3QocGF0aClcbiAgICAgICAgICByZWxhdGl2ZVBhdGggPSBwYXRoLnJlcGxhY2UocHJvamVjdFBhdGgsICcnKS5zdWJzdHJpbmcoMSlcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJlbGF0aXZlUGF0aCA9IHBhdGhcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmZpbGVTdXBwb3J0ZWQocmVsYXRpdmVQYXRoKSkge1xuICAgICAgICAgIHRoaXMuZm9ybWF0KHsgc2VsZWN0aW9uOiBmYWxzZSB9KVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApXG4gIH0sXG4gIGNvbmZpZzogeyBmb3JtYXRPblNhdmU6IHsgdHlwZTogJ2Jvb2xlYW4nLCBkZWZhdWx0OiBmYWxzZSB9IH1cbn1cbiJdfQ==