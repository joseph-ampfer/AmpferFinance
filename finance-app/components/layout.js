import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import NavigationBar from './NavigationBar';

const Layout = ({ children, navigation }) => {
  const isLoggedIn = true;

  return (
    <View style={styles.mainContainer}>
      {/* Navigation Bar */}
      <NavigationBar navigation={navigation} isLoggedIn={isLoggedIn} />

      <ImageBackground source={require('../assets/background7.png')} style={styles.background} resizeMode="cover">
        {/* Main Content */}
        <View style={{ flex: 1 }}>{children}</View>
      </ImageBackground>

      {/* Footer */}
      <View></View>
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
