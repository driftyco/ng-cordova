//  install   :   cordova plugin add cordova-plugin-battery-status
//  link      :   https://github.com/apache/cordova-plugin-battery-status

angular.module('ngCordova.plugins.batteryStatus', [])

  .factory('$cordovaBatteryStatus', ['$rootScope', '$window', '$timeout', function ($rootScope, $window, $timeout) {

    var service = {
      level: null,
      isPlugged: null
    };

    /**
      * @param {string} status
      */
    var batteryStatus = function (status) {
      $timeout(function () {
        service.level = status.level;
        service.isPlugged = status.isPlugged;
        $rootScope.$broadcast('$cordovaBatteryStatus:status', status);
      });
    };

    /**
      * @param {string} status
      */
    var batteryCritical = function (status) {
      $timeout(function () {
        service.level = status.level;
        service.isPlugged = status.isPlugged;
        $rootScope.$broadcast('$cordovaBatteryStatus:critical', status);
      });
    };

    /**
      * @param {string} status
      */
    var batteryLow = function (status) {
      $timeout(function () {
        service.level = status.level;
        service.isPlugged = status.isPlugged;
        $rootScope.$broadcast('$cordovaBatteryStatus:low', status);
      });
    };
  
    document.addEventListener('deviceready', function () {
      if (navigator.battery) {
        $window.addEventListener('batterystatus', batteryStatus, false);
        $window.addEventListener('batterycritical', batteryCritical, false);
        $window.addEventListener('batterylow', batteryLow, false);
        
        $timeout(function () {  
          service.level = navigator.battery.level;
          service.isPlugged = navigator.battery.isPlugged;
        });
      }
    }, false);
    
    return service;
  }])
  .run(['$injector', function ($injector) {
    $injector.get('$cordovaBatteryStatus'); //ensure the factory and subsequent event listeners get initialised
  }]);
