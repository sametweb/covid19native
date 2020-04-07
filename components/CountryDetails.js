import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	View,
	Text,
	SafeAreaView,
	KeyboardAvoidingView,
	ScrollView,
	Dimensions,
	StyleSheet,
	ActivityIndicator
} from "react-native";

import {
	VictoryContainer,
	VictoryChart,
	VictoryTheme,
	VictoryLine,
	VictoryVoronoiContainer,
	VictoryTooltip,
	VictoryAxis,
	VictoryLegend,
	VictoryPie
} from "victory-native";

const CountryDetails = props => {
	const { slug } = props.route.params;
	const [country, setCountry] = useState("");
	const [confirmed, setConfirmed] = useState([]);
	const [recovered, setRecovered] = useState([]);
	const [deaths, setDeaths] = useState([]);
	const [dailyStats, setDailyStats] = useState([]);

	// For animating the PieChart
	const [angle, setAngle] = useState(0);

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
				setConfirmed(responses[0].data[responses[0].data.length - 1].Cases);
				setRecovered(responses[1].data[responses[1].data.length - 1]?.Cases);
				setDeaths(responses[2].data[responses[2].data.length - 1]?.Cases);
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

	setTimeout(() => {
		setAngle(360);
	}, 1000);

	const screenWidth = Dimensions.get("window").width - 20;

	// Line Chart Data
	const confirmedData = dailyStats.map((day, index) => {
		return { x: day.date, y: day.confirmed };
	});

	const recoveredData = dailyStats.map((day, index) => {
		return { x: day.date, y: day.recovered };
	});

	const deathsData = dailyStats.map((day, index) => {
		return { x: day.date, y: day.deaths };
	});

	// Pie Chart Data
	const pieData = [
		{ x: `${confirmed}`, y: confirmed, fill: chartColors.confirmed },
		{ x: `${recovered}`, y: recovered, fill: chartColors.recovered },
		{ x: `${deaths}`, y: deaths, fill: chartColors.deaths }
	];

	return (
		<SafeAreaView>
			<KeyboardAvoidingView behavior='padding'>
				<ScrollView style={{ padding: 10 }} keyboardDismissMode='on-drag'>
					{dailyStats.length ? (
						<View style={styles.container}>
							<Text style={styles.country}>{country}</Text>
							<View
								style={{
									...styles.chartContainer,
									backgroundColor: chartColors.lineChartBackground
								}}
							>
								<VictoryChart
									padding={{
										left: confirmed > 9999 ? 55 : confirmed > 999 ? 45 : 35,
										top: 80,
										bottom: 50,
										right: 20
									}}
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
										/>
									}
								>
									<VictoryAxis
										dependentAxis
										style={{
											grid: {
												stroke: "darkgray",
												pointerEvents: "painted"
											}
										}}
									/>
									<VictoryAxis
										style={{
											// tickLabels: { angle: -60 },
											grid: {
												fill: "none",
												stroke: "none",
												pointerEvents: "painted"
											}
										}}
										fixLabelOverlap={true}
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
												symbol: { fill: chartColors.confirmed }
											},
											{
												name: "Recovered",
												symbol: { fill: chartColors.recovered }
											},
											{ name: "Deaths", symbol: { fill: chartColors.deaths } }
										]}
									/>
									<VictoryLine
										data={confirmedData}
										style={{
											data: {
												stroke: chartColors.confirmed,
												strokeWidth: ({ active }) => (active ? 4 : 2)
											},
											labels: { fill: chartColors.confirmed },
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
												stroke: chartColors.recovered,
												strokeWidth: ({ active }) => (active ? 4 : 2)
											},
											labels: { fill: chartColors.recovered },
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
												stroke: chartColors.deaths,
												strokeWidth: ({ active }) => (active ? 4 : 2)
											},
											labels: { fill: chartColors.deaths },
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

							{confirmed ? (
								<View
									style={{
										...styles.chartContainer,
										backgroundColor: chartColors.pieChartBackground
									}}
								>
									<VictoryPie
										containerComponent={<VictoryContainer responsive />}
										width={screenWidth}
										data={pieData}
										colorScale={[
											chartColors.confirmed,
											chartColors.recovered,
											chartColors.deaths
										]}
										animate={{
											easing: "exp",
											duration: 2000,
											onLoad: { duration: 1500 }
										}}
										// radius={({ index }) => (index == chosen ? 70 : 60)}
										innerRadius={80}
										endAngle={angle}
										padAngle={1}
										style={{
											labels: { padding: 10, fill: ({ datum }) => datum.fill }
										}}
									/>
								</View>
							) : (
								<Text>Loading Pie</Text>
							)}
						</View>
					) : (
						<ActivityIndicator size='large' style={{ marginTop: 50 }} />
					)}
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

// Styles
const chartColors = {
	lineChartBackground: "transparent",
	pieChartBackground: "transparent",
	confirmed: "#3e4a61",
	recovered: "#00e0ff",
	deaths: "#ff5959"
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30
	},
	country: {
		fontSize: 28,
		marginBottom: 20,
		fontWeight: "bold"
	},
	chartContainer: {
		marginTop: 10,
		marginBottom: 5,
		borderRadius: 5,
		backgroundColor: "#00d1ff"
	},
	chartHeader: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 10
	}
});

export default CountryDetails;
