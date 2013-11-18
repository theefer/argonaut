define(['./resource.js', './http/base.js'], function(ResourceFactory, Http) {

    function Api(uri, options) {
        this.uri = uri;

        options = options || {};

        if (! options.httpAdapter) {
            throw new Error('Missing httpAdapter option when creating Api');
        }

        this.Resource = ResourceFactory({
            // http: new Http(options.httpAdapter, options)
            http: new Http(options.httpAdapter),
            syncData: options.syncData
        });
    }

    Api.prototype.root = function() {
        return new this.Resource(this.uri);
    };

    return Api;
});
