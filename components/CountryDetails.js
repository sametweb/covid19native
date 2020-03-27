import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	View,
	Text,
	SafeAreaView,
	KeyboardAvoidingView,
	ScrollView
} from "react-native";

import { PieChart } from "react-native-svg-charts";
import {
	VictoryBar,
	VictoryChart,
	VictoryTheme,
	VictoryScatter
} from "victory-native";

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

	const data = [
		{ x: "confirmed", y: confirmed },
		{ x: "recovered", y: recovered },
		{ x: "deaths", y: deaths }
	];

	return (
		<SafeAreaView>
			<KeyboardAvoidingView behavior='padding'>
				<ScrollView style={{ padding: 10 }} keyboardDismissMode='on-drag'>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							marginTop: 30
						}}
					>
						<Text>US</Text>
						<Text>Confirmed: {confirmed}</Text>
						<Text>Recovered: {recovered}</Text>
						<Text>Deaths: {deaths}</Text>
						<View>
							<VictoryChart
								theme={VictoryTheme.material}
								domain={{ x: [0, 3], y: [0, 100000] }}
								width={340}
							>
								<VictoryScatter
									style={{ data: { fill: "#c43a31" } }}
									size={7}
									data={data}
									labels={({ datum }) => ` ${datum.y}`}
								/>
							</VictoryChart>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default CountryDetails;
