(function() {
  var AtomNyancat, AtomNyancatView, CompositeDisposable;

  AtomNyancatView = require('./atom-nyancat-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = AtomNyancat = {
    atomNyancatView: null,
    modalPanel: null,
    subscriptions: null,
    activate: function(state) {
      console.log("nyancat enabled");
      this.view = new AtomNyancatView();
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
      var editor, lastScreenLine, lastVisibleRow, percent, precent;
      editor = atom.workspace.getActiveTextEditor();
      this.view.clear();
      if (editor != null) {
        lastVisibleRow = editor.firstVisibleScreenRow;
        lastScreenLine = editor.getLineCount() - editor.rowsPerPage;
        percent = lastVisibleRow / parseFloat(lastScreenLine);
      } else {
        precent = 1;
      }
      return this.view.updateScroll(percent);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3Vyb21hcnUvLmF0b20vcGFja2FnZXMvbnlhbmNhdC9saWIvYXRvbS1ueWFuY2F0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVI7O0VBQ2pCLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsV0FBQSxHQUNmO0lBQUEsZUFBQSxFQUFpQixJQUFqQjtJQUNBLFVBQUEsRUFBWSxJQURaO0lBRUEsYUFBQSxFQUFlLElBRmY7SUFJQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQkFBWjtNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxlQUFKLENBQUE7TUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUk7YUFFWixJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFmLENBQXFDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUM3QyxLQUFDLENBQUEsZUFBRCxDQUFBO1VBQ0EsS0FBQyxDQUFBLFNBQUQsQ0FBQTtpQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFBO1FBSDZDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQyxDQUFWO0lBTlEsQ0FKVjtJQWVBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLGVBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhO0lBSkgsQ0FmWjtJQXFCQSxnQkFBQSxFQUFrQixTQUFDLFNBQUQ7QUFDaEIsVUFBQTtNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixRQUFBLEdBQVc7YUFDWCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFDLENBQUEsU0FBYixFQUF3QixRQUF4QjtJQUhnQixDQXJCbEI7SUEwQkEsU0FBQSxFQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULElBQU8sY0FBUDtBQUNFLGVBREY7O01BRUEsYUFBQSxHQUFnQixNQUFNLENBQUMsVUFBUCxDQUFBO01BQ2hCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsYUFBYSxDQUFDLG9CQUFkLENBQW1DLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO2lCQUNsRCxLQUFDLENBQUEsTUFBRCxDQUFBO1FBRGtEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxDQUFqQjthQUVBLElBQUMsQ0FBQSxNQUFELENBQUE7SUFSUyxDQTFCWDtJQW9DQSxlQUFBLEVBQWlCLFNBQUE7TUFDZixJQUFHLHdCQUFIO1FBQ0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFERjs7YUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlO0lBSEEsQ0FwQ2pCO0lBeUNBLE1BQUEsRUFBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBQTtNQUNBLElBQUcsY0FBSDtRQUNFLGNBQUEsR0FBaUIsTUFBTSxDQUFDO1FBQ3hCLGNBQUEsR0FBaUIsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFBLEdBQXdCLE1BQU0sQ0FBQztRQUNoRCxPQUFBLEdBQVUsY0FBQSxHQUFlLFVBQUEsQ0FBVyxjQUFYLEVBSDNCO09BQUEsTUFBQTtRQUtFLE9BQUEsR0FBVSxFQUxaOzthQU1BLElBQUMsQ0FBQSxJQUFJLENBQUMsWUFBTixDQUFtQixPQUFuQjtJQVRNLENBekNSOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiQXRvbU55YW5jYXRWaWV3ID0gcmVxdWlyZSAnLi9hdG9tLW55YW5jYXQtdmlldydcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID0gQXRvbU55YW5jYXQgPVxuICBhdG9tTnlhbmNhdFZpZXc6IG51bGxcbiAgbW9kYWxQYW5lbDogbnVsbFxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBjb25zb2xlLmxvZyBcIm55YW5jYXQgZW5hYmxlZFwiXG5cbiAgICBAdmlldyA9IG5ldyBBdG9tTnlhbmNhdFZpZXcoKVxuICAgIEBzdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0gPT5cbiAgICAgIEB1bnN1Ykxhc3RBY3RpdmUoKVxuICAgICAgQHN1YkFjdGl2ZSgpXG4gICAgICBAdXBkYXRlKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEB1bnN1Ykxhc3RBY3RpdmUoKVxuICAgIEBzdWJzLmRpc3Bvc2UoKVxuICAgIEB2aWV3LmRlc3Ryb3koKVxuICAgIEBzdGF0dXNCYXIgPSBudWxsXG5cbiAgY29uc3VtZVN0YXR1c0JhcjogKHN0YXR1c0JhcikgLT5cbiAgICBAc3RhdHVzQmFyID0gc3RhdHVzQmFyXG4gICAgcHJpb3JpdHkgPSA1MDBcbiAgICBAdmlldy5tb3VudChAc3RhdHVzQmFyLCBwcmlvcml0eSlcblxuICBzdWJBY3RpdmU6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgbm90IGVkaXRvcj9cbiAgICAgIHJldHVyblxuICAgIGVkaXRvckVsZW1lbnQgPSBlZGl0b3IuZ2V0RWxlbWVudCgpXG4gICAgQGVkaXRvcl9zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAZWRpdG9yX3N1YnMuYWRkIGVkaXRvckVsZW1lbnQub25EaWRDaGFuZ2VTY3JvbGxUb3AgKHRvcCkgPT5cbiAgICAgIEB1cGRhdGUoKVxuICAgIEB1cGRhdGUoKSAjIHVwZGF0ZSBvbmNlIHJlZ2FyZGxlc1xuXG4gIHVuc3ViTGFzdEFjdGl2ZTogLT5cbiAgICBpZiBAZWRpdG9yX3N1YnM/XG4gICAgICBAZWRpdG9yX3N1YnMuZGlzcG9zZSgpXG4gICAgQGVkaXRvcl9zdWJzID0gbnVsbFxuXG4gIHVwZGF0ZTogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAdmlldy5jbGVhcigpXG4gICAgaWYgZWRpdG9yP1xuICAgICAgbGFzdFZpc2libGVSb3cgPSBlZGl0b3IuZmlyc3RWaXNpYmxlU2NyZWVuUm93XG4gICAgICBsYXN0U2NyZWVuTGluZSA9IGVkaXRvci5nZXRMaW5lQ291bnQoKSAtIGVkaXRvci5yb3dzUGVyUGFnZVxuICAgICAgcGVyY2VudCA9IGxhc3RWaXNpYmxlUm93L3BhcnNlRmxvYXQobGFzdFNjcmVlbkxpbmUpXG4gICAgZWxzZVxuICAgICAgcHJlY2VudCA9IDFcbiAgICBAdmlldy51cGRhdGVTY3JvbGwocGVyY2VudClcbiJdfQ==
