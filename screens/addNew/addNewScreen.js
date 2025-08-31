import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  View,
  Image,
  Alert,
  Platform,
  Switch,
} from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import Header from "../../components/header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Touchable } from "../../components/touchable";
import { Menu, MenuItem } from "react-native-material-menu";
import { Button } from "../../components/button";
import { Calendar } from "react-native-calendars";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as WebBrowser from "expo-web-browser";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
  Toast,
} from "react-native-alert-notification";
import { API_URL } from "@env";
import { Circle } from "react-native-animated-spinkit";
import { shareAsync } from "expo-sharing";

const AddNewScreen = ({ navigation, route }) => {
  const from = route.params.from;
  const mode = route.params.mode;
  const item = route.params.project;
  // console.warn(item);
  const todayDate = new Date().toLocaleDateString();

  const [taskName, setTaskName] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedProject, setSelectedProject] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [defaultDate, setDefaultDate] = useState(new Date().getDate());
  const [dateSelectionFor, setDateSelectionFor] = useState("");
  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [projectName, setprojectName] = useState("");
  const [isLoading, setisLoading] = useState(false);
  // const [teamsList,setTeamList] = useState([]);

  const initialValues = {
    taskName: "",
    projectName: "",
    startingDate: "",
    endingDate: "",
    selectedProject: null,
    selectedTeam: "",
    projectStatus: "",
    taskStatus: "",
    status: true,
  };
  const [loadValues, setLoadValues] = useState(null);
  useEffect(() => {
    console.warn("called...");
    if (from === "task") {
      const fetchProjects = async () => {
        console.warn("calledeee...");
        try {
          // const url = `${API_URL}/project/`;
          // console.log(url);

          // const response = await fetch(`${API_URL}/project/`); // change localhost to your backend IP if using mobile
          const response = await fetch(
            "http:192.168.8.101:8080/api/v1/project/"
          );
          const result = await response.json();
          // console.warn(result);

          if (result.status === 200) {
            console.warn("Suucess");
            // console.warn(result.payload[0]);
            const projectNames = result.payload[0].map((item) => item.name);
            console.warn(projectNames);
            setSelectedProject(result.payload[0]); // because payload is wrapped in a list
          } else {
            console.warn(result.errorMessages?.[0] || "No records found");
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setisLoading(false);
        }
      };

      fetchProjects();
    }
  }, []);

  useEffect(() => {
    // console.warn(mode,from);
    if (mode == "edit" && from == "project") {
      const fetchProjects = async () => {
        setisLoading(true);
        // console.warn(item);
        console.warn("get existing project...");
        try {
          const projectId = item?.id;
          // const url = `${API_URL}/project/`;
          // console.log(url);

          // const response = await fetch(`${API_URL}/project/`); // change localhost to your backend IP if using mobile
          const response = await fetch(
            `http://192.168.8.101:8080/api/v1/project/${projectId}`
          );
          const result = await response.json();
          // console.warn(result);

          if (result.status === 200) {
            setisLoading(false);
            console.warn("Suucess ooo");
            const values = result.payload[0];
            const formatDate = (dateStr) => {
              if (!dateStr) return "";
              const [year, month, day] = dateStr.split("-"); // "2025-08-14" → ["2025","08","14"]
              return `${day}/${month}/${year}`;
            };
            // console.warn(values.attachments);
            // Map backend attachments into your frontend format
            const savedAttachments = (values.attachments || []).map(
              (att, index) => ({
                name: att.imageOriginalName || `file_${index}`, // backend field
                uri: "http://192.168.8.101:8080/uploads/" + att.filePath, // build correct URL
                type: att.fileType || "application/octet-stream",
                saved: true, // mark as already saved
              })
            );
            const initialValues = {
              // taskName: "",
              projectName: values?.name,
              startingDate: values?.startDate
                ? formatDate(values.startDate)
                : "",
              endingDate: values?.endDate ? formatDate(values.endDate) : "",
              projectStatus: values?.projectStatus,
              status: values?.status,
              // selectedProject: null,
              selectedTeam: "",
            };
            // console.warn(initialValues);
            setLoadValues(initialValues);
            setAttachments(savedAttachments);
            console.warn(values?.teamMembers);
            const membersList = (values?.teamMembers || []).map((item) => ({
              id: item.id,
              name: item.name,
              profession: item.designation,
              selected: false,
              image: item.attachment
                ? `data:${item.attachment.mimeType};base64,${item.attachment.data}`
                : null,
            }));
            setSelectedMembers(membersList);

            // setSelectedMembers(values?.teamMembers);
            // const projectNames = result.payload[0].map((item) => item.name);
            // console.warn(projectNames);
            // setSelectedProject(result.payload[0]); // because payload is wrapped in a list
          } else {
            console.warn(result.errorMessages?.[0] || "No records found");
          }
        } catch (error) {
          setisLoading(false);
          console.error("Error fetching projects:", error);
        } finally {
          setisLoading(false);
        }
      };

      fetchProjects();
    }
  }, []);

  useEffect(() => {
    console.warn("called member...");

    const fetchTeamMembers = async () => {
      console.warn("member...");
      try {
        // const url = `${API_URL}/project/`;
        // console.log(url);
        const status = true;
        // const response = await fetch(`${API_URL}/project/`); // change localhost to your backend IP if using mobile
        const response = await fetch(
          `http://192.168.8.101:8080/api/v1/member/status/${status}`
        );
        const result = await response.json();
        console.warn(result);

        if (result.status === 200) {
          console.warn("Suucess");
          // console.warn(result.payload[0]);
          // const projectNames = result.payload[0].map((item) => item.name);
          // console.warn(projectNames);
          // setSelectedProject(result.payload[0]); // because payload is wrapped in a list
        } else {
          console.warn(result.errorMessages?.[0] || "No records found");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setisLoading(false);
      }
      fetchTeamMembers();
    };
  }, []);

  const validationSchema = Yup.object().shape({
    taskName:
      from === "task"
        ? Yup.string().required("Task name is required")
        : Yup.string(),
    projectName:
      from === "project"
        ? Yup.string().required("Project name is required")
        : Yup.string(),
    startingDate: Yup.string().required("Starting date is required"),
    endingDate: Yup.string()
      .required("Ending date is required")
      .test(
        "is-after-start",
        "Ending date cannot be before starting date",
        function (value) {
          const { startingDate } = this.parent;
          if (!startingDate || !value) return true;

          // Parse dd/mm/yyyy → Date
          const [startDay, startMonth, startYear] = startingDate
            .split("/")
            .map(Number);
          const [endDay, endMonth, endYear] = value.split("/").map(Number);

          const startDateObj = new Date(startYear, startMonth - 1, startDay);
          const endDateObj = new Date(endYear, endMonth - 1, endDay);

          return endDateObj >= startDateObj;
        }
      ),
    // selectedProject:
    //   from === "task"
    //     ? Yup.string().required("Project selection is required")
    //     : Yup.string(),
    // selectedTeam:
    //   from === "task"
    //     ? Yup.string().required("Project selection is required")
    //     : Yup.string(),
  });

  useEffect(() => {
    if (route.params?.members) {
      setSelectedMembers(route.params.members);
    }
  }, [route.params?.members]);

  // Camera
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Camera access is needed to take pictures."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const file = {
        name: result.assets[0].uri.split("/").pop(),
        uri: result.assets[0].uri,
        type: "image",
      };
      setAttachments((prev) => [...prev, file]);
    }
  };

  // Gallery
  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Gallery access is needed to select images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const file = {
        name: result.assets[0].uri.split("/").pop(),
        uri: result.assets[0].uri,
        type: "image",
      };
      setAttachments((prev) => [...prev, file]);
    }
  };

  // Document Picker
  const openDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/*",
      ],
      copyToCacheDirectory: true,
    });
    console.warn(result.assets[0].mimeType);
    // if (result.type === "success") {
    const file = {
      name: result.assets[0].name,
      uri: result.assets[0].uri,
      type: result.assets[0].mimeType,
    };
    setAttachments((prev) => [...prev, file]);
    // }
  };

  // ---------- UI Components ----------

  const attachmentSheet = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAttachmentSheet}
      onRequestClose={() => setShowAttachmentSheet(false)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowAttachmentSheet(false)}
        style={styles.modalBackground}
      >
        <View style={{ justifyContent: "flex-end", flex: 1 }}>
          <TouchableOpacity activeOpacity={1} style={styles.sheetWrapStyle}>
            <Text style={Fonts.blackColor16SemiBold}>Choose attachment</Text>

            {optionSort({
              iconName: "camera",
              color: Colors.darkBlueColor,
              option: "Camera",
              onPress: () => {
                setShowAttachmentSheet(false);
                setTimeout(openCamera, 300);
              },
            })}
            {optionSort({
              iconName: "image",
              color: Colors.darkGreenColor,
              option: "Gallery",
              onPress: () => {
                setShowAttachmentSheet(false);
                setTimeout(openDocumentPicker, 300);
              },
            })}
            {/* {optionSort({
              iconName: "folder",
              color: Colors.darkOrangeColor,
              option: "Files",
              onPress: () => {
                setShowAttachmentSheet(false);
                setTimeout(openDocumentPicker, 300);
              },
            })} */}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const attachmentsDisplay = () =>
    attachments.length > 0 && (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginBottom: Sizes.fixPadding * 2,
        }}
      >
        <Text style={Fonts.blackColor16Medium}>Selected Files</Text>

        {attachments.map((file, index) => {
          const fileName = file.name?.toLowerCase() || "";
          const mimeType = file.type?.toLowerCase() || "";

          const isImage =
            mimeType.includes("image") ||
            fileName.endsWith(".jpg") ||
            fileName.endsWith(".jpeg") ||
            fileName.endsWith(".png") ||
            fileName.endsWith(".gif") ||
            fileName.endsWith(".webp");

          const isPDF = mimeType.includes("pdf") || fileName.endsWith(".pdf");
          const isWord =
            mimeType.includes("word") ||
            fileName.endsWith(".doc") ||
            fileName.endsWith(".docx");
          const isExcel =
            mimeType.includes("excel") ||
            fileName.endsWith(".xls") ||
            fileName.endsWith(".xlsx");

          // Download to gallery function (does not modify attachments)
          const downloadToGallery = async (file) => {
            try {
              // Step 1: download remote file to app cache
              const localUri = `${FileSystem.cacheDirectory}${file.name}`;
              const { uri } = await FileSystem.downloadAsync(
                file.uri,
                localUri
              );

              if (Platform.OS === "android") {
                // Step 2: save to user-selected folder
                const permissions =
                  await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

                if (permissions.granted) {
                  const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                  });

                  const newUri =
                    await FileSystem.StorageAccessFramework.createFileAsync(
                      permissions.directoryUri,
                      file.name,
                      file.type || "application/octet-stream"
                    );

                  await FileSystem.writeAsStringAsync(newUri, base64, {
                    encoding: FileSystem.EncodingType.Base64,
                  });

                  Alert.alert("Success", `${file.name} saved successfully!`);
                } else {
                  Alert.alert(
                    "Permission denied",
                    "Cannot save file without permission."
                  );
                }
              } else {
                // iOS: fallback share
                await shareAsync(uri);
              }
            } catch (error) {
              console.log("Download error:", error);
              Alert.alert("Error", "Failed to download file.");
            }
          };

          return (
            <View key={index} style={styles.attachmentRow}>
              {/* Open file on tap */}
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                onPress={() => WebBrowser.openBrowserAsync(file.uri)}
              >
                {isImage ? (
                  <Image
                    source={{ uri: file.uri }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 4,
                      marginRight: Sizes.fixPadding,
                    }}
                  />
                ) : (
                  <MaterialIcons
                    name={
                      isPDF
                        ? "picture-as-pdf"
                        : isWord
                        ? "article"
                        : isExcel
                        ? "grid-on"
                        : "insert-drive-file"
                    }
                    size={24}
                    color={Colors.primaryColor}
                    style={{ marginRight: Sizes.fixPadding }}
                  />
                )}

                <Text
                  style={{ ...Fonts.blackColor15Medium, flex: 1 }}
                  numberOfLines={1}
                >
                  {file.name}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => downloadToGallery(file)}
                style={{ marginHorizontal: Sizes.fixPadding }}
              >
                <MaterialIcons name="file-download" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAttachments((prev) => prev.filter((_, i) => i !== index));
                }}
                style={{ marginLeft: Sizes.fixPadding }}
              >
                <MaterialIcons name="close" size={24} color="green" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  const optionSort = ({ iconName, color, option, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.optionRow}
    >
      <View style={styles.optionCircle}>
        <Ionicons name={iconName} color={color} size={22} />
      </View>
      <Text
        style={{
          ...Fonts.blackColor16Medium,
          flex: 1,
          marginLeft: Sizes.fixPadding + 5,
        }}
        numberOfLines={1}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );
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

  async function downloadToCache(url, filename) {
    const localUri = `${FileSystem.cacheDirectory}${filename}`;
    const { uri } = await FileSystem.downloadAsync(url, localUri);
    console.log("✅ Downloaded to:", uri);
    return uri; // something like file:///data/user/0/host.exp.exponent/cache/...pdf
  }
  const handleAdd = async (values) => {
    console.log("ddddd");
    // console.warn(values);
    // console.warn(selectedMembers);
    setisLoading(true);

    if (from == "project") {
      try {
        let formData = new FormData();
        for (let i = 0; i < attachments.length; i++) {
          const file = attachments[i];
          let fileUri = "";
          // if (file.saved) continue;
          if (file.saved) {
            const localUri = await downloadToCache(file.uri, file.name);
            fileUri = localUri;
          } else {
            fileUri = file.uri;
          }
          console.warn(fileUri);
          const mimeType = getMimeType(file.name || file.uri);
          console.warn(mimeType);
          const safeName =
            file.name?.replace(/[^a-zA-Z0-9._-]/g, "_") ||
            `file_${Date.now()}_${i}`;
          if (!fileUri || !mimeType || !safeName) {
            // console.warn(`❌ Skipping invalid file at index ${i}`, file);
            continue;
          }
          // console.warn(safeName);

          formData.append("files", {
            uri: fileUri,
            name: safeName,
            type: mimeType,
          });
        }
        // console.warn(formData);
        // Convert "dd/mm/yyyy" strings to ISO format "yyyy-MM-dd"
        const parseDMY = (str) => {
          const [day, month, year] = str.split("/").map(Number);
          return new Date(year, month - 1, day); // JS months are 0-indexed
        };

        const formatDate = (date) => {
          const d = new Date(date);
          const month = `${d.getMonth() + 1}`.padStart(2, "0");
          const day = `${d.getDate()}`.padStart(2, "0");
          const year = d.getFullYear();
          return `${year}-${month}-${day}`;
        };

        const project = {
          projectId: mode == "edit" ? item?.id : "",

          name: values?.projectName,
          startDate: formatDate(parseDMY(values?.startingDate)),
          // startDate:values?.startingDate,
          endDate: formatDate(parseDMY(values?.endingDate)),
          projectStatus: mode == "edit" ? values?.projectStatus : "PENDING",
          status: values?.status,
          teamMembers: selectedMembers.map((m) => m.id),
          // endDate:values?.endingDate,
          // team: selectedTeam,
        };

        formData.append("project", JSON.stringify(project));
        // console.warn(formData);
        // const response = await fetch("http:192.168.8.101:8080/api/v1/project/");
        const response = await fetch(
          "http://192.168.8.101:8080/api/v1/project/save",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        console.log(result);

        if (result.status === 200) {
          setisLoading(false);
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody:
              mode == "edit"
                ? "Project Details has been updated Successfully."
                : "Project Details has been added Successfully.",
            button: "Close",
            autoClose: 2000, // auto-close after 3 seconds
            closeOnOverlayTap: true,
          });
          // Alert.alert("Success", "Project created successfully!");
          setTimeout(() => {
            navigation.pop(); // or navigation.pop()
          }, 2000);
        } else {
          setisLoading(false);
          // Show error dialog
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Something went wrong!",
            button: "Close",
            autoClose: 3000,
            closeOnOverlayTap: true,
          });
        }
      } catch (err) {
        setisLoading(false);
        console.error("Error creating project:", err);
        // Show error dialog
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Something went wrong!",
          button: "Close",
          autoClose: 3000,
          closeOnOverlayTap: true,
        });
      }
    } else {
      console.warn(values);
      try {
        let formData = new FormData();
        for (let i = 0; i < attachments.length; i++) {
          const file = attachments[i];
          let fileUri = "";
          // if (file.saved) continue;
          if (file.saved) {
            const localUri = await downloadToCache(file.uri, file.name);
            fileUri = localUri;
          } else {
            fileUri = file.uri;
          }
          console.warn(fileUri);
          const mimeType = getMimeType(file.name || file.uri);
          console.warn(mimeType);
          const safeName =
            file.name?.replace(/[^a-zA-Z0-9._-]/g, "_") ||
            `file_${Date.now()}_${i}`;
          if (!fileUri || !mimeType || !safeName) {
            // console.warn(`❌ Skipping invalid file at index ${i}`, file);
            continue;
          }
          // console.warn(safeName);

          formData.append("files", {
            uri: fileUri,
            name: safeName,
            type: mimeType,
          });
        }
        // Convert "dd/mm/yyyy" strings to ISO format "yyyy-MM-dd"
        const parseDMY = (str) => {
          const [day, month, year] = str.split("/").map(Number);
          return new Date(year, month - 1, day); // JS months are 0-indexed
        };

        const formatDate = (date) => {
          const d = new Date(date);
          const month = `${d.getMonth() + 1}`.padStart(2, "0");
          const day = `${d.getDate()}`.padStart(2, "0");
          const year = d.getFullYear();
          return `${year}-${month}-${day}`;
        };

        const task = {
          taskId: mode == "edit" ? item?.id : "",
          name: values?.taskName,
          startDate: formatDate(parseDMY(values?.startingDate)),
          endDate: formatDate(parseDMY(values?.endingDate)),
          // endDate:values?.endingDate,
          // team: selectedTeam,
          project: values?.selectedProject?.projectId,
          status: values?.status,
          taskStatus: mode == "edit" ? values?.taskStatus : "PENDING",
          teamMembers: selectedMembers.map((m) => m.id),
        };
        formData.append("task", JSON.stringify(task));
        console.warn(formData);

        const response = await fetch("http://192.168.8.101:8080/api/v1/task/save", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log(result);

        if (result.status === 200) {
          setisLoading(false);
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: "Task Details has been added Successfully.",
            button: "Close",
            autoClose: 2000, // auto-close after 3 seconds
            closeOnOverlayTap: true,
          });
          // Alert.alert("Success", "Project created successfully!");
          setTimeout(() => {
            navigation.pop(); // or navigation.pop()
          }, 2000);
        } else {
          setisLoading(false);
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Something went wrong!",
            button: "Close",
            autoClose: 3000,
            closeOnOverlayTap: true,
          });
        }
      } catch (err) {
        setisLoading(false);
        console.error("Error creating project:", err);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Something went wrong!",
          button: "Close",
          autoClose: 3000,
          closeOnOverlayTap: true,
        });
      }
    }
  };

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

  // ---------- Form Fields ----------

  return (
    <AlertNotificationRoot>
      <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <Header
          header={
            from === "task"
              ? mode === "edit"
                ? "Update task"
                : "Add new task"
              : from === "project"
              ? mode === "edit"
                ? "Update project"
                : "Add new project"
              : "Add new"
          }
          navigation={navigation}
        />

        <Formik
          enableReinitialize={true}
          initialValues={loadValues || initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.warn("dddddd");
            console.warn("for:" + values);
            handleAdd(values);
          }}
        >
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => {
            console.log(errors);

            return (
              <ScrollView
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
              >
                {loadingDialog()}
                {/* {calendarDialog(setFieldValue)} */}
                {from == "task" && (
                  <View style={{ margin: Sizes.fixPadding * 2 }}>
                    <Text style={Fonts.blackColor16Medium}>Task name</Text>
                    <View style={styles.infoBox}>
                      <TextInput
                        // value={taskName}
                        // onChangeText={setTaskName}
                        value={values.taskName}
                        onChangeText={handleChange("taskName")}
                        placeholder="Enter task name"
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                      />
                    </View>
                    {touched.taskName && errors.taskName && (
                      <Text style={{ color: "red", fontSize: 12 }}>
                        {errors.taskName}
                      </Text>
                    )}
                  </View>
                )}

                {from == "task" && (
                  <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                      Select Project
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setShowMenu(true);
                      }}
                      style={{
                        ...styles.infoBox,
                        ...CommonStyles.rowAlignCenter,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          ...(values?.selectedProject
                            ? { ...Fonts.blackColor15Medium }
                            : { ...Fonts.grayColor15Medium }),
                          flex: 1,
                        }}
                      >
                        {values.selectedProject
                          ? values.selectedProject?.name
                          : "Select project"}
                      </Text>
                      <Menu
                        visible={showMenu}
                        anchor={
                          <Ionicons
                            name="chevron-down"
                            color={Colors.grayColor}
                            size={20}
                          />
                        }
                        onRequestClose={() => {
                          setShowMenu(false);
                        }}
                      >
                        <View
                          style={{
                            paddingTop: Sizes.fixPadding - 5.0,
                            borderRadius: Sizes.fixPadding,
                          }}
                        >
                          <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedProject.map((option, index) => (
                              <MenuItem
                                key={`${index}`}
                                textStyle={{ ...Fonts.blackColor16Medium }}
                                onPress={() => {
                                  setFieldValue("selectedProject", option);
                                  // setSelectedTeam(option);
                                  setShowMenu(false);
                                }}
                              >
                                {option.name}
                              </MenuItem>
                            ))}
                          </ScrollView>
                        </View>
                      </Menu>
                    </TouchableOpacity>
                  </View>
                )}
                {from == "project" && (
                  <View
                    style={{
                      marginHorizontal: Sizes.fixPadding * 2.0,
                      marginTop:
                        from == "task"
                          ? Sizes.fixPadding * 2.0
                          : Sizes.fixPadding * 2.0,
                    }}
                  >
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                      Project name
                    </Text>
                    <View style={styles.infoBox}>
                      <TextInput
                        value={values.projectName}
                        onChangeText={handleChange("projectName")}
                        placeholder="Enter project name"
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                      />
                    </View>
                    {touched.projectName && errors.projectName && (
                      <Text style={{ color: "red", fontSize: 12 }}>
                        {errors.projectName}
                      </Text>
                    )}
                  </View>
                )}
                {/* {from === "task" && taskNameInfo()} */}
                {/* {projectNameInfo()} */}
                {/* {projectNameInfo()} */}
                {/* {startingDateInfo()} */}
                <View style={{ margin: Sizes.fixPadding * 2 }}>
                  <Text style={Fonts.blackColor16Medium}>Starting date</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setDateSelectionFor("start");
                      setShowCalendar(true);
                    }}
                    style={{
                      ...styles.infoBox,
                      paddingVertical: Sizes.fixPadding + 3,
                    }}
                  >
                    <Text
                      style={
                        values.startingDate
                          ? Fonts.blackColor15Medium
                          : Fonts.grayColor15Medium
                      }
                    >
                      {values.startingDate || "Enter starting date"}
                    </Text>
                  </TouchableOpacity>
                  {touched.startingDate && errors.startingDate && (
                    <Text style={{ color: "red", fontSize: 12 }}>
                      {errors.startingDate}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    marginHorizontal: Sizes.fixPadding * 2,
                    marginTop: 0,
                  }}
                >
                  <Text style={Fonts.blackColor16Medium}>Ending date</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setDateSelectionFor("end");
                      setShowCalendar(true);
                    }}
                    style={{
                      ...styles.infoBox,
                      paddingVertical: Sizes.fixPadding + 3,
                    }}
                  >
                    <Text
                      style={
                        values.endingDate
                          ? Fonts.blackColor15Medium
                          : Fonts.grayColor15Medium
                      }
                    >
                      {values.endingDate || "Enter ending date"}
                    </Text>
                  </TouchableOpacity>
                  {touched.endingDate && errors.endingDate && (
                    <Text style={{ color: "red", fontSize: 12 }}>
                      {errors.endingDate}
                    </Text>
                  )}
                </View>
                {/* {endingDateInfo()} */}
                {/* {attachmentInfo()} */}
                <View style={{ margin: Sizes.fixPadding * 2 }}>
                  <Text style={Fonts.blackColor16Medium}>Attachment</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowAttachmentSheet(true)}
                    style={{
                      ...styles.infoBox,
                      ...CommonStyles.rowAlignCenter,
                    }}
                  >
                    <View style={styles.attachmentIconWrapper}>
                      <MaterialIcons
                        name="attach-file"
                        size={18}
                        color={Colors.primaryColor}
                        style={{ transform: [{ rotate: "50deg" }] }}
                      />
                    </View>
                    <Text
                      style={{
                        ...Fonts.grayColor15Medium,
                        flex: 1,
                        marginLeft: Sizes.fixPadding,
                      }}
                      numberOfLines={1}
                    >
                      Attach file
                    </Text>
                  </TouchableOpacity>
                </View>
                {attachmentsDisplay()}

                <View style={{ margin: Sizes.fixPadding * 2 }}>
                  <Text style={Fonts.blackColor16Medium}>
                    Select team member
                  </Text>
                  <Touchable
                    onPress={() =>
                      navigation.push("InviteMember", { inviteFor: "addTask" })
                    }
                    style={{
                      ...styles.infoBox,
                      ...CommonStyles.rowAlignCenter,
                    }}
                  >
                    {selectedMembers.length === 0 ? (
                      <Text style={{ ...Fonts.grayColor15Medium, flex: 1 }}>
                        Select member
                      </Text>
                    ) : (
                      <View style={{ ...CommonStyles.rowAlignCenter, flex: 1 }}>
                        {selectedMembers.slice(0, 4).map((item, index) => (
                          <Image
                            key={index}
                            source={{ uri: item.image }}
                            style={{
                              ...styles.selectedMemberStyle,
                              left: -(index * 6),
                            }}
                          />
                        ))}
                        {selectedMembers.length > 4 && (
                          <View
                            style={{
                              ...styles.selectedMemberStyle,
                              ...CommonStyles.center,
                              left: -25,
                            }}
                          >
                            <Text style={Fonts.blackColor12SemiBold}>
                              +{selectedMembers.length - 4}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                    <View style={styles.addIconOuterCircle}>
                      <View style={styles.addIconInnerCircle}>
                        <MaterialIcons
                          name="add"
                          color={Colors.whiteColor}
                          size={12}
                        />
                      </View>
                    </View>

                    {/* Status Toggle */}
                  </Touchable>
                </View>
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
                  <Text
                    style={{ marginLeft: 170, ...Fonts.blackColor15Medium }}
                  >
                    {values.status ? "Active" : "Inactive"}
                  </Text>
                </View>
                {/* {memberInfo()} */}
                <Button
                  buttonText={
                    from === "task"
                      ? mode === "edit"
                        ? "Update task"
                        : "Add  task"
                      : from === "project"
                      ? mode === "edit"
                        ? "Update project"
                        : "Add  project"
                      : "Add new"
                  }
                  onPress={handleSubmit}
                />

                {/* {addButton()} */}
                {/* {calendarDialog()} */}
                {attachmentSheet()}

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
                            <Text style={Fonts.blackColor16SemiBold}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              const chosenDate = selectedDate || todayDate;
                              if (dateSelectionFor === "start") {
                                setFieldValue("startingDate", chosenDate); // ✅ set Formik value
                              } else {
                                setFieldValue("endingDate", chosenDate); // ✅ set Formik value
                              }
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
              </ScrollView>
            );
          }}
        </Formik>
      </View>
    </AlertNotificationRoot>
  );
};

export default AddNewScreen;

// ---------- Styles ----------
const styles = StyleSheet.create({
  infoBox: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginTop: Sizes.fixPadding,
  },
  sheetWrapStyle: {
    backgroundColor: Colors.whiteColor,
    padding: Sizes.fixPadding * 2,
    borderTopRightRadius: Sizes.fixPadding,
    borderTopLeftRadius: Sizes.fixPadding,
  },
  optionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    ...CommonStyles.center,
    backgroundColor: Colors.lightGrayColor,
  },
  optionRow: {
    ...CommonStyles.rowAlignCenter,
    marginTop: Sizes.fixPadding * 2,
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
  attachmentRow: {
    ...CommonStyles.rowAlignCenter,
    marginTop: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    padding: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    ...CommonStyles.shadow,
  },
  attachmentIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGrayColor,
    ...CommonStyles.center,
  },
  selectedMemberStyle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.whiteColor,
  },
  addIconOuterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryColor,
    ...CommonStyles.center,
  },
  addIconInnerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor,
    ...CommonStyles.center,
  },
});
