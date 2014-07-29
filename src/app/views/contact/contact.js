angular.module('app.views.contact', [])
  .controller('ContactCtrl', ['$scope', '$http', function ($scope, $http) {
    // Use x-www-form-urlencoded Content-Type
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     */
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
    $http.defaults.transformRequest = [function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

    $scope.submitMessage = 'Send Message';

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
      $scope.submitMessage = 'Sending Message ...';
      $http.post('php/sendMail.php', {
        'name' : $scope.name || ' ',
        'email' : $scope.email || ' ',
        'phone' : $scope.phone || ' ',
        'message' : $scope.message || ' '
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
        if ($scope.failCount >= 3) {
          $scope.formError = 'Seems like there are some problems. Email us at info@robertrotberg.com if they persist.';
        } else {
          $scope.formError = 'Emailing form data failed with status '+status+' (' + data +')';
        }
        $scope.submitDisabled = false;
        $scope.submitMessage = 'Try again';
      });
    };

  }]);
