import React from 'react';
import { View, StyleSheet } from 'react-native';
import Layout from '../components/layout';
import { TextInput, Button, Snackbar, Portal } from 'react-native-paper';
import getToken from '../tokenGetter/getToken';

export default function BuyScreen({ navigation }) {
  const [symbol, setSymbol] = React.useState('');
  const [shares, setShares] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const onDismissVisible = () => setVisible(false);

  const buy = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/buy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ symbol, shares }),
        });

        if (response.ok) {
          navigation.navigate('Index');
        } else {
          const data = await response.json();
          switch (data.error) {
            case 'bad_funds':
              setErrorMessage('Insufficient funds to make purchase');
              break;
            case 'no_stock':
              setErrorMessage('Could not find stock');
              break;
            case 'no_symbol':
              setErrorMessage('Must enter a symbol');
              break;
            case 'not_whole':
              setErrorMessage('Must input a whole number of shares');
              break;
            case 'not_positive':
              setErrorMessage('Must input a positive number of shares');
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
        <TextInput
          label="Stock symbol"
          value={symbol}
          onChangeText={(symbol) => setSymbol(symbol)}
          style={styles.input}
          mode="outlined"
          autoComplete="off"
          outlineColor="blue"
          activeOutlineColor="blue"
        />
        <TextInput
          keyboardType="number-pad"
          label="Shares"
          onChangeText={(shares) => setShares(Number(shares))}
          style={styles.input}
          mode="outlined"
          autoComplete="off"
          autoCorrect={false}
          autoCompleteType="off"
          outlineColor="blue"
          activeOutlineColor="blue"
        />
        <Button
          mode="contained"
          style={styles.button}
          buttonColor="blue"
          onPress={() => {
            if (symbol == '') {
              setErrorMessage('Must enter a symbol');
              setVisible(true);
            } else if (!Number.isInteger(shares)) {
              setErrorMessage('Enter whole shares only');
              setVisible(true);
            } else if (shares <= 0) {
              setErrorMessage('Must input a positive number of shares');
              setVisible(true);
            } else {
              buy();
            }
          }}
        >
          Buy stock
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
  text: {
    marginBottom: 30,
    fontSize: 20,
    color: 'purple',
  },
  button: {
    width: 200,
  },
});
