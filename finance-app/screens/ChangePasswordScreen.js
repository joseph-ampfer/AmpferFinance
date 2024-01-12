import React from 'react';
import { View, StyleSheet } from 'react-native';
import Layout from '../components/layout';
import { TextInput, Button, Snackbar, Portal } from 'react-native-paper';
import getToken from '../tokenGetter/getToken';

const ChangePasswordScreen = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const onDismissVisible = () => setVisible(false);

  const change = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/change', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, currentPassword, newPassword, confirm }),
        });

        if (response.ok) {
          navigation.navigate('Login');
        } else {
          const data = await response.json();
          switch (data.error) {
            case 'invalid':
              setErrorMessage('Invalid username or password');
              break;
            case 'not_matched':
              setErrorMessage('New passwords do not match');
              break;
            default:
              setErrorMessage('An unexpected error occured');
          }
          setVisible(true);
        }
      } else {
        setErrorMessage('Session expired, log in to continue');
        setVisible(true);
        console.log('No token found');
        navigation.navigate('Login');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occured. Please try again later.');
      setVisible(true);
      console.error('Error:', error);
    }
  };

  return (
    <Layout navigation={navigation}>
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
            label="Current password"
            value={currentPassword}
            onChangeText={(currentPassword) => setCurrentPassword(currentPassword)}
            style={styles.input}
            mode="outlined"
            secureTextEntry={true}
            outlineColor="blue"
            activeOutlineColor="blue"
          />
          <TextInput
            label="New password"
            value={newPassword}
            onChangeText={(newPassword) => setNewPassword(newPassword)}
            style={styles.input}
            mode="outlined"
            secureTextEntry={true}
            outlineColor="blue"
            activeOutlineColor="blue"
          />
          <TextInput
            label="Confirm new password"
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
              if (username == '' || currentPassword == '' || newPassword == '') {
                setErrorMessage('Enter username, password, and new password');
                setVisible(true);
              } else if (newPassword != confirm) {
                setErrorMessage('New passwords do not match');
                setVisible(true);
              } else {
                change();
              }
            }}
          >
            Change Password
          </Button>
          <Portal>
            <Snackbar visible={visible} onDismiss={onDismissVisible} style={{ bottom: 0 }}>
              {errorMessage}
            </Snackbar>
          </Portal>
        </View>
      </View>
    </Layout>
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
  button: {
    width: 200,
  },
});

export default ChangePasswordScreen;
