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
  const { slug } = props.route.params;

  const [confirmed, setConfirmed] = useState([]);
  const [recovered, setRecovered] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [fifteenDays, setFifteenDays] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    date: [],
    recovered: [],
    deaths: []
  });
  const [countryName, setCountryName] = useState("");

  const getCases = country => {
    axios
      .get(
        `https://api.covid19api.com/total/country/${country}/status/confirmed`
      )
      .then(res => {
        setCountryName(res.data[0].Country);
        setConfirmed(res.data[res.data.length - 1].Cases);
        const dailyConfirmed = res.data.map(({ Cases }) => Cases);
        const fifteenDays = dailyConfirmed;
        // .slice(1).slice(-15);

        const date = res.data.map(({ Date }) => Date);
        const lastFifteenDays = date.map(date => date.slice(6, 10));
        setFifteenDays(fifteenDays);
        setDailyStats({
          ...dailyStats,
          date: lastFifteenDays
          // .slice(1).slice(-15)
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

  // console.log("CONFIRMED", dailyStats.confirmed);
  // console.log("LAST MONTH", fifteenDays);
  console.log("DATE", dailyStats.date);

  useEffect(() => {
    getCases(slug);
  }, [slug]);

  const barChartData = {
    labels: [
      `Recovered: ${recovered.toLocaleString()}
		`,
      `Deaths: ${deaths.toLocaleString()}`
    ],
    datasets: [
      {
        data: [recovered, deaths]
      }
    ]
  };

  const lineChartData = {
    labels: dailyStats.date,
    datasets: [
      {
        data: fifteenDays
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#333333",
    backgroundGradientTo: "#262626",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: "2",
      strokeWidth: "0",
      stroke: "#ffa726"
    }
  };

  const screenWidth = Dimensions.get("window").width - 20;
  // const title = (slug.charAt(0).toUpperCase() + slug.slice(1)).replace(
  //   "-",
  //   " "
  // );

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView style={{ padding: 10 }} keyboardDismissMode="on-drag">
          <View style={styles.container}>
            <Text style={styles.country}>
              {countryName === "US" ? "United States of America" : countryName}
            </Text>
            {confirmed ? (
              <View style={styles.chartContainer}>
                <Text style={styles.chartHeader}>
                  Confirmed: {confirmed.toLocaleString()}
                </Text>
                <BarChart
                  style={styles.chart}
                  data={barChartData}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  fromZero
                  withHorizontalLabels={false}
                />
              </View>
            ) : (
              <Text>Loading...</Text>
            )}
            {fifteenDays.length ? (
              <View style={styles.chartContainer}>
                <Text style={styles.chartHeader}>
                  COVID-19's Spread in{" "}
                  {countryName === "US"
                    ? "United States of America"
                    : countryName}
                </Text>
                <LineChart
                  style={styles.chart}
                  data={lineChartData}
                  width={screenWidth}
                  height={256}
                  chartConfig={chartConfig}
                  fromZero
                  bezier
                  withInnerLines={false}
                  verticalLabelRotation={0}
                  formatYLabel={X => Number(X).toLocaleString()}
                  formatXLabel={Y => {
                    const month = Number(Y.split("")[0]);
                    const day = Number(Y.split("-")[1]);
                    const months = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec"
                    ];
                    return day % 14 ? "" : `${months[month - 1]} ${day}`;
                  }}
                  // renderDotContent={({ x, y, index }) => (
                  //   <Text
                  //     key={index}
                  //     style={{
                  //       position: "absolute",
                  //       top: y,
                  //       left: x,
                  //       color: "#fff"
                  //     }}
                  //     onPress={() => props.navigation.navigate("Home")}
                  //   >
                  //     a
                  //   </Text>
                  // )}
                  // formatXLabel={x => "a"}
                />
              </View>
            ) : (
              <Text>Loading...</Text>
            )}
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
    backgroundColor: "#333333"
  },
  chartHeader: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10
  },
  chart: {
    marginVertical: 8
  }
});

export default CountryDetails;
