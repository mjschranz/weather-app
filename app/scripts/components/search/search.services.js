/* @ngInject */
function SearchService($http, $q, $window) {
  return {
    getData: function(query) {
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
          units: "metric"
        }
      };

      return $http(req);
    }
  };
}

angular.module("search.services", [])
  .service("SearchService", SearchService);
