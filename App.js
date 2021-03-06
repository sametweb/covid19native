import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./components/Home";
import CountryDetails from "./components/CountryDetails";

const Stack = createStackNavigator();

const App = props => {
	return (
		<NavigationContainer>
			<Stack.Navigator headerMode='none'>
				<Stack.Screen name='Home' component={Home} />
				<Stack.Screen name='CountryDetails' component={CountryDetails} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
