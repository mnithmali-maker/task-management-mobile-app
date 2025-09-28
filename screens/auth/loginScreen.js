import {
  ImageBackground,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  BackHandler,
} from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { Button } from "../../components/button";
import { useFocusEffect } from "@react-navigation/native";
import { ExitToast } from "../../components/exitToast";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";

// ✅ Yup validation schema
const LoginSchema = Yup.object().shape({
  userName: Yup.string().required("User name is required"),
  password: Yup.string().required("Password is required"),
});

const LoginScreen = ({ navigation }) => {
  const [backClickCount, setBackClickCount] = useState(0);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  // ✅ Back handler logic
  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      backClickCount === 1 ? BackHandler.exitApp() : _spring();
    }
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      navigation.addListener("gestureEnd", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
        navigation.removeListener("gestureEnd", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />
      <View style={{ flex: 1 }}>
        {topImageWithHeader()}
        {loginInfo()}
      </View>
      {backClickCount == 1 ? <ExitToast /> : null}
    </View>
  );

  // ✅ Formik wrapped login form
  function loginInfo() {
    return (
      <View style={styles.loginInfoWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          style={{
            borderTopLeftRadius: Sizes.fixPadding * 4.0,
            borderTopRightRadius: Sizes.fixPadding * 4.0,
            overflow: "hidden",
          }}
        >
          {authGirlImage()}
          <Formik
            initialValues={{ userName: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
              console.log("Logging in with:", values);
              navigation.push("BottomTabBar");
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                {userNameInfo(
                  values.userName,
                  handleChange("userName"),
                  handleBlur("userName"),
                  errors.userName,
                  touched.userName
                )}
                {passwordInfo(
                  values.password,
                  handleChange("password"),
                  handleBlur("password"),
                  errors.password,
                  touched.password
                )}
                <Button onPress={handleSubmit} buttonText="Login" />
              </>
            )}
          </Formik>
        </ScrollView>
      </View>
    );
  }

  // ✅ Username field with validation
  function userNameInfo(value, onChange, onBlur, error, touched) {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor15Medium }}>User name</Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Enter user name"
            placeholderTextColor={Colors.grayColor}
            style={{ ...Fonts.blackColor15Medium, padding: 0 }}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        </View>
        {error && touched && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // ✅ Password field with validation + toggle visibility
  function passwordInfo(value, onChange, onBlur, error, touched) {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor15Medium }}>Password</Text>
        <View style={styles.textFieldWrapper}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor={Colors.grayColor}
              style={{ ...Fonts.blackColor15Medium, flex: 1, padding: 0 }}
              cursorColor={Colors.primaryColor}
              selectionColor={Colors.primaryColor}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
              style={{ paddingHorizontal: 6 }}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={Colors.grayColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        {error && touched && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  function authGirlImage() {
    return (
      <Image
        source={require("../../assets/images/auth_girl.png")}
        style={styles.authGirlImageStyle}
      />
    );
  }

  function topImageWithHeader() {
    return (
      <ImageBackground
        source={require("../../assets/images/top_image.png")}
        style={{ width: "100%", height: 280.0, ...CommonStyles.center }}
        tintColor="rgba(241, 183,255,0.8)"
      >
        <View style={{ marginHorizontal: Sizes.fixPadding * 5.0 }}>
          <Text style={{ textAlign: "center", ...Fonts.whiteColor22SemiBold }}>
            Login
          </Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding,
              ...Fonts.whiteColor15Medium,
              opacity: 0.8,
              textAlign: "center",
            }}
          >
            Welcome please login your account using User name
          </Text>
        </View>
      </ImageBackground>
    );
  }
};

export default LoginScreen;

const styles = StyleSheet.create({
  loginInfoWrapper: {
    marginTop: -Sizes.fixPadding * 4.0,
    flex: 1,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 4.0,
    borderTopRightRadius: Sizes.fixPadding * 4.0,
    overflow: "hidden",
  },
  authGirlImageStyle: {
    width: 120.0,
    height: 120.0,
    resizeMode: "contain",
    alignSelf: "center",
    margin: Sizes.fixPadding * 4.0,
  },
  textFieldWrapper: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 4.0,
    marginTop: Sizes.fixPadding,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
