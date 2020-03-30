import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	View,
	Text,
	SafeAreaView,
	KeyboardAvoidingView,
	ScrollView,
	Dimensions,
	StyleSheet
} from "react-native";

import { BarChart, LineChart } from "react-native-chart-kit";

const CountryDetails = props => {
	// const { slug } = props.route.params;

	const [confirmed, setConfirmed] = useState([]);
	const [recovered, setRecovered] = useState([]);
	const [deaths, setDeaths] = useState([]);

	const getCases = country => {
		axios
			.get(
				`https://api.covid19api.com/total/country/${country}/status/confirmed`
			)
			.then(res => setConfirmed(res.data[res.data.length - 1].Cases))
			.catch(error => console.log(error));

		axios
			.get(
				`https://api.covid19api.com/total/country/${country}/status/recovered`
			)
			.then(res => setRecovered(res.data[res.data.length - 1].Cases))
			.catch(error => console.log(error));

		axios
			.get(`https://api.covid19api.com/total/country/${country}/status/deaths`)
			.then(res => setDeaths(res.data[res.data.length - 1].Cases))
			.catch(error => console.log(error));
	};

	useEffect(() => {
		getCases("us");
	}, []);

	const data = {
		labels: ["Recovered", "Deaths"],
		datasets: [
			{
				data: [recovered, deaths]
			}
		]
	};

	const chartConfig = {
		backgroundGradientFrom: "#333333",
		backgroundGradientTo: "#262626",
		decimalPlaces: 0,
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
	};

	const screenWidth = Dimensions.get("window").width - 20;

	return (
		<SafeAreaView>
			<KeyboardAvoidingView behavior='padding'>
				<ScrollView style={{ padding: 10 }} keyboardDismissMode='on-drag'>
					<View style={styles.container}>
						<Text style={styles.country}>United States of America</Text>
						<View style={styles.barChartContainer}>
							<Text style={styles.barChartHeader}>Confirmed: {confirmed}</Text>
							<BarChart
								style={styles.barChart}
								data={data}
								width={screenWidth}
								height={220}
								chartConfig={chartConfig}
								fromZero
							/>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30
	},
	country: {
		fontSize: 24,
		marginBottom: 20,
		fontWeight: "bold"
	},
	barChartContainer: {
		backgroundColor: "#000",
		marginTop: 10,
		borderRadius: 5,
		backgroundColor: "#333333"
	},
	barChartHeader: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 10
	},
	barChart: {
		marginVertical: 8
	}
});

export default CountryDetails;
