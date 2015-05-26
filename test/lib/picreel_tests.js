QUnit.test("Acumen Picreel Library", function(assert) {
  var subject = new APLSubscriber({$: window.jQuery});

  assert.ok(subject, "APLib should be defined");

  assert.strictEqual(subject.$, window.jQuery, "Instance jQuery should be the window's jQuery");
});

QUnit.test("APL Subscriber", function(assert) {
  var validVarsName  = 'hurp';
  var validListName  = 'SUBSCRIBERS';
  var validEventName = 'subscribe';
  var validEmail     = 'Valid.Email1@address1.co.uk';
  var invalidEmail   = 'invalid.email@address';
  var params         = {
    submitSelector: "#submit-button",
    emailSelector:  "input[name='email']",
    handler:        "/test/test_handler.js",
    list:           validListName,
    vars:           [validVarsName, 'durp'],
    event:          validEventName,
    $:              window.jQuery,
    onerror:        function() {}
  };
  var validFormData = {
    email: validEmail,
    lists: [validListName],
    vars:  [validVarsName, 'durp'],
    event: validEventName
  };
  var subject                = new APLSubscriber(params);
  var handleButtonClickSpy   = sinon.spy(subject, "handleButtonClick");
  var submitSpy              = sinon.spy(subject, "submit");
  var carrierSpy             = sinon.spy($, "ajax");
  var applyErrorStatusSpy    = sinon.spy(subject, "applyErrorStatus");
  var applyLoadingStatusSpy  = sinon.spy(subject, "applyLoadingStatus");
  var removeErrorStatusSpy   = sinon.spy(subject, "removeErrorStatus");
  var formToCarrierParamsSpy = sinon.spy(subject, "formToCarrierParams");

  assert.strictEqual(subject.topWindow, window, "topWindow should be window");

  assert.ok(subject.emailIsValid(validEmail), "Recognizes a valid email");

  assert.notOk(subject.emailIsValid(invalidEmail), "Recognizes an invalid email");

  handleButtonClickSpy.reset();
  applyLoadingStatusSpy.reset();
  $(subject.emailSelector).val(validEmail);
  $(subject.submitSelector).trigger("onBeforeSubmit");
  assert.ok(handleButtonClickSpy.called, "When button is clicked, subscriber should submit to custom handler");
  assert.ok(applyLoadingStatusSpy.called, "Indicates when loading");

  submitSpy.reset();
  applyErrorStatusSpy.reset();
  $(subject.emailSelector).val(invalidEmail);
  $(subject.submitSelector).trigger("onBeforeSubmit");
  assert.notOk(submitSpy.called, "Won't submit an invalid Email");
  assert.ok(applyErrorStatusSpy.called, "Indicates an error has occured");

  submitSpy.reset();
  removeErrorStatusSpy.reset();
  $(subject.emailSelector).val(validEmail);
  $(subject.submitSelector).trigger("onBeforeSubmit");
  assert.ok(submitSpy.called, "Will submit a valid Email");
  assert.ok(removeErrorStatusSpy.called, "Removes error indicators");

  $(subject.emailSelector).val(validEmail);
  $(subject.submitSelector).trigger("onBeforeSubmit");
  assert.ok((subject.formToCarrierParams().lists.indexOf(validListName) >= 0), "If a list is specified, it is submitted");
  assert.ok((subject.formToCarrierParams().vars.indexOf(validVarsName) >= 0), "If var values exist, they are submitted");
  assert.ok((subject.formToCarrierParams().event == validEventName), "If an event name exists, it is submitted");

  carrierSpy.reset();
  $(subject.emailSelector).val(validEmail);
  $(subject.submitSelector).trigger("onBeforeSubmit");
  assert.deepEqual(subject.formToCarrierParams(), validFormData, "Reads data from the form");
  assert.ok(carrierSpy.called, "Sends AJAX carrier");
});
