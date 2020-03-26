import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "react-native-paper";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

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
      deaths: TotalDeaths,
      activePercent: Number((((TotalConfirmed - TotalRecovered - TotalDeaths) / TotalConfirmed) * 100).toFixed(2)),
      recoveredPercent: Number(((TotalRecovered / TotalConfirmed) * 100).toFixed(2)),
      deathsPercent: Number(((TotalDeaths / TotalConfirmed) * 100).toFixed(2))
    });
  }, [countries]);

  useEffect(() => {
    axios
      .get("https://api.covid19api.com/summary")
      .then(res => setCountries(res.data.Countries))
      .catch(err => console.log(err));
  }, []);

  return (
    <View>
      <View style={{ paddingBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          COVID-19 Statistics by Country
        </Text>
      </View>
      {!countries.length || !stats.total ? (
        <ActivityIndicator size="large" />
      ) : (
        <View>
          {/* prettier-ignore */}
          <View style={{ marginBottom: 20 }}>
      <View style={{ height: 30, width: "100%", backgroundColor: "pink" }}>
        <View style={{ height: 30, width: `${stats.activePercent}%`, backgroundColor: "lightyellow" }}>
          <View style={{ height: 30, width: `${stats.recoveredPercent}%`, backgroundColor: "skyblue" }} >
            <View style={{ height: 30, width: `${stats.deathsPercent}%`, backgroundColor: "crimson" }}></View>
          </View>
        </View>
      </View>
      </View>
          {/* prettier-ignore */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
      <View style={{ width: 12, height: 12, backgroundColor: 'pink'}}></View><Text style={{fontSize: 10}}>Total {stats.total}</Text>
        <View style={{ width: 12, height: 12, backgroundColor: 'lightyellow'}}></View><Text style={{fontSize: 10}}>Active {stats.activePercent}%</Text>
        <View style={{ width: 12, height: 12, backgroundColor: 'skyblue'}}></View><Text style={{fontSize: 10}}>Recovered {stats.recoveredPercent}%</Text>
        <View style={{ width: 12, height: 12, backgroundColor: 'crimson'}}></View><Text style={{fontSize: 10}}>Deaths { stats.deathsPercent}%</Text>
      </View>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <TextInput
              value={search}
              onChangeText={text => setSearch(text)}
              placeholder="search countries"
              style={{
                width: "80%",
                height: 35,
                paddingLeft: 10,
                // borderWidth: 1,
                // borderColor: "#ccc",
                // borderStyle: "solid",
                backgroundColor: "white"
              }}
            ></TextInput>
            <TouchableOpacity
              onPress={() => setSearch("")}
              style={{
                width: "20%",
                height: 35,
                // borderWidth: 1,
                // borderColor: "#ccc",
                // borderStyle: "solid",
                borderLeftWidth: 0,
                backgroundColor: "#333",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
              >
                Clear
              </Text>
            </TouchableOpacity>
          </View>
          <DataTable>
            <DataTable.Header style={{ backgroundColor: "#333" }}>
              <DataTable.Title>
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Country
                </Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Total
                </Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Recovered
                </Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Deaths
                </Text>
              </DataTable.Title>
            </DataTable.Header>
            {countries
              .filter(({ Country }) =>
                Country.toLowerCase().includes(search.toLowerCase())
              )
              .map((country, i) => {
                return (
                  <DataTable.Row
                    key={i}
                    style={i % 2 ? { backgroundColor: "#e1e1e2" } : {}}
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
