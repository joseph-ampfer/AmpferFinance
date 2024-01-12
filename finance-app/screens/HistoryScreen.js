import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Layout from '../components/layout';
import getToken from '../tokenGetter/getToken';
import { useFocusEffect } from '@react-navigation/native';
import { DataTable, Surface, Portal, Snackbar } from 'react-native-paper';

export default function HistoryScreen({ navigation }) {
  const [data, setData] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const onDismissVisible = () => setVisible(false);

  // THIS IS FOR TABLE AND PAGINATION OF TABLE
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 20]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  //

  const getHistory = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch('https://1359-50-5-95-80.ngrok-free.app/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          setErrorMessage('No transactions found for the current user');
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
      console.log('Try Error:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getHistory();
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
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>
          <ScrollView horizontal={true}>
            <Surface style={styles.surfaceTable} elevation={1}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Action</DataTable.Title>
                  <DataTable.Title>Symbol</DataTable.Title>
                  <DataTable.Title>Price</DataTable.Title>
                  <DataTable.Title>Shares</DataTable.Title>
                  <DataTable.Title numeric>Time</DataTable.Title>
                </DataTable.Header>

                {data.slice(from, to).map((stock, index) =>
                  stock.shares > 0 ? (
                    <DataTable.Row key={stock.time} style={getRowStyle(index)}>
                      <DataTable.Cell>Bought</DataTable.Cell>
                      <DataTable.Cell>{stock.symbol}</DataTable.Cell>
                      <DataTable.Cell numeric>{usd(stock.price)}</DataTable.Cell>
                      <DataTable.Cell numeric>{stock.shares}</DataTable.Cell>
                      <DataTable.Cell numeric>{stock.time}</DataTable.Cell>
                    </DataTable.Row>
                  ) : (
                    <DataTable.Row key={stock.time} style={getRowStyle(index)}>
                      <DataTable.Cell>Sold </DataTable.Cell>
                      <DataTable.Cell>{stock.symbol}</DataTable.Cell>
                      <DataTable.Cell numeric>{usd(stock.price)}</DataTable.Cell>
                      <DataTable.Cell numeric>{stock.shares * -1}</DataTable.Cell>
                      <DataTable.Cell numeric>{stock.time}</DataTable.Cell>
                    </DataTable.Row>
                  )
                )}

                <DataTable.Pagination
                  page={page}
                  numberOfPages={Math.ceil(data.length / itemsPerPage)}
                  onPageChange={(page) => setPage(page)}
                  label={`${from + 1}-${to} of ${data.length}`}
                  numberOfItemsPerPageList={numberOfItemsPerPageList}
                  numberOfItemsPerPage={itemsPerPage}
                  onItemsPerPageChange={onItemsPerPageChange}
                  showFastPaginationControls
                  selectPageDropdownLabel={'Rows per page'}
                />
              </DataTable>
            </Surface>
          </ScrollView>
        </ScrollView>
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
    width: '100%',
    alignItems: 'center',
    //justifyContent: 'center',
    //borderRadius: 23,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'white',
  },
  textContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: 30,
  },
  text: {
    fontSize: 24,
  },
  surfaceText: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#bbd9fa',
  },
  scrollView: {
    backgroundColor: '',
    marginHorizontal: 0,
  },
  contentContainerStyle: {
    //alignItems: 'center'
  },
});
