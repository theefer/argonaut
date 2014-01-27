if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['./src/api'], function (Api) {
  return {
    Api: Api
  };
});
