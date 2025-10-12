import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Switch,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import Header from "../../components/header";
import { Touchable } from "../../components/touchable";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button } from "../../components/button";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
  Toast,
} from "react-native-alert-notification";
import * as FileSystem from "expo-file-system";

import { Circle } from "react-native-animated-spinkit";
const teamOptions = [
  "Designer team",
  "Developer team",
  "HR team",
  "Marketing team",
  "Management team",
];

const AddNewMemberScreen = ({ navigation, route }) => {
  const [isLoading, setisLoading] = useState(false);
  // Check if we are in update mode
  const isUpdateMode = route.params?.member ? true : false;
  const existingMember = route.params?.member || null;
  console.warn(existingMember?.status);
  const pickDocument = async (setFieldValue) => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access gallery is required!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setFieldValue("attachment", result.assets[0]);
      }
    } catch (error) {
      console.log("Error picking file:", error);
    }
  };

  const toggleTeam = (team, selectedTeams, setFieldValue) => {
    if (selectedTeams.includes(team)) {
      setFieldValue(
        "selectedTeams",
        selectedTeams.filter((t) => t !== team)
      );
    } else {
      setFieldValue("selectedTeams", [...selectedTeams, team]);
    }
  };

  function loadingDialog() {
    return (
      <Modal animationType="fade" transparent={true} visible={isLoading}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "center", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={styles.dialogStyle}
            >
              <View style={{ ...CommonStyles.center }}>
                <Circle
                  size={50}
                  color={Colors.primaryColor}
                  style={{ marginTop: Sizes.fixPadding - 5.0 }}
                />
                <Text
                  style={{
                    ...Fonts.primaryColor20Medium,
                    marginTop: Sizes.fixPadding + 2.0,
                  }}
                >
                  Please wait
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
  const validationSchema = Yup.object().shape({
    memberName: Yup.string().required("Member name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    attachment: Yup.object().required("Attachment is required"),
    // selectedTeams: Yup.array().min(1, "Select at least one team"),
  });

  const getMimeType = (path) => {
    if (!path || typeof path !== "string") return null;

    const extension = path.split(".").pop()?.toLowerCase();

    const mimeMap = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      txt: "text/plain",
      gif: "image/gif",
      bmp: "image/bmp",
      heic: "image/heic",
    };

    return mimeMap[extension] || "application/octet-stream"; // fallback if unknown
  };

  const handleSubmit = async (values) => {
    console.log("handleSubmit");
    setisLoading(true);

    try {
      const formData = new FormData();

      const file = values.attachment;

      // ✅ Step 1: Prepare the member JSON
      const member = {
        id: isUpdateMode ? values.id : null,
        name: values.memberName,
        email: values.email,
        status: values.status,
      };

      // ✅ Step 2: If attachment exists, handle it
      if (file) {
        let fileUri = file.uri;
        let safeName =
          file.name?.replace(/[^a-zA-Z0-9._-]/g, "_") ||
          file.imageOriginalName ||
          `file_${Date.now()}`;
        let mimeType = getMimeType(file.name || file.mimeType || "jpg");

        // ⚡ CASE 1: existing image (base64)
        if (!file.uri && file.data) {
          console.log("Converting base64 image to file...");
          const base64Data = file.data.startsWith("data:")
            ? file.data.split(",")[1]
            : file.data;
          const filePath = `${FileSystem.cacheDirectory}${safeName}.jpg`;

          await FileSystem.writeAsStringAsync(filePath, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          fileUri = filePath;
        }

        // ✅ Append to formData
        formData.append("files", {
          uri: fileUri,
          name: safeName,
          type: mimeType,
        });
      }

      // ✅ Step 3: Append member JSON
      formData.append("member", JSON.stringify(member));

      // ✅ Step 4: API call
      const response = await fetch("http://192.168.1.10:8080/api/v1/member", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Response:", result);

      if (result.status == 200) {
        setisLoading(false);
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: isUpdateMode
            ? "Team Member updated successfully"
            : "Team Member added successfully",
          button: "Close",
          autoClose: 2000,
        });
        setTimeout(() => navigation.pop(), 2000);
      } else {
        throw new Error("Server returned error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setisLoading(false);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something went wrong while uploading!",
        button: "Close",
        autoClose: 3000,
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <Formik
        initialValues={{
          id: isUpdateMode ? existingMember.id : null,
          memberName: isUpdateMode ? existingMember?.name : "",
          email: isUpdateMode ? existingMember?.email : "",
          attachment: isUpdateMode ? existingMember?.attachment : "",
          // selectedTeams: [],
          status: isUpdateMode ? existingMember?.status : true,
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
          handleSubmit(values);
          // navigation.pop();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <Header
              header={isUpdateMode ? "Update member" : "Add New Member"}
              navigation={navigation}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustKeyboardInsets={true}
            >
              {loadingDialog()}
              <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Member Name</Text>
                <View style={styles.infoBox}>
                  <TextInput
                    value={values.memberName}
                    onChangeText={handleChange("memberName")}
                    placeholder="Enter member name"
                    placeholderTextColor={Colors.grayColor}
                    style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                  />
                </View>
                {touched.memberName && errors.memberName && (
                  <Text style={{ color: "red" }}>{errors.memberName}</Text>
                )}
              </View>

              {/* Email */}
              <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Email</Text>
                <View style={styles.infoBox}>
                  <TextInput
                    value={values.email}
                    onChangeText={handleChange("email")}
                    placeholder="Enter email"
                    placeholderTextColor={Colors.grayColor}
                    style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                    keyboardType="email-address"
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={{ color: "red" }}>{errors.email}</Text>
                )}
              </View>

              {/* Team Selection */}
              {/* <View style={{ margin: Sizes.fixPadding * 2.0 }}>
              <Text style={{ ...Fonts.blackColor16Medium }}>Select Teams</Text>
              <View style={{ marginTop: Sizes.fixPadding }}>
                {teamOptions.map((team, index) => (
                  <Touchable
                    key={index}
                    onPress={() =>
                      toggleTeam(team, values.selectedTeams, setFieldValue)
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: Sizes.fixPadding,
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: Colors.grayColor,
                        backgroundColor: values.selectedTeams.includes(team)
                          ? Colors.primaryColor
                          : Colors.whiteColor,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {values.selectedTeams.includes(team) && (
                        <MaterialIcons
                          name="check"
                          size={16}
                          color={Colors.whiteColor}
                        />
                      )}
                    </View>
                    <Text
                      style={{ ...Fonts.blackColor15Medium, marginLeft: 10 }}
                    >
                      {team}
                    </Text>
                  </Touchable>
                ))}
              </View>
              {touched.selectedTeams && errors.selectedTeams && (
                <Text style={{ color: "red" }}>{errors.selectedTeams}</Text>
              )}
            </View> */}

              {/* Status Toggle */}
              <View
                style={{
                  margin: Sizes.fixPadding * 2.0,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ ...Fonts.blackColor16Medium, flex: 1 }}>
                  Status
                </Text>
                <Switch
                  value={values.status}
                  onValueChange={(val) => setFieldValue("status", val)}
                  trackColor={{
                    false: Colors.grayColor,
                    true: Colors.primaryColor,
                  }}
                  thumbColor={Colors.whiteColor}
                />
                <Text style={{ marginLeft: 8, ...Fonts.blackColor15Medium }}>
                  {values.status ? "Active" : "Inactive"}
                </Text>
              </View>

              {/* Attachment */}
              <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Attachment</Text>
                <Touchable
                  onPress={() => pickDocument(setFieldValue)}
                  style={{ ...styles.infoBox, ...CommonStyles.rowAlignCenter }}
                >
                  <Text style={{ ...Fonts.grayColor15Medium, flex: 1 }}>
                    {values.attachment
                      ? "Replace attachment"
                      : "Upload attachment"}
                  </Text>
                  <View style={styles.addIconOuterCircle}>
                    <View style={styles.addIconinnerCircle}>
                      <MaterialIcons
                        name="attach-file"
                        color={Colors.whiteColor}
                        size={12}
                      />
                    </View>
                  </View>
                </Touchable>

                {values.attachment && (
                  <View
                    style={[
                      styles.attachmentRow,
                      { marginTop: Sizes.fixPadding },
                    ]}
                  >
                    <Image
                      source={{
                        uri: values.attachment.data
                          ? `data:${values.attachment.mimeType};base64,${values.attachment.data}`
                          : values.attachment.uri, // fallback for picked file
                      }}
                      style={{ width: 70, height: 70, borderRadius: 6 }}
                    />

                    <Text
                      style={{
                        ...Fonts.blackColor14Regular,
                        flex: 1,
                        marginLeft: 8,
                      }}
                    >
                      {values.attachment.imageOriginalName || "Selected File"}
                    </Text>
                    <Touchable
                      onPress={() => setFieldValue("attachment", null)}
                    >
                      <MaterialIcons
                        name="close"
                        size={20}
                        color={Colors.redColor}
                      />
                    </Touchable>
                  </View>
                )}
                {touched.attachment && errors.attachment && (
                  <Text style={{ color: "red" }}>{errors.attachment}</Text>
                )}
              </View>
            </ScrollView>

            {/* Save Button */}
            <Button
              buttonText={isUpdateMode ? "Update" : "Save"}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </AlertNotificationRoot>
  );
};

export default AddNewMemberScreen;

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    ...CommonStyles.shadow,
    padding: Sizes.fixPadding + 2.0,
    marginTop: Sizes.fixPadding,
  },
  addIconOuterCircle: {
    backgroundColor: Colors.primaryColor,
    width: 16,
    height: 16,
    borderRadius: 8.0,
  },
  addIconinnerCircle: {
    width: 16.0,
    height: 16.0,
    borderRadius: 8.0,
    ...CommonStyles.center,
    backgroundColor: Colors.primaryColor,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 2.0,
    ...CommonStyles.buttonShadow,
    shadowColor: Colors.blackColor,
    shadowOpacity: 0.25,
  },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    ...CommonStyles.shadow,
  },
  dialogStyle: {
    marginHorizontal: Sizes.fixPadding * 2,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 2,
  },
});
