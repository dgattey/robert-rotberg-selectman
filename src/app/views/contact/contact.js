angular.module('app.views.contact', [])
  .controller('ContactCtrl', ['$scope', function ($scope) {

    $scope.submitMessage = function(form) {
      if (form.$invalid) {
        $scope.showGenericError = true;
        return;
      }

      //SEND MESSAGE HERE VIA NODEMAILER!

      $scope.firstName = $scope.name.substr(0, $scope.name.indexOf(' '));
      if ($scope.firstName === '') {
        $scope.firstName = $scope.name;
      }
      $scope.showConfirmation = true;
    };

  }]);
