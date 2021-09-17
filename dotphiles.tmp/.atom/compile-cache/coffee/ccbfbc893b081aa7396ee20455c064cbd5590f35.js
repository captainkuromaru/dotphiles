(function() {
  var CompositeDisposable, NyancatScroll, NyancatScrollView;

  NyancatScrollView = require('./nyancat-scroll-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = NyancatScroll = {
    NyancatScrollView: null,
    modalPanel: null,
    subscriptions: null,
    activate: function(state) {
      this.view = new NyancatScrollView();
      this.subs = new CompositeDisposable;
      return this.subs.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function() {
          _this.unsubLastActive();
          _this.subActive();
          return _this.update();
        };
      })(this)));
    },
    deactivate: function() {
      this.unsubLastActive();
      this.subs.dispose();
      this.view.destroy();
      return this.statusBar = null;
    },
    consumeStatusBar: function(statusBar) {
      var priority;
      this.statusBar = statusBar;
      priority = 500;
      return this.view.mount(this.statusBar, priority);
    },
    subActive: function() {
      var editor, editorElement;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      editorElement = editor.getElement();
      this.editor_subs = new CompositeDisposable;
      this.editor_subs.add(editorElement.onDidChangeScrollTop((function(_this) {
        return function(top) {
          return _this.update();
        };
      })(this)));
      return this.update();
    },
    unsubLastActive: function() {
      if (this.editor_subs != null) {
        this.editor_subs.dispose();
      }
      return this.editor_subs = null;
    },
    update: function() {
      var editor, lastScreenLine, lastVisibleRow, percent;
      editor = atom.workspace.getActiveTextEditor();
      this.view.clear();
      if (editor != null) {
        lastVisibleRow = editor.getFirstVisibleScreenRow();
        lastScreenLine = editor.getLineCount() - editor.rowsPerPage;
        if (lastScreenLine >= 0) {
          percent = lastVisibleRow / parseFloat(lastScreenLine);
        } else {
          percent = 1;
        }
      } else {
        percent = 1;
      }
      return this.view.updateScroll(percent);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3Vyb21hcnUvLmF0b20vcGFja2FnZXMvbnlhbmNhdC1zY3JvbGwvbGliL255YW5jYXQtc2Nyb2xsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSOztFQUNuQixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBQUEsR0FDZjtJQUFBLGlCQUFBLEVBQW1CLElBQW5CO0lBQ0EsVUFBQSxFQUFZLElBRFo7SUFFQSxhQUFBLEVBQWUsSUFGZjtJQUlBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksaUJBQUosQ0FBQTtNQUNSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSTthQUVaLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBcUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQzdDLEtBQUMsQ0FBQSxlQUFELENBQUE7VUFDQSxLQUFDLENBQUEsU0FBRCxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxNQUFELENBQUE7UUFINkM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDLENBQVY7SUFKUSxDQUpWO0lBYUEsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsZUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7TUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFKSCxDQWJaO0lBbUJBLGdCQUFBLEVBQWtCLFNBQUMsU0FBRDtBQUNoQixVQUFBO01BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYTtNQUNiLFFBQUEsR0FBVzthQUNYLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLElBQUMsQ0FBQSxTQUFiLEVBQXdCLFFBQXhCO0lBSGdCLENBbkJsQjtJQXdCQSxTQUFBLEVBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsSUFBTyxjQUFQO0FBQ0UsZUFERjs7TUFFQSxhQUFBLEdBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQUE7TUFDaEIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixhQUFhLENBQUMsb0JBQWQsQ0FBbUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7aUJBQ2xELEtBQUMsQ0FBQSxNQUFELENBQUE7UUFEa0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLENBQWpCO2FBRUEsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQVJTLENBeEJYO0lBa0NBLGVBQUEsRUFBaUIsU0FBQTtNQUNmLElBQUcsd0JBQUg7UUFDRSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxFQURGOzthQUVBLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFIQSxDQWxDakI7SUF1Q0EsTUFBQSxFQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFBO01BQ0EsSUFBRyxjQUFIO1FBQ0UsY0FBQSxHQUFpQixNQUFNLENBQUMsd0JBQVAsQ0FBQTtRQUNqQixjQUFBLEdBQWlCLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBQSxHQUF3QixNQUFNLENBQUM7UUFDaEQsSUFBRyxjQUFBLElBQWtCLENBQXJCO1VBQ0UsT0FBQSxHQUFVLGNBQUEsR0FBZSxVQUFBLENBQVcsY0FBWCxFQUQzQjtTQUFBLE1BQUE7VUFHRSxPQUFBLEdBQVUsRUFIWjtTQUhGO09BQUEsTUFBQTtRQVFFLE9BQUEsR0FBVSxFQVJaOzthQVNBLElBQUMsQ0FBQSxJQUFJLENBQUMsWUFBTixDQUFtQixPQUFuQjtJQVpNLENBdkNSOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiTnlhbmNhdFNjcm9sbFZpZXcgPSByZXF1aXJlICcuL255YW5jYXQtc2Nyb2xsLXZpZXcnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IE55YW5jYXRTY3JvbGwgPVxuICBOeWFuY2F0U2Nyb2xsVmlldzogbnVsbFxuICBtb2RhbFBhbmVsOiBudWxsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEB2aWV3ID0gbmV3IE55YW5jYXRTY3JvbGxWaWV3KClcbiAgICBAc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vicy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtID0+XG4gICAgICBAdW5zdWJMYXN0QWN0aXZlKClcbiAgICAgIEBzdWJBY3RpdmUoKVxuICAgICAgQHVwZGF0ZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAdW5zdWJMYXN0QWN0aXZlKClcbiAgICBAc3Vicy5kaXNwb3NlKClcbiAgICBAdmlldy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyID0gbnVsbFxuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChzdGF0dXNCYXIpIC0+XG4gICAgQHN0YXR1c0JhciA9IHN0YXR1c0JhclxuICAgIHByaW9yaXR5ID0gNTAwXG4gICAgQHZpZXcubW91bnQoQHN0YXR1c0JhciwgcHJpb3JpdHkpXG5cbiAgc3ViQWN0aXZlOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIG5vdCBlZGl0b3I/XG4gICAgICByZXR1cm5cbiAgICBlZGl0b3JFbGVtZW50ID0gZWRpdG9yLmdldEVsZW1lbnQoKVxuICAgIEBlZGl0b3Jfc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGVkaXRvcl9zdWJzLmFkZCBlZGl0b3JFbGVtZW50Lm9uRGlkQ2hhbmdlU2Nyb2xsVG9wICh0b3ApID0+XG4gICAgICBAdXBkYXRlKClcbiAgICBAdXBkYXRlKCkgIyB1cGRhdGUgb25jZSByZWdhcmRsZXNcblxuICB1bnN1Ykxhc3RBY3RpdmU6IC0+XG4gICAgaWYgQGVkaXRvcl9zdWJzP1xuICAgICAgQGVkaXRvcl9zdWJzLmRpc3Bvc2UoKVxuICAgIEBlZGl0b3Jfc3VicyA9IG51bGxcblxuICB1cGRhdGU6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQHZpZXcuY2xlYXIoKVxuICAgIGlmIGVkaXRvcj9cbiAgICAgIGxhc3RWaXNpYmxlUm93ID0gZWRpdG9yLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpXG4gICAgICBsYXN0U2NyZWVuTGluZSA9IGVkaXRvci5nZXRMaW5lQ291bnQoKSAtIGVkaXRvci5yb3dzUGVyUGFnZVxuICAgICAgaWYgbGFzdFNjcmVlbkxpbmUgPj0gMFxuICAgICAgICBwZXJjZW50ID0gbGFzdFZpc2libGVSb3cvcGFyc2VGbG9hdChsYXN0U2NyZWVuTGluZSlcbiAgICAgIGVsc2VcbiAgICAgICAgcGVyY2VudCA9IDFcbiAgICBlbHNlXG4gICAgICBwZXJjZW50ID0gMVxuICAgIEB2aWV3LnVwZGF0ZVNjcm9sbChwZXJjZW50KVxuIl19
