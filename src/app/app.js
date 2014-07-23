/**
 * APP
 * The module that runs the full application
 */
var navigation;
angular.module('rotbergApp', [
  'ui.bootstrap',
  'ui.router',
  'app.views',
  'app.vendor'
]).config(function ($stateProvider, $urlRouterProvider) {

  // Setting up Parse
  if (Parse){
     Parse.initialize("ho6HnNe3rRvhLvSVdZqizGy2BIXiPdCov4AIrKBL", "89LDCNDNImDFnKDZBL8C9mr0HB641SXMzeLExIru");
  }

  $urlRouterProvider.otherwise('/');
  navigation = [
    {"title":"Donate","icon":"flash","url":"donate"},
    /*{"title":"Endorse","icon":"certificate","url":"endorse"},*/
    {"title":"Send Message","icon":"comment","url":"contact"}
  ];
  for (var i = 0; i < navigation.length; i++) {
    var view = navigation[i];
    $stateProvider
      .state(view.url, {
        url: '/'+view.url,
        templateUrl: 'app/views/'+view.url+'/'+view.url+'.tpl.html'
      });
  }

}).controller('ButtonCtrl', function ($scope) {
  $scope.buttons = navigation;
});
