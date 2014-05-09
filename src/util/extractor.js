if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function() {

    var isArray = 'isArray' in Array ?
        Array.isArray :
        function(value) {
            return Object.prototype.toString.call(value) === '[object Array]';
        };

    function isNull(value) {
        return value === null;
    }

    function isEntityProperty(key) {
        return ['uri', 'data', 'links'].indexOf(key) !== -1;
    }

    function isEntity(val) {
        return (typeof val === 'object') &&
               ! isNull(val) &&
               Object.keys(val).length > 0 &&
               Object.keys(val).every(isEntityProperty);
        // FIXME: check type of uri, links
    }


    function ExtractorFactory(options) {

        options = options || {};

        var Resource = options.Resource;

        if (! Resource) {
            throw new Error('Missing Resource option when calling ExtractorFactory');
        }


        function extract(val, fallbackUri) {
            if (isEntity(val)) {
                var uri = val.uri || fallbackUri;
                var data = parseData(val.data);
                var links = val.links;
                if (uri) {
                    return new Resource(uri, data, links);
                } else {
                    // If there is no URI, it’s an entity but not a resource
                    return {
                        data: data,
                        links: links
                    };
                }
            } else {
                return parseData(val);
            }
        }

        function parseData(data) {
            var mapped;

            switch (typeof data) {
            case 'object':
                if (isNull(data)) {
                    mapped = null;
                } else if (isArray(data)) {
                    mapped = data.map(function(item) {
                        return extract(item);
                    });
                } else {
                    mapped = {};
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            mapped[key] = extract(data[key]);
                        }
                    }
                }
                break;

            case 'string':
            case 'number':
            case 'boolean':
                mapped = data;
                break;

            case 'undefined':
                // leave undefined
                break;

            default:
                throw new Error('unexpected type in parseData: ' + typeof data);
            }

            return mapped;
        }

        return extract;
    };

    return ExtractorFactory;
});
