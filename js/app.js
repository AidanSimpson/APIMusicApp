// Ionic Starter App

//Resources
//MusicGraph API  https://developer.musicgraph.com/api-docs/v2/artists
//http://ionicframework.com/docs/components/#header
//http://www.jsoneditoronline.org/

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var MusicGraphApp = angular.module('MusicGraphApp', ['ionic', 'ngRoute', 'ngSanitize'])

.run(function($ionicPlatform,$rootScope,$location) {

  $rootScope.returnHome = function(){
      $location.path('/list') //You can access this route anywhere in the application as it is in the rootScope
  };

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

MusicGraphApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/list',
    {
      controller: 'ListController',
      templateUrl: 'partials/list.html'
    })
    .when('/details/:itemId',{
      controller: 'DetailsController',
      templateUrl: 'partials/details.html'
    }) //:itemId stores a variable
    .otherwise({redirectTo: '/list'});
}]);

MusicGraphApp.controller('ListController', function($scope, $http, $ionicLoading){ //use built in ionic spinner
$scope.artistRefresh = function(){
  $ionicLoading.show(); //start the built in Ionic spinner
  $http.get("http://api.musicgraph.com/api/v2/artist/search?api_key=12e04077569ccad32feddb3b02f74b62&genre=rock") //request for the MusicGraph API
  .success(function(response){
    console.log(response.data);

    $scope.artists = response.data;
    //$scope.artists.musicbrainz_image_url = $scope.artists.url;
    //$scope.artists.musicbrainz_image_url = $scope.artists.url.substring(48,52);

    $ionicLoading.hide(); //hides the ionic loader
  })
  .finally(function(){
    $scope.$broadcast('scroll.refreshComplete')
  });
}

$scope.artistRefresh();
});

//Addition minification syntax
MusicGraphApp.controller('DetailsController', ['$scope', '$http', '$ionicLoading', '$routeParams', function($scope, $http, $ionicLoading, $routeParams){

  //$ionicLoading.show(); commented this out because in the API some artist did mot have images, which caused the detail page to keep refreshing
  console.log($routeParams.itemId)

  $http.get("http://api.musicgraph.com/api/v2/artist/search?api_key=12e04077569ccad32feddb3b02f74b62&genre=rock")
  .success(function(response, data){

    $scope.artistDetail = response.data[$routeParams.itemId]; //grab the info based on the id
    $scope.artistDetail.artistImage = $scope.artistDetail.musicbrainz_image_url.substr(40); //cut the original like to just get the file name

    //$scope.artistDetail.artistImage = $scope.artistDetail.musicbrainz_image_url.substr(40);
      // the link that the api gives... it only goes to the site where the image is located
      // https://commons.wikimedia.org/wiki/File:Coldplay_Viva_La_Vida_Tour_in_Hannover_August_25th_2009.jpg

      // these are two of the actual links to the images themselves
      // https://upload.wikimedia.org/wikipedia/commons/7/7a/Coldplay_Viva_La_Vida_Tour_in_Hannover_August_25th_2009.jpg
      // https://upload.wikimedia.org/wikipedia/commons/0/07/Metallica_at_The_O2_Arena_London_2008.jpg

      //In the HTML I had the first part, and the here...
        //I cropped it so I would only get the file name (Coldplay_Viva_La_Vida_Tour_in_Hannover_August_25th_2009.jpg)
        //but the few bits that change in the middle messed it all up (/7/7a)

    $ionicLoading.hide(); //hides the ionic loader
  });
}]);