import React from "react";
import { ScrollView, View, KeyboardAvoidingView } from "react-native";

import CountryList from "./CountryList";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = props => {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView style={{ padding: 10 }} keyboardDismissMode="on-drag">
          <CountryList />
          <View style={{ height: 50 }}></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Home;
