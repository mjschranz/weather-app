/* @ngInject */
function ForeCastController($scope, SearchService, $stateParams, $location,
                            $state, $rootScope) {
  var self = this;

  function getData() {
    SearchService.getData(self.query, self.unit)
      .then(function onSuccess(res) {
        $rootScope.requestActive = false;
        if (res) {
          self.city = res.data.city;
          self.results = res.data.list;
        }
      }, function onError() {
        $rootScope.requestActive = false;
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
