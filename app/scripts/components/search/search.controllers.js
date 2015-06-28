/* @ngInject */
function SearchController($scope, $location) {
  this.searchTerm = $scope.initQuery || "";
  this.unit = $scope.initUnit || "metric";

  this.search = function(evt) {
    if (evt.which === 13 || evt.type === "click") {
      $location.search({
        "query": this.searchTerm,
        "unit": this.unit
      });
    }
  };

  this.setUnit = function(unit) {
    this.unit = unit;
    $location.search({
      "query": this.searchTerm,
      "unit": this.unit
    });
  };
}

angular.module("search.controllers", [])
  .controller("SearchController", SearchController);
