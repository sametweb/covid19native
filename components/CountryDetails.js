import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text } from "react-native";

const CountryDetails = props => {
  const { slug } = props.route.params;
  const [confirmed, setConfirmed] = useState([]);
  const [recovered, setRecovered] = useState([]);
  const [deaths, setDeaths] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.covid19api.com/total/country/us/status/confirmed`)
      .then(res =>
        setConfirmed(
          res.data.reduce((acc, country) => (acc += country.Cases), 0)
        )
      )
      .catch(error => console.log(error));

    axios
      .get(`https://api.covid19api.com/total/country/us/status/recovered`)
      .then(res =>
        setRecovered(
          res.data.reduce((acc, country) => (acc += country.Cases), 0)
        )
      )
      .catch(error => console.log(error));

    axios
      .get(`https://api.covid19api.com/total/country/us/status/deaths`)
      .then(res =>
        setDeaths(res.data.reduce((acc, country) => (acc += country.Cases), 0))
      )
      .catch(error => console.log(error));
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
