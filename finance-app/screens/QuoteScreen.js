import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layout from '../components/layout';
import { TextInput, Button, Snackbar, Portal, Surface } from 'react-native-paper';
import getToken from '../tokenGetter/getToken';

export default function QuoteScreen({ navigation }) {
  const [symbol, setSymbol] = React.useState('');
  const [stockData, setStockData] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const onDismissVisible = () => setVisible(false);

  const getQuote = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ symbol }),
        });

        const data = await response.json();

        if (response.ok) {
          setStockData(data);
        } else {
          setStockData(null);
          switch (data.error) {
            case 'no_input':
              setErrorMessage("Enter a stock's symbol to get its price");
              break;
            case 'no_stock':
              setErrorMessage('Could not find a stock with that symbol');
              break;
            default:
              setErrorMessage('An unexpected error occured');
          }
          setVisible(true);
        }
      } else {
        setStockData(null);
        setErrorMessage('Session expired, log in to continue');
        setVisible(true);
        console.log('No token found');
        navigation.navigate('Login');
      }
    } catch (error) {
      setStockData(null);
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
          outlineColor="blue"
          activeOutlineColor="blue"
        />
        <Button
          mode="contained"
          style={styles.button}
          buttonColor="blue"
          onPress={() => {
            if (symbol == '') {
              setErrorMessage("Enter a stock's symbol to get its price");
              setVisible(true);
            } else {
              getQuote();
            }
          }}
        >
          Get Quote
        </Button>

        {stockData && (
          <View style={{ margin: 30 }}>
            <Surface style={styles.surface}>
              <Text style={{ fontSize: 50 }}>{stockData.name}</Text>
              <Text style={{ fontSize: 30 }}>${stockData.price}</Text>
            </Surface>
          </View>
        )}

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
  surface: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#EEF5FF',
  },
});
