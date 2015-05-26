  (function() {
    var APLSubscriber = (function() {

    function APLSubscriber(args) {
      for(arg in args) {
        if(typeof this.arg == 'undefined') {
          this[arg] = args[arg];
        }
      }

      this.topWindow      = getTopWindow();
      this.$              = this.$               || window.jQuery;
      this.requestUrl     = this.getRequestUrl() || window.location.href;
      this.lists          = this.lists           || [];
      this.submitSelector = this.submitSelector  || ".submit";
      this.emailSelector  = this.emailSelector   || "input[name='email']";
      this.errorClass     = this.errorClass      || "subscriber-error";
      this.loadingClass   = this.loadingClass    || "subscriber-loading";
      this.onerror        = this.onerror         || noop;
      this.onsuccess      = this.onsuccess       || noop;
      this.oncomplete     = this.oncomplete      || noop;
      this.vars           = this.vars            || [];
      this.event          = this.event           || null;
      this.action         = this.action          || "/";
      this.carrier        = null;

      this.buildSubscriberLists();
      this.bindNewClickEvents();
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
      this.removeErrorStatus();
      this.applyLoadingStatus();

      var email = this.$(this.emailSelector).val();

      if(this.emailIsValid(email)) {
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

    APLSubscriber.prototype.bindNewClickEvents = function() {
      var _APL = this;

      this.$(window).on('onBeforeSubmit', function(e){
        _APL.handleButtonClick(e);
      });
    };

    var getTopWindow = function() {
      var topWindow = window;
      while (topWindow !== topWindow.parent) {
        topWindow = topWindow.parent;
      }
      return topWindow;
    };

    var noop = function() {};

    return APLSubscriber;

  })();

  if (typeof module !== "undefined" && module !== null) {
    module.exports = APLSubscriber;
  }

  module.exports = APLSubscriber;

}).call(this);
