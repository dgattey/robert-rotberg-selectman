var navigation = [
  {
    "title": "Donate",
    "icon": "flash",
    "url": "donate"
  }/*,
  {
    "title": "Endorse",
    "icon": "certificate",
    "url": "endorse"
  },
  {
    "title": "Send Message",
    "icon": "comment",
    "url": "contact"
  }*/
];

angular.module('rotbergApp', [
  // Built in
  'ui.bootstrap',
  'ui.router',

  // Extras
  'timer'
]).config(function ($stateProvider, $urlRouterProvider) {

  // Setting up Parse
  if (Parse){
     Parse.initialize("ho6HnNe3rRvhLvSVdZqizGy2BIXiPdCov4AIrKBL", "89LDCNDNImDFnKDZBL8C9mr0HB641SXMzeLExIru");
  }

  $urlRouterProvider.otherwise('/');
  for (var i = 0; i < navigation.length; i++) {
    var view = navigation[i];
    $stateProvider
      .state(view.url, {
        url: '/'+view.url,
        templateUrl: 'partials/'+view.url+'.html'
      });
  }

}).controller('ButtonCtrl', function ($scope) {
  $scope.buttons = navigation;


});
