angular.module('app.views.support', [])
  .controller('SupportCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.submitMessage = 'Submit Endorsement';

    $scope.clearError = function() {
      $scope.failCount = 0;
      $scope.formError = null;
    };

    $scope.send = function(form) {
      if (form.$invalid) {
        $scope.formError = 'Oops! Couldn\'t submit since all the fields are not filled';
        return;
      }

      //Send email message
      $scope.submitDisabled = true;
      $scope.submitMessage = 'Endorsing ...';
      $http.post('php/sendMail.php', {
        'name' : $scope.name || ' ',
        'endorsement' : $scope.message || ' '
      }).
      success(function() {
        $scope.firstName = $scope.name.substr(0, $scope.name.indexOf(' '));
        if ($scope.firstName === '') {
          $scope.firstName = $scope.name;
        }
        $scope.showConfirmation = true;
      }).
      error(function(data, status) {
        $scope.failCount = $scope.failCount + 1 || 1;
        if ($scope.failCount >= 2) {
          $scope.formError = 'Seems like there are some problems. Email us at info@robertrotberg.com if they persist.';
        } else {
          $scope.formError = 'Emailing form data failed with status '+status+' (' + data +')';
        }
        $scope.submitDisabled = false;
        $scope.submitMessage = 'Try again';
      });
    };
  }]);
