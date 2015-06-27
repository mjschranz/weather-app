/* @ngInject */
function SearchController($scope, SearchService, $state, $location) {
  this.searchTerm = $scope.initQuery || "";

  this.search = function(evt) {

    if (evt.which === 13 || evt.type === "click") {
      $location.search("query", this.searchTerm);
    }
  }
}

angular.module("search.controllers", ["search.services"])
  .controller("SearchController", SearchController);
