import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Portal } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LayoutLogin from '../components/layoutLogin';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const onDismissVisible = () => setVisible(false);

  const login = async () => {
    try {
      const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // STORE TOKEN ON USER SIDE
        await AsyncStorage.setItem('userToken', data['access_token']);
        setUsername('');
        setPassword('');
        navigation.navigate('Index');
      } else {
        switch (data.error) {
          case 'no_input':
            setErrorMessage('Input your username and password');
            break;
          case 'invalid':
            setErrorMessage('Invalid username or password');
            break;
          default:
            setErrorMessage('An unexpected error occured');
        }
        setVisible(true);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occured. Please try again later.');
      setVisible(true);
      console.error('Error:', error);
    }
  };

  return (
    <LayoutLogin navigation={navigation}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View>
          <TextInput
            label="Username"
            value={username}
            onChangeText={(username) => setUsername(username)}
            style={styles.input}
            mode="outlined"
            outlineColor="blue"
            activeOutlineColor="blue"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={(password) => setPassword(password)}
            style={styles.input}
            mode="outlined"
            outlineColor="blue"
            activeOutlineColor="blue"
            secureTextEntry={true}
          />
          <Button
            mode="contained"
            style={styles.button}
            buttonColor="blue"
            onPress={() => {
              if (username == '' || password == '') {
                setErrorMessage('Input your username and password');
                setVisible(true);
              } else {
                login();
              }
            }}
          >
            Log In
          </Button>
          <Portal>
            <Snackbar visible={visible} onDismiss={onDismissVisible} style={{ bottom: 0 }}>
              {errorMessage}
            </Snackbar>
          </Portal>
        </View>
      </View>
    </LayoutLogin>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 200,
    marginBottom: 20,
  },
  button: {
    width: 200,
  },
});

export default LoginScreen;
