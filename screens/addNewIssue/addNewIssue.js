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
import React, { useEffect, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";

import { Circle } from "react-native-animated-spinkit";
const teamOptions = [
  "Designer team",
  "Developer team",
  "HR team",
  "Marketing team",
  "Management team",
];

const AddNewIssue = ({ navigation, route }) => {
  const initialValues = {
    memberName: "",
    email: "",
    attachment: [],
    issueStatus: "TODO",
    isActive: true,
  };
  const [isLoading, setisLoading] = useState(false);
  const [exIssue, setExIssue] = useState(null);
  const [loadvalues, setLoadValues] = useState(initialValues);
  // Check if we are in update mode
  const isUpdateMode = route.params?.issue ? true : false;
  const existingIssue = route.params?.issue || null;
  console.log(isUpdateMode);
  console.warn("isUpdateMode");
  console.log(existingIssue);

  useEffect(() => {
    if (existingIssue != null) {
      findCommentsByIssue(existingIssue.issueId);
    }
  }, [existingIssue]);

  const findCommentsByIssue = async (id) => {
    setisLoading(true);
    try {
      console.log(`http://192.168.1.14:8080/api/v1/issue/${id}`);
      const response = await fetch(
        `http://192.168.1.14:8080/api/v1/issue/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text(); // or respon/se.json() if server returns JSON
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("list:", result.payload[0]);
      const mappedFiles = result.payload[0].attachments.map((file) => ({
        uri: `data:${file.mimeType};base64,${file.data}`,
        name: file.imageOriginalName,
        type: file.mimeType,
        size: file.fileSize,
      }));

      const data = {
        issueId: result.payload[0].issueId,
        issue: result.payload[0].description,
        issueStatus: result.payload[0].issueStatus,
        attachment: mappedFiles,
      };
      setLoadValues(data);
      setisLoading(false);
      // setComments(result.payload[0]);
      return result;
    } catch (error) {
      // Handle network/parse errors
      console.error("Request failed:", error.message);
      // You can also show an alert or return a fallback value
    }
  };

  const pickDocument = async (values, setFieldValue) => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access gallery is required!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const newFile = result.assets[0];
        setFieldValue("attachment", [...values.attachment, newFile]); // plural
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
    // attachment: Yup.object().required("Attachment is required"),
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

    let formData = new FormData();
    console.log("attachement 2");
    console.log(values.attachment);
    // loop through multiple attachments
    for (let i = 0; i < values?.attachment?.length; i++) {
      const file = values.attachment[i];
      const fileUri = file.uri;
      const mimeType = getMimeType(file.name || file.uri);
      const safeName =
        file.name?.replace(/[^a-zA-Z0-9._-]/g, "_") ||
        `file_${Date.now()}_${i}`;

      if (!fileUri || !mimeType || !safeName) continue;

      formData.append("files", {
        uri: fileUri,
        name: safeName,
        type: mimeType,
      });
    }

    console.log("handleSubmit 2");

    const issue = {
      issueId: isUpdateMode ? values.issueId : null,
      description: values.issue,
      projectId: "01a2bcfd-6551-4a8c-81a2-9e34ae27c5e1",
      issueStatus: values.issueStatus,
    };

    formData.append("issue", JSON.stringify(issue));

    const response = await fetch("http://192.168.1.14:8080/api/v1/issue", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log("result1112222222222222222222");
    console.log(result.payload[0]);

    setisLoading(false);
    if (result.payload[0] == "success.") {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: isUpdateMode
          ? "Issue is updated successfully"
          : "New Issue is added successfully",
        button: "Close",
        autoClose: 2000,
      });
      setTimeout(() => navigation.pop(), 2000);
    } else {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something went wrong!",
        button: "Close",
        autoClose: 3000,
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <Formik
        enableReinitialize={true}
        initialValues={loadvalues || initialValues}
        // validationSchema={validationSchema}
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
              header={isUpdateMode ? "Update Issue" : "Add New Issue"}
              navigation={navigation}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustKeyboardInsets={true}
            >
              {loadingDialog()}
              <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Issue</Text>
                <View style={styles.infoBox}>
                  <TextInput
                    value={values.issue}
                    onChangeText={handleChange("issue")}
                    placeholder="Enter Issue"
                    placeholderTextColor={Colors.grayColor}
                    style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                  />
                </View>
                {touched.issue && errors.issue && (
                  <Text style={{ color: "red" }}>{errors.issue}</Text>
                )}
              </View>
              <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>issueStatus</Text>
                <View style={styles.pickerBox}>
                  <Picker
                    selectedValue={values.issueStatus}
                    onValueChange={(itemValue) =>
                      setFieldValue("issueStatus", itemValue)
                    }
                  >
                    <Picker.Item label="TODO" value="TODO" />
                    <Picker.Item
                      label="Dev in Progress"
                      value="DEV_IN_PROGRESS"
                    />
                    <Picker.Item label="Completed" value="COMPLETED" />
                    <Picker.Item label="QA Open" value="QA_OPEN" />
                    <Picker.Item label="QA Passed" value="QA_PASSED" />
                    <Picker.Item label="Reopen" value="REOPEN" />
                  </Picker>
                </View>
              </View>
              {/* Attachment */}
              <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Attachments</Text>
                <Touchable
                  onPress={() => pickDocument(values, setFieldValue)}
                  style={{ ...styles.infoBox, ...CommonStyles.rowAlignCenter }}
                >
                  <Text style={{ ...Fonts.grayColor15Medium, flex: 1 }}>
                    {values.attachment.length > 0
                      ? "Add more attachments"
                      : "Upload attachments"}
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

                {values.attachment.map((file, index) => (
                  <View
                    key={index}
                    style={[
                      styles.attachmentRow,
                      { marginTop: Sizes.fixPadding },
                    ]}
                  >
                    <Image
                      source={{ uri: file.uri }}
                      style={{ width: 70, height: 70, borderRadius: 6 }}
                    />
                    <Text
                      style={{
                        ...Fonts.blackColor14Regular,
                        flex: 1,
                        marginLeft: 8,
                      }}
                    >
                      {file.fileName || `File ${index + 1}`}
                    </Text>
                    <Touchable
                      onPress={() => {
                        const updated = values.attachment.filter(
                          (_, i) => i !== index
                        );
                        setFieldValue("attachment", updated);
                      }}
                    >
                      <MaterialIcons
                        name="close"
                        size={20}
                        color={Colors.redColor}
                      />
                    </Touchable>
                  </View>
                ))}
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

export default AddNewIssue;

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
  pickerBox: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    ...CommonStyles.shadow,
    marginTop: Sizes.fixPadding,
    // Custom padding for Picker (smaller than infoBox)
    paddingHorizontal: Sizes.fixPadding,
  },
  picker: {
    height: 45, // control height explicitly
    color: Colors.blackColor,
  },
});
