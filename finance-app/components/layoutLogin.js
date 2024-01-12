import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import NavigationBar from './NavigationBar';

const LayoutLogin = ({ children, navigation }) => {
  // User is not logged in
  const isLoggedIn = false;

  return (
    <View style={styles.mainContainer}>
      {/* Navigation Bar */}
      <NavigationBar navigation={navigation} isLoggedIn={isLoggedIn} />

      <ImageBackground source={require('../assets/background7.png')} style={styles.background} resizeMode="cover">
        {/* Main Content */}
        <View style={{ flex: 1 }}>{children}</View>
      </ImageBackground>

      {/* Footer */}
      <View>
        <Text style={styles.text}>Data provided by Yahoo</Text>
      </View>
    </View>
  );
};

export default LayoutLogin;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    backgroundColor: 'black',
    color: 'white'
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
