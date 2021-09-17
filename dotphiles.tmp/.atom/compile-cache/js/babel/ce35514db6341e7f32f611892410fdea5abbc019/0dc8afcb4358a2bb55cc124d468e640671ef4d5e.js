Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _lodashPartial = require('lodash/partial');

var _lodashPartial2 = _interopRequireDefault(_lodashPartial);

var _nyanIndentRender = require('./nyan-indent-render');

'use babel';

exports['default'] = {

  subscriptions: null,
  isVisible: false,

  config: {
    color: {
      order: 1,
      type: 'string',
      'default': 'nyan',
      'enum': [{ value: 'nyan', description: 'Nyan' }, { value: 'blue', description: 'Blue' }, { value: 'green', description: 'Green' }, { value: 'safari', description: 'Safari' }, { value: 'aquamarine', description: 'Aquamarine' }, { value: 'midnight', description: 'Midnight' }, { value: 'pink', description: 'Pink' }, { value: 'purple', description: 'Purple' }, { value: 'red', description: 'Red' }, { value: 'orange', description: 'Orange' }, { value: 'mustard', description: 'Mustard' }]
    },
    useCustomColors: {
      order: 3,
      type: 'boolean',
      'default': false
    },
    customColors: {
      order: 4,
      type: 'object',
      title: 'Custom Colors',
      properties: {
        0: {
          title: 'First color',
          type: 'color',
          'default': '#ff7f7f'
        },
        1: {
          title: 'Second color',
          type: 'color',
          'default': '#ffe481'
        },
        2: {
          title: 'Third color',
          type: 'color',
          'default': '#d2ff8b'
        },
        3: {
          title: 'Fourth color',
          type: 'color',
          'default': '#a5d1ff'
        },
        4: {
          title: 'Fifth color',
          type: 'color',
          'default': '#e39cff'
        }
      }
    },
    opacity: {
      order: 2,
      type: 'integer',
      minimum: 1,
      maximum: 100,
      'default': 40
    }
  },

  initialize: function initialize() {
    this.startSubscriptions();
    this.subscribeCommands();
  },

  getPreferences: function getPreferences() {
    var chosenColor = atom.config.get('nyan-indent.color');
    var opacity = atom.config.get('nyan-indent.opacity');
    var useCustomColors = atom.config.get('nyan-indent.useCustomColors');
    var customColors = atom.config.get('nyan-indent.customColors');

    return {
      chosenColor: chosenColor,
      opacity: opacity,
      useCustomColors: useCustomColors,
      customColors: customColors
    };
  },

  activate: function activate() {
    this.isVisible = true;

    var preferences = this.getPreferences();
    this.paintAllTextEditors(preferences);

    // Subscribe to changes in text
    this.subscribeToTextChange(preferences);

    // Subscribe to configuration changes
    this.subscribeToConfigurationChange();
  },

  deactivate: function deactivate() {
    this.isVisible = false;

    this.subscriptions.dispose();
    this.cleanAlltextEditors();
  },

  startSubscriptions: function startSubscriptions() {
    this.subscriptions = new _atom.CompositeDisposable();
  },

  subscribeCommands: function subscribeCommands() {
    var _this = this;

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'nyan-indent:toggle': function nyanIndentToggle() {
        return _this.toggle();
      }
    }));
  },

  subscribeToTextChange: function subscribeToTextChange(preferences) {
    var _this2 = this;

    this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
      return _this2.subscriptions.add(textEditor.buffer.onDidChangeText((0, _lodashPartial2['default'])(_nyanIndentRender.textDidChange, textEditor, preferences)));
    }));
  },

  updatePreferences: function updatePreferences(preferences) {
    this.subscriptions.dispose();

    this.startSubscriptions();

    this.cleanAlltextEditors();
    this.paintAllTextEditors(preferences);

    this.subscribeToTextChange(preferences);
    this.subscribeToConfigurationChange();
  },

  subscribeToConfigurationChange: function subscribeToConfigurationChange() {
    var _this3 = this;

    this.subscriptions.add(atom.config.onDidChange('nyan-indent.color', {}, function (event) {
      var preferences = _this3.getPreferences();

      _this3.updatePreferences(_extends({}, preferences, {
        chosenColor: event.newValue
      }));
    }));

    this.subscriptions.add(atom.config.onDidChange('nyan-indent.opacity', {}, function (event) {
      var preferences = _this3.getPreferences();

      _this3.updatePreferences(_extends({}, preferences, {
        opacity: event.newValue
      }));
    }));

    this.subscriptions.add(atom.config.onDidChange('nyan-indent.useCustomColors', {}, function (event) {
      var preferences = _this3.getPreferences();

      _this3.updatePreferences(_extends({}, preferences, {
        useCustomColors: event.newValue
      }));
    }));

    this.subscriptions.add(atom.config.onDidChange('nyan-indent.customColors', {}, function (event) {
      var preferences = _this3.getPreferences();

      _this3.updatePreferences(_extends({}, preferences, {
        customColors: event.newValue
      }));
    }));
  },

  paintAllTextEditors: function paintAllTextEditors(preferences) {
    this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
      return (0, _nyanIndentRender.paint)(textEditor, preferences);
    }));
  },

  cleanTextEditor: function cleanTextEditor(textEditor) {
    (0, _nyanIndentRender.clean)(textEditor);
  },

  cleanAlltextEditors: function cleanAlltextEditors() {
    var _this4 = this;

    atom.workspace.getTextEditors().forEach(function (textEditor) {
      return _this4.cleanTextEditor(textEditor);
    });
  },

  toggle: function toggle() {
    if (!this.isVisible) {
      this.activate();
      return;
    }

    this.deactivate();
    // Resets the subscriptions and rebinds the toggle command
    this.initialize();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2t1cm9tYXJ1Ly5hdG9tL3BhY2thZ2VzL255YW4taW5kZW50L2xpYi9ueWFuLWluZGVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7NkJBQ3RCLGdCQUFnQjs7OztnQ0FDUSxzQkFBc0I7O0FBSmxFLFdBQVcsQ0FBQzs7cUJBTUc7O0FBRWIsZUFBYSxFQUFFLElBQUk7QUFDbkIsV0FBUyxFQUFFLEtBQUs7O0FBRWhCLFFBQU0sRUFBRTtBQUNOLFNBQUssRUFBRTtBQUNMLFdBQUssRUFBRSxDQUFDO0FBQ1IsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxNQUFNO0FBQ2YsY0FBTSxDQUNKLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEVBQ3RDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEVBQ3RDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLEVBQ3hDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEVBQzFDLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLEVBQ2xELEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLEVBQzlDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEVBQ3RDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEVBQzFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLEVBQ3BDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEVBQzFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQzdDO0tBQ0Y7QUFD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QVU7YUFBSSxPQUFLLGVBQWUsQ0FBQyxVQUFVLENBQUM7S0FBQSxDQUMvQyxDQUFDO0dBQ0g7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsUUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbkIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hCLGFBQU87S0FDUjs7QUFFRCxRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNuQjtDQUNGIiwiZmlsZSI6Ii9ob21lL2t1cm9tYXJ1Ly5hdG9tL3BhY2thZ2VzL255YW4taW5kZW50L2xpYi9ueWFuLWluZGVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgcGFydGlhbCBmcm9tICdsb2Rhc2gvcGFydGlhbCc7XG5pbXBvcnQgeyBwYWludCwgY2xlYW4sIHRleHREaWRDaGFuZ2UgfSBmcm9tICcuL255YW4taW5kZW50LXJlbmRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuICBpc1Zpc2libGU6IGZhbHNlLFxuXG4gIGNvbmZpZzoge1xuICAgIGNvbG9yOiB7XG4gICAgICBvcmRlcjogMSxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ255YW4nLFxuICAgICAgZW51bTogW1xuICAgICAgICB7IHZhbHVlOiAnbnlhbicsIGRlc2NyaXB0aW9uOiAnTnlhbicgfSxcbiAgICAgICAgeyB2YWx1ZTogJ2JsdWUnLCBkZXNjcmlwdGlvbjogJ0JsdWUnIH0sXG4gICAgICAgIHsgdmFsdWU6ICdncmVlbicsIGRlc2NyaXB0aW9uOiAnR3JlZW4nIH0sXG4gICAgICAgIHsgdmFsdWU6ICdzYWZhcmknLCBkZXNjcmlwdGlvbjogJ1NhZmFyaScgfSxcbiAgICAgICAgeyB2YWx1ZTogJ2FxdWFtYXJpbmUnLCBkZXNjcmlwdGlvbjogJ0FxdWFtYXJpbmUnIH0sXG4gICAgICAgIHsgdmFsdWU6ICdtaWRuaWdodCcsIGRlc2NyaXB0aW9uOiAnTWlkbmlnaHQnIH0sXG4gICAgICAgIHsgdmFsdWU6ICdwaW5rJywgZGVzY3JpcHRpb246ICdQaW5rJyB9LFxuICAgICAgICB7IHZhbHVlOiAncHVycGxlJywgZGVzY3JpcHRpb246ICdQdXJwbGUnIH0sXG4gICAgICAgIHsgdmFsdWU6ICdyZWQnLCBkZXNjcmlwdGlvbjogJ1JlZCcgfSxcbiAgICAgICAgeyB2YWx1ZTogJ29yYW5nZScsIGRlc2NyaXB0aW9uOiAnT3JhbmdlJyB9LFxuICAgICAgICB7IHZhbHVlOiAnbXVzdGFyZCcsIGRlc2NyaXB0aW9uOiAnTXVzdGFyZCcgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB1c2VDdXN0b21Db2xvcnM6IHtcbiAgICAgIG9yZGVyOiAzLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBjdXN0b21Db2xvcnM6IHtcbiAgICAgIG9yZGVyOiA0LFxuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICB0aXRsZTogJ0N1c3RvbSBDb2xvcnMnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAwOiB7XG4gICAgICAgICAgdGl0bGU6ICdGaXJzdCBjb2xvcicsXG4gICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICBkZWZhdWx0OiAnI2ZmN2Y3ZicsXG4gICAgICAgIH0sXG4gICAgICAgIDE6IHtcbiAgICAgICAgICB0aXRsZTogJ1NlY29uZCBjb2xvcicsXG4gICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICBkZWZhdWx0OiAnI2ZmZTQ4MScsXG4gICAgICAgIH0sXG4gICAgICAgIDI6IHtcbiAgICAgICAgICB0aXRsZTogJ1RoaXJkIGNvbG9yJyxcbiAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIGRlZmF1bHQ6ICcjZDJmZjhiJyxcbiAgICAgICAgfSxcbiAgICAgICAgMzoge1xuICAgICAgICAgIHRpdGxlOiAnRm91cnRoIGNvbG9yJyxcbiAgICAgICAgICB0eXBlOiAnY29sb3InLFxuICAgICAgICAgIGRlZmF1bHQ6ICcjYTVkMWZmJyxcbiAgICAgICAgfSxcbiAgICAgICAgNDoge1xuICAgICAgICAgIHRpdGxlOiAnRmlmdGggY29sb3InLFxuICAgICAgICAgIHR5cGU6ICdjb2xvcicsXG4gICAgICAgICAgZGVmYXVsdDogJyNlMzljZmYnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wYWNpdHk6IHtcbiAgICAgIG9yZGVyOiAyLFxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgbWluaW11bTogMSxcbiAgICAgIG1heGltdW06IDEwMCxcbiAgICAgIGRlZmF1bHQ6IDQwLFxuICAgIH0sXG4gIH0sXG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLnN0YXJ0U3Vic2NyaXB0aW9ucygpO1xuICAgIHRoaXMuc3Vic2NyaWJlQ29tbWFuZHMoKTtcbiAgfSxcblxuICBnZXRQcmVmZXJlbmNlcygpIHtcbiAgICBjb25zdCBjaG9zZW5Db2xvciA9IGF0b20uY29uZmlnLmdldCgnbnlhbi1pbmRlbnQuY29sb3InKTtcbiAgICBjb25zdCBvcGFjaXR5ID0gYXRvbS5jb25maWcuZ2V0KCdueWFuLWluZGVudC5vcGFjaXR5Jyk7XG4gICAgY29uc3QgdXNlQ3VzdG9tQ29sb3JzID0gYXRvbS5jb25maWcuZ2V0KCdueWFuLWluZGVudC51c2VDdXN0b21Db2xvcnMnKTtcbiAgICBjb25zdCBjdXN0b21Db2xvcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ255YW4taW5kZW50LmN1c3RvbUNvbG9ycycpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNob3NlbkNvbG9yLFxuICAgICAgb3BhY2l0eSxcbiAgICAgIHVzZUN1c3RvbUNvbG9ycyxcbiAgICAgIGN1c3RvbUNvbG9ycyxcbiAgICB9O1xuICB9LFxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcblxuICAgIGNvbnN0IHByZWZlcmVuY2VzID0gdGhpcy5nZXRQcmVmZXJlbmNlcygpO1xuICAgIHRoaXMucGFpbnRBbGxUZXh0RWRpdG9ycyhwcmVmZXJlbmNlcyk7XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiB0ZXh0XG4gICAgdGhpcy5zdWJzY3JpYmVUb1RleHRDaGFuZ2UocHJlZmVyZW5jZXMpO1xuXG4gICAgLy8gU3Vic2NyaWJlIHRvIGNvbmZpZ3VyYXRpb24gY2hhbmdlc1xuICAgIHRoaXMuc3Vic2NyaWJlVG9Db25maWd1cmF0aW9uQ2hhbmdlKCk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmNsZWFuQWxsdGV4dEVkaXRvcnMoKTtcbiAgfSxcblxuICBzdGFydFN1YnNjcmlwdGlvbnMoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgfSxcblxuICBzdWJzY3JpYmVDb21tYW5kcygpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdueWFuLWluZGVudDp0b2dnbGUnOiAoKSA9PiB0aGlzLnRvZ2dsZSgpLFxuICAgIH0pKTtcbiAgfSxcblxuICBzdWJzY3JpYmVUb1RleHRDaGFuZ2UocHJlZmVyZW5jZXMpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyh0ZXh0RWRpdG9yID0+XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICB0ZXh0RWRpdG9yLmJ1ZmZlci5vbkRpZENoYW5nZVRleHQocGFydGlhbCh0ZXh0RGlkQ2hhbmdlLCB0ZXh0RWRpdG9yLCBwcmVmZXJlbmNlcykpLFxuICAgICAgKSxcbiAgICApKTtcbiAgfSxcblxuICB1cGRhdGVQcmVmZXJlbmNlcyhwcmVmZXJlbmNlcykge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cbiAgICB0aGlzLnN0YXJ0U3Vic2NyaXB0aW9ucygpO1xuXG4gICAgdGhpcy5jbGVhbkFsbHRleHRFZGl0b3JzKCk7XG4gICAgdGhpcy5wYWludEFsbFRleHRFZGl0b3JzKHByZWZlcmVuY2VzKTtcblxuICAgIHRoaXMuc3Vic2NyaWJlVG9UZXh0Q2hhbmdlKHByZWZlcmVuY2VzKTtcbiAgICB0aGlzLnN1YnNjcmliZVRvQ29uZmlndXJhdGlvbkNoYW5nZSgpO1xuICB9LFxuXG4gIHN1YnNjcmliZVRvQ29uZmlndXJhdGlvbkNoYW5nZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdueWFuLWluZGVudC5jb2xvcicsIHt9LCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHByZWZlcmVuY2VzID0gdGhpcy5nZXRQcmVmZXJlbmNlcygpO1xuXG4gICAgICB0aGlzLnVwZGF0ZVByZWZlcmVuY2VzKHtcbiAgICAgICAgLi4ucHJlZmVyZW5jZXMsXG4gICAgICAgIGNob3NlbkNvbG9yOiBldmVudC5uZXdWYWx1ZSxcbiAgICAgIH0pO1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ255YW4taW5kZW50Lm9wYWNpdHknLCB7fSwgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBwcmVmZXJlbmNlcyA9IHRoaXMuZ2V0UHJlZmVyZW5jZXMoKTtcblxuICAgICAgdGhpcy51cGRhdGVQcmVmZXJlbmNlcyh7XG4gICAgICAgIC4uLnByZWZlcmVuY2VzLFxuICAgICAgICBvcGFjaXR5OiBldmVudC5uZXdWYWx1ZSxcbiAgICAgIH0pO1xuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ255YW4taW5kZW50LnVzZUN1c3RvbUNvbG9ycycsIHt9LCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHByZWZlcmVuY2VzID0gdGhpcy5nZXRQcmVmZXJlbmNlcygpO1xuXG4gICAgICB0aGlzLnVwZGF0ZVByZWZlcmVuY2VzKHtcbiAgICAgICAgLi4ucHJlZmVyZW5jZXMsXG4gICAgICAgIHVzZUN1c3RvbUNvbG9yczogZXZlbnQubmV3VmFsdWUsXG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdueWFuLWluZGVudC5jdXN0b21Db2xvcnMnLCB7fSwgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBwcmVmZXJlbmNlcyA9IHRoaXMuZ2V0UHJlZmVyZW5jZXMoKTtcblxuICAgICAgdGhpcy51cGRhdGVQcmVmZXJlbmNlcyh7XG4gICAgICAgIC4uLnByZWZlcmVuY2VzLFxuICAgICAgICBjdXN0b21Db2xvcnM6IGV2ZW50Lm5ld1ZhbHVlLFxuICAgICAgfSk7XG4gICAgfSkpO1xuICB9LFxuXG4gIHBhaW50QWxsVGV4dEVkaXRvcnMocHJlZmVyZW5jZXMpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhcbiAgICAgIHRleHRFZGl0b3IgPT4gcGFpbnQodGV4dEVkaXRvciwgcHJlZmVyZW5jZXMpLFxuICAgICkpO1xuICB9LFxuXG4gIGNsZWFuVGV4dEVkaXRvcih0ZXh0RWRpdG9yKSB7XG4gICAgY2xlYW4odGV4dEVkaXRvcik7XG4gIH0sXG5cbiAgY2xlYW5BbGx0ZXh0RWRpdG9ycygpIHtcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZvckVhY2goXG4gICAgICB0ZXh0RWRpdG9yID0+IHRoaXMuY2xlYW5UZXh0RWRpdG9yKHRleHRFZGl0b3IpLFxuICAgICk7XG4gIH0sXG5cbiAgdG9nZ2xlKCkge1xuICAgIGlmICghdGhpcy5pc1Zpc2libGUpIHtcbiAgICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAvLyBSZXNldHMgdGhlIHN1YnNjcmlwdGlvbnMgYW5kIHJlYmluZHMgdGhlIHRvZ2dsZSBjb21tYW5kXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH0sXG59O1xuIl19