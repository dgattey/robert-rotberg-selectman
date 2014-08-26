angular.module('app.views.endorse', [])
  .controller('EndorseCtrl', ['$scope', function ($scope) {
    $scope.endorsements = [];
    $scope.errorLoadingEndorsements = false;

    var Endorsement = Parse.Object.extend('Endorsement');
    var query = new Parse.Query(Endorsement);
    query.limit(1000);
    query.find({
      success: function(collection) {

        $scope.$apply(function(){
          for (var i = 0; i < collection.length; i++) {
            var name = collection[i].get('name'),
                withoutEnding = name.split(',')[0].trim(),
                nameArray = withoutEnding.split(' '),
                lastName = nameArray[nameArray.length-1].trim();
            if (!lastName || lastName === '' || lastName === ' '){
              lastName = nameArray[nameArray.length-2].trim();
            }
            $scope.endorsements.push({
              name: name,
              lastName: lastName
            });
          }
        });
      },
      error: function(collection, error) {
        console.warn('Could not retrieve endorsements because ', error);
        $scope.errorLoadingEndorsements = true;
      }
    });
  }]);
