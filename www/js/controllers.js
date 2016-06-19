var host = "http://10.41.199.76:5060";

angular.module('starter.controllers', [])

.controller('ArticlesCtrl', function($scope, $http) {
  $scope.articles = [];

  $http.get(host + "/articles").success(function(res) {
    console.log(res);
    $scope.articles = res.articles;
  });
})

.controller('ArticleDetailCtrl', function($scope, $stateParams, $http) {
  $scope.article = {};
  $scope.similar_articles = [];

  $http.get(host + "/articles/" + $stateParams.articleId).success(function(res) {
    console.log(res);
    $scope.article = res.article;
    $scope.similar_articles = res.similar_articles;
  });
})

.controller('GraphCtrl', function($scope, $stateParams, $http, Graph) {
  var color = d3.scale.category20()
  $scope.options = {
    chart: {
      type: 'forceDirectedGraph',
      height: (function(){ return nv.utils.windowSize().height })(),
      width: (function(){ return nv.utils.windowSize().width })(),
      margin:{top: 0, right: 0, bottom: 0, left: 0},
      color: function(d){
        return color(d.group)
      },
      zoom: {
        //NOTE: All attributes below are optional
        enabled: true,
        scale: 1,
        scaleExtent: [1, 10],
        translate: [0, 0],
        useFixedDomain: false,
        useNiceScale: false,
        horizontalOff: false,
        verticalOff: false,
        zoomed: function(xDomain, yDomain) {
          var domains = {x1: 0, x2: 0, y1: 1, y2: 1};
          return domains;
        },
        unzoomed: function(xDomain, yDomain) {
          var domains = {x1: 0, x2: 0, y1: 0, y2: 0};
          return domains;
        },
        unzoomEventType: 'dblclick.zoom'
      },
      nodeExtras: function(node) {
        node && node
        .append("text")
        .attr("dx", 6)
        .attr("dy", ".3em")
        .text(function(d) { return d.name })
        .style('font-size', '8px');
      }
    }
  };

  $scope.data = Graph.all();
  $http.get(host + "/articles/graph").success(function(res) {
    console.log(res);
    $scope.data = res.data;
  });
})

.controller('DashCtrl', function($scope, TDCardDelegate, $http) {
  var cardTypes = [
    { image: 'img/max.png' },
    { image: 'img/ben.png' },
    { image: 'img/perry.png' },
    { image: 'img/mike.png' },
    { image: 'img/adam.jpg' },
  ];

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.unshift(angular.extend({}, newCard));
  }

  $scope.cards = [];
  //for(var i = 0; i < 3; i++) $scope.addCard();
  $http.get(host + "/articles/simple").success(function(res) {
    console.log(res);
    $scope.cards = res.articles;
  });
})

.controller('CardCtrl', function($scope, TDCardDelegate) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };
});
