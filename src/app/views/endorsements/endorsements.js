angular.module('app.views.endorse', [])
  .controller('EndorseCtrl', ['$scope', function ($scope) {
    $scope.endorsements = [];
    $scope.errorLoadingEndorsements = false;
    var EndorsementCollection = Parse.Collection.extend({
      model: Parse.Object.extend('Endorsement')
    });

    var collection = new EndorsementCollection();
    collection.fetch({
      success: function(collection) {
        $scope.$apply(function(){
          collection.each(function(endorsement) {
            $scope.endorsements.push({name:endorsement.get('name')});
          });
        });
      },
      error: function(collection, error) {
        console.warn('Could not retrieve endorsements because ' + error);
        $scope.errorLoadingEndorsements = true;
      }
    });
  }]);
