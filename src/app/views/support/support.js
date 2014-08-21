angular.module('app.views.support', [])
  .controller('SupportCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.submitMessage = 'Submit Endorsement';
    $scope.formData = {
      name: '',
      displayName: 'wholeName',
      publicEmployee: 'no',
      message: ''
    };

    var getFirstName = function(name) {
      return name && name !== '' ? name.split(' ')[0] : name;
    };

    $scope.clearError = function() {
      $scope.failCount = 0;
      $scope.formError = null;
    };

    $scope.send = function(form) {
      if (form.$invalid) {
        $scope.formError = 'Oops! Couldn\'t submit since all the fields are not filled';
        return;
      }

      //Compose Data
      var postObj = {
        name: $scope.formData.name || ' ',
        displayName: 'Anonymous',
        message: $scope.formData.message || ' '
      };
      if ($scope.formData.publicEmployee === 'no') {
        switch ($scope.formData.displayName) {
          case 'firstName':
            postObj.displayName = getFirstName(postObj.name) || ' ';
            break;
          case 'wholeName':
            postObj.displayName = postObj.name;
            break;
          default:
            break;
        }
      } else {
        postObj.displayName = 'Public Employee';
      }

      //Send email message
      $scope.submitDisabled = true;
      $scope.submitMessage = 'Endorsing ...';
      $http.post('php/sendMail.php', postObj).
      success(function() {
        $scope.firstName = getFirstName($scope.formData.name);
        $scope.showConfirmation = true;
      }).
      error(function(data, status) {
        $scope.failCount = $scope.failCount + 1 || 1;
        if ($scope.failCount >= 4) {
          $scope.formError = 'Seems like there are some problems. Email us at info@robertrotberg.com if they persist.';
        } else {
          $scope.formError = 'Emailing form data failed with status '+status+' (' + data +')';
        }
        $scope.submitDisabled = false;
        $scope.submitMessage = 'Try again';
      });
    };
  }]);
