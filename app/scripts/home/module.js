/* @ngInject */
function homeConfig($stateProvider) {
  $stateProvider.state("home", {
    url: "/",
    controller: "HomeController as hc",
    templateUrl: "home/templates/home.html"
  });
}

angular.module("ngApp.home", ["home.controllers"])
  .config(homeConfig);
