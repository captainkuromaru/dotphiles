(function() {
  var AtomNyancatView;

  module.exports = AtomNyancatView = (function() {
    function AtomNyancatView(serializedState) {
      this.element = document.createElement('div');
      this.element.classList.add('inline-block', 'atom-nyancat');
    }

    AtomNyancatView.prototype.serialize = function() {};

    AtomNyancatView.prototype.destroy = function() {
      this.unmount();
      return this.element.remove();
    };

    AtomNyancatView.prototype.mount = function(statusBar, priority) {
      return this.statusBarTile = statusBar.addLeftTile({
        item: this.element,
        priority: priority
      });
    };

    AtomNyancatView.prototype.unmount = function() {
      var ref;
      if ((ref = this.statusBarTile) != null) {
        ref.destroy();
      }
      return this.statusbarTile = null;
    };

    AtomNyancatView.prototype.getElement = function() {
      return this.element;
    };

    AtomNyancatView.prototype.clear = function() {
      var results;
      results = [];
      while (this.element.firstChild != null) {
        results.push(this.element.removeChild(this.element.firstChild));
      }
      return results;
    };

    AtomNyancatView.prototype.updateScroll = function(progress) {
      var catArse, catArseSize, catHead, catHeadSize, catSize, catTrail, maxWidth, percentage, trailSize;
      if (progress + .000001 > 1) {
        progress = 1;
      }
      percentage = 100 * parseFloat(progress);
      catHeadSize = 18;
      catArseSize = 9;
      catSize = catArseSize + catHeadSize;
      maxWidth = 200;
      trailSize = (maxWidth - catHeadSize) * progress + catArseSize;
      this.element.style.width = maxWidth + "px";
      catTrail = document.createElement('span');
      catTrail.classList.add('atom-nyancat-trail');
      catTrail.style.width = Math.min(trailSize, maxWidth - catHeadSize) + "px";
      catHead = document.createElement('span');
      catHead.classList.add('atom-nyancat-head');
      catArse = document.createElement('span');
      catArse.classList.add('atom-nyancat-arse');
      catTrail.appendChild(catArse);
      this.element.appendChild(catTrail);
      return this.element.appendChild(catHead);
    };

    return AtomNyancatView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3Vyb21hcnUvLmF0b20vcGFja2FnZXMvbnlhbmNhdC9saWIvYXRvbS1ueWFuY2F0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MseUJBQUMsZUFBRDtNQUVYLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixjQUF2QixFQUF1QyxjQUF2QztJQUhXOzs4QkFNYixTQUFBLEdBQVcsU0FBQSxHQUFBOzs4QkFHWCxPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxPQUFELENBQUE7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQTtJQUZPOzs4QkFJVCxLQUFBLEdBQU8sU0FBQyxTQUFELEVBQVksUUFBWjthQUNMLElBQUMsQ0FBQSxhQUFELEdBQWlCLFNBQVMsQ0FBQyxXQUFWLENBQXNCO1FBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxPQUFQO1FBQWdCLFFBQUEsRUFBVSxRQUExQjtPQUF0QjtJQURaOzs4QkFHUCxPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7O1dBQWMsQ0FBRSxPQUFoQixDQUFBOzthQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCO0lBRlY7OzhCQUlULFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBO0lBRFM7OzhCQUdaLEtBQUEsR0FBTyxTQUFBO0FBQ0wsVUFBQTtBQUFBO2FBQU0sK0JBQU47cUJBQ0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBOUI7TUFERixDQUFBOztJQURLOzs4QkFLUCxZQUFBLEdBQWMsU0FBQyxRQUFEO0FBRVosVUFBQTtNQUFBLElBQUcsUUFBQSxHQUFXLE9BQVgsR0FBcUIsQ0FBeEI7UUFDRSxRQUFBLEdBQVcsRUFEYjs7TUFFQSxVQUFBLEdBQWEsR0FBQSxHQUFNLFVBQUEsQ0FBVyxRQUFYO01BRW5CLFdBQUEsR0FBYztNQUNkLFdBQUEsR0FBYztNQUNkLE9BQUEsR0FBVSxXQUFBLEdBQWM7TUFDeEIsUUFBQSxHQUFXO01BQ1gsU0FBQSxHQUFZLENBQUMsUUFBQSxHQUFXLFdBQVosQ0FBQSxHQUEyQixRQUEzQixHQUFzQztNQUNsRCxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFmLEdBQXVCLFFBQUEsR0FBVztNQUVsQyxRQUFBLEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkI7TUFDWCxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLG9CQUF2QjtNQUNBLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBZixHQUF1QixJQUFJLENBQUMsR0FBTCxDQUFTLFNBQVQsRUFBb0IsUUFBQSxHQUFXLFdBQS9CLENBQUEsR0FBOEM7TUFFckUsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCO01BQ1YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixtQkFBdEI7TUFFQSxPQUFBLEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkI7TUFDVixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQWxCLENBQXNCLG1CQUF0QjtNQUVBLFFBQVEsQ0FBQyxXQUFULENBQXFCLE9BQXJCO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLFFBQXJCO2FBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLE9BQXJCO0lBekJZOzs7OztBQTlCaEIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBBdG9tTnlhbmNhdFZpZXdcbiAgY29uc3RydWN0b3I6IChzZXJpYWxpemVkU3RhdGUpIC0+XG4gICAgIyBDcmVhdGUgcm9vdCBlbGVtZW50XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycsICdhdG9tLW55YW5jYXQnKVxuXG4gICMgUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgc2VyaWFsaXplOiAtPlxuXG4gICMgVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHVubW91bnQoKVxuICAgIEBlbGVtZW50LnJlbW92ZSgpXG5cbiAgbW91bnQ6IChzdGF0dXNCYXIsIHByaW9yaXR5KSAtPlxuICAgIEBzdGF0dXNCYXJUaWxlID0gc3RhdHVzQmFyLmFkZExlZnRUaWxlKGl0ZW06IEBlbGVtZW50LCBwcmlvcml0eTogcHJpb3JpdHkpXG5cbiAgdW5tb3VudDogLT5cbiAgICBAc3RhdHVzQmFyVGlsZT8uZGVzdHJveSgpXG4gICAgQHN0YXR1c2JhclRpbGUgPSBudWxsXG5cbiAgZ2V0RWxlbWVudDogLT5cbiAgICBAZWxlbWVudFxuXG4gIGNsZWFyOiAtPlxuICAgIHdoaWxlIEBlbGVtZW50LmZpcnN0Q2hpbGQ/XG4gICAgICBAZWxlbWVudC5yZW1vdmVDaGlsZChAZWxlbWVudC5maXJzdENoaWxkKVxuXG4gICMgcGVyY2VudGFnZSBzaG91bGQgYmUgbnVtYmVyIGJldHdlZW4gMCBhbmQgMVxuICB1cGRhdGVTY3JvbGw6IChwcm9ncmVzcykgLT5cbiAgICAjIHJvdW5kIHBlcmNlbnRhZ2UgdXBcbiAgICBpZiBwcm9ncmVzcyArIC4wMDAwMDEgPiAxXG4gICAgICBwcm9ncmVzcyA9IDFcbiAgICBwZXJjZW50YWdlID0gMTAwICogcGFyc2VGbG9hdChwcm9ncmVzcylcblxuICAgIGNhdEhlYWRTaXplID0gMThcbiAgICBjYXRBcnNlU2l6ZSA9IDlcbiAgICBjYXRTaXplID0gY2F0QXJzZVNpemUgKyBjYXRIZWFkU2l6ZVxuICAgIG1heFdpZHRoID0gMjAwXG4gICAgdHJhaWxTaXplID0gKG1heFdpZHRoIC0gY2F0SGVhZFNpemUpICogcHJvZ3Jlc3MgKyBjYXRBcnNlU2l6ZVxuICAgIEBlbGVtZW50LnN0eWxlLndpZHRoID0gbWF4V2lkdGggKyBcInB4XCJcblxuICAgIGNhdFRyYWlsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgY2F0VHJhaWwuY2xhc3NMaXN0LmFkZCgnYXRvbS1ueWFuY2F0LXRyYWlsJylcbiAgICBjYXRUcmFpbC5zdHlsZS53aWR0aCA9IE1hdGgubWluKHRyYWlsU2l6ZSwgbWF4V2lkdGggLSBjYXRIZWFkU2l6ZSkgKyBcInB4XCJcblxuICAgIGNhdEhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjYXRIZWFkLmNsYXNzTGlzdC5hZGQoJ2F0b20tbnlhbmNhdC1oZWFkJylcblxuICAgIGNhdEFyc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjYXRBcnNlLmNsYXNzTGlzdC5hZGQoJ2F0b20tbnlhbmNhdC1hcnNlJylcblxuICAgIGNhdFRyYWlsLmFwcGVuZENoaWxkKGNhdEFyc2UpXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2F0VHJhaWwpXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2F0SGVhZClcbiJdfQ==
