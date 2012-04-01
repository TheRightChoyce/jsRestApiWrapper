## About
This is a simple javascript file to consume REST style APIs. I created this as a means to easily interacte with whichever API I happened to be dealing with at the time based on some hacking around on my own.

## Expectations
The API you're trying to hit should implement a single endpoint for each HTTP GET/POST/PUT/DELETE method. I.E you should be able to hit `http://path/to/api` with all 4 headers and get a result. In order to use paging and filtering, the API should also support ODATA

## Usage
You can check `/tests/index.html` for examples of  requests, but here's a quick example:
    var api = new RestAPIWrapper({url: 'http://path/to/some/api'});
    api.get({ controller: 'foo', success: function(data) { alert('Got ' + data.length + ' items.') } });

This hits an endpoint of `http://path/to/some/api/get` with a get request and returns the first X amount of rows. To continue paging you can simply call:
    api.next({ success: function(data) { alert('Got next' + data.length + ' items.') } });

## Other
Thus far I've only used this on self-written C# APIs written with the new MVC Web-Api framework, but it should work on any REST style API

## Changes
There's a few TODOs in the `restapiwrapper.js` file and am debating if its worth adding a jquery plugin wrapper around this as well.