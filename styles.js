import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  altBg: { backgroundColor: "#e1e1e2" },
  homeHeader: {
    paddingBottom: 20
  },
  homeTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold"
  },
  homePieChart: {
    backgroundColor: "#333",
    paddingTop: 20,
    borderRadius: 5,
    marginBottom: 20
  },
  homePieChartTitle: {
    textAlign: "center",
    fontSize: 14,
    color: "white"
  },
  searchForm: {
    flexDirection: "row",
    marginBottom: 20
  },
  searchFormInput: {
    width: "80%",
    height: 35,
    paddingLeft: 10,
    backgroundColor: "white"
  },
  searchFormButton: {
    width: "20%",
    height: 35,
    borderLeftWidth: 0,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center"
  },
  searchFormButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12
  },
  tableHeader: {
    backgroundColor: "#333"
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "white"
  }
});
