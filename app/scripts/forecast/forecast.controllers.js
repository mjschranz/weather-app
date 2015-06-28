/* @ngInject */
function ForeCastController($scope, SearchService, $stateParams, $location, $state) {
  var self = this;

  function getData() {
    SearchService.getData(self.query, self.unit)
      .then(function onSuccess(res) {
        if (res) {
          self.city = res.data.city;
          self.results = res.data.list;
        }
      }, function onError() {
        // TODO
      });
  }

  if ($stateParams.query) {
    this.previousQuery = this.query = $stateParams.query;
    this.previousUnit = this.unit = $stateParams.unit;
    getData();
  }

  $scope.$on("$locationChangeSuccess", function() {
    if ($location.search()["query"]) {
      $state.go("forecast", $location.search(), { inherit: false });
    }
  });
}

angular.module("forecast.controllers", [])
  .controller("ForeCastController", ForeCastController);
