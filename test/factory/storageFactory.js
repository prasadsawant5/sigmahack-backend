'use strict';

class StorageFactory {
    authToken = '';
    latitude = '';
    longitude = '';

    StorageFactory() {}

    setAuthToken(authToken) {
        this.authToken = authToken;
    }

    getAuthToken() {
        return this.authToken;
    }

    setLatitude(latitude) {
        this.latitude = latitude;
    }

    getLatitude() {
        return this.latitude;
    }

    setLongitude(longitude) {
        this.longitude = longitude;
    }

    getLongitude() {
        return this.longitude;
    }
    
    
}

module.exports = StorageFactory;