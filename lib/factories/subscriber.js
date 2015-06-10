var Trackers = require('../adapters/trackers');

(function() {

  var APLSubscriber = (function() {

    function APLSubscriber(args) {
      for(arg in args) {
        if(typeof this.arg == 'undefined') {
          this[arg] = args[arg];
        }
      }

      this.topWindow           = _getTopWindow();
      this.$                   = this.$                   || window.jQuery;
      this.requestUrl          = this.getRequestUrl()     || window.location.href;
      this.lists               = this.lists               || [];
      this.submitSelector      = this.submitSelector      || ".submit";
      this.emailSelector       = this.emailSelector       || "input[name='email']";
      this.errorClass          = this.errorClass          || "subscriber-error";
      this.loadingClass        = this.loadingClass        || "subscriber-loading";
      this.onerror             = this.onerror             || _noop;
      this.onsuccess           = this.onsuccess           || _noop;
      this.oncomplete          = this.oncomplete          || _noop;
      this.vars                = this.vars                || [];
      this.event               = this.event               || null;
      this.action              = this.action              || "/";
      this.eventAction         = this.eventAction         || '';
      this.eventCategory       = this.eventCategory       || '';
      this.eventValue          = this.eventValue          || 0;
      this.eventNonInteraction = this.eventNonInteraction || '';
      this.trackers            = new Trackers();
      this.carrier             = null;

      this.trackers.registerTracker('GTM', this.topWindow.dataLayer);
      _trackOpen(this);

      this.buildSubscriberLists();
      _bindNewClickEvents(this);
    }

    APLSubscriber.prototype.buildSubscriberLists = function() {
      if(this.list) {
        this.lists.push(this.list);
      }
    };

    APLSubscriber.prototype.applyErrorStatus = function() {
    };

    APLSubscriber.prototype.applyErrorStatus = function() {
      this.$(this.emailSelector).addClass(this.errorClass);
    };

    APLSubscriber.prototype.removeErrorStatus = function() {
      this.$(this.emailSelector).removeClass(this.errorClass);
    };

    APLSubscriber.prototype.applyLoadingStatus = function() {
      this.$(this.emailSelector).addClass(this.loadingClass);
    };

    APLSubscriber.prototype.removeLoadingStatus = function() {
      this.$(this.emailSelector).removeClass(this.loadingClass);
    };

    APLSubscriber.prototype.getRequestUrl = function() {
      var requestUrl = this.$('input[name="request_url"]').val();

      if(requestUrl) {
        return requestUrl;
      } else {
        return null;
      }
    };

    APLSubscriber.prototype.handleButtonClick = function(e) {
      var email = this.$(this.emailSelector).val();

      this.removeErrorStatus();
      this.applyLoadingStatus();

      if(this.emailIsValid(email)) {
        _trackSubmit(this);
        this.submit();
      } else {
        this.handleError();
      }
    };

    APLSubscriber.prototype.emailIsValid = function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    APLSubscriber.prototype.formToCarrierParams = function() {
      var data = {};

      data['email'] = this.$(this.emailSelector).val();
      if(this.vars.length) data['vars'] = this.vars;
      if(this.event) data['event'] = this.event;

      if (this.lists.length) {
        data['lists'] = [];
        for (var i=0; i<this.lists.length; i++) {
          data['lists'].push(this.lists[i]);
        }
      }

      return data;
    };

    APLSubscriber.prototype.handleSuccess = function() {
      if(typeof this.onsuccess == 'function')
        this.onsuccess();

      this.$(self).trigger('onPicAfterSubmit');
    };

    APLSubscriber.prototype.handleError = function() {
      if(typeof this.onerror == 'function')
        this.onerror();

      this.removeLoadingStatus();
      this.applyErrorStatus();
    };

    APLSubscriber.prototype.handleComplete = function() {
      if(typeof this.oncomplete == 'function')
        this.oncomplete();

      this.removeLoadingStatus();
    };

    APLSubscriber.prototype.submit = function() {
      var _APL = this;

      var carrierOptions = {
        url:         _APL.action,
        data:        _APL.formToCarrierParams(),
        dataType:    'jsonp',
        complete:    function(){ _APL.handleComplete(); },
        success:     function(){ _APL.handleSuccess(); },
        error:       function(){ _APL.handleError(); },
        crossDomain: true
      };

      this.carrier = this.$.ajax(carrierOptions);
    };

    _bindNewClickEvents = function(_APL) {
      _APL.$(window).on('onBeforeSubmit', function(e){
        _APL.handleButtonClick(e);
      });

      _APL.$('body').on('pr:onPicAfterClose', function(e){
        _trackClose(_APL);
      });
    };

    var _getTopWindow = function() {
      var topWindow = window;
      while (topWindow !== topWindow.parent) {
        topWindow = topWindow.parent;
      }
      return topWindow;
    };

    var _trackOpen = function(_APL) {
      var trackerOptions = {
        'event':               'trackAnalyticsEvent',
        'eventCategory':       _APL.eventCategory,
        'eventAction':         'View',
        'eventNonInteraction': true
      };
      _APL.trackers.track('GTM', trackerOptions);
    };

    var _trackSubmit = function(_APL) {
      var trackerOptions = {
        'event':            'trackAnalyticsEvent',
        'eventCategory':    _APL.eventCategory,
        'eventAction':      _APL.eventAction
      };
      _APL.trackers.track('GTM', trackerOptions);
    };

    var _trackClose = function(_APL) {
      var trackerOptions = {
        'event':            'trackAnalyticsEvent',
        'eventCategory':    _APL.eventCategory,
        'eventAction':      'Close'
      };
      _APL.trackers.track('GTM', trackerOptions);
    };

    var _noop = function() {};

    return APLSubscriber;

  })();

  module.exports = APLSubscriber;

}).call(this);
