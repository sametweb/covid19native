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
	VictoryTooltip,
	VictoryAxis,
	VictoryLegend
} from "victory-native";

const CountryDetails = props => {
	const { slug } = props.route.params;
	const [country, setCountry] = useState("");
	const [confirmed, setConfirmed] = useState([]);
	const [recovered, setRecovered] = useState([]);
	const [deaths, setDeaths] = useState([]);
	const [dailyStats, setDailyStats] = useState([]);

	// const getCases = country => {
	// 	axios
	// 		.get(
	// 			`https://api.covid19api.com/total/country/${country}/status/confirmed`
	// 		)
	// 		.then(res => {
	// 			setCountry(res.data[0]?.Country);
	// 			setConfirmed(res.data[res.data.length - 1].Cases);

	// 			const dailyConfirmed = res.data.map(({ Cases }) => Cases);
	// 			const date = res.data.map(({ Date }) => Date);

	// 			setDailyStats({
	// 				...dailyStats,
	// 				confirmed: [{ date: date, confirmed: dailyConfirmed }]
	// 			});
	// 		})
	// 		.catch(error => console.log(error));

	// 	axios
	// 		.get(
	// 			`https://api.covid19api.com/total/country/${country}/status/recovered`
	// 		)
	// 		.then(res => {
	// 			setRecovered(res.data[res.data.length - 1].Cases);
	// 			// const dailyRecovered = res.data.map(({ Cases }) => Cases);
	// 				// 			// setDailyStats({ ...dailyStats, recovered: fifteenDays });
	//
	// 		})
	// 		.catch(error => console.log(error));

	// 	axios
	// 		.get(`https://api.covid19api.com/total/country/${country}/status/deaths`)
	// 		.then(res => {
	// 			setDeaths(res.data[res.data.length - 1].Cases);
	// 			// const dailyDeaths = res.data.map(({ Cases }) => Cases);
	// 			// setDailyStats({ ...dailyStats, deaths: dailyDeaths });
	// 			// console.log("DEATHS", dailyStats.deaths);
	// 		})
	// 		.catch(error => console.log(error));
	// };

	const getCases = country => {
		const confirmedRequest = axios.get(
			`https://api.covid19api.com/total/dayone/country/${country}/status/confirmed`
		);
		const recoveredRequest = axios.get(
			`https://api.covid19api.com/total/dayone/country/${country}/status/recovered`
		);
		const deathsRequest = axios.get(
			`https://api.covid19api.com/total/dayone/country/${country}/status/deaths`
		);

		axios.all([confirmedRequest, recoveredRequest, deathsRequest]).then(
			axios.spread((...responses) => {
				setCountry(responses[1].data[0]?.Country);
				setDailyStats(
					responses[0].data.map(confirmed => {
						const recovered = responses[1].data.length
							? responses[1].data.find(
									recovered => recovered.Date === confirmed.Date
							  )
							: [];
						const deaths = responses[2].data.length
							? responses[2].data.find(death => death.Date === confirmed.Date)
							: [];

						return {
							date: confirmed.Date.substr(6, 4),
							confirmed: confirmed.Cases,
							recovered: recovered?.Cases || 0,
							deaths: deaths?.Cases || 0
						};
					})
				);
			})
		);
	};

	useEffect(() => {
		getCases(slug);
	}, [slug]);

	const screenWidth = Dimensions.get("window").width - 20;

	const confirmedData = dailyStats.map((day, index) => {
		return { x: day.date, y: day.confirmed };
	});

	const recoveredData = dailyStats.map((day, index) => {
		return { x: day.date, y: day.recovered };
	});

	const deathsData = dailyStats.map((day, index) => {
		return { x: day.date, y: day.deaths };
	});

	console.log("dailyStats", dailyStats[0]);

	return (
		<SafeAreaView>
			<KeyboardAvoidingView behavior='padding'>
				<ScrollView style={{ padding: 10 }} keyboardDismissMode='on-drag'>
					<View style={styles.container}>
						<Text style={styles.country}>{country}</Text>
						{dailyStats.length ? (
							<View style={styles.chartContainer}>
								{/* <Text style={styles.chartHeader}>COVID-19's Spread</Text> */}
								<VictoryChart
									padding={{ left: 60, top: 80, bottom: 50, right: 20 }}
									width={screenWidth}
									theme={VictoryTheme.material}
									domainPadding={{ y: 10 }}
									containerComponent={
										<VictoryVoronoiContainer
											mouseFollowTooltips
											voronoiDimension='x'
											labels={({ datum }) => `${datum.y}`}
											labelComponent={
												<VictoryTooltip
													constrainToVisibleArea
													cornerRadius={5}
													flyoutStyle={{ fill: "white" }}
													center={{ x: screenWidth / 2, y: 120 }}
													pointerOrientation='bottom'
													flyoutWidth={80}
													flyoutHeight={50}
												/>
											}
											// voronoiPadding={5}
										/>
									}
								>
									<VictoryAxis dependentAxis />
									<VictoryAxis
										style={{
											tickLabels: { angle: -60 },
											grid: {
												fill: "none",
												stroke: "none",
												pointerEvents: "painted"
											}
										}}
									/>
									<VictoryLegend
										x={screenWidth / 6}
										y={10}
										title="COVID-19's Spread"
										centerTitle
										orientation='horizontal'
										gutter={20}
										style={{
											title: { fontSize: 20 }
										}}
										data={[
											{
												name: "Confirmed",
												symbol: { fill: "#777a77" }
											},
											{ name: "Recovered", symbol: { fill: "#32a840" } },
											{ name: "Deaths", symbol: { fill: "#c43a31" } }
										]}
									/>
									<VictoryLine
										data={confirmedData}
										style={{
											data: {
												stroke: "#777a77",
												strokeWidth: ({ active }) => (active ? 4 : 2)
											},
											labels: { fill: "#777a77" },
											parent: { border: "1px solid #ccc" }
										}}
										interpolation='catmullRom'
										animate={{
											duration: 2000,
											onLoad: { duration: 1000 }
										}}
									/>
									<VictoryLine
										data={recoveredData}
										style={{
											data: {
												stroke: "#32a840",
												strokeWidth: ({ active }) => (active ? 4 : 2)
											},
											labels: { fill: "#32a840" },
											parent: { border: "1px solid #ccc" }
										}}
										interpolation='catmullRom'
										animate={{
											duration: 2000,
											onLoad: { duration: 1000 }
										}}
									/>
									<VictoryLine
										data={deathsData}
										style={{
											data: {
												stroke: "#c43a31",
												strokeWidth: ({ active }) => (active ? 4 : 2)
											},
											labels: { fill: "#c43a31" },
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
		backgroundColor: "#75bdd1"
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
