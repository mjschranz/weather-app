/* @ngInject */
function SearchService($http, $q, $rootScope) {
  return {
    getData: function(query, unit) {
      query = (query || "").trim();

      if (!query) {
        return $q.when(query);
      }

      var req = {
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/forecast/daily",
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          q: query,
          cnt: 5,
          units: unit || "metric"
        }
      };

      $rootScope.requestActive = true;
      return $http(req);
    }
  };
}

angular.module("search.services", [])
  .service("SearchService", SearchService);
