# Acumen Brands Utilities Library for Picreel

Whosoever embeds this library in a Picreel template, if he be worthy, shall possess the power to send emails to SailThru and track them using Lighthouse.

## An Important Note on [Semantic Versioning](http://semver.org/)

This library attempts to follow the SemVer specification. Before deploying, be sure to update the library version in <code>package.json</code>. This library will deploy to a semantically versioned path in the specified S3 bucket, so breaking changes will not affect previously deployed versions.


## Environment Setup

1. Install [Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
1. Run <code>npm install</code>, which will install all necessary support libraries for testing building, and exporting
1. Copy <code>config/aws-config.json.example</code> to  <code>config/aws-config.json</code> and fill in with appropriate values.<br>
  _If you don't have actual values for the config params, the example values may be left or changed simply to  <code>""</code>, and the <code>grunt aws</code> task simply won't complete._

## Export APLS for Browsers

1. Follow the [Environment Setup](#environment-setup) steps above
1. Run <code>grunt</code> to build the libraries. If all tests pass, normal and minified libraries will be in the <code>/build</code> directory.

## Run Acceptance Tests Only

1. Follow the [Environment Setup](#environment-setup) steps above
1. Run <code>grunt test</code>

## Deploy to Production

1. Follow the [Environment Setup](#environment-setup) steps above
1. Update the semantic version in <code>package.json</code>
1. Run <code>grunt deploy:production</code>. If all tests pass, normal and minified libraries will be uploaded to the S3 bucket specified in <code>config/aws-config.json</code> along a semantically versioned path, and a matching CloudFront invalidation will be created.

## Implementation Example

Picreel doesn't do <code>&lt;form&gt;</code>s, but it does do <code>&lt;input&gt;</code>s. Let's say you had

1. an email input <code>&lt;input type="email" name="email"&gt;</code>
1. a submit input <code>&lt;input type="button" id="submit-button"&gt;</code>
1. and a desire to submit the form to a custom Sailthru list, "STYLE"

In the editor you would place the following:

```JavaScript
<script src="//my-cloudfront-dist-id.cloudfront.net/libs/picreel/0.4.0/picreel.min.js"></script>
<script>
  if(window.jQuery){

    jQuery(document).ready(function($) {
      var params = {
        submitSelector: "#submit-button",
        emailSelector:  "input[name='email']",
        action:         "https://www.mydomain.com/my_form_handler/",
        list:           "STYLE"
      };
      window.APLS = new APLSubscriber(params);
    });

  };
</script>
```

### Implementation with vars

Sailthru [Vars](http://getstarted.sailthru.com/new-for-developers-overview/email-and-user-profiles/user/#POST Mode - Optional Parameters - vars 2) may added to templates and will be submitted as event vars and profile varswhen a user subscribes. All vars submitted will be made to equal the value _1_.

Simply add an array of vars to the template editor, as in the following example:

```JavaScript
<script src="//my-cloudfront-dist-id.cloudfront.net/libs/picreel/0.4.0/picreel.min.js"></script>
<script>
  if(window.jQuery){

    jQuery(document).ready(function($) {
      var params = {
        action:         "https://www.mydomain.com/my_form_handler/",
        list:           "SUBSCRIBERS",
        vars:           ["giveaway", "example"]
      };
      window.APLS = new APLSubscriber(params);
    });

  };
</script>
```

### Implementation with a custom event name

Sailthru will accept any event name, but you will have to configure which event names have triggers in Sailthru.

For a custom event name, add it as a string:

```JavaScript
<script src="//my-cloudfront-dist-id.cloudfront.net/libs/picreel/0.4.0/picreel.min.js"></script>
<script>
  if(window.jQuery){

    jQuery(document).ready(function($) {
      var params = {
        action:         "https://www.mydomain.com/my_form_handler/",
        list:           "SUBSCRIBERS",
        event:          "my_event_name"
      };
      window.APLS = new APLSubscriber(params);
    });

  };
</script>
```

_NOTE 1: Pireel's editor does not load jQuery, but we're dependent on jQuery. Therefore, be sure to wrap <code>new APLSubscriber</code> declaration in <code>if(window.jQuery)</code>_

_NOTE 2: Most new APLS attributes may be specified when creating a new object. See <code>lib/factories/subscriber.js</code> for what may be created as arguments_
