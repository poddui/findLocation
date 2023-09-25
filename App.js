import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Button, Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_KEY } from '@env';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


export default function App() {

  const [text, setText] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [mapKey, setMapKey] = useState(1);
  const { width, height } = Dimensions.get('window');
  const [isMapReady, setIsMapReady] = useState(false); 


  useEffect(() => {
    currentLocation();
  }, []);

  const currentLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      Alert.alert('No permission to get location!')
      return;
    }
    let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude)
    console.log(longitude)
    console.log(latitude)
    setIsMapReady(true);
  }

  const findLocation = async () => {
    try {
      const response = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${text}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLatitude(data.results[0].locations[0].displayLatLng.lat);
      setLongitude(data.results[0].locations[0].displayLatLng.lng);
      setMapKey(mapKey + 1); 
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>{latitude} & {longitude}</Text>
      <MapView
        key={mapKey} 
        style={{ flex: 1, height: height, width: width }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
        region={{ 
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
        >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title={text} />
      </MapView>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="enter address"
      />
      <Button
        title="Find location"
        onPress={() => findLocation()}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 350,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
