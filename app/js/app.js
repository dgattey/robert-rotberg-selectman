angular.module('rotbergApp', [
  // Built in
  'ngRoute',
  'ui.bootstrap',

  // Extras
  'parse-angular',
  'timer'
]).controller('ButtonCtrl', ['$scope', function ($scope) {

  Parse.initialize("ho6HnNe3rRvhLvSVdZqizGy2BIXiPdCov4AIrKBL", "89LDCNDNImDFnKDZBL8C9mr0HB641SXMzeLExIru");

  $scope.setSelected = function(item) {
    if ($scope.selected === item) $scope.selected = undefined;
    else $scope.selected = item;

    // Cloud Code is patched too!
    Parse.Cloud.run("testMeH", function(results) {
        console.log(results);
    });
  }

  $scope.buttons = [
    {
      "title": "Donate",
      "icon": "flash",
      "content": "donate"
    },
    {
      "title": "Endorse",
      "icon": "certificate",
      "content": "endorse"
    },
    {
      "title": "Send Message",
      "icon": "comment",
      "content": "showContactForm"
    }
  ];

}]);
