/* @ngInject */
function SearchController($scope, $location) {
  this.searchTerm = $scope.initQuery || "";

  this.search = function(evt) {

    if (evt.which === 13 || evt.type === "click") {
      $location.search("query", this.searchTerm);
    }
  }
}

angular.module("search.controllers", [])
  .controller("SearchController", SearchController);
