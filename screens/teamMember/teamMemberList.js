import {
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { Touchable } from "../../components/touchable";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const TeamScreen = ({ navigation }) => {
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    (async () => {
      console.log("response");
      const response = await fetch("http://192.168.1.12:8080/api/v1/member", {
        method: "GET",
      });
      const result = await response.json();
      setMemberList(result.payload[0]);
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      {header()}
      <FlatList
        data={memberList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Sizes.fixPadding * 2,
          paddingBottom: Sizes.fixPadding * 10, // extra bottom for floating button
        }}
      />

      {/* Floating Add Button */}
      <Touchable
        onPress={() => navigation.push("AddTeamMember")}
        style={styles.fabButton}
      >
        <View style={styles.addIconOuterCircle}>
          <View style={styles.addIconinnerCircle}>
            <MaterialIcons name="add" color={Colors.whiteColor} size={28} />
          </View>
        </View>
      </Touchable>
    </View>
  );

  function header() {
    return (
      <View style={{ backgroundColor: Colors.primaryColor }}>
        <ImageBackground
          source={require("../../assets/images/top_image2.png")}
          style={{ width: "100%" }}
          tintColor="rgba(241, 183,255,0.8)"
        >
          <SafeAreaView />
          <View style={styles.headerWrapStyle}>
            <Touchable onPress={() => navigation.pop()}>
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={Colors.whiteColor}
              />
            </Touchable>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                marginHorizontal: Sizes.fixPadding,
                ...Fonts.whiteColor18SemiBold,
              }}
            >
              Team Members
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }

  function renderItem({ item }) {
    return (
      <View style={{ ...styles.memberInfoBox, ...CommonStyles.rowAlignCenter }}>
        <Image
          source={{
            uri: `data:${item.attachment.mimeType};base64,${item.attachment.data}`,
          }}
          style={{ width: 52, height: 52, borderRadius: 26 }}
        />
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
            {item.email}
          </Text>
        </View>

        <Touchable onPress={() => navigation.push("Chat", { item })}>
          <Ionicons
            name="chatbox-ellipses-outline"
            color={Colors.primaryColor}
            size={22}
            style={{ marginLeft: Sizes.fixPadding }}
          />
        </Touchable>
      </View>
    );
  }
};

export default TeamScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    ...CommonStyles.rowAlignCenter,
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingTop: StatusBar.currentHeight + Sizes.fixPadding * 1.5,
    paddingBottom: Sizes.fixPadding + 5,
  },
  memberInfoBox: {
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2,
    marginBottom: Sizes.fixPadding * 2,
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
  },
  // Floating button style
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  addIconOuterCircle: {
    backgroundColor: Colors.primaryColor,
    width: 56,
    height: 56,
    borderRadius: 28,
    ...CommonStyles.center,
    ...CommonStyles.buttonShadow,
  },
  addIconinnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    ...CommonStyles.center,
    backgroundColor: Colors.primaryColor,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 2,
    shadowColor: Colors.blackColor,
    shadowOpacity: 0.25,
  },
});
