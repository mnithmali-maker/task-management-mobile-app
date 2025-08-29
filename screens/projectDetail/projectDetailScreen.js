import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  FlatList,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  FontFamily,
  CommonStyles,
} from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Touchable } from "../../components/touchable";
import * as Progress from "react-native-progress";
import { TabView, TabBar } from "react-native-tab-view";
import TaskDeleteDialog from "../../components/taskDeleteDialog";
import { Menu, MenuItem } from "react-native-material-menu";
import TaskCompleteDialog from "../../components/taskCompleteDialog";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
  Toast,
} from "react-native-alert-notification";

// const optionsList = ['Delete project', 'Share project', 'Copy link', 'Complete Project'];

const progressTaskList = [
  {
    id: "1",
    title: "Deshboard ui design",
    description: "Shopping app project",
    progress: 0.6,
    fill: Colors.blueColor,
    unfill: Colors.lightBlueColor,
  },
  {
    id: "2",
    title: "Email reply & testing",
    description: "Green project",
    progress: 0.2,
    fill: Colors.tomatoColor,
    unfill: Colors.lightTomatoColor,
  },
  {
    id: "3",
    title: "User interface design",
    description: "Food delivery app project",
    progress: 0.4,
    fill: Colors.yellowColor,
    unfill: Colors.lightYellowColor,
  },
  {
    id: "4",
    title: "Mobile application  design",
    description: "Shopping app project",
    progress: 0.6,
    fill: Colors.woodenColor,
    unfill: Colors.lightWoodenColor,
  },
  {
    id: "5",
    title: "UX member payment",
    description: "Microsoft product  design",
    progress: 0.5,
    fill: Colors.parrotColor,
    unfill: Colors.lightParrotColor,
  },
  {
    id: "6",
    title: "Mobile application design",
    description: "Shopping app project",
    progress: 0.6,
    fill: Colors.blueColor,
    unfill: Colors.lightBlueColor,
  },
  {
    id: "7",
    title: "Deshboard ui design",
    description: "Shopping app project",
    progress: 0.5,
    fill: Colors.tomatoColor,
    unfill: Colors.lightTomatoColor,
  },
];

const attachFilesList = [
  {
    id: "1",
    image: require("../../assets/images/files/file1.png"),
    name: "Lorem2.jpeg",
    size: "56.56 KB",
    date: "04 oct",
  },
  {
    id: "2",
    image: require("../../assets/images/files/file2.png"),
    name: "Lorem2.jpeg",
    size: "56.56 KB",
    date: "04 oct",
  },
  {
    id: "3",
    image: require("../../assets/images/files/file3.png"),
    name: "Lorem2.jpeg",
    size: "56.56 KB",
    date: "04 oct",
  },
];

const teamsList = [
  {
    id: "1",
    image: require("../../assets/images/users/user3.png"),
    name: "Jenny Wilson",
    profession: "Designer",
  },
  {
    id: "2",
    image: require("../../assets/images/users/user2.png"),
    name: "Esther Howard",
    profession: "Back-end developer",
  },
  {
    id: "3",
    image: require("../../assets/images/users/user4.png"),
    name: "Brooklyn Simmons",
    profession: "Back-end developer",
  },
  {
    id: "4",
    image: require("../../assets/images/users/user5.png"),
    name: "Cameron Williamson",
    profession: "flutter develpoer",
  },
];

const commentsList = [
  {
    id: "1",
    image: require("../../assets/images/users/user2.png"),
    name: "Guy Hawkins",
    profession: "Designer",
    time: "1 hour ago",
    comment:
      "Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id porttitor in. Consequat morbi odio morbi",
  },
  {
    id: "2",
    image: require("../../assets/images/users/user3.png"),
    name: "Nipuni Madushani",
    profession: "Back-end developer",
    time: "1 hour ago",
    comment:
      "Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id porttitor in. Consequat morbi odio morbi",
  },
  {
    id: "3",
    image: require("../../assets/images/users/user4.png"),
    name: "Guy Hawkins",
    profession: "Flutter developer",
    time: "1 hour ago",
    attachments: [
      require("../../assets/images/files/file4.png"),
      require("../../assets/images/files/file5.png"),
      require("../../assets/images/files/file6.png"),
    ],
    comment:
      "Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id porttitor in. Consequat morbi odio morbi",
  },
  {
    id: "4",
    image: require("../../assets/images/users/user5.png"),
    name: "Esther Howard",
    profession: "Developer",
    time: "1 hour ago",
    comment:
      "Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id porttitor in. Consequat morbi odio morbi",
  },
  {
    id: "5",
    image: require("../../assets/images/users/user6.png"),
    name: "Albert Flores",
    profession: "Designer",
    time: "1 hour ago",
    comment:
      "Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id porttitor in. Consequat morbi odio morbi",
  },
];

const ProjectDetailScreen = ({ navigation, route }) => {
  useEffect(() => {
    if (route.params?.members) {
      setteamMembers([...teamMembers, ...route.params.members]);
    }
  }, [route.params?.members]);
  const updateStatus = async (projectId, status) => {
    try {
      // console.log("Calling:", `${API_URL}/project/updateStatus/${projectId}/${status}`);

      const response = await fetch(
        `http:192.168.8.102:8080/api/v1/project/updateStatus/${projectId}/${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("Backend Response:", result);

      if (result.status === 200) {
        // Alert.alert("✅ Success", "Project status updated successfully!");
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Project  has been completed Successfully.",
          button: "Close",
          autoClose: 2000, // auto-close after 3 seconds
          closeOnOverlayTap: true,
        });
      } else {
        Alert.alert("⚠️ Failed", result.errorMessages?.[0] || "Update failed");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("❌ Error", "Could not update status");
    }
  };

  const item = route.params.item;
  const category = route.params.category;
  //  let optionsList;

  const optionsList = useMemo(() => {
    const fullOptions = [
      "Delete project",
      "Share project",
      "Copy link",
      "Complete Project",
    ];

    if (category === "complete") {
      // Remove 'Complete Project' for completed projects
      return fullOptions.filter((option) => option !== "Complete Project");
    }
    return fullOptions; // Show all options for active projects
  }, [category]);

  const [index, setIndex] = useState(0);
  const routes = [
    { key: "first", title: "All task" },
    { key: "second", title: "File" },
    { key: "third", title: "Team" },
    { key: "forth", title: "Comments" },
  ];
  const [showDeleteDialog, setshowDeleteDialog] = useState(false);
  const [showCompleteDialog, setshowCompleteDialog] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const [teamMembers, setteamMembers] = useState(teamsList);

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "height" : null}
        style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}
      >
        {header()}
        {projectDetail()}
        {tabBarInfo()}
        {deleteDialog()}
        {completeDialog()}
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );

  function deleteDialog() {
    return (
      <TaskDeleteDialog
        visible={showDeleteDialog}
        setVisible={() => {
          setshowDeleteDialog(false);
        }}
        message="Are you sure you want to delete this project"
        onDelete={() => {
          setshowDeleteDialog(false);
          navigation.navigate({
            name: "Project",
            params: { id: item.id, category: category },
            merge: true,
          });
        }}
      />
    );
  }

  function completeDialog() {
    return (
      <TaskCompleteDialog
        visible={showCompleteDialog}
        setVisible={() => {
          setshowCompleteDialog(false);
        }}
        message="Are you sure you want to complete this project"
        onDelete={() => {
          console.warn("dddddddd");
          setshowCompleteDialog(false);

          updateStatus(item.id, "COMPLETED");
          // navigation.navigate({
          //   name: "Project",
          //   params: { id: item.id, category: category },
          //   merge: true,
          // });
        }}
      />
    );
  }

  function tabBarInfo() {
    const renderScene = ({ route }) => {
      switch (route.key) {
        case "first":
          return <AllTasks navigation={navigation} />;
        case "second":
          return <Files />;
        case "third":
          return <Teams navigation={navigation} teamMembers={teamMembers} />;
        case "forth":
          return <Comments />;
      }
    };

    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ height: 0 }}
            style={{
              backgroundColor: "#EDEDED",
              elevation: 0,
            }}
            pressColor={Colors.bodyBackColor}
            renderLabel={({ route, focused }) => (
              <Text
                numberOfLines={1}
                style={{
                  ...(focused
                    ? { ...Fonts.primaryColor16SemiBold }
                    : { ...Fonts.grayColor16SemiBold }),
                }}
              >
                {route.title}
              </Text>
            )}
          />
        )}
      />
    );
  }

  function projectDetail() {
    return (
      <View style={{ ...CommonStyles.center, margin: Sizes.fixPadding * 2.0 }}>
        {category == "complete" ? (
          <View style={{ ...styles.doneCircle, borderColor: item.fill }}>
            <MaterialIcons name="done" color={item.fill} size={40} />
          </View>
        ) : (
          <Progress.Circle
            size={70}
            progress={item.progress / 100}
            unfilledColor={item.unfill}
            color={item.fill}
            borderWidth={0}
            thickness={7}
            formatText={(progress) => `${item.progress}%`}
            showsText={true}
            textStyle={{
              fontSize: 16.0,
              fontFamily: FontFamily.medium,
              color: Colors.blackColor,
            }}
          />
        )}
        <View style={{ marginTop: Sizes.fixPadding + 5.0 }}>
          <Text style={{ textAlign: "center", ...Fonts.blackColor18SemiBold }}>
            {item.title}
          </Text>
          <Text style={{ textAlign: "center", ...Fonts.grayColor14Medium }}>
            Starting date : 25 jan 2022
          </Text>
          <Text style={{ textAlign: "center", ...Fonts.grayColor14Medium }}>
            Ending date : 15 feb 2022
          </Text>
        </View>
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
          <View style={styles.headerWrapStyle}>
            <Touchable
              onPress={() => {
                navigation.pop();
              }}
            >
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
              Project detail
            </Text>
            <Menu
              visible={showMenu}
              anchor={
                <Ionicons
                  name="ellipsis-vertical"
                  color={Colors.whiteColor}
                  size={20}
                  onPress={() => {
                    setshowMenu(true);
                  }}
                />
              }
              onRequestClose={() => {
                setshowMenu(false);
              }}
            >
              <View
                style={{
                  paddingTop: Sizes.fixPadding - 5.0,
                  borderRadius: Sizes.fixPadding,
                }}
              >
                {optionsList.map((option, index) => (
                  <MenuItem
                    key={`${index}`}
                    textStyle={{ ...Fonts.blackColor16Medium }}
                    onPress={() => {
                      if (index == 0) {
                        Platform.OS == "ios"
                          ? setTimeout(() => {
                              setshowDeleteDialog(true);
                            }, 400)
                          : setshowDeleteDialog(true);
                      }

                      if (index == 3) {
                        Platform.OS == "ios"
                          ? setTimeout(() => {
                              setshowCompleteDialog(true);
                            }, 400)
                          : setshowCompleteDialog(true);
                      }
                      setshowMenu(false);
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </View>
            </Menu>
          </View>
        </ImageBackground>
      </View>
    );
  }
};

const Comments = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {commentTitle()}
        {comments()}
      </ScrollView>
      {typeComment()}
    </View>
  );

  function typeComment() {
    const fieldRef = useRef();
    return (
      <View style={styles.addCommentBox}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            fieldRef.current.focus();
          }}
          style={styles.attachmentIconWrapper}
        >
          <MaterialIcons
            name="attach-file"
            size={20}
            color={Colors.grayColor}
            style={{ transform: [{ rotate: "50deg" }] }}
          />
        </TouchableOpacity>
        <TextInput
          ref={fieldRef}
          placeholder="Write comment.."
          style={{
            ...Fonts.blackColor14Medium,
            flex: 1,
            marginHorizontal: Sizes.fixPadding + 5.0,
          }}
          placeholderTextColor={Colors.grayColor}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            fieldRef.current.clear();
          }}
          style={styles.sendIconWrapper}
        >
          <MaterialIcons name="send" size={20} color={Colors.primaryColor} />
        </TouchableOpacity>
      </View>
    );
  }

  function comments() {
    const renderItem = ({ item }) => (
      <View style={styles.commentCard}>
        <View style={{ ...CommonStyles.rowAlignCenter }}>
          <Image
            source={item.image}
            style={{ width: 50.0, height: 50.0, borderRadius: 25.0 }}
          />
          <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
              {item.profession}
            </Text>
          </View>
          <Text style={{ ...Fonts.grayColor14Medium }}>{item.time}</Text>
        </View>
        {item.attachments ? (
          <FlatList
            data={item.attachments}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: innerItem, index }) => (
              <Image
                source={innerItem}
                style={{
                  marginRight:
                    index == item.attachments?.length - 1
                      ? 0
                      : Sizes.fixPadding,
                  ...styles.attachImageStyle,
                }}
              />
            )}
            contentContainerStyle={{ paddingTop: Sizes.fixPadding }}
          />
        ) : null}
        <Text
          style={{ ...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding }}
        >
          {item.comment}
        </Text>
      </View>
    );
    return (
      <FlatList
        data={commentsList}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
        scrollEnabled={false}
      />
    );
  }

  function commentTitle() {
    return (
      <Text
        style={{ ...Fonts.blackColor16Medium, margin: Sizes.fixPadding * 2.0 }}
      >
        Comments({commentsList.length})
      </Text>
    );
  }
};

const Teams = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {memberAndInviteInfo()}
        {teamsInfo()}
      </ScrollView>
    </View>
  );

  function teamsInfo() {
    const renderItem = ({ item }) => (
      <View style={styles.teamCard}>
        <Image
          source={item.image}
          style={{ width: 50.0, height: 50.0, borderRadius: 25.0 }}
        />
        <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
            {item.profession}
          </Text>
        </View>
      </View>
    );
    return (
      <FlatList
        data={props.teamMembers}
        renderItem={renderItem}
        keyExtractor={(item, index) => `team${index}${item.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
        scrollEnabled={false}
      />
    );
  }

  function memberAndInviteInfo() {
    return (
      <View
        style={{
          ...CommonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <Text
          numberOfLines={1}
          style={{ flex: 1, ...Fonts.blackColor16Medium }}
        >
          Team member({props.teamMembers.length})
        </Text>
        <Touchable
          onPress={() => {
            props.navigation.push("InviteMember", {
              memberFor: "project",
              inviteFor: "team",
            });
          }}
          style={{ ...CommonStyles.rowAlignCenter }}
        >
          <View style={styles.addIconOuterCircle}>
            <View style={styles.addIconinnerCircle}>
              <MaterialIcons name="add" color={Colors.whiteColor} size={12} />
            </View>
          </View>
          <Text
            style={{
              ...Fonts.primaryColor14Medium,
              marginLeft: Sizes.fixPadding - 5.0,
            }}
          >
            Invite member
          </Text>
        </Touchable>
      </View>
    );
  }
};

const Files = () => {
  const attachmentOptions = ["Copy link", "Delete file", "Share link"];
  const [showMenu, setshowMenu] = useState(false);
  const [selectedItemId, setselectedItemId] = useState();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {attachmentAndNewInfo()}
        {attachments()}
      </ScrollView>
    </View>
  );

  function attachments() {
    const renderItem = ({ item }) => (
      <View style={styles.attachmentCard}>
        <Image source={item.image} style={{ width: 92.0, height: 57.0 }} />
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 2.0 }}>
          <Text style={{ ...Fonts.blackColor15Medium }}>{item.name}</Text>
          <Text style={{ ...Fonts.grayColor14Medium }}>
            {item.size} - {item.date}
          </Text>
        </View>
        <Menu
          visible={selectedItemId == item.id ? showMenu : false}
          anchor={
            <Ionicons
              name="ellipsis-vertical"
              color={Colors.grayColor}
              size={18}
              onPress={() => {
                setselectedItemId(item.id);
                setshowMenu(true);
              }}
            />
          }
          onRequestClose={() => {
            setshowMenu(false);
          }}
        >
          <View
            style={{
              paddingTop: Sizes.fixPadding - 5.0,
              borderRadius: Sizes.fixPadding,
            }}
          >
            {attachmentOptions.map((option, index) => (
              <MenuItem
                key={`${index}`}
                textStyle={{ ...Fonts.blackColor16Medium }}
                onPress={() => {
                  setshowMenu(false);
                }}
              >
                {option}
              </MenuItem>
            ))}
          </View>
        </Menu>
      </View>
    );
    return (
      <FlatList
        data={attachFilesList}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
      />
    );
  }

  function attachmentAndNewInfo() {
    return (
      <View
        style={{
          ...CommonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <Text
          numberOfLines={1}
          style={{ flex: 1, ...Fonts.blackColor16Medium }}
        >
          Attachment (3 file)
        </Text>
        <View style={{ ...CommonStyles.rowAlignCenter }}>
          <View style={styles.addIconOuterCircle}>
            <View style={styles.addIconinnerCircle}>
              <MaterialIcons name="add" color={Colors.whiteColor} size={12} />
            </View>
          </View>
          <Text
            style={{
              ...Fonts.primaryColor14Medium,
              marginLeft: Sizes.fixPadding - 5.0,
            }}
          >
            Attach new
          </Text>
        </View>
      </View>
    );
  }
};

const AllTasks = (props) => {
  const [selctedItemId, setselctedItemId] = useState();
  const [showMenu, setshowMenu] = useState(false);
  const [showDeleteDialog, setshowDeleteDialog] = useState(false);
  const [tasks, settasks] = useState(progressTaskList);

  const optionsList = ["Delete task", "Share task", "Copy link"];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {totalAndAddInfo()}
        {tasks.length == 0 ? noDataInfo() : dataInfo()}
      </ScrollView>
    </View>
  );

  function noDataInfo() {
    return (
      <View style={{ flex: 0.8, ...CommonStyles.center }}>
        <Image
          source={require("../../assets/images/icons/empty_task.png")}
          style={{ width: 53.0, height: 53.0, resizeMode: "contain" }}
        />
        <Text
          style={{
            ...Fonts.grayColor16Medium,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Empty task list
        </Text>
      </View>
    );
  }

  function dataInfo() {
    const renderItem = ({ item }) => {
      return (
        <View style={{ ...styles.taskCard }}>
          {
            <Progress.Circle
              size={42}
              progress={item.progress}
              unfilledColor={item.unfill}
              color={item.fill}
              borderWidth={0}
              thickness={4}
              formatText={(progress) => `${item.progress * 100}%`}
              showsText={true}
              textStyle={{
                fontSize: 12.0,
                fontFamily: FontFamily.medium,
                color: item.fill,
              }}
            />
          }
          <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 5.0 }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium }}>
              {item.title}
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
              {item.description}
            </Text>
          </View>
          <Menu
            visible={selctedItemId == item.id ? showMenu : false}
            anchor={
              <Ionicons
                name="ellipsis-vertical"
                color={Colors.lightGrayColor}
                size={18}
                onPress={() => {
                  setselctedItemId(item.id);
                  setshowMenu(true);
                }}
              />
            }
            onRequestClose={() => {
              setshowMenu(false);
            }}
          >
            <View
              style={{
                paddingTop: Sizes.fixPadding - 5.0,
                borderRadius: Sizes.fixPadding,
              }}
            >
              {optionsList.map((option, index) => (
                <MenuItem
                  key={`${index}`}
                  textStyle={{ ...Fonts.blackColor16Medium }}
                  onPress={() => {
                    if (index == 0) {
                      Platform.OS == "ios"
                        ? setTimeout(() => {
                            setshowDeleteDialog(true);
                          }, 350)
                        : setshowDeleteDialog(true);
                    }
                    setshowMenu(false);
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </View>
          </Menu>
        </View>
      );
    };

    return (
      <>
        <FlatList
          data={tasks}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => renderItem({ item })}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
          scrollEnabled={false}
        />
        {deleteDialog()}
      </>
    );
  }

  function deleteDialog() {
    return (
      <TaskDeleteDialog
        visible={showDeleteDialog}
        setVisible={() => {
          setshowDeleteDialog(false);
        }}
        onDelete={() => {
          settasks(tasks.filter((item) => item.id !== selctedItemId));
        }}
      />
    );
  }

  function totalAndAddInfo() {
    return (
      <View
        style={{
          ...CommonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <Text
          numberOfLines={1}
          style={{ flex: 1, ...Fonts.blackColor16Medium }}
        >
          Total {tasks.length} task
        </Text>
        <Touchable
          onPress={() => {
            props.navigation.push("AddNew", { from: "task" });
          }}
          style={{ ...CommonStyles.rowAlignCenter }}
        >
          <View style={styles.addIconOuterCircle}>
            <View style={styles.addIconinnerCircle}>
              <MaterialIcons name="add" color={Colors.whiteColor} size={12} />
            </View>
          </View>
          <Text
            style={{
              ...Fonts.primaryColor14Medium,
              marginLeft: Sizes.fixPadding - 5.0,
            }}
          >
            Add new
          </Text>
        </Touchable>
      </View>
    );
  }
};

export default ProjectDetailScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    ...CommonStyles.rowAlignCenter,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingTop:
      Platform.OS == "ios"
        ? Sizes.fixPadding * 6.0
        : StatusBar.currentHeight + Sizes.fixPadding * 1.5,
    paddingBottom: Sizes.fixPadding + 5.0,
  },
  doneCircle: {
    width: 70.0,
    height: 70.0,
    borderRadius: 35.0,
    borderWidth: 7.0,
    ...CommonStyles.center,
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
  attachmentCard: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    ...CommonStyles.rowAlignCenter,
  },
  teamCard: {
    ...CommonStyles.rowAlignCenter,
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  attachImageStyle: {
    width: 50.0,
    height: 50.0,
    borderRadius: 5.0,
  },
  commentCard: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  attachmentIconWrapper: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 30.0,
    height: 30.0,
    ...CommonStyles.center,
    ...CommonStyles.shadow,
  },
  sendIconWrapper: {
    width: 40.0,
    height: 40.0,
    borderRadius: Sizes.fixPadding - 5.0,
    ...CommonStyles.center,
    ...CommonStyles.shadow,
    backgroundColor: "#FFFAFA",
  },
  addTaskInfoBox: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    ...CommonStyles.shadow,
    padding: Sizes.fixPadding + 2.0,
    marginTop: Sizes.fixPadding,
  },
  addCommentBox: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    ...CommonStyles.rowAlignCenter,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderColor: "#ececec",
  },
  taskCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.4,
    ...CommonStyles.shadow,
    ...CommonStyles.rowAlignCenter,
  },
});
