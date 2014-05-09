if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['./api'], function (Api) {
  return {
    Api: Api
  };
});
