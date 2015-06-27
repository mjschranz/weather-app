/* @ngInject */
function SearchWeather() {
  return {
    restrict: "E",
    templateUrl: "components/search/templates/search.html",
    controller: "SearchController as sc",
    replace: true,
    scope: {
      initQuery: "="
    }
  };
}

angular.module("search.directives", [])
  .directive("searchWeather", SearchWeather);
