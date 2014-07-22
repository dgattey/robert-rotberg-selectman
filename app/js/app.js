angular.module('rotbergApp', [
  // Built in
  'ngRoute',
  'ui.bootstrap',

  // Extras
  'timer'
]).controller('ButtonCtrl', ['$scope', function ($scope) {
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
