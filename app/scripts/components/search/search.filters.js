
angular.module("search.filters", [])
  .filter("capitalize", function() {
    return function(input, scope) {
      if (input) {
        input = input.split(" ");
        return _.map(input, function(word) {
          word = word.toLowerCase();
          return word.substring(0, 1).toUpperCase() + word.substring(1);
        }).join(" ");
      }
    }
  })
  .filter("date", function() {
    return function(value) {
      // Value is in seconds vs milliseconds
      return moment(value * 1000).format("MMMM Do");
    };
  });
