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

import {
	VictoryChart,
	VictoryTheme,
	VictoryLine,
	VictoryVoronoiContainer,
	VictoryTooltip
} from "victory-native";

const CountryDetails = props => {
	const { slug } = props.route.params;
	const [country, setCountry] = useState("");
	const [confirmed, setConfirmed] = useState([]);
	const [recovered, setRecovered] = useState([]);
	const [deaths, setDeaths] = useState([]);
	const [fifteenDays, setFifteenDays] = useState([]);
	const [dailyStats, setDailyStats] = useState({
		date: [],
		confirmed: []
	});

	const getCases = country => {
		axios
			.get(
				`https://api.covid19api.com/total/country/${country}/status/confirmed`
			)
			.then(res => {
				console.log(res.data);
				setCountry(res.data[0]?.Country);
				setConfirmed(res.data[res.data.length - 1].Cases);
				const dailyConfirmed = res.data.map(({ Cases }) => Cases);

				const date = res.data.map(({ Date }) => Date);

				setDailyStats({
					...dailyStats,
					date: date,
					confirmed: dailyConfirmed
				});
			})
			.catch(error => console.log(error));

		axios
			.get(
				`https://api.covid19api.com/total/country/${country}/status/recovered`
			)
			.then(res => {
				setRecovered(res.data[res.data.length - 1].Cases);
				// const dailyRecovered = res.data.map(({ Cases }) => Cases);
				// const fifteenDays = dailyRecovered.slice(1).slice(-30);
				// setDailyStats({ ...dailyStats, recovered: fifteenDays });
				// console.log("RECOVERED", dailyStats.recovered);
			})
			.catch(error => console.log(error));

		axios
			.get(`https://api.covid19api.com/total/country/${country}/status/deaths`)
			.then(res => {
				setDeaths(res.data[res.data.length - 1].Cases);
				// const dailyDeaths = res.data.map(({ Cases }) => Cases);
				// setDailyStats({ ...dailyStats, deaths: dailyDeaths });
				// console.log("DEATHS", dailyStats.deaths);
			})
			.catch(error => console.log(error));
	};

	useEffect(() => {
		getCases(slug);
	}, [slug]);

	const screenWidth = Dimensions.get("window").width - 20;
	const data = dailyStats.confirmed.map(day => {});

	const lineChartData = [
		{ x: 1, y: 2 },
		{ x: 2, y: 3 },
		{ x: 3, y: 5 },
		{ x: 4, y: 4 },
		{ x: 5, y: 7 }
	];

	return (
		<SafeAreaView>
			<KeyboardAvoidingView behavior='padding'>
				<ScrollView style={{ padding: 10 }} keyboardDismissMode='on-drag'>
					<View style={styles.container}>
						<Text style={styles.country}>{country}</Text>
						{dailyStats.confirmed.length ? (
							<View style={styles.chartContainer}>
								<Text style={styles.chartHeader}>COVID-19's Spread</Text>
								<VictoryChart
									width={screenWidth}
									theme={VictoryTheme.grayscale}
									domainPadding={{ y: 10 }}
									containerComponent={
										<VictoryVoronoiContainer
											voronoiDimension='x'
											labels={({ datum }) => `y: ${datum.y} x: ${datum.x}`}
											labelComponent={
												<VictoryTooltip
													cornerRadius={5}
													flyoutStyle={{ fill: "white" }}
												/>
											}
											// voronoiPadding={1}
										/>
									}
								>
									<VictoryLine
										// labelComponent={<VictoryTooltip renderInPortal={false} />}
										data={lineChartData}
										style={{
											data: { stroke: "#c43a31" },
											parent: { border: "1px solid #ccc" }
										}}
										interpolation='catmullRom'
										animate={{
											duration: 2000,
											onLoad: { duration: 1000 }
										}}
									/>
								</VictoryChart>
							</View>
						) : (
							<Text>Loading...</Text>
						)}
						{/* {confirmed ? (
							<View style={styles.chartContainer}>
								<Text style={styles.chartHeader}>Confirmed: {confirmed}</Text>
							
							</View>
						) : (
							<Text>Loading...</Text>
						)} */}
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
	chartContainer: {
		marginTop: 10,
		marginBottom: 40,
		borderRadius: 5,
		backgroundColor: "#93c2be"
	},
	chartHeader: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 10
	},
	chart: {}
});

export default CountryDetails;
