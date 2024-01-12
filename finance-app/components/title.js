import { View } from 'react-native';
import { Text } from 'react-native';

const Title = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ color: 'blue', fontSize: 25 }}>A</Text>
      <Text style={{ color: 'red', fontSize: 25 }}>M</Text>
      <Text style={{ color: '#f2b50c', fontSize: 25 }}>P</Text>
      <Text style={{ color: 'green', fontSize: 25 }}>F</Text>
      <Text style={{ color: 'blue', fontSize: 25 }}>E</Text>
      <Text style={{ color: 'red', fontSize: 25 }}>R</Text>
      <Text> </Text>
      <Text style={{ color: 'blue', fontSize: 25 }}>Finance</Text>
    </View>
  );
};

export default Title;
