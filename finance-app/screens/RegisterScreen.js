import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Portal, Surface } from 'react-native-paper';
import LayoutLogin from '../components/layoutLogin';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const onDismissVisible = () => setVisible(false);

  const register = async () => {
    try {
      const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Login');
      } else {
        switch (data.error) {
          case 'no_input':
            setErrorMessage('Enter a username and password');
            break;
          case 'name_taken':
            setErrorMessage('Username taken, please choose another username');
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
        <View style={styles.textContainer}>
          <Surface style={styles.surfaceText} elevation={1}>
            <Text style={styles.text}>Register a new user</Text>
          </Surface>
        </View>
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
            secureTextEntry={true}
            outlineColor="blue"
            activeOutlineColor="blue"
          />
          <TextInput
            label="Confirm Password"
            value={confirm}
            onChangeText={(confirm) => setConfirm(confirm)}
            style={styles.input}
            mode="outlined"
            secureTextEntry={true}
            outlineColor="blue"
            activeOutlineColor="blue"
          />
          <Button
            mode="contained"
            style={styles.button}
            buttonColor="blue"
            onPress={() => {
              if (username == '' || password == '') {
                setErrorMessage('Enter a username and password');
                setVisible(true);
              } else if (password != confirm) {
                setErrorMessage('Passwords do not match');
                setVisible(true);
              } else {
                register();
              }
            }}
          >
            Register
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
  text: {
    marginBottom: 30,
    fontSize: 20,
    color: 'purple',
  },
  surfaceText: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    //backgroundColor: '#c8dcf7'
  },
  textContainer: {
    //alignItems: 'flex-end',
    //alignSelf: 'flex-end',
    //marginRight: 30,
  },
  text: {
    fontSize: 20,
    color: 'blue',
  },
  button: {
    width: 200,
  },
});

export default RegisterScreen;
