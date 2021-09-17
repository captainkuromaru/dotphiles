(function() {
  module.exports = {
    activate: function() {
      return atom.workspaceView.command("atom-disapproval:ಠ_ಠ", (function(_this) {
        return function() {
          return _this.insertLookOfDisapproval();
        };
      })(this));
    },
    insertLookOfDisapproval: function() {
      var editor;
      editor = atom.workspace.activePaneItem;
      return editor.insertText('ಠ_ಠ');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3Vyb21hcnUvLmF0b20vcGFja2FnZXMvYXRvbS1kaXNhcHByb3ZhbC9saWIvYXRvbS1kaXNhcHByb3ZhbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUE7YUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHNCQUEzQixFQUNFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsdUJBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURGO0lBRFEsQ0FBVjtJQUlBLHVCQUFBLEVBQXlCLFNBQUE7QUFDdkIsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDO2FBQ3hCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCO0lBRnVCLENBSnpCOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogLT5cbiAgICBhdG9tLndvcmtzcGFjZVZpZXcuY29tbWFuZCBcImF0b20tZGlzYXBwcm92YWw64LKgX+CyoFwiLFxuICAgICAgPT4gQGluc2VydExvb2tPZkRpc2FwcHJvdmFsKClcblxuICBpbnNlcnRMb29rT2ZEaXNhcHByb3ZhbDogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5hY3RpdmVQYW5lSXRlbVxuICAgIGVkaXRvci5pbnNlcnRUZXh0KCfgsqBf4LKgJylcbiJdfQ==
