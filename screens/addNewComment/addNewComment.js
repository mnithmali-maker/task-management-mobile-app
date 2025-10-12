import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import Header from "../../components/header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Formik } from "formik";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { Circle } from "react-native-animated-spinkit";

const AddNewComment = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState(""); // For main input
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState(""); // For editing comments

  console.log("issue");
  console.log(route.params.issue.issueId);

  useEffect(() => {
    findCommentsByIssue(route.params.issue.issueId);
  }, [route.params.issue.issueId]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  };

  const addComment = async () => {
    if (!newCommentText.trim()) return;
    const newComment = {
      id: null,
      description: newCommentText,
      createdTime: new Date().toISOString(),
      issue: route.params.issue.issueId,
      status: true,
    };
    try {
      const response = await fetch(
        "http://192.168.1.10:8080/api/v1/comment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment), // ✅ stringify, not parse
        }
      );

      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text(); // or response.json() if server returns JSON
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      findCommentsByIssue(route.params.issue.issueId);
      const result = await response.json();
      console.log("Success:", result);
      return result;
    } catch (error) {
      // Handle network/parse errors
      console.error("Request failed:", error.message);
      // You can also show an alert or return a fallback value
    }

    console.log("response");
    console.log(result);
    // setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  const startEditing = (id, currentText) => {
    setEditingCommentId(id);
    setEditingText(currentText);
  };

  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    const updatedComments = comments.map((comment) =>
      comment.id === id ? { ...comment, description: editingText } : comment
    );

    editingComment();
    setComments(updatedComments);
    setEditingCommentId(null);
    setEditingText("");
  };

  const editingComment = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.10:8080/api/v1/comment",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment), // ✅ stringify, not parse
        }
      );

      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text(); // or response.json() if server returns JSON
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      findCommentsByIssue(route.params.issue.issueId);
      const result = await response.json();
      console.log("Success:", result);
      return result;
    } catch (error) {
      // Handle network/parse errors
      console.error("Request failed:", error.message);
      // You can also show an alert or return a fallback value
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.commentCard}>
      {/* Top row: Date + Icons */}
      <View
        style={{
          ...CommonStyles.rowAlignCenter,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ ...Fonts.grayColor14Medium }}>
          {formatDate(item.createdTime)}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <TouchableOpacity
            onPress={() => console.log("Reply to:", item.id)}
            style={{ marginHorizontal: 6 }}
          >
            <MaterialIcons
              name="comment"
              size={20}
              color={Colors.primaryColor}
            />
          </TouchableOpacity> */}

          {editingCommentId === item.id ? (
            <TouchableOpacity
              onPress={() => saveEdit(item.id)}
              style={{ marginLeft: 6 }}
            >
              <MaterialIcons name="check" size={20} color="green" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => startEditing(item.id, item.description)}
              style={{ marginLeft: 6 }}
            >
              <MaterialIcons
                name="edit"
                size={20}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Comment content */}
      {editingCommentId === item.id ? (
        <TextInput
          style={{
            ...Fonts.blackColor14Medium,
            marginTop: Sizes.fixPadding,
            borderWidth: 1,
            borderColor: Colors.primaryColor,
            borderRadius: 6,
            padding: 6,
          }}
          value={editingText} // Use editingText
          onChangeText={setEditingText} // Update editingText
          multiline
          autoFocus
        />
      ) : (
        <Text
          style={{ ...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding }}
        >
          {item.description}
        </Text>
      )}
    </View>
  );

  const findCommentsByIssue = async (id) => {
    try {
      const response = await fetch(
        `http://192.168.1.10:8080/api/v1/comment/getComments/${id}`,
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
      setComments(result.payload[0]);
      return result;
    } catch (error) {
      // Handle network/parse errors
      console.error("Request failed:", error.message);
      // You can also show an alert or return a fallback value
    }
  };

  return (
    <AlertNotificationRoot>
      <Formik
        initialValues={{
          memberName: "",
          email: "",
          attachment: [],
          issueStatus: "TODO",
          isActive: true,
        }}
        enableReinitialize={true}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {() => (
          <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <Header header={"Add New Comment"} navigation={navigation} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustKeyboardInsets={true}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {loadingDialog()}

              {/* Input Box */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type your comment..."
                  value={newCommentText} // Use separate state
                  onChangeText={setNewCommentText} // Update main input
                  multiline
                />
                <TouchableOpacity
                  onPress={addComment}
                  style={styles.sendButton}
                >
                  <MaterialIcons
                    name="send"
                    size={22}
                    color={Colors.whiteColor}
                  />
                </TouchableOpacity>
              </View>

              {/* Comment List */}
              <FlatList
                data={comments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: Sizes.fixPadding }}
                scrollEnabled={false}
              />
            </ScrollView>
          </View>
        )}
      </Formik>
    </AlertNotificationRoot>
  );
};

export default AddNewComment;

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    ...CommonStyles.shadow,
    padding: Sizes.fixPadding + 2.0,
    marginTop: Sizes.fixPadding,
  },
  commentCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
    ...CommonStyles.shadow,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    margin: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    ...CommonStyles.shadow,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    ...Fonts.blackColor14Medium,
  },
  sendButton: {
    backgroundColor: Colors.primaryColor,
    padding: 8,
    borderRadius: 25,
    marginLeft: 6,
  },
  dialogStyle: {
    marginHorizontal: Sizes.fixPadding * 2,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 2,
  },
});
