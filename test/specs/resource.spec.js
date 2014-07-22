define(['/base/src/resource.js'], function(ResourceFactory) {

    describe('ResourceFactory', function() {

        function mockHttp() {
            return {
                // TODO: other methods
                get: function (uri, data, options) {
                    return {
                        then: function () {}
                    };
                },
                post: function (uri, data, options) {
                    return {
                        then: function () {}
                    };
                },
                del: function (uri, data, options) {
                    return {
                        then: function () {}
                    };
                }
            };
        }

        it('should be a function', function() {
            ResourceFactory.should.be.a('function');
        });

        it('should throw an exception if called without an http adapter', function() {
            (function() {
                ResourceFactory();
            }).should.throw(Error, 'Missing http option when calling ResourceFactory');
        });

        it('should return a Resource constructor', function() {
            var Resource = ResourceFactory({
                http: mockHttp()
            });

            Resource.should.be.a('function');
        });

        // TODO: accept syncData


        describe('Resource', function() {

            var Resource;

            beforeEach(function() {
                Resource = ResourceFactory({
                    http: mockHttp()
                });
            });

            describe('constructor', function() {
                it('should throw an exception if called without a URI', function() {
                    (function() {
                        new Resource();
                    }).should.throw(Error, 'Missing URI parameter when creating Resource');
                });

                it('should store the provided uri', function() {
                    var resource = new Resource('http://example.com/api');
                    resource.should.be.an('object');
                    resource.uri.should.equal('http://example.com/api');
                });

                // FIXME: make uri immutable?

                it('should not have a data property if no data provided', function() {
                    var resource = new Resource('http://example.com/api');
                    resource.should.not.have.property('data');
                });

                it('should store the provided data', function() {
                    var resource = new Resource('http://example.com/api', {
                        foo: 123
                    });
                    resource.data.should.eql({foo: 123});
                });
            });


            describe('instance', function() {
                var http;
                var Resource;
                var resource;

                beforeEach(function() {
                    http = mockHttp();
                    Resource = ResourceFactory({
                        http: http
                    });
                    resource = new Resource('http://example.com/api');
                });

                function whenPOST(response) {
                    sinon.stub(http, 'post', function () {
                        return {
                            then: function (fn) {
                                return fn(response);
                            }
                        };
                    });
                }


                // TODO: get, post, put, delete

                describe('#post', function () {

                    it('should send a POST request', function () {
                        whenPOST({
                            status: 200,
                            statusText: 'OK',
                            contentType: 'application/json',
                            body: {}
                        });
                        resource.post('foo');
                        http.post.should.have.been.calledWith('http://example.com/api', 'foo');
                    });

                    it('should send a POST request and then follow the redirect', function () {
                        whenPOST({
                            // TODO: test other status codes?
                            status: 301,
                            statusText: 'See Other',
                            contentType: 'application/json',
                            location: 'http://example.com/api/redirect',
                            body: {}
                        });
                        sinon.spy(http, 'get');
                        resource.post('foo');
                        http.post.should.have.been.calledWith('http://example.com/api', 'foo');
                        http.get.should.have.been.calledWith('http://example.com/api/redirect');
                    });

                });

                describe('#del', function() {

                    it('should send a DELETE request', function() {
                        sinon.spy(http, 'del');
                        resource.del();
                        http.del.should.have.been.calledWith('http://example.com/api');
                    });

                });


                describe('#delete', function() {

                    it('should be an alias to #del', function() {
                        resource['delete'].should.be.equal(resource.del);
                    });

                });


                describe('#follow', function() {

                    beforeEach(function() {
                        resource.links = [
                            {rel: 'plain', href: 'http://example.com/api/plain'},
                            {rel: 'var', href: 'http://example.com/api/{id}'}
                        ];
                    });

                    it('should return a resource to the corresponding plain link', function() {
                        var link = resource.follow('plain');
                        link.should.be.an.instanceof(Resource);
                        link.uri.should.equal('http://example.com/api/plain');
                    });

                    it('should return a resource to the corresponding templated link with a variable', function() {
                        var link = resource.follow('var', {id: 123});
                        link.uri.should.equal('http://example.com/api/123');
                    });

                    it('should throw an exception if the corresponding templated link requires a variable that is not provided', function() {
                        (function() {
                            resource.follow('var');
                        }).should.throw('Missing parameter for URI template variable: id');
                    });

                    it('should throw an error if the link is not found', function() {
                        (function() {
                            resource.follow('non-existent');
                        }).should.throw('link not found');
                    });

                });

            });
        });
    });
});
