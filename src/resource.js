if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['./util/extractor.js', './util/uri-template.js'],
       function(ExtractorFactory, uriTemplate) {

    function ResourceFactory(options) {

        options = options || {};

        var http = options.http;
        var syncData = options.syncData;

        if (! http) {
            throw new Error('Missing http option when calling ResourceFactory');
        }

        var extract = ExtractorFactory({Resource: Resource});

        function Resource(uri, data, links) {
            if (! uri) {
                throw new Error('Missing URI parameter when creating Resource');
            }

            this.uri = uri;

            if (typeof data !== 'undefined') {
                this.data = data;
            }

            if (typeof links !== 'undefined') {
                this.links = links;
            }
        }

        // Resource.prototype = Object.create(..)


        Resource.prototype.get = function(params) {
            return http.get(this.uri, params).then(function(resp) {
                // parse returned entities
                var extracted = extract(resp.body, this.uri);

                // FIXME: iff an entity?
                if (syncData) {
                    this.data = extracted.data;
                    this.links = extracted.links;
                }

                return extracted;
            }.bind(this));
        };

        Resource.prototype.post = function(data, params) {
            // FIXME: or not?
            if (typeof data === 'undefined') {
                data = this.data;
            }

            return http.post(this.uri, data, params).then(function(resp) {
                return extract(resp.body, this.uri);
            }.bind(this));
        };

        Resource.prototype.put = function(data) {
            // FIXME: or not?
            if (typeof data === 'undefined') {
                data = this.data;
            }

            return http.put(this.uri, data).then(function(resp) {
                var extracted = extract(resp.body, this.uri);
                // this.data = resp.body;
                return extracted;
            });
        };

        Resource.prototype.del = function() {
            return http.del(this.uri).then(function(resp) {
                if (syncData) {
                    delete this.data;
                }
            });
        };


        // Alias
        Resource.prototype['delete'] = Resource.prototype.del;


        /**
         * Follow a rel link and return the corresponding Resource.
         *
         * @param {string} rel the name of the relation to follow
         * @param {object} params URI parameters for the relation's URI template
         * @return {Promise} a Promise of a new Resource if link found
         * @throw {LinkNotFound}
         */
        Resource.prototype.follow = function(rel, params) {
            var links = this.links || [];
            for (var i = 0, l = links.length; i < l; i++) {
                if (links[i].rel === rel) {
                    var linkedUrlTemplate = links[i].href;
                    var linkedUrl = uriTemplate(linkedUrlTemplate, params);
                    // TODO: allow injecting cache, etc?
                    return new Resource(linkedUrl);
                }
            }
            throw new Error('link not found');
            // TODO: define error - throw new LinkNotFound();
        };

        return Resource;

    }

    return ResourceFactory;

});
