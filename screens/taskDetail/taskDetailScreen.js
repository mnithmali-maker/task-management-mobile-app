import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  FlatList,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
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
import { Button } from "../../components/button";

const optionsList = ["Delete task", "Share task", "Copy link"];

const subTasks = [
  {
    id: "1",
    task: "Collect data base from client",
    tasker: "jenny Williamson",
    profession: "Designer",
    image: require("../../assets/images/users/user2.png"),
    isDone: true,
  },
  {
    id: "2",
    task: "Get app resource from ui designer",
    tasker: "jenny Williamson",
    profession: "Flutter Developer",
    image: require("../../assets/images/users/user2.png"),
    isDone: true,
  },
  {
    id: "3",
    task: "Generate app play store resource",
    tasker: "jenny Williamson",
    profession: "Developer",
    image: require("../../assets/images/users/user2.png"),
    isDone: false,
  },
  {
    id: "4",
    task: "Set up API for apps",
    tasker: "jenny Williamson",
    profession: "Back-end developer",
    image: require("../../assets/images/users/user2.png"),
    isDone: false,
  },
  {
    id: "5",
    task: "Collect data from client",
    tasker: "jenny Williamson",
    profession: "Developer",
    image: require("../../assets/images/users/user2.png"),
    isDone: false,
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

const TaskDetailScreen = ({ navigation, route }) => {
  useEffect(() => {
    if (route.params?.members) {
      if (route.params.inviteFor == "task") {
        setshowAddTasksSheet(true);
        setselectedMembers(route.params.members);
      } else if (route.params.inviteFor == "team") {
        setteamMembers([...teamMembers, ...route.params.members]);
      }
    }
  }, [route.params?.members]);

  const item = route.params.item;
  const category = route.params.category;

  const [index, setIndex] = useState(0);
  const routes = [
    // { key: "first", title: "Sub task" },
    // { key: "second", title: "File" },
    // { key: "third", title: "Team" },
    { key: "forth", title: "Comments" },
  ];
  const [showDeleteDialog, setshowDeleteDialog] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const [taskName, settaskName] = useState("");
  const [showAddTasksSheet, setshowAddTasksSheet] = useState(false);
  const [selectedMembers, setselectedMembers] = useState([]);
  const [teamMembers, setteamMembers] = useState(teamsList);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "height" : null}
      style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}
    >
      {header()}
      {taskDetail()}
      {tabBarInfo()}
      {deleteDialog()}
    </KeyboardAvoidingView>
  );

  function deleteDialog() {
    return (
      <TaskDeleteDialog
        visible={showDeleteDialog}
        setVisible={() => {
          setshowDeleteDialog(false);
        }}
        onDelete={() => {
          setshowDeleteDialog(false);
          navigation.navigate({
            name: "Task",
            params: { id: item.id, category: category },
            merge: true,
          });
        }}
      />
    );
  }

  function tabBarInfo() {
    const renderScene = ({ route }) => {
      switch (route.key) {
        case "first":
          return (
            <SubTasks
              navigation={navigation}
              taskName={taskName}
              settaskName={settaskName}
              showAddTasksSheet={showAddTasksSheet}
              setshowAddTasksSheet={setshowAddTasksSheet}
              selectedMembers={selectedMembers}
              setselectedMembers={setselectedMembers}
            />
          );
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

  function taskDetail() {
    return (
      <View style={{ ...CommonStyles.center, margin: Sizes.fixPadding * 2.0 }}>
        {category == "complete" ? (
          <View style={{ ...styles.doneCircle, borderColor: item.fill }}>
            <MaterialIcons name="done" color={item.fill} size={40} />
          </View>
        ) : (
          <Progress.Circle
            size={70}
            progress={item.progress}
            unfilledColor={item.unfill}
            color={item.fill}
            borderWidth={0}
            thickness={7}
            formatText={(progress) => `${item.progress * 100}%`}
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
              Task detail
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
            props.navigation.push("InviteMember", { inviteFor: "team" });
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

const SubTasks = (props) => {
  const [tasksList, settasksList] = useState(subTasks);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {totalAndAddInfo()}
        {tasks()}
      </ScrollView>
      {addTaskSheet()}
    </View>
  );

  function addTaskSheet() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.showAddTasksSheet}
        onRequestClose={() => {
          props.setshowAddTasksSheet(false);
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            props.setshowAddTasksSheet(false);
          }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "height" : null}
            style={{ justifyContent: "flex-end", flex: 1 }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={styles.sheetWrapper}
            >
              <View>
                <Text style={{ ...Fonts.blackColor16Medium }}>Task name</Text>
                <View style={styles.addTaskInfoBox}>
                  <TextInput
                    value={props.taskName}
                    onChangeText={props.settaskName}
                    placeholder="Enter task name"
                    placeholderTextColor={Colors.grayColor}
                    style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                  />
                </View>
              </View>
              <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                  Task assign to
                </Text>
                {props.selectedMembers.length == 0 ? (
                  <Touchable
                    onPress={() => {
                      props.setshowAddTasksSheet(false);
                      props.navigation.push("InviteMember", {
                        inviteFor: "task",
                      });
                    }}
                    style={{
                      ...styles.addTaskInfoBox,
                      ...CommonStyles.rowAlignCenter,
                    }}
                  >
                    <Text style={{ ...Fonts.grayColor15Medium, flex: 1 }}>
                      Select member
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={Colors.grayColor}
                    />
                  </Touchable>
                ) : (
                  <Touchable
                    onPress={() => {
                      props.setshowAddTasksSheet(false);
                      props.navigation.push("InviteMember", {
                        inviteFor: "task",
                      });
                    }}
                    style={{
                      ...styles.addTaskInfoBox,
                      ...CommonStyles.rowAlignCenter,
                    }}
                  >
                    <View style={{ ...CommonStyles.rowAlignCenter }}>
                      {props.selectedMembers.slice(0, 4).map((item, index) => (
                        <Image
                          key={`${index}`}
                          source={item.image}
                          style={{
                            ...styles.selectedMemberStyle,
                            left: -(index * 6),
                          }}
                        />
                      ))}
                      {props.selectedMembers.length > 4 ? (
                        <View
                          style={{
                            ...styles.selectedMemberStyle,
                            ...CommonStyles.center,
                            left: -25.0,
                          }}
                        >
                          <Text style={{ ...Fonts.blackColor12SemiBold }}>
                            +{props.selectedMembers.length - 4}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </Touchable>
                )}
              </View>
              <Button
                buttonText="Add sub task"
                style={{
                  marginHorizontal: 0,
                  marginTop: Sizes.fixPadding * 4.0,
                  marginBottom: 0,
                }}
                onPress={() => {
                  props.setshowAddTasksSheet(false);
                }}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    );
  }

  function updateTasks(id) {
    const updatedTasks = tasksList.map((item) => {
      if (item.id == id) {
        return { ...item, isDone: !item.isDone };
      } else {
        return item;
      }
    });
    settasksList(updatedTasks);
  }

  function tasks() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          updateTasks(item.id);
        }}
        style={styles.subTaskCard}
      >
        <View
          style={{
            width: 24.0,
            height: 24.0,
            borderRadius: Sizes.fixPadding - 5.0,
            ...CommonStyles.center,
            ...CommonStyles.shadow,
            borderWidth: item.isDone ? 0.0 : Platform.OS == "ios" ? 0.0 : 2.0,
            backgroundColor: item.isDone
              ? Colors.primaryColor
              : Colors.whiteColor,
          }}
        >
          {item.isDone ? (
            <MaterialIcons name="done" color={Colors.whiteColor} size={16} />
          ) : null}
        </View>
        <View style={styles.subTaskDivider} />
        <View style={{ flex: 1 }}>
          <Text style={{ ...Fonts.blackColor14Medium }}>{item.task}</Text>
          <View
            style={{
              ...CommonStyles.rowAlignCenter,
              marginTop: Sizes.fixPadding - 5.0,
            }}
          >
            <Image
              source={item.image}
              style={{ width: 18.0, height: 18.0, borderRadius: 9.0 }}
            />
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.grayColor12SemiBold,
                flex: 1,
                marginLeft: Sizes.fixPadding - 5.0,
              }}
            >
              {item.tasker} ({item.profession})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={tasksList}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
        scrollEnabled={false}
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
          Total {tasksList.length} sub task
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.setshowAddTasksSheet(true);
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
            Add new sub task
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default TaskDetailScreen;

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
  subTaskCard: {
    ...CommonStyles.rowAlignCenter,
    ...CommonStyles.shadow,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
  },
  subTaskDivider: {
    height: 36.0,
    width: 1.0,
    backgroundColor: Colors.grayColor,
    marginHorizontal: Sizes.fixPadding + 5.0,
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
  sheetWrapper: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 4.0,
    borderTopRightRadius: Sizes.fixPadding * 4.0,
    overflow: "hidden",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding * 2.5,
  },
  checkBoxStyle: {
    width: 24.0,
    height: 24.0,
    borderRadius: Sizes.fixPadding - 5.0,
    ...CommonStyles.center,
    ...CommonStyles.shadow,
  },
  selectedMemberStyle: {
    width: 25.0,
    height: 25.0,
    borderColor: Colors.whiteColor,
    borderWidth: 2.0,
    borderRadius: 13.0,
    backgroundColor: Colors.extraLightGrayColor,
    overflow: "hidden",
  },
  addCommentBox: {
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    ...CommonStyles.rowAlignCenter,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderColor: "#ececec",
  },
});
