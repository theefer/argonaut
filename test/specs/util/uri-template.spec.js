define(['/base/src/util/uri-template.js', 'chai'],
       function(uriTemplate, chai) {

    describe('uriTemplate', function() {

        it('should be a function', function() {
            uriTemplate.should.be.a('function');
        });


        describe('with plain string template', function() {
            var plainTemplate = 'http://example.com/some/path';

            it('should return the plain string', function() {
                var templated = uriTemplate(plainTemplate);
                templated.should.equal(plainTemplate);
            });

        });

        describe('with template including a variable', function() {
            var varTemplate = 'http://example.com/some/{id}';

            it('should substitute the provided string value', function() {
                var templated = uriTemplate(varTemplate, {id: 'abc'});
                templated.should.equal('http://example.com/some/abc');
            });

            it('should URI escape the provided string value', function() {
                var templated = uriTemplate(varTemplate, {id: 'héllo world?!'});
                templated.should.equal('http://example.com/some/h%C3%A9llo%20world%3F!');
            });

            it('should substitute the provided integer value', function() {
                var templated = uriTemplate(varTemplate, {id: 123});
                templated.should.equal('http://example.com/some/123');
            });

            it('should substitute the provided boolean value', function() {
                var templated = uriTemplate(varTemplate, {id: false});
                templated.should.equal('http://example.com/some/false');
            });

            it('should throw an exception if the value provided is an array', function() {
                (function() {
                    uriTemplate(varTemplate, {id: [1]});
                }).should.throw('Invalid type for URI template parameter: id');
            });

            it('should throw an exception if the value provided is an object', function() {
                (function() {
                    uriTemplate(varTemplate, {id: {}});
                }).should.throw('Invalid type for URI template parameter: id');
            });

            it('should throw an exception if no value is provided', function() {
                (function() {
                    uriTemplate(varTemplate, {});
                }).should.throw('Missing parameter for URI template variable: id');
            });

        });


        describe('with template including query expansion', function() {
            var queryTemplate = 'http://example.com/some/{?q}';

            it('should omit the query parameter if no value is provided', function() {
                var templated = uriTemplate(queryTemplate);
                templated.should.equal('http://example.com/some/');
            });

            it('should include the provided string value', function() {
                var templated = uriTemplate(queryTemplate, {q: 'abc'});
                templated.should.equal('http://example.com/some/?q=abc');
            });

            it('should escape the provided string value', function() {
                var templated = uriTemplate(queryTemplate, {q: 'héllo world?!'});
                templated.should.equal('http://example.com/some/?q=h%C3%A9llo%20world%3F!');
            });

            it('should include the provided integer value', function() {
                var templated = uriTemplate(queryTemplate, {q: 123});
                templated.should.equal('http://example.com/some/?q=123');
            });

            it('should include the provided boolean value', function() {
                var templated = uriTemplate(queryTemplate, {q: false});
                templated.should.equal('http://example.com/some/?q=false');
            });

            it('should throw an exception if the value provided is an array', function() {
                (function() {
                    uriTemplate(queryTemplate, {q: [1]});
                }).should.throw('Invalid type for URI template parameter: q');
            });

            it('should throw an exception if the value provided is an object', function() {
                (function() {
                    uriTemplate(queryTemplate, {q: {}});
                }).should.throw('Invalid type for URI template parameter: q');
            });
        });


        describe('with template mixing variables and query expansion', function() {
            var mixedTemplate = 'http://example.com/some/{id}/{other}/{?q,v}';

            it('should include all variables if provided', function() {
                var templated = uriTemplate(mixedTemplate, {
                    id: 'abc def',
                    other: 123,
                    q: 'test+3',
                    v: true
                });
                templated.should.equal('http://example.com/some/abc%20def/123/?q=test%2B3&v=true');
            });

            it('should ignore missing query parameters', function() {
                var templated = uriTemplate(mixedTemplate, {
                    id: 'abc',
                    other: 123,
                    v: true
                });
                templated.should.equal('http://example.com/some/abc/123/?v=true');
            });

            it('should throw an exception if a variable value is missing', function() {
                (function() {
                    uriTemplate(mixedTemplate, {
                        id: 'abc',
                        v: true
                    });
                }).should.throw('Missing parameter for URI template variable: other');
            });

        });

        // TODO: test url encoding
    });
});
