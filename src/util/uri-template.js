define(function() {

    function validValueType(val) {
        var type = typeof val;
        return type === 'string' || type === 'number' || type === 'boolean';
    }

    function truthy(x) {
        return x;
    }

    /**
     * Apply a URI template to a set of parameters.
     *
     * This is an incomplete implementation of RFC 6570.
     *
     * See the RFC for reference:
     * http://tools.ietf.org/html/rfc6570
     *
     * @param {string} template URI template string
     * @param {object} params   Key-value map of URI parameters
     * @return
     */
    function uriTemplate(template, params) {
        params = params || {};
        return template.
            replace(/\{\?(.*?)\}/g, function(match, varNameList) {
                var varNames = varNameList.split(',');
                var query = varNames.map(function(varName) {
                    var val = params[varName];
                    if (typeof val !== 'undefined') {
                        if (! validValueType(val)) {
                            throw new Error("Invalid type for URI template parameter: " + varName);
                        }
                        return varName + '=' + encodeURIComponent(val);
                    }
                }).filter(truthy);
                if (query.length > 0) {
                    return '?' + query.join('&');
                } else {
                    return '';
                }
            }).
            replace(/\{(.*?)\}/g, function(match, varName) {
                var val = params[varName];
                if (typeof val === 'undefined') {
                    throw new Error("Missing parameter for URI template variable: " + varName);
                }
                if (! validValueType(val)) {
                    throw new Error("Invalid type for URI template parameter: " + varName);
                }
                return encodeURIComponent(val);
            });
    }

    return uriTemplate;
});
