/* @ngInject */
function HomeController($scope, $state, $location) {
  $scope.$on("$locationChangeSuccess", function() {
    $state.go("forecast", $location.search(), { inherit: false });
  });
}

angular.module("home.controllers", [])
  .controller("HomeController", HomeController);
