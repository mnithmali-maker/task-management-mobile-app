import {
  ImageBackground,
  Modal,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  CommonStyles,
  FontFamily,
} from "../../constants/styles";
import * as Progress from "react-native-progress";
import { Touchable } from "../../components/touchable";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileScreen = ({ navigation }) => {
  const [showLogoutDialog, setshowLogoutDialog] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      {header()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {userInfo()}
        {options()}
      </ScrollView>
      {logoutDialog()}
    </View>
  );

  function logoutDialog() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLogoutDialog}
        onRequestClose={() => {
          setshowLogoutDialog(false);
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setshowLogoutDialog(false);
          }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "center", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={styles.dialogStyle}
            >
              <Image
                source={require("../../assets/images/icons/logout_big.png")}
                style={styles.dialogImageStyle}
              />
              <Text
                style={{ textAlign: "center", ...Fonts.blackColor16Medium }}
              >
                Are you sure you want to logout this account?
              </Text>
              <View
                style={{
                  ...CommonStyles.rowAlignCenter,
                  marginTop: Sizes.fixPadding + 5.0,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setshowLogoutDialog(false);
                  }}
                  style={{
                    ...styles.dialogButtonStyle,
                    backgroundColor: Colors.whiteColor,
                    ...CommonStyles.shadow,
                    marginRight: Sizes.fixPadding,
                  }}
                >
                  <Text style={{ ...Fonts.primaryColor18Medium }}>No</Text>
                </TouchableOpacity>
                <Touchable
                  onPress={() => {
                    setshowLogoutDialog(false);
                    navigation.push("Login");
                  }}
                  style={{
                    ...styles.dialogButtonStyle,
                    backgroundColor: Colors.primaryColor,
                    ...CommonStyles.buttonShadow,
                    marginLeft: Sizes.fixPadding,
                  }}
                >
                  <Text style={{ ...Fonts.whiteColor18Medium }}>Yes</Text>
                </Touchable>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function options() {
    return (
      <View style={styles.optionsWrapper}>
        {optionSort({
          iconName: "person-outline",
          option: "Edit profile",
          onPress: () => {
            navigation.push("EditProfile");
          },
        })}
        {divider()}
        {optionSort({
          iconName: "people-outline",
          option: "Team",
          onPress: () => {
            navigation.push("Team");
          },
        })}
        {divider()}
        {divider()}
        {optionSort({
          iconName: "people-outline",
          option: "Team Member",
          onPress: () => {
            navigation.push("TeamMember");
          },
        })}
        {optionSort({
          iconName: "reader-outline",
          option: "Terms & condition",
          onPress: () => {
            navigation.push("TermsAndConditions");
          },
        })}
        {divider()}
        {optionSort({
          iconName: "warning-outline",
          option: "Privacy policy",
          onPress: () => {
            navigation.push("PrivacyPolicy");
          },
        })}
        {divider()}
        {optionSort({
          iconName: "help-circle-outline",
          option: "FAQs",
          onPress: () => {
            navigation.push("Faq");
          },
        })}
        {divider()}
        {logoutOption()}
      </View>
    );
  }

  function logoutOption() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowLogoutDialog(true);
        }}
        style={{
          ...CommonStyles.rowAlignCenter,
          marginHorizontal: Sizes.fixPadding,
          marginVertical: Sizes.fixPadding + 5.0,
        }}
      >
        <Image
          source={require("../../assets/images/icons/logout.png")}
          style={{ width: 18.0, height: 18.0, resizeMode: "contain" }}
        />
        <Text
          numberOfLines={1}
          style={{
            ...Fonts.redColor16Medium,
            flex: 1,
            marginHorizontal: Sizes.fixPadding,
          }}
        >
          Logout
        </Text>
        <Ionicons
          name="chevron-forward-outline"
          size={18}
          color={Colors.blackColor}
        />
      </TouchableOpacity>
    );
  }

  function divider() {
    return (
      <View
        style={{ backgroundColor: Colors.extraLightGrayColor, height: 1.0 }}
      />
    );
  }

  function optionSort({ iconName, option, onPress }) {
    return (
      <Touchable
        onPress={onPress}
        style={{
          ...CommonStyles.rowAlignCenter,
          marginHorizontal: Sizes.fixPadding,
          marginVertical: Sizes.fixPadding + 5.0,
        }}
      >
        <Ionicons name={iconName} size={18} color={Colors.blackColor} />
        <Text
          numberOfLines={1}
          style={{
            ...Fonts.blackColor16Medium,
            flex: 1,
            marginHorizontal: Sizes.fixPadding,
          }}
        >
          {option}
        </Text>
        <Ionicons
          name="chevron-forward-outline"
          size={18}
          color={Colors.blackColor}
        />
      </Touchable>
    );
  }

  function userInfo() {
    return (
      <View
        style={{
          ...CommonStyles.rowAlignCenter,
          marginVertical: Sizes.fixPadding * 3.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <Image
          source={require("../../assets/images/users/user1.jpeg")}
          style={{ width: 70.0, height: 70.0, borderRadius: 35.0 }}
        />
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 5.0 }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
            Nipuni Madushani
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14SemiBold }}>
            20 task/10 completed
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14SemiBold }}>
            Developer
          </Text>
        </View>
        <Progress.Circle
          size={60}
          progress={0.4}
          unfilledColor={"#DCD4F3"}
          color={Colors.primaryColor}
          borderWidth={0}
          thickness={7}
          formatText={(progress) => `40%`}
          showsText={true}
          textStyle={{
            fontSize: 15.0,
            fontFamily: FontFamily.medium,
            color: Colors.primaryColor,
          }}
        />
      </View>
    );
  }

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
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ ...Fonts.whiteColor22SemiBold }}>
                Profile
              </Text>
              <Text
                numberOfLines={1}
                style={{ ...Fonts.whiteColor16Medium, opacity: 0.8 }}
              >
                Hello Nipuni Madushani
              </Text>
            </View>
            <View style={{ height: 95, justifyContent: "flex-end" }}>
              <Image
                source={require("../../assets/images/working_boy.png")}
                style={{ width: 110, height: 80.0, resizeMode: "stretch" }}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
};

export default ProfileScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    ...CommonStyles.rowAlignCenter,
    justifyContent: "space-between",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingTop: StatusBar.currentHeight + Sizes.fixPadding,
  },
  optionsWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  dialogButtonStyle: {
    flex: 1,
    ...CommonStyles.center,
    padding: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
  },
  dialogImageStyle: {
    width: 80.0,
    height: 80.0,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: Sizes.fixPadding - 5.0,
  },
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 2.0,
    width: "80%",
    alignSelf: "center",
  },
});
