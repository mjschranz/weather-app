/* @ngInject */
function appConfig($urlRouterProvider,
                   $locationProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");
}

angular
    .module("ngApp", [
      "ui.router.state",
      "ui.bootstrap",

      "ngApp.home",
      "ngApp.forecast",
      "ngApp.components",
      "templates"
    ])
    .config(appConfig);
