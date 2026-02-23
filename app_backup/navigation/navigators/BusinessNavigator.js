// import { createStackNavigator } from 'react-navigation-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screens from '../../constants/screens';
import Business from '../../screens/Merchant/Business/business';
import Icon from '../../components/Icon';
import { TouchableOpacity } from 'react-native';
import AddBranch from '../../screens/Merchant/Business/AddBranch';



const Stack = createNativeStackNavigator();

export default function BusinessNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={screens.Business}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={screens.Business}
        component={Business}
        options={{ title: 'Branch' }}
      />
      <Stack.Screen
        name={screens.AddBranch}
        component={AddBranch}
        options={{ title: 'Add Branch' }}
      />
    </Stack.Navigator>
  );
}
