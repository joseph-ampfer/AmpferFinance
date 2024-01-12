import React from 'react';
import { View, StyleSheet } from 'react-native';
import Layout from '../components/layout';
import { Button, Portal, Snackbar, TextInput } from 'react-native-paper';
import getToken from '../tokenGetter/getToken';

export default function WithdrawlScreen({ navigation }) {
  const [withdrawl, setWithdrawl] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const onDismissVisible = () => setVisible(false);

  const withdrawlFunction = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/withdrawl', {
          method: 'Post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ withdrawl }),
        });

        if (response.ok) {
          navigation.navigate('Index');
        } else {
          const data = await response.json();
          switch (data.error) {
            case 'no_input':
              setErrorMessage('Enter an amount to withdrawl');
              break;
            case 'not_number':
              setErrorMessage('Enter a number');
              break;
            case 'not_positive':
              setErrorMessage('Enter a positive amount');
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
      console.log('Error:', error);
    }
  };

  return (
    <Layout navigation={navigation}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
          keyboardType="number-pad"
          label="Withdrawl amount"
          onChangeText={(withdrawl) => setWithdrawl(Number(withdrawl))}
          mode="outlined"
          autoComplete="off"
          autoCompleteType="off"
          autoCorrect={false}
          style={styles.input}
          outlineColor="blue"
          activeOutlineColor="blue"
        ></TextInput>
        <Button
          mode="contained"
          buttonColor="blue"
          style={styles.button}
          onPress={() => {
            if (withdrawl <= 0) {
              setErrorMessage('Enter a positive amount');
              setVisible(true);
            } else {
              withdrawlFunction();
            }
          }}
        >
          Withdrawl
        </Button>
        <Portal>
          <Snackbar visible={visible} onDismiss={onDismissVisible} style={{ bottom: 0 }}>
            {errorMessage}
          </Snackbar>
        </Portal>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 200,
    marginBottom: 20,
  },
  button: {
    width: 200,
  },
});
