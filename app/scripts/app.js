/* @ngInject */
function appConfig($urlRouterProvider,
                   $locationProvider,
                   RestangularProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");
  RestangularProvider.setBaseUrl("http://api.openweathermap.org/data/2.5/forecast");
}

angular
    .module("ngApp", [
      "ui.router.state",
      "ui.bootstrap",
      "restangular",

      "ngApp.home",
      "ngApp.forecast",
      "ngApp.components",
      "templates"
    ])
    .config(appConfig);
