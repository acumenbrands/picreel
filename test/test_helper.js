// Test libraries
// Relative links to test libs to be included
var testLibraries = [
  './lib/picreel_tests.js',
  '../node_modules/sinon/pkg/sinon-1.14.1.js',
  '../node_modules/sinon/pkg/sinon-le.js',
  '../node_modules/sinon-qunit/lib/sinon-qunit.js'
];

console.log("\n");
for(var i=0; i<testLibraries.length; i++) {
  console.log('Loading additional testing lib: ' + testLibraries[i]);
  $.getScript(testLibraries[i]);
}

// Got jQuery?
// Picreel uses jQuery, so we will, too.
QUnit.test("jQuery", function(assert) {
  var subject = jQuery;

  assert.equal(subject, $, "jQuery should be defined");
  assert.equal(subject.fn.jquery, "1.10.2", "jQuery should be version 1.10.2");
});
