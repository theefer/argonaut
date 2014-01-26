if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function() {

    var defaultType = 'json';
    var typeAcceptMap = {
        '*':   'text/javascript, text/html, application/xml, text/xml, */*',
        xml:   'application/xml, text/xml',
        html:  'text/html',
        text:  'text/plain',
        json:  'application/json, text/javascript',
        js:    'application/javascript, text/javascript',
        jsonp: 'application/javascript, text/javascript, */*'
    };

    // FIXME: stick methods on prototype instead?

    return function(httpAdapter, options) {

        options = options || {};

        if (!httpAdapter) {
            throw new Error('Http constructor called without an httpAdapter');
        }

        if (options.type && !typeAcceptMap[options.type]) {
            throw new Error('Resource constructed with an invalid type: ', options.type);
        }

        var type = options.type || defaultType;
        var baseOptions = {
            type:   type,
            accept: options.accept || typeAcceptMap[type]
        };

        function fillOptions(options) {
            var o = {}, k;
            for (k in baseOptions) { o[k] = baseOptions[k]; }
            for (k in options)     { o[k] = options[k];     }
            return o;
        }

        /**
         * @return a new Promise(data)
         */
        function get(uri, data, options) {
            return httpAdapter.get(uri, data, fillOptions(options));
        }

        /**
         * @return a new Promise(data)
         */
        function put(uri, data, options) {
            var allOptions = fillOptions(options);
            if (allOptions.type == 'json') {
                // FIXME: let adapter do it?
                allOptions.contentType = 'application/json';
                data = JSON.stringify(data)
            }
            return httpAdapter.put(uri, data, allOptions);
        }

        /**
         * @return a new Promise(data)
         */
        function post(uri, data, options) {
            var allOptions = fillOptions(options);
            if (allOptions.type == 'json') {
                // FIXME: let adapter do it?
                allOptions.contentType = 'application/json';
                data = JSON.stringify(data)
            }
            return httpAdapter.post(uri, data, allOptions);
        }

        /**
         * @return a new Promise(data)
         */
        function del(uri, options) {
            return httpAdapter.del(uri, fillOptions(options));
        }

        return {
            get: get,
            put: put,
            post: post,
            del: del
        };
    };
});
