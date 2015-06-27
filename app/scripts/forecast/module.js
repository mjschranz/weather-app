/* @ngInject */
function forecastConfig($stateProvider) {
  $stateProvider.state("forecast", {
    url: "/forecast/:query",
    controller: "ForeCastController as fc",
    templateUrl: "forecast/templates/forecast.html"
  });
}

angular.module("ngApp.forecast", ["forecast.controllers"])
  .config(forecastConfig);
