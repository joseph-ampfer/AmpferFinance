import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/layout';
import { DataTable, Surface, Text, ActivityIndicator, Portal, Snackbar } from 'react-native-paper';
import getToken from '../tokenGetter/getToken';
import { useFocusEffect } from '@react-navigation/native';

export default function IndexScreen({ navigation }) {
  const [portfolio, setPortfolio] = React.useState([]);
  const [cash, setCash] = React.useState(0);
  const [grandTotal, setGrandTotal] = React.useState([]);
  const [stockPrices, setStockPrices] = React.useState([]);
  const [stockValues, setStockValues] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const onDismissVisible = () => setVisible(false);

  // THIS IS PART EXAMPLE TABLE AND PART PAGINATION OF TABLE
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 20]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, portfolio.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  //

  const getIndex = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPortfolio(data['portfolio']);
          setCash(data['cash']);
          setGrandTotal(data['grand_total']);
          setStockPrices(data['stock_prices']);
          setStockValues(data['stock_values']);
          setLoaded(true);
        } else {
          setErrorMessage('An unexpected error occured');
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
      setLoaded(false);
      getIndex();
    }, [])
  );

  function usd(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  const getRowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white',
  });

  return (
    <Layout navigation={navigation}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {loaded ? (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>
              <Surface style={styles.surfaceTable} elevation={0}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title sortDirection="descending">Symbol</DataTable.Title>
                    <DataTable.Title numeric>Shares</DataTable.Title>
                    <DataTable.Title numeric>Price</DataTable.Title>
                    <DataTable.Title numeric>TOTAL</DataTable.Title>
                  </DataTable.Header>

                  {portfolio.slice(from, to).map((stock, index) => (
                    <DataTable.Row key={stock.symbol} style={getRowStyle(index)}>
                      <DataTable.Cell>{stock.symbol}</DataTable.Cell>
                      <DataTable.Cell numeric>{stock.t_shares}</DataTable.Cell>
                      <DataTable.Cell numeric>{usd(stockPrices[stock.symbol])}</DataTable.Cell>
                      <DataTable.Cell numeric>{usd(stockValues[stock.symbol])}</DataTable.Cell>
                    </DataTable.Row>
                  ))}

                  <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(portfolio.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${portfolio.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                  />
                </DataTable>
              </Surface>
              <View style={styles.textContainer}>
                <Surface style={styles.surfaceText} elevation={0}>
                  <Text style={styles.text}>Cash: {usd(cash)}</Text>
                </Surface>
                <Surface style={styles.surfaceTextBottom} elevation={0}>
                  <Text style={styles.text}>TOTAL: {usd(grandTotal)}</Text>
                </Surface>
              </View>
            </ScrollView>
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
  surfaceTable: {
    padding: 8,
    paddingTop: 5,
    width: '100%',
    alignItems: 'center',
    //justifyContent: 'center',
    //borderBottomLeftRadius: 23,
    //borderBottomRightRadius: 23,
    //borderRadius: 23,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'white',
  },
  textContainer: {
    width: '100%',
  },
  text: {
    fontSize: 24,
    color: 'blue',
    fontWeight: 'bold',
  },
  surfaceText: {
    padding: 15,
    marginBottom: 0,
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'flex-end',
  },
  surfaceTextBottom: {
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 0,
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  scrollView: {
    backgroundColor: '',
    marginHorizontal: 0,
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
});
