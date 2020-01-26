(function() {
  var NyancatScrollView;

  module.exports = NyancatScrollView = (function() {
    function NyancatScrollView(serializedState) {
      this.element = document.createElement('div');
      this.element.classList.add('inline-block', 'nyancat-scroll');
    }

    NyancatScrollView.prototype.serialize = function() {};

    NyancatScrollView.prototype.destroy = function() {
      this.unmount();
      return this.element.remove();
    };

    NyancatScrollView.prototype.mount = function(statusBar, priority) {
      return this.statusBarTile = statusBar.addLeftTile({
        item: this.element,
        priority: priority
      });
    };

    NyancatScrollView.prototype.unmount = function() {
      var ref;
      if ((ref = this.statusBarTile) != null) {
        ref.destroy();
      }
      return this.statusbarTile = null;
    };

    NyancatScrollView.prototype.getElement = function() {
      return this.element;
    };

    NyancatScrollView.prototype.clear = function() {
      var results;
      results = [];
      while (this.element.firstChild != null) {
        results.push(this.element.removeChild(this.element.firstChild));
      }
      return results;
    };

    NyancatScrollView.prototype.updateScroll = function(progress) {
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
      catTrail.classList.add('nyancat-scroll-trail');
      catTrail.style.width = Math.min(trailSize, maxWidth - catHeadSize) + "px";
      catHead = document.createElement('span');
      catHead.classList.add('nyancat-scroll-head');
      catArse = document.createElement('span');
      catArse.classList.add('nyancat-scroll-arse');
      catTrail.appendChild(catArse);
      this.element.appendChild(catTrail);
      return this.element.appendChild(catHead);
    };

    return NyancatScrollView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUva3Vyb21hcnUvLmF0b20vcGFja2FnZXMvbnlhbmNhdC1zY3JvbGwvbGliL255YW5jYXQtc2Nyb2xsLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1MsMkJBQUMsZUFBRDtNQUVYLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixjQUF2QixFQUF1QyxnQkFBdkM7SUFIVzs7Z0NBTWIsU0FBQSxHQUFXLFNBQUEsR0FBQTs7Z0NBR1gsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsT0FBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUE7SUFGTzs7Z0NBSVQsS0FBQSxHQUFPLFNBQUMsU0FBRCxFQUFZLFFBQVo7YUFDTCxJQUFDLENBQUEsYUFBRCxHQUFpQixTQUFTLENBQUMsV0FBVixDQUFzQjtRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsT0FBUDtRQUFnQixRQUFBLEVBQVUsUUFBMUI7T0FBdEI7SUFEWjs7Z0NBR1AsT0FBQSxHQUFTLFNBQUE7QUFDUCxVQUFBOztXQUFjLENBQUUsT0FBaEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUZWOztnQ0FJVCxVQUFBLEdBQVksU0FBQTthQUNWLElBQUMsQ0FBQTtJQURTOztnQ0FHWixLQUFBLEdBQU8sU0FBQTtBQUNMLFVBQUE7QUFBQTthQUFNLCtCQUFOO3FCQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixJQUFDLENBQUEsT0FBTyxDQUFDLFVBQTlCO01BREYsQ0FBQTs7SUFESzs7Z0NBS1AsWUFBQSxHQUFjLFNBQUMsUUFBRDtBQUVaLFVBQUE7TUFBQSxJQUFHLFFBQUEsR0FBVyxPQUFYLEdBQXFCLENBQXhCO1FBQ0UsUUFBQSxHQUFXLEVBRGI7O01BRUEsVUFBQSxHQUFhLEdBQUEsR0FBTSxVQUFBLENBQVcsUUFBWDtNQUVuQixXQUFBLEdBQWM7TUFDZCxXQUFBLEdBQWM7TUFDZCxPQUFBLEdBQVUsV0FBQSxHQUFjO01BQ3hCLFFBQUEsR0FBVztNQUNYLFNBQUEsR0FBWSxDQUFDLFFBQUEsR0FBVyxXQUFaLENBQUEsR0FBMkIsUUFBM0IsR0FBc0M7TUFDbEQsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBZixHQUF1QixRQUFBLEdBQVc7TUFFbEMsUUFBQSxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCO01BQ1gsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixzQkFBdkI7TUFDQSxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQWYsR0FBdUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFULEVBQW9CLFFBQUEsR0FBVyxXQUEvQixDQUFBLEdBQThDO01BRXJFLE9BQUEsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QjtNQUNWLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IscUJBQXRCO01BRUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCO01BQ1YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQixDQUFzQixxQkFBdEI7TUFFQSxRQUFRLENBQUMsV0FBVCxDQUFxQixPQUFyQjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixRQUFyQjthQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixPQUFyQjtJQXpCWTs7Ozs7QUE5QmhCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTnlhbmNhdFNjcm9sbFZpZXdcbiAgY29uc3RydWN0b3I6IChzZXJpYWxpemVkU3RhdGUpIC0+XG4gICAgIyBDcmVhdGUgcm9vdCBlbGVtZW50XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycsICdueWFuY2F0LXNjcm9sbCcpXG5cbiAgIyBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNhbiBiZSByZXRyaWV2ZWQgd2hlbiBwYWNrYWdlIGlzIGFjdGl2YXRlZFxuICBzZXJpYWxpemU6IC0+XG5cbiAgIyBUZWFyIGRvd24gYW55IHN0YXRlIGFuZCBkZXRhY2hcbiAgZGVzdHJveTogLT5cbiAgICBAdW5tb3VudCgpXG4gICAgQGVsZW1lbnQucmVtb3ZlKClcblxuICBtb3VudDogKHN0YXR1c0JhciwgcHJpb3JpdHkpIC0+XG4gICAgQHN0YXR1c0JhclRpbGUgPSBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoaXRlbTogQGVsZW1lbnQsIHByaW9yaXR5OiBwcmlvcml0eSlcblxuICB1bm1vdW50OiAtPlxuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzYmFyVGlsZSA9IG51bGxcblxuICBnZXRFbGVtZW50OiAtPlxuICAgIEBlbGVtZW50XG5cbiAgY2xlYXI6IC0+XG4gICAgd2hpbGUgQGVsZW1lbnQuZmlyc3RDaGlsZD9cbiAgICAgIEBlbGVtZW50LnJlbW92ZUNoaWxkKEBlbGVtZW50LmZpcnN0Q2hpbGQpXG5cbiAgIyBwZXJjZW50YWdlIHNob3VsZCBiZSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxXG4gIHVwZGF0ZVNjcm9sbDogKHByb2dyZXNzKSAtPlxuICAgICMgcm91bmQgcGVyY2VudGFnZSB1cFxuICAgIGlmIHByb2dyZXNzICsgLjAwMDAwMSA+IDFcbiAgICAgIHByb2dyZXNzID0gMVxuICAgIHBlcmNlbnRhZ2UgPSAxMDAgKiBwYXJzZUZsb2F0KHByb2dyZXNzKVxuXG4gICAgY2F0SGVhZFNpemUgPSAxOFxuICAgIGNhdEFyc2VTaXplID0gOVxuICAgIGNhdFNpemUgPSBjYXRBcnNlU2l6ZSArIGNhdEhlYWRTaXplXG4gICAgbWF4V2lkdGggPSAyMDBcbiAgICB0cmFpbFNpemUgPSAobWF4V2lkdGggLSBjYXRIZWFkU2l6ZSkgKiBwcm9ncmVzcyArIGNhdEFyc2VTaXplXG4gICAgQGVsZW1lbnQuc3R5bGUud2lkdGggPSBtYXhXaWR0aCArIFwicHhcIlxuXG4gICAgY2F0VHJhaWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjYXRUcmFpbC5jbGFzc0xpc3QuYWRkKCdueWFuY2F0LXNjcm9sbC10cmFpbCcpXG4gICAgY2F0VHJhaWwuc3R5bGUud2lkdGggPSBNYXRoLm1pbih0cmFpbFNpemUsIG1heFdpZHRoIC0gY2F0SGVhZFNpemUpICsgXCJweFwiXG5cbiAgICBjYXRIZWFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgY2F0SGVhZC5jbGFzc0xpc3QuYWRkKCdueWFuY2F0LXNjcm9sbC1oZWFkJylcblxuICAgIGNhdEFyc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjYXRBcnNlLmNsYXNzTGlzdC5hZGQoJ255YW5jYXQtc2Nyb2xsLWFyc2UnKVxuXG4gICAgY2F0VHJhaWwuYXBwZW5kQ2hpbGQoY2F0QXJzZSlcbiAgICBAZWxlbWVudC5hcHBlbmRDaGlsZChjYXRUcmFpbClcbiAgICBAZWxlbWVudC5hcHBlbmRDaGlsZChjYXRIZWFkKVxuIl19
