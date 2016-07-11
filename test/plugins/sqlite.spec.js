describe('Service: $cordovaSQLite', function() {

  var $cordovaSQLite, $rootScope, dbMock;

  beforeEach(module('ngCordova.plugins.sqlite'));

  beforeEach(inject(function (_$cordovaSQLite_, _$rootScope_) {
    $cordovaSQLite = _$cordovaSQLite_;
    $rootScope = _$rootScope_;

    window.sqlitePlugin = {
      openDatabase: angular.noop,
      deleteDatabase: angular.noop
    };
  }));

  it('should call window\'s sqlitePlugin.open method without background', function() {

    var dbName = 'someDbName';
    var location = "default";
    var iosLocation = "default";
    spyOn(window.sqlitePlugin, 'openDatabase');
    $cordovaSQLite.openDB({name: dbName, location:location, iosDatabaseLocation: iosLocation});

    expect(window.sqlitePlugin.openDatabase).toHaveBeenCalledWith({
      name: dbName, bgType: undefined, location: location, iosDatabaseLocation: iosLocation
    });
  });

  it('should call window\'s sqlitePlugin.open method with background', function() {

    var dbName = 'someDbName';
    var bgType = 2;
    var location = "default";
    var iosLocation = "default";
    spyOn(window.sqlitePlugin, 'openDatabase');
    $cordovaSQLite.openDB(dbName, bgType, location, iosLocation);

    expect(window.sqlitePlugin.openDatabase).toHaveBeenCalledWith({
      name: dbName,
      bgType: bgType,
      location: location,
      iosDatabaseLocation: iosLocation
    });
  });

  it('should call window\'s sqlitePlugin.open method with options', function() {

    var dbName = 'someDbName';
    var location = "default";
    var iosLocation = "default";
    spyOn(window.sqlitePlugin, 'openDatabase');
    $cordovaSQLite.openDB({name: dbName, location:location, iosDatabaseLocation: iosLocation});

    expect(window.sqlitePlugin.openDatabase).toHaveBeenCalledWith({
      name: dbName,
      location: location,
      iosDatabaseLocation: iosLocation
    });
  });

  it('should call window\'s sqlitePlugin.deleteDB method', function() {

    var result;
    var dbName = 'someDbName';
    var location = "default";
    var iosLocation = "default";
    var options = {name: dbName, location:location, iosDatabaseLocation:iosLocation};
    

    spyOn(window.sqlitePlugin, 'deleteDatabase')
      .and.callFake(function (options, successCb, errorCb) {
        successCb(true);
      });

    $cordovaSQLite.deleteDB(options, location, iosLocation)
      .then(function (response) {
        result = response;
      });

    $rootScope.$digest();

    expect(result).toBe(true);
  });

  it('should call errorCb when in window\'s sqlitePlugin.deleteDatabase a error orccurs', function() {

    var result;
    var errorObj = { someError: 1 };
    var dbName = 'someDbName';
    var location = "default";
    var iosLocation = "default";

    spyOn(window.sqlitePlugin, 'deleteDatabase')
      .and.callFake(function (dbName, location, iosLocation, successCb, errorCb) {
        errorCb(errorObj);
      });

    $cordovaSQLite.deleteDB(dbName)
      .then(angular.noop, function (response) {
        result = response;
      });

    $rootScope.$digest();

    expect(result).toBe(errorObj);
  });

});
