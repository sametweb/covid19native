import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text } from "react-native";

const CountryDetails = props => {
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

	return (
		<View>
			<Text>Confirmed: {confirmed}</Text>
			<Text>Recovered: {recovered}</Text>
			<Text>Deaths: {deaths}</Text>
		</View>
	);
};

export default CountryDetails;
