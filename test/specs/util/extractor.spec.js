define([
    '/base/src/util/extractor.js',
    '/base/src/resource.js',
    'chai'
], function(
    ExtractorFactory,
    ResourceFactory,
    chai
) {
    var should = chai.should();

    describe('ExtractorFactory', function() {

        function mockResource(uri, data, links) {
            this.uri = uri;
            this.data = data;
            this.links = links;
        }

        it('should be a function', function() {
            ExtractorFactory.should.be.a('function');
        });

        it('should throw an exception if called without a Resource option', function() {
            (function() {
                ExtractorFactory();
            }).should.throw(Error, 'Missing Resource option when calling ExtractorFactory');
        });

        it('should return an extract function', function() {
            var extract = ExtractorFactory({
                Resource: mockResource
            });

            extract.should.be.a('function');
        });


        describe('extract', function() {

            var extract;

            beforeEach(function() {
                extract = ExtractorFactory({
                    Resource: mockResource
                });
            });

            describe('primitive types', function() {
                it('should pass through integers', function() {
                    var extracted = extract(1);
                    extracted.should.equal(1);
                });

                it('should pass through floats', function() {
                    var extracted = extract(2.3);
                    extracted.should.equal(2.3);
                });

                it('should pass through strings', function() {
                    var extracted = extract('hello');
                    extracted.should.equal('hello');
                });

                it('should pass through booleans', function() {
                    var extracted = extract(false);
                    extracted.should.equal(false);
                });
            });

            describe('array of primitives', function() {
                it('should pass through array of integers', function() {
                    var extracted = extract([1,2,3]);
                    extracted.should.deep.equal([1,2,3]);
                });

                it('should pass through nested mixed array', function() {
                    var extracted = extract([1,['2', false],{a: 3}]);
                    extracted.should.deep.equal([1,['2', false],{a: 3}]);
                });
            });

            describe('objects of primitives', function() {
                it('should pass through plain objects', function() {
                    var extracted = extract({foo: 'bar', baz: 0});
                    extracted.should.deep.equal({foo: 'bar', baz: 0});
                });

                it('should pass through nested objects', function() {
                    var extracted = extract({
                        foo: {bar: 'baz'},
                        quux: false
                    });
                    extracted.should.deep.equal({
                        foo: {bar: 'baz'},
                        quux: false
                    });
                });

                it('should deep copy objects', function() {
                    var input = {a: {b: 'c'}};
                    var extracted = extract(input);

                    extracted.should.not.equal(input);
                    extracted.a.should.not.equal(input.b);
                });
            });

            // TODO: with uri
            // TODO: with data (with or w/o uri)
            // TODO: with uri and data

            // TODO: with links (with or w/o uri)

            // TODO: nested in array, object

/*

{
  data: {
    a: "b",
    c: 4
  }
}

{
  uri: "/path",
  data: {
    a: "b",
    c: 4
  }
}

{uri: false}
{links: 2}
*/

            describe('complex data', function() {
                it('should extract nested entities', function() {
                    var extracted = extract({
                        data: {
                            prop1: 'val1',
                            arr: [{
                                uri: '/nested-entity1'
                            }, {
                                uri: '/nested-entity2',
                                data: 'nested',
                                links: [
                                    {rel: 'nested-rel', href: '/link'}
                                ]
                            }],
                            obj: {
                                deep: {
                                    uri: '/deep-entity',
                                    data: {
                                        a: 'b'
                                    }
                                }
                            }
                        }
                    }, '/entity');

                    extracted.should.be.an.instanceof(mockResource);
                    extracted.uri.should.equal('/entity');
                    extracted.data.prop1.should.equal('val1');

                    extracted.data.arr[0].should.be.instanceof(mockResource);
                    extracted.data.arr[0].uri.should.equal('/nested-entity1');

                    extracted.data.arr[1].should.be.instanceof(mockResource);
                    extracted.data.arr[1].uri.should.equal('/nested-entity2');
                    extracted.data.arr[1].data.should.equal('nested');
                    extracted.data.arr[1].links.should.deep.equal([{rel: 'nested-rel', href: '/link'}]);

                    extracted.data.obj.deep.should.be.instanceof(mockResource);
                    extracted.data.obj.deep.uri.should.equal('/deep-entity');
                    extracted.data.obj.deep.data.should.deep.equal({a: 'b'});
                    should.not.exist(extracted.data.obj.deep.links);
                });
            });

        });
    });
});
