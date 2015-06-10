(function() {
  var Trackers = (function() {

    function Trackers(args) {
      var args = args || {};

      this.trackers = ('trackers' in args) ? args.trackers : {};

      return this;
    }

    Trackers.prototype.registerTracker = function (key, ref) {
      this.trackers[key] = ref;
    };

    Trackers.prototype.track = function (key, eventOptions) {
      this.trackers[key].push(eventOptions);
    };

    var _noop = function() {};

    return Trackers;

  })();

  module.exports = Trackers;

}).call(this);
