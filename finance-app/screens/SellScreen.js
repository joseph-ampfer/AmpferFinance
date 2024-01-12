import React from 'react';
import { View, StyleSheet } from 'react-native';
import Layout from '../components/layout';
import { TextInput, Button, Snackbar, Portal, ActivityIndicator } from 'react-native-paper';
import getToken from '../tokenGetter/getToken';
import { SelectList } from 'react-native-dropdown-select-list';
import { useFocusEffect } from '@react-navigation/native';

export default function SellScreen({ navigation }) {
  const [data, setData] = React.useState([]);
  const [selected, setSelected] = React.useState('');
  const [shares, setShares] = React.useState('');
  const [loaded, setLoaded] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const onDismissVisible = () => setVisible(false);

  const sellStock = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/sell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ selected, shares }),
        });

        if (response.ok) {
          navigation.navigate('Index');
        } else {
          const data = await response.json();
          switch (data.error) {
            case 'no_input':
              setErrorMessage('Choose a stock to sell');
              break;
            case 'no_ownership':
              setErrorMessage('You do not own that many shares');
              break;
            case 'not_whole':
              setErrorMessage('Enter a whole number of shares');
              break;
            case 'not_positive':
              setErrorMessage('Enter a positive number of shares');
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

  const getSymbols = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/sell', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          let newArray = data['symbols'].map((item) => {
            return { key: item.symbol, value: item.symbol };
          });
          setData(newArray);
          setLoaded(true);
        } else {
          setErrorMessage('An unexpected error occured retrieving your data');
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

  useFocusEffect(
    React.useCallback(() => {
      getSymbols();
    }, [])
  );

  return (
    <Layout navigation={navigation}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {loaded ? (
          <View>
            <SelectList
              setSelected={setSelected}
              data={data}
              save="value"
              onSelect={() => alert(selected)}
              boxStyles={styles.dropdownbox}
              placeholder="Select stock"
              inputStyles={styles.inputStyles}
              searchPlaceholder="Search"
              dropdownTextStyles={styles.dropdownTextStyles}
              dropdownStyles={styles.dropdownStyles}
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
                if (selected == '') {
                  setErrorMessage('Choose a stock to sell');
                  setVisible(true);
                } else if (!Number.isInteger(shares)) {
                  setErrorMessage('Enter a whole number of shares');
                  setVisible(true);
                } else if (shares <= 0) {
                  setErrorMessage('Enter a positive number of shares');
                  setVisible(true);
                } else {
                  sellStock();
                }
              }}
            >
              Sell stock
            </Button>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator animating={!loaded} color="blue" size={'large'} />
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
  dropdownbox: {
    width: 200,
    height: 50,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fffafe',
    borderColor: 'blue',
  },
  inputStyles: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  dropdownTextStyles: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  dropdownStyles: {
    backgroundColor: '#fffafe',
    marginBottom: 20,
  },
  button: {
    width: 200,
  },
});

