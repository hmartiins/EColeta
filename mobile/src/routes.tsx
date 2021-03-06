import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import Home from './pages/home';
import Points from './pages/points';
import Detail from './pages/detail';

const Stack = createStackNavigator();

const Routes = () =>{
  return(
    <NavigationContainer>
      <Stack.Navigator headerMode="none" screenOptions={{
        cardStyle:{
          backgroundColor: '#f0f0f5'
        }
      }}>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Points" component={Points}/>
        <Stack.Screen name="Detail" component={Detail}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Routes;