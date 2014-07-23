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
  .config(['$stateProvider', function ($stateProvider) {

    if (Parse){
      Parse.initialize(
        'ho6HnNe3rRvhLvSVdZqizGy2BIXiPdCov4AIrKBL', // API
        '89LDCNDNImDFnKDZBL8C9mr0HB641SXMzeLExIru' // This app
      );
    }

    // Create routes
    for (var i = 0; i < navigation.length; i++) {
      var view = navigation[i];
      $stateProvider.state(view.url, {
        url: '/'+view.url,
        templateUrl: 'app/views/'+view.url+'/'+view.url+'.tpl.html'
      });
    }
  }])

 .controller('ButtonCtrl', ['$scope', function ($scope) {
    $scope.buttons = navigation;
  }]);
