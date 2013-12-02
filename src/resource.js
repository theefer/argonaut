define(['./util/uri-template.js'], function(uriTemplate) {

    function ResourceFactory(options) {

        options = options || {};

        if (! options.http) {
            throw new Error('Missing http option when creating ResourceFactory');
        }

        var http = options.http;
        var syncData = options.syncData;

        function Resource(uri, data) {
            if (! uri) {
                throw new Error('Missing URI parameter when creating Resource');
            }

            this.uri = uri;

            if (typeof data !== 'undefined') {
                this.data = data;
            }
        }

        // Resource.prototype = Object.create(..)


        Resource.prototype.get = function(params) {
            return http.get(this.uri, params).then(function(resp) {
                // FIXME: plain data vs entity?
                if (syncData) {
                    this.data = resp.body.data;
                    this.links = resp.body.links;
                }

                // this._contentType = resp.contentType;
                // FIXME: as entity?
                return resp.body;
            }.bind(this));
        };

        Resource.prototype.post = function(data, params) {
            // FIXME: or not?
            if (typeof data === 'undefined') {
                data = this.data;
            }

            return http.post(this.uri, data, params).then(function(resp) {
                return resp.body;
            });
        };

        Resource.prototype.put = function(data) {
            // FIXME: or not?
            if (typeof data === 'undefined') {
                data = this.data;
            }

            return http.put(this.uri, data).then(function(resp) {
                // this.data = resp.body;
                return resp.body;
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
