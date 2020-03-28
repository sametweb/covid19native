import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "react-native-paper";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { styles } from "../styles";

const CountryList = props => {
  const [countries, setCountries] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const TotalConfirmed = countries.reduce(
      (acc, country) => (acc += country.TotalConfirmed),
      0
    );

    const TotalRecovered = countries.reduce(
      (acc, country) => (acc += country.TotalRecovered),
      0
    );

    const TotalDeaths = countries.reduce(
      (acc, country) => (acc += country.TotalDeaths),
      0
    );
    //prettier-ignore
    setStats({
      total: TotalConfirmed,
      active: TotalConfirmed - TotalRecovered - TotalDeaths,
      recovered: TotalRecovered,
      deaths: TotalDeaths
    });
  }, [countries]);

  useEffect(() => {
    axios
      .get("https://api.covid19api.com/summary")
      .then(res => {
        setCountries(
          res.data.Countries.filter(
            country => country.Country && country.TotalConfirmed
          ).map(country =>
            country.Country === "US"
              ? { ...country, Country: "United States of America" }
              : country
          )
        );
      })
      .catch(err => console.log(err));
  }, []);

  data = [
    {
      name: "Active Cases",
      count: stats.active,
      color: "lightyellow",
      legendFontColor: "#fff",
      legendFontSize: 12
    },
    {
      name: "Recovered",
      count: stats.recovered,
      color: "skyblue",
      legendFontColor: "#fff",
      legendFontSize: 12
    },
    {
      name: "Deaths",
      count: stats.deaths,
      color: "pink",
      legendFontColor: "#fff",
      legendFontSize: 12
    }
  ];

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
  };

  const screenWidth = Dimensions.get("window").width - 20;

  const date = new Date();
  const today = `${date.getMonth() +
    1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <View>
      <View style={styles.homeHeader}>
        <Text style={styles.homeTitle}>COVID-19 Statistics by Country</Text>
      </View>
      {!countries.length || !stats.total ? (
        <ActivityIndicator size="large" />
      ) : (
        <View>
          <View style={styles.homePieChart}>
            <Text style={styles.homePieChartTitle}>
              <Text style={styles.bold}>{stats.total}</Text> people got COVID-19
              as of {today}.
            </Text>
            <PieChart
              data={data}
              width={screenWidth}
              height={200}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="0"
            />
          </View>

          <View style={styles.searchForm}>
            <TextInput
              value={search}
              onChangeText={text => setSearch(text)}
              placeholder="search countries"
              style={styles.searchFormInput}
            ></TextInput>
            <TouchableOpacity
              onPress={() => setSearch("")}
              style={styles.searchFormButton}
            >
              <Text style={styles.searchFormButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>
                <Text style={styles.tableHeaderText}>Country</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={styles.tableHeaderText}>Total</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={styles.tableHeaderText}>Recovered</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={styles.tableHeaderText}>Deaths</Text>
              </DataTable.Title>
            </DataTable.Header>
            {countries
              .filter(({ Country }) =>
                Country.toLowerCase().includes(search.toLowerCase())
              )
              .map((country, i) => {
                return (
                  <DataTable.Row
                    onPress={() =>
                      props.navigation.navigate("CountryDetails", {
                        slug: country.Slug
                      })
                    }
                    key={i}
                    style={i % 2 ? styles.altBg : {}}
                  >
                    <DataTable.Cell>{country.Country}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {country.TotalConfirmed}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {country.TotalRecovered}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {country.TotalDeaths}
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
          </DataTable>
        </View>
      )}
    </View>
  );
};

export default CountryList;
