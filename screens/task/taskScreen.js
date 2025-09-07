
import React, { useRef, useState, useEffect } from "react";
import {
  ImageBackground,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Carousel from "react-native-snap-carousel-v4";
import { TabView, TabBar } from "react-native-tab-view";
import * as Progress from "react-native-progress";
import { Menu, MenuItem } from "react-native-material-menu";

import {
  Colors,
  Sizes,
  Fonts,
  CommonStyles,
  screenWidth,
  FontFamily,
} from "../../constants/styles";
import { Touchable } from "../../components/touchable";
import TaskDeleteDialog from "../../components/taskDeleteDialog";

const taskCategoryList = [
  {
    id: "1",
    title: "Total task",
    description: "50 task",
    bgColor: Colors.purpleColor,
    bgImageColor: "rgba(255, 228, 255,0.8)",
    icon: require("../../assets/images/icons/list.png"),
  },
  {
    id: "2",
    title: "In-progress",
    description: "20 task",
    bgColor: Colors.greenColor,
    bgImageColor: "rgba(91, 254, 255,0.8)",
    icon: require("../../assets/images/icons/calendar.png"),
  },
  {
    id: "3",
    title: "Completed",
    description: "10 task",
    bgColor: Colors.pitchColor,
    bgImageColor: "rgba(255, 226, 226,0.8)",
    icon: require("../../assets/images/icons/complete.png"),
  },
  {
    id: "4",
    title: "Team",
    description: "12 member",
    bgColor: Colors.pinkColor,
    bgImageColor: "rgba(254, 219, 255,0.8)",
    icon: require("../../assets/images/icons/team.png"),
  },
];

const colorPairs = [
  { fill: Colors.woodenColor, unfill: Colors.lightWoodenColor },
  { fill: Colors.parrotColor, unfill: Colors.lightParrotColor },
  { fill: Colors.tomatoColor, unfill: Colors.lightTomatoColor },
  { fill: Colors.blueColor, unfill: Colors.lightBlueColor },
  { fill: Colors.yellowColor, unfill: Colors.lightYellowColor },
];

const TaskScreen = ({ navigation, route }) => {
  const categoryRef = useRef();
  const [todoTasks, setTodoTasks] = useState([]);
  const [progressTasks, setProgressTasks] = useState([]);
  const [completeTasks, setCompleteTasks] = useState([]);
  const [holdTasks, setHoldTasks] = useState([]);
  const [index, setIndex] = useState(0);

  // Fetch tasks based on category
  const fetchTasks = async (status) => {
    try {
      const response = await fetch(
        `http://192.168.8.102:8080/api/v1/task/status/${status}`
      );
      const result = await response.json();

      if (result.status === 200) {
        const projects = result.payload[0] || [];
        const formattedProjects = projects.map((p, i) => {
          const color = colorPairs[i % colorPairs.length];
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const endDate = new Date(p.endDate);
          endDate.setHours(0, 0, 0, 0);

          let deadlineText = null;
          let deadlineColor = null;
          if (endDate < today) {
            deadlineText = "⚠️ Due date has passed";
            deadlineColor = Colors.redColor;
          } else if (endDate.getTime() === today.getTime()) {
            deadlineText = "⏰ Due date is today";
            deadlineColor = Colors.darkGreenColor;
          }

          return {
            id: p.taskId,
            title: p.name,
            description: p.project,
            progress: 0,
            fill: color.fill,
            unfill: color.unfill,
            isDeadlinePassed: today >= endDate,
            deadlineText,
            deadlineColor,
            date: new Date(p.startDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            endDate: new Date(p.endDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          };
        });

        switch (status) {
          case "TODO":
            setTodoTasks(formattedProjects);
            break;
          case "INPROGRESS":
            setProgressTasks(formattedProjects);
            break;
          case "COMPLETED":
            setCompleteTasks(formattedProjects);
            break;
          case "HOLD":
            setHoldTasks(formattedProjects);
            break;
        }
      } else {
        console.warn(result.errorMessages?.[0] || "No active projects found");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      fetchTasks("TODO");
      fetchTasks("INPROGRESS");
      fetchTasks("COMPLETED");
      fetchTasks("HOLD");
      categoryRef.current?.startAutoplay();
    });
    const unsubscribeBlur = navigation.addListener("blur", () => {
      categoryRef.current?.stopAutoplay();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const routes = [
    { key: "todo", title: "To do" },
    { key: "progress", title: "InProgress" },
    { key: "complete", title: "Completed" },
    { key: "hold", title: "Hold" },
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "todo":
        return (
          <Task
            data={todoTasks}
            category="todo"
            navigation={navigation}
            onDelete={deleteTodoTask}
          />
        );
      case "progress":
        return (
          <Task
            data={progressTasks}
            category="progress"
            navigation={navigation}
            onDelete={deleteProgressTask}
          />
        );
      case "complete":
        return (
          <Task
            data={completeTasks}
            category="complete"
            navigation={navigation}
            onDelete={deleteCompleteTask}
          />
        );
      case "hold":
        return (
          <Task
            data={holdTasks}
            category="hold"
            navigation={navigation}
            onDelete={deleteCompleteTask}
          />
        );
      default:
        return null;
    }
  };

  function deleteTodoTask({ id }) {
    setTodoTasks((prev) => prev.filter((item) => item.id !== id));
  }

  function deleteProgressTask({ id }) {
    setProgressTasks((prev) => prev.filter((item) => item.id !== id));
  }

  function deleteCompleteTask({ id }) {
    setCompleteTasks((prev) => prev.filter((item) => item.id !== id));
  }

  const header = () => (
    <View style={{ backgroundColor: Colors.primaryColor }}>
      <ImageBackground
        source={require("../../assets/images/top_image2.png")}
        style={{ width: "100%" }}
        tintColor="rgba(241, 183,255,0.8)"
      >
        <SafeAreaView />
        <View style={styles.headerInfoWrapper}>
          <Image
            source={require("../../assets/images/users/user1.jpeg")}
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
          <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
            <Text style={Fonts.whiteColor18SemiBold}>
              Hello Nipuni Madushani
            </Text>
            <Text style={{ ...Fonts.whiteColor15Medium, opacity: 0.8 }}>
              Good morning
            </Text>
          </View>
          <Touchable onPress={() => navigation.push("Search")}>
            <Ionicons
              name="search-outline"
              color={Colors.whiteColor}
              size={24}
            />
          </Touchable>
          <Touchable onPress={() => navigation.push("Notification")}>
            <Ionicons
              name="notifications-outline"
              color={Colors.whiteColor}
              size={24}
              style={{ marginLeft: Sizes.fixPadding + 2 }}
            />
          </Touchable>
        </View>
      </ImageBackground>
    </View>
  );

  const addButton = () => (
    <View style={styles.addButtonOuterCircle}>
      <Touchable
        style={styles.addButtonInnerCircle}
        onPress={() => navigation.push("AddNew", { from: "task" })}
      >
        <MaterialIcons name="add" size={33} color={Colors.whiteColor} />
      </Touchable>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      {header()}
      <TaskCategories categoryRef={categoryRef} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ height: 0 }}
            style={{ backgroundColor: "#EDEDED", elevation: 0 }}
            pressColor={Colors.bodyBackColor}
            renderLabel={({ route, focused }) => (
              <Text
                numberOfLines={1}
                style={{
                  ...(focused
                    ? Fonts.primaryColor16SemiBold
                    : Fonts.grayColor16SemiBold),
                  textAlign: "center",
                  width: screenWidth / 1.5,
                }}
              >
                {route.title}
              </Text>
            )}
          />
        )}
      />
      {addButton()}
    </View>
  );
};

// TaskCategories Component
const TaskCategories = ({ categoryRef }) => {
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);

  const renderItem = ({ item }) => (
    <View
      style={{ backgroundColor: item.bgColor, ...styles.categoryWrapStyle }}
    >
      <Image
        source={require("../../assets/images/category_bg.png")}
        style={{ width: "75%", height: "100%", position: "absolute", right: 0 }}
        tintColor={item.bgImageColor}
      />
      <View style={styles.categoryTypeIconWrapper}>
        <Image
          source={item.icon}
          style={{ width: 20, height: 20, resizeMode: "contain" }}
        />
      </View>
      <View style={{ marginLeft: Sizes.fixPadding * 2, flex: 1 }}>
        <Text numberOfLines={1} style={Fonts.whiteColor18Medium}>
          {item.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            ...Fonts.whiteColor17Medium,
            marginTop: Sizes.fixPadding - 5,
          }}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ marginVertical: Sizes.fixPadding * 2 }}>
      <Carousel
        ref={categoryRef}
        data={taskCategoryList}
        sliderWidth={screenWidth}
        itemWidth={screenWidth / 1.8}
        itemHeight={110}
        renderItem={renderItem}
        firstItem={1}
        autoplay
        loop
        containerCustomStyle={{ marginBottom: Sizes.fixPadding + 5 }}
        autoplayInterval={5000}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        onSnapToItem={setCurrentScrollIndex}
      />
      <View style={{ alignSelf: "center", ...CommonStyles.rowAlignCenter }}>
        {taskCategoryList.map((item, index) => (
          <View
            key={item.id}
            style={{
              ...styles.paginationStyle,
              backgroundColor:
                currentScrollIndex === index ? Colors.primaryColor : "#D9D9D9",
            }}
          />
        ))}
      </View>
    </View>
  );
};

// Task Component
const Task = ({ data, category, navigation, onDelete }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const optionsList = ["Delete task", "Share task", "Copy link"];

  const renderItem = ({ item }) => (
    <Touchable
      style={styles.taskCard}
      onPress={() => navigation.push("TaskDetail", { item, category })}
    >
      {category === "complete" ? (
        <View style={{ ...styles.doneIconWrapper, borderColor: item.fill }}>
          <MaterialIcons name="done" color={item.fill} size={24} />
        </View>
      ) : (
        <Progress.Circle
          size={42}
          progress={item.progress}
          unfilledColor={item.unfill}
          color={item.fill}
          borderWidth={0}
          thickness={4}
          formatText={() => `${item.progress * 100}%`}
          showsText
          textStyle={{
            fontSize: 12,
            fontFamily: FontFamily.medium,
            color: item.fill,
          }}
        />
      )}
      <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 5 }}>
        <Text numberOfLines={1} style={Fonts.blackColor16Medium}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={Fonts.grayColor14Medium}>
          {item.description}
        </Text>
        <View style={{ flexDirection: "row", flex: 1, marginTop: 4 }}>
          <MaterialIcons
            name="calendar-today"
            color={Colors.grayColor}
            size={14}
          />
          <Text
            style={{
              flex: 1,
              marginLeft: Sizes.fixPadding - 5,
              color: item?.isDeadlinePassed
                ? item.deadlineColor
                : Fonts.grayColor12SemiBold.color,
              fontSize: Fonts.grayColor12SemiBold.fontSize,
            }}
          >
            {item.date}
          </Text>
          <MaterialIcons
            name="calendar-today"
            color={Colors.grayColor}
            size={14}
          />
          <Text
            style={{
              flex: 1,
              marginLeft: Sizes.fixPadding - 5,
              color: item?.isDeadlinePassed
                ? item.deadlineColor
                : Fonts.grayColor12SemiBold.color,
              fontSize: Fonts.grayColor12SemiBold.fontSize,
            }}
          >
            {item.endDate}
          </Text>
          <Touchable
            onPress={() =>
              navigation.push("AddNew", {
                from: "task",
                mode: "edit",
                project: item,
              })
            }
          >
            <MaterialIcons name="edit" size={22} color={Colors.primaryColor} />
          </Touchable>
        </View>
        {item?.isDeadlinePassed && (
          <Text
            style={{ color: item.deadlineColor, marginTop: 4, fontSize: 12 }}
          >
            {item.deadlineText}
          </Text>
        )}
      </View>
      <Menu
        visible={selectedItemId === item.id && showMenu}
        anchor={
          <Ionicons
            name="ellipsis-vertical"
            color={Colors.lightGrayColor}
            size={18}
            onPress={() => {
              setSelectedItemId(item.id);
              setShowMenu(true);
            }}
          />
        }
        onRequestClose={() => setShowMenu(false)}
      >
        {optionsList.map((option, index) => (
          <MenuItem
            key={index}
            textStyle={Fonts.blackColor16Medium}
            onPress={() => {
              if (index === 0) setShowDeleteDialog(true);
              setShowMenu(false);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      <TaskDeleteDialog
        visible={showDeleteDialog}
        setVisible={() => setShowDeleteDialog(false)}
        onDelete={() => onDelete({ id: selectedItemId })}
      />
    </Touchable>
  );

  return (
    <View style={{ flex: 1 }}>
      {data.length === 0 ? (
        <View style={{ flex: 1, ...CommonStyles.center }}>
          <Image
            source={require("../../assets/images/icons/empty_task.png")}
            style={{ width: 53, height: 53, resizeMode: "contain" }}
          />
          <Text
            style={{
              ...Fonts.grayColor16Medium,
              marginTop: Sizes.fixPadding - 5,
            }}
          >
            Empty task list
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2 }}
        />
      )}
    </View>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  headerInfoWrapper: {
    ...CommonStyles.rowAlignCenter,
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingTop: StatusBar.currentHeight + Sizes.fixPadding * 1.5,
    paddingBottom: Sizes.fixPadding + 2,
  },
  paginationStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: Sizes.fixPadding - 7,
  },
  categoryWrapStyle: {
    borderRadius: Sizes.fixPadding,
    height: 110,
    paddingHorizontal: Sizes.fixPadding,
    ...CommonStyles.rowAlignCenter,
    marginHorizontal: Sizes.fixPadding,
  },
  categoryTypeIconWrapper: {
    width: 43,
    height: 43,
    borderRadius: 21.5,
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.center,
  },
  doneIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    ...CommonStyles.center,
  },
  taskCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2,
    marginBottom: Sizes.fixPadding * 2.4,
    ...CommonStyles.shadow,
    ...CommonStyles.rowAlignCenter,
  },
  addButtonOuterCircle: {
    backgroundColor: Colors.primaryColor,
    position: "absolute",
    bottom: 25,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  addButtonInnerCircle: {
    backgroundColor: Colors.primaryColor,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 4,
    width: 60,
    height: 60,
    borderRadius: 30,
    ...CommonStyles.center,
    ...CommonStyles.buttonShadow,
    shadowColor: Colors.blackColor,
    shadowOpacity: 0.25,
  },
});
