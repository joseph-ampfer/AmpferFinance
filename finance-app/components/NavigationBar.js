import React, { useState } from 'react';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Title from './title';

const NavigationBar = ({ navigation, isLoggedIn }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Appbar.Header style={styles.row}>
      <Title />
      <Appbar.Content title="" />
      {isLoggedIn && (
        <Menu
          contentStyle={styles.menu}
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="menu" color="black" onPress={openMenu} />}
        >
          <Menu.Item
            style={styles.menuItem}
            leadingIcon="home"
            onPress={() => navigation.navigate('Index')}
            title="Home"
          />
          <Menu.Item
            style={styles.menuItem}
            leadingIcon="magnify"
            onPress={() => navigation.navigate('Quote')}
            title="Quote"
          />
          <Menu.Item
            style={styles.menuItem}
            leadingIcon="plus-circle"
            onPress={() => navigation.navigate('Buy')}
            title="Buy"
          />
          <Menu.Item
            style={styles.menuItem}
            leadingIcon="minus-circle"
            onPress={() => navigation.navigate('Sell')}
            title="Sell"
          />
          <Menu.Item
            style={styles.menuItem}
            leadingIcon="history"
            onPress={() => navigation.navigate('History')}
            title="History"
          />
          <Menu.Item
            style={styles.menuItem}
            leadingIcon="piggy-bank-outline"
            onPress={() => navigation.navigate('Deposit')}
            title="Deposit"
          />
          <Menu.Item
            style={styles.menuItem}
            leadingIcon="bank-transfer-out"
            onPress={() => navigation.navigate('Withdrawl')}
            title="Withdrawl"
          />
          <Menu.Item
            style={styles.menuItem}
            onPress={() => navigation.navigate('ChangePassword')}
            title="Change Password"
          />
          <Divider style={styles.divider} bold="true" />
          <Menu.Item
            style={styles.menuItem}
            leadingIcon="logout"
            onPress={() => navigation.navigate('Login')}
            title="Logout"
          />
        </Menu>
      )}

      {!isLoggedIn && (
        <>
          <Appbar.Action title="Login" icon="login" onPress={() => navigation.navigate('Login')} color="black" />
          <Appbar.Action
            title="Register"
            icon="account-plus"
            onPress={() => navigation.navigate('Register')}
            color="black"
          />
        </>
      )}
    </Appbar.Header>
  );
};

export default NavigationBar;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  menuItem: {
    marginVertical: 10,
  },
  divider: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: 'black'
  },
  menu: {
    backgroundColor: '#B4D4FF',
    borderRadius: 15
  }
});
