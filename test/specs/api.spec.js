define(['/base/src/api.js', 'chai'], function(Api, chai) {

    describe('Api', function(){
        describe('constructor', function(){
            it('should be a function', function() {
                Api.should.be.a('function');
            });

            it('should throw an exception if called without an httpAdapter', function() {
                (function() {
                    new Api();
                }).should.throw(Error, 'Missing httpAdapter option when creating Api');
            });

            // TODO: httpAdapter
            // TODO: syncData
        });

        describe('#root', function(){
        });

        describe('#Resource', function(){
        });
    });
});
