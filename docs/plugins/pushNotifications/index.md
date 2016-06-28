---
layout: docs-plugins
title: ngCordova - Document and Examples - by the Ionic Framework Team

plugin-name:  $cordovaPush
source: https://github.com/driftyco/ng-cordova/blob/master/src/plugins/push.js
official-docs: https://github.com/phonegap-build/PushPlugin
icon-apple: true
icon-android: true
icon-windows: true
---

# [DEPRECATED] 
## The `PushPlugin` is deprecated. Use the `$cordovaPushV5` which is the service for [phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push).

Allows your application to receive push notifications. To receive notifications in your controllers or services, listen for `$cordovaPush:notificationReceived` event.

Note: Ionic offers a tightly-integrated Push Notification service to make sending and receiving push notifications easy for Ionic apps: [Ionic Push docs](http://docs.ionic.io/v1.0/docs/push-from-scratch)


```
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
```

#### Methods

##### `register(config)`

| Param        | Type           | Detail  |
| ------------ |----------------| --------|
| config       | `Object`       | Configuration object for setting default values |

> **Returns** `Object` with user information, such as id, lastName


##### `unregister(options)`

| Param        | Type           | Detail  |
| ------------ |----------------| --------|
| options      | `Object`       | Options for unregistering push-notifications (not generally needed) |


##### `$rootScope.$on('$cordovaPush:notificationReceived', func(event, notification))`

| Returns      | Type           | Detail  |
| ------------ |----------------| --------|
| event        | `Object`       | Default Angular event passed into the listener (not used in push notifications) |
| notification | `Object`       | Notification received from server |


##### `setBadgeNumber(number)` *- iOS only*

| Param        | Type           | Detail  |
| ------------ |----------------| --------|
| number       | `Integer`      | Set the badge count visible when the app is not running |


#### Example - iOS

Setup Push Notifications when the App is first opened:

```javascript
module.run(function($http, $cordovaPush) {

  var iosConfig = {
    "badge": true,
    "sound": true,
    "alert": true,
  };

  document.addEventListener("deviceready", function(){
    $cordovaPush.register(iosConfig).then(function(deviceToken) {
      // Success -- send deviceToken to server, and store for future use
      console.log("deviceToken: " + deviceToken)
      $http.post("http://server.co/", {user: "Bob", tokenID: deviceToken})
    }, function(err) {
      alert("Registration error: " + err)
    });


    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      if (notification.alert) {
        navigator.notification.alert(notification.alert);
      }

      if (notification.sound) {
        var snd = new Media(event.sound);
        snd.play();
      }

      if (notification.badge) {
        $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });
      }
    });

    // WARNING! dangerous to unregister (results in loss of tokenID)
    $cordovaPush.unregister(options).then(function(result) {
      // Success!
    }, function(err) {
      // Error
    });

  }, false);
```

#### Example - Android

Setup Push Notifications when the App is first opened:

```javascript
module.run(function($cordovaPush) {

  var androidConfig = {
    "senderID": "replace_with_sender_id",
  };

  document.addEventListener("deviceready", function(){
    $cordovaPush.register(androidConfig).then(function(result) {
      // Success
    }, function(err) {
      // Error
    })

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            alert('registration ID = ' + notification.regid);
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });


    // WARNING: dangerous to unregister (results in loss of tokenID)
    $cordovaPush.unregister(options).then(function(result) {
      // Success!
    }, function(err) {
      // Error
    })

  }, false);
});
```


#### Additional Resources

- [Local and Push Notification Programming Guide](http://developer.apple.com/library/mac/#documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/ApplePushService/ApplePushService.html) (Apple)
- [Apple Push Notification Services Tutorial: Part 1/2](http://www.raywenderlich.com/3443/apple-push-notification-services-tutorial-part-12)
- [Apple Push Notification Services Tutorial: Part 2/2](http://www.raywenderlich.com/3525/apple-push-notification-services-tutorial-part-2)
- [Google Cloud Messaging for Android](http://developer.android.com/guide/google/gcm/index.html) (Android)
- [How to Implement Push Notifications for Android](http://tokudu.com/2010/how-to-implement-push-notifications-for-android/)
