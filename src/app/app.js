var navigation = [
{'title':'Donate','icon':'flash','url':'donate'},
/*{'title':'Endorse','icon':'certificate','url':'endorse'},*/
{'title':'Send Message','icon':'comment','url':'contact'}
];

/**
 * APP
 * The module that runs the full application
 */
 angular.module('rotbergApp', [
  'ui.bootstrap',
  'ui.router',
  'app.views',
  'app.vendor'
  ])

  // Sets up routing and Parse
  .config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {

    // Create routes
    for (var i = 0; i < navigation.length; i++) {
      var view = navigation[i];
      $stateProvider.state(view.url, {
        url: '/'+view.url,
        templateUrl: 'app/views/'+view.url+'/'+view.url+'.tpl.html'
      });
    }

    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    // Converts an object to x-www-form-urlencoded serialization.
    var param = function(obj) {
      var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

      for(name in obj) {
        value = obj[name];

        if(value instanceof Array) {
          for(i=0; i<value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value instanceof Object) {
          for(subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
  }])

 .controller('ButtonCtrl', ['$scope', function ($scope) {
    $scope.buttons = navigation;
  }]);
