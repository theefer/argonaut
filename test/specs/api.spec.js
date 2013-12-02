define(['/base/src/api.js'], function(Api) {

    describe('Api', function() {

        function mockHttpAdapter() {
            return {};
        }

        describe('constructor', function() {
            it('should be a function', function() {
                Api.should.be.a('function');
            });

            it('should throw an exception if called without a URI', function() {
                (function() {
                    new Api();
                }).should.throw(Error, 'Missing URI parameter when creating Api');
            });

            it('should throw an exception if called without an httpAdapter', function() {
                (function() {
                    new Api('http://api.example.com/');
                }).should.throw(Error, 'Missing httpAdapter option when creating Api');
            });

            it('should construct an Api instance', function() {
                var api = new Api('http://api.example.com/', {
                    httpAdapter: mockHttpAdapter()
                });

                api.should.be.an('object');
            });

            // TODO: accept syncData
        });

        describe('#root', function() {
            var api;

            beforeEach(function() {
                api = new Api('http://api.example.com/', {
                    httpAdapter: mockHttpAdapter()
                });
            });

            it('should be a function', function() {
                api.root.should.be.a('function');
            });

            it('should return a Resource pointing to the API root', function() {
                var root = api.root();

                root.should.be.an.instanceof(api.Resource);
                root.uri.should.equal('http://api.example.com/');
            });

            it('should return a new Resource every time it is called', function() {
                var root1 = api.root();
                var root2 = api.root();

                root1.should.not.be.equal(root2);
            });
        });

        describe('#Resource', function() {
            var api;

            beforeEach(function() {
                api = new Api('http://api.example.com/', {
                    httpAdapter: mockHttpAdapter()
                });
            });

            it('should be a (constructor) function', function() {
                api.Resource.should.be.a('function');
            });

            // TODO: same http adapter, syncData option
        });
    });
});
