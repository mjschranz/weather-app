/* @ngInject */
function ForeCastController($scope, SearchService, $stateParams, $location, $state) {
  var self = this;

  function getData() {
    SearchService.getData(self.query)
      .then(function onSuccess(res) {
        console.log(res.data);
      }, function onError() {
        // TODO
      });
  }

  if ($stateParams.query) {
    this.previousQuery = this.query = $stateParams.query;
    getData();
  }

  $scope.$on("$locationChangeSuccess", function() {
    if ($location.search()["query"] && $location.search()["query"] !== self.query) {
      $state.go("forecast", $location.search(), { inherit: false });
    }
  });
}

angular.module("forecast.controllers", [])
  .controller("ForeCastController", ForeCastController);
