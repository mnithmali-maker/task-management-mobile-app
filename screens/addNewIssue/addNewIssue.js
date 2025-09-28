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
import { Calendar } from "react-native-calendars";
import { Circle } from "react-native-animated-spinkit";

const AddNewIssue = ({ navigation, route }) => {
  const initialValues = {
    createdTime: null,
    email: "",
    attachment: [],
    issueStatus: "TODO",
    isActive: true,
    issueCategory: "Financial",
    endingDate: null,
  };
  const [isLoading, setisLoading] = useState(false);
  const [exIssue, setExIssue] = useState(null);
  const [loadvalues, setLoadValues] = useState(initialValues);
  const [showCalendar, setShowCalendar] = useState(false);
  // Check if we are in update mode
  const isUpdateMode = route.params?.issue ? true : false;
  const existingIssue = route.params?.issue || null;
  const projectId = route.params?.projectId?.id;
  console.warn(isUpdateMode);
  console.warn(existingIssue);

  const [selectedDate, setSelectedDate] = useState("");
  const [defaultDate, setDefaultDate] = useState(new Date().getDate());
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
        issueCategory: result.payload[0].issueCategory,
        createdTime: result.payload[0].createdTime,
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
    try {
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
        projectId: projectId,
        issueStatus: values.issueStatus,
        issueCategory: values.issueCategory,
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
    } catch (error) {
      // Handle network/parse errors
      console.error("Request failed:", error.message);
      // You can also show an alert or return a fallback value
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
                <Text style={{ ...Fonts.blackColor16Medium }}>
                  Issue Status
                </Text>
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
              <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                  Issue Category
                </Text>
                <View style={styles.pickerBox}>
                  <Picker
                    selectedValue={values.issueCategory}
                    onValueChange={(itemValue) =>
                      setFieldValue("issueCategory", itemValue)
                    }
                  >
                    <Picker.Item label="Financial" value="Financial" />
                    <Picker.Item label="Design" value="Design" />
                    <Picker.Item label="Site Reports" value="Site Reports" />
                  </Picker>
                </View>
              </View>
              {isUpdateMode ? (
                <View
                  style={{
                    marginHorizontal: Sizes.fixPadding * 2,
                    marginTop: 0,
                  }}
                >
                  <Text style={Fonts.blackColor16Medium}>Created Date</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      // setDateSelectionFor("end");
                      setShowCalendar(true);
                    }}
                    style={{
                      ...styles.infoBox,
                      paddingVertical: Sizes.fixPadding + 3,
                    }}
                  >
                    <Text
                      style={
                        values.createdTime
                          ? Fonts.blackColor15Medium
                          : Fonts.grayColor15Medium
                      }
                    >
                      {values.createdTime || "Enter created date"}
                    </Text>
                  </TouchableOpacity>
                  {touched.createdTime && errors.createdTime && (
                    <Text style={{ color: "red", fontSize: 12 }}>
                      {errors.createdTime}
                    </Text>
                  )}
                </View>
              ) : (
                ""
              )}

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
            <Modal
              animationType="slide"
              transparent
              visible={showCalendar}
              onRequestClose={() => setShowCalendar(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowCalendar(false)}
                style={styles.modalBackground}
              >
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.dialogStyle}
                  >
                    <Calendar
                      monthFormat="MMMM yyyy"
                      renderArrow={(direction) =>
                        direction === "left" ? (
                          <MaterialIcons
                            name="arrow-back-ios"
                            color={Colors.grayColor}
                            size={18}
                          />
                        ) : (
                          <MaterialIcons
                            name="arrow-forward-ios"
                            color={Colors.grayColor}
                            size={18}
                          />
                        )
                      }
                      hideExtraDays
                      disableMonthChange
                      firstDay={1}
                      onPressArrowLeft={(subtractMonth) => subtractMonth()}
                      onPressArrowRight={(addMonth) => addMonth()}
                      enableSwipeMonths
                      dayComponent={({ date }) => (
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => {
                            setSelectedDate(
                              `${date.day}/${date.month}/${date.year}`
                            );
                            setDefaultDate(date.day);
                          }}
                          style={{
                            ...styles.calenderDateWrapStyle,
                            backgroundColor:
                              date.day === defaultDate
                                ? Colors.primaryColor
                                : Colors.whiteColor,
                          }}
                        >
                          <Text
                            style={
                              date.day === defaultDate
                                ? Fonts.whiteColor16SemiBold
                                : Fonts.blackColor16Medium
                            }
                          >
                            {date.day}
                          </Text>
                        </TouchableOpacity>
                      )}
                      theme={{
                        calendarBackground: Colors.whiteColor,
                        textSectionTitleColor: Colors.grayColor,
                        monthTextColor: Colors.blackColor,
                        textMonthFontFamily: "Poppins-SemiBold",
                        textDayHeaderFontFamily: "Poppins-SemiBold",
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 12,
                      }}
                    />

                    <View style={styles.dialogButtonWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowCalendar(false)}
                        style={{
                          ...styles.dialogButtonStyle,
                          backgroundColor: Colors.whiteColor,
                          marginRight: Sizes.fixPadding * 1.5,
                        }}
                      >
                        <Text style={Fonts.blackColor16SemiBold}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          const chosenDate = selectedDate || todayDate;
                          setFieldValue(`createdTime`, selectedDate);
                          setShowCalendar(false);
                        }}
                        style={{
                          ...styles.dialogButtonStyle,
                          backgroundColor: Colors.primaryColor,
                        }}
                      >
                        <Text style={Fonts.whiteColor16SemiBold}>Ok</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dialogStyle: {
    marginHorizontal: Sizes.fixPadding * 2,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 2,
  },
  dialogButtonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: Sizes.fixPadding * 2,
  },
  dialogButtonStyle: {
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2,
    borderRadius: Sizes.fixPadding,
  },
  calenderDateWrapStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    ...CommonStyles.center,
  },
});
