import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import IndexScreen from './screens/IndexScreen';
import QuoteScreen from './screens/QuoteScreen';
import BuyScreen from './screens/BuyScreen';
import SellScreen from './screens/SellScreen';
import WithdrawlScreen from './screens/WithdrawlScreen';
import HistoryScreen from './screens/HistoryScreen';
import DepositScreen from './screens/DepositScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Index" component={IndexScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Quote" component={QuoteScreen} />
      <Stack.Screen name="Buy" component={BuyScreen} />
      <Stack.Screen name="Sell" component={SellScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Deposit" component={DepositScreen} />
      <Stack.Screen name="Withdrawl" component={WithdrawlScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}
