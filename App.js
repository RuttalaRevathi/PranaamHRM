import React, { Component } from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { WebView } from 'react-native-webview';

export default class App extends Component {
  webref = null;

  componentDidMount() {
    this.requestLocationPermission();
    setTimeout(() => {
      const run = `true;`;
      if (this.webref) {
        this.webref.injectJavaScript(run);
      }
    }, 3000);
  }

  // 🔐 Ask for permission
  requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app requires access to your location.',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      this.getLocation(); // iOS
    }
  };

  // 📍 Get current location
  getLocation = () => {
  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log('Current location:', latitude, longitude);
      // Alert.alert('Location', `Latitude: ${latitude}, Longitude: ${longitude}`);
    },
    (error) => {
      console.log('Location Error:', error);
      // Alert.alert('Error', `Unable to fetch location: ${error.message}`);
    },
    {
      enableHighAccuracy: false,  // ⛔ GPS lock not required
      timeout: 10000,             // 10 seconds max wait
      maximumAge: 10000,          // Accept cached location if ≤10s old
      forceRequestLocation: true,
      showLocationDialog: true,
    }
  );
};



  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          ref={(r) => (this.webref = r)}
          source={{
            uri: 'https://hrm.pranaamhospitals.in/web/index.php/auth/login',
          }}
        />
      </View>
    );
  }
}
