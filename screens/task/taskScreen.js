import { ImageBackground, FlatList, Image, StyleSheet, Text, View, StatusBar, Platform, SafeAreaView } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { Colors, Sizes, Fonts, CommonStyles, screenWidth, FontFamily } from '../../constants/styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Carousel from 'react-native-snap-carousel-v4';
import { TabView, TabBar } from "react-native-tab-view";
import * as Progress from 'react-native-progress';
import { Menu, MenuItem } from 'react-native-material-menu';
import { Touchable } from '../../components/touchable'
import TaskDeleteDialog from '../../components/taskDeleteDialog'

const taskCategoryList = [
  {
    id: '1',
    title: 'Total task',
    description: '50 task',
    bgColor: Colors.purpleColor,
    bgImageColor: 'rgba(255, 228, 255,0.8)',
    icon: require('../../assets/images/icons/list.png'),
  },
  {
    id: '2',
    title: 'In-progress',
    description: '20 task',
    bgColor: Colors.greenColor,
    bgImageColor: 'rgba(91, 254, 255,0.8)',
    icon: require('../../assets/images/icons/calendar.png')
  },
  {
    id: '3',
    title: 'Completed',
    description: '10 task',
    bgColor: Colors.pitchColor,
    bgImageColor: 'rgba(255, 226, 226,0.8)',
    icon: require('../../assets/images/icons/complete.png')
  },
  {
    id: '4',
    title: 'Team',
    description: '12 member',
    bgColor: Colors.pinkColor,
    bgImageColor: 'rgba(254, 219, 255,0.8)',
    icon: require('../../assets/images/icons/team.png')
  },
];

const todoTaskList = [
  {
    id: '1',
    title: 'Mobile application  design',
    description: 'Shopping app project',
    progress: 0.6,
    fill: Colors.woodenColor,
    unfill: Colors.lightWoodenColor,
  },
  {
    id: '2',
    title: 'UX member payment',
    description: 'Microsoft product  design',
    progress: 0.5,
    fill: Colors.parrotColor,
    unfill: Colors.lightParrotColor
  },
  {
    id: '3',
    title: 'Email reply & testing',
    description: 'Green project',
    progress: 0.2,
    fill: Colors.tomatoColor,
    unfill: Colors.lightTomatoColor
  },
  {
    id: '4',
    title: 'Deshboard ui design',
    description: 'Shopping app project',
    progress: 0.6,
    fill: Colors.blueColor,
    unfill: Colors.lightBlueColor
  },
  {
    id: '5',
    title: 'User interface design',
    description: 'Food delivery app project',
    progress: 0.4,
    fill: Colors.yellowColor,
    unfill: Colors.lightYellowColor,
  },
  {
    id: '6',
    title: 'Mobile application design',
    description: 'Shopping app project',
    progress: 0.6,
    fill: Colors.woodenColor,
    unfill: Colors.lightWoodenColor,
  },
  {
    id: '7',
    title: 'UX member payment',
    description: 'Microsoft product  design',
    progress: 0.5,
    fill: Colors.parrotColor,
    unfill: Colors.lightParrotColor,
  },
];

const progressTaskList = [
  {
    id: '1',
    title: 'Deshboard ui design',
    description: 'Shopping app project',
    progress: 0.6,
    fill: Colors.blueColor,
    unfill: Colors.lightBlueColor
  },
  {
    id: '2',
    title: 'Email reply & testing',
    description: 'Green project',
    progress: 0.2,
    fill: Colors.tomatoColor,
    unfill: Colors.lightTomatoColor,
  },
  {
    id: '3',
    title: 'User interface design',
    description: 'Food delivery app project',
    progress: 0.4,
    fill: Colors.yellowColor,
    unfill: Colors.lightYellowColor
  },
  {
    id: '4',
    title: 'Mobile application  design',
    description: 'Shopping app project',
    progress: 0.6,
    fill: Colors.woodenColor,
    unfill: Colors.lightWoodenColor,
  },
  {
    id: '5',
    title: 'UX member payment',
    description: 'Microsoft product  design',
    progress: 0.5,
    fill: Colors.parrotColor,
    unfill: Colors.lightParrotColor
  },
  {
    id: '6',
    title: 'Mobile application design',
    description: 'Shopping app project',
    progress: 0.6,
    fill: Colors.blueColor,
    unfill: Colors.lightBlueColor
  },
  {
    id: '7',
    title: 'Deshboard ui design',
    description: 'Shopping app project',
    progress: 0.5,
    fill: Colors.tomatoColor,
    unfill: Colors.lightTomatoColor
  },
];

const TaskScreen = ({ navigation, route }) => {

  const categoryRef = useRef();

  const [todoTasks, settodoTasks] = useState(todoTaskList);
  const [progressTasks, setprogressTasks] = useState(progressTaskList);
  const [completeTasks, setcompleteTasks] = useState(todoTaskList);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (route.params) {
      if (route.params.category === "todo") {
        deleteTodoTask({ id: route.params.id })
      }
      else if (route.params.category === "progress") {
        deleteProgressTask({ id: route.params.id })
      }
      else if (route.params.category === "complete") {
        deleteCompleteTask({ id: route.params.id })
      }
    }
  }, [route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      categoryRef.current.startAutoplay((instantly = false));
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      categoryRef.current.stopAutoplay();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      {header()}
      <TaskCategories categoryRef={categoryRef} />
      {tabBarInfo()}
      {addButton()}
    </View>
  )

  function addButton() {
    return (
      <View style={styles.addButtonOuterCircle}>
        <Touchable
          onPress={() => { navigation.push('AddNew', { from: 'task' }) }}
          style={styles.addButtonInnerCircle}
        >
          <MaterialIcons name="add" size={33} color={Colors.whiteColor} />
        </Touchable>
      </View>
    )
  }

  function tabBarInfo() {

    const routes = [
      { key: "first", title: "To do" },
      { key: "second", title: "In-Progress" },
      { key: "third", title: "Completed" },
    ];

    const renderScene = ({ route }) => {
      switch (route.key) {
        case "first":
          return <Task
            data={todoTasks}
            navigation={navigation}
            category='todo'
            onDelete={deleteTodoTask}
          />;
        case "second":
          return <Task
            data={progressTasks}
            navigation={navigation}
            category='progress'
            onDelete={deleteProgressTask}
          />;
        case "third":
          return <Task
            data={completeTasks}
            navigation={navigation}
            category='complete'
            onDelete={deleteCompleteTask}
          />;
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
              backgroundColor: '#EDEDED',
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
                  textAlign:
                    route.key == "first"
                      ? "left"
                      : route.key == "third"
                        ? "right"
                        : "center",
                  width: screenWidth / 4,
                  marginLeft: route.key == "second" ? -10.0 : 0,
                }}
              >
                {route.title}
              </Text>
            )}
          />
        )}
      />
    )
  }

  function deleteCompleteTask({ id }) {
    const newData = completeTasks.filter((item) => item.id !== id);
    setcompleteTasks(newData);
  }

  function deleteProgressTask({ id }) {
    const newData = progressTasks.filter((item) => item.id !== id);
    setprogressTasks(newData);
  }

  function deleteTodoTask({ id }) {
    const newData = todoTasks.filter((item) => item.id !== id);
    settodoTasks(newData);
  }

  function header() {
    return (
      <View style={{ backgroundColor: Colors.primaryColor }}>
        <ImageBackground
          source={require('../../assets/images/top_image2.png')}
          style={{ width: '100%' }}
          tintColor='rgba(241, 183,255,0.8)'
        >
          <SafeAreaView />
          <View style={styles.headerInfoWrapper}>
            <Image
              source={require('../../assets/images/users/user1.jpeg')}
              style={{ width: 60.0, height: 60.0, borderRadius: 30.0, }}
            />
            <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
              <Text style={{ ...Fonts.whiteColor18SemiBold }}>
                Hello Nipuni Madushani
              </Text>
              <Text style={{ ...Fonts.whiteColor15Medium, opacity: 0.8, }}>
                Good morning
              </Text>
            </View>
            <Touchable onPress={() => { navigation.push('Search') }}>
              <Ionicons
                name='search-outline'
                color={Colors.whiteColor}
                size={24}
              />
            </Touchable>
            <Touchable onPress={() => { navigation.push('Notification') }}>
              <Ionicons
                name='notifications-outline'
                color={Colors.whiteColor}
                size={24}
                style={{ marginLeft: Sizes.fixPadding + 2.0 }}
              />
            </Touchable>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const TaskCategories = ({ categoryRef }) => {
  const [currentScrollIndex, setCurrentScrollIndex] = useState(1);

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: item.bgColor, ...styles.categoryWrapStyle }} >
      <Image
        source={require('../../assets/images/category_bg.png')}
        style={{ width: '75%', height: '100%', position: 'absolute', right: 0 }}
        tintColor={item.bgImageColor}
      />
      <View style={styles.categoryTypeIconWrapper}>
        <Image
          source={item.icon}
          style={{ width: 20.0, height: 20.0, resizeMode: 'contain' }}
        />
      </View>
      <View style={{ marginLeft: Sizes.fixPadding * 2.0, flex: 1 }}>
        <Text numberOfLines={1} style={{ ...Fonts.whiteColor18Medium }}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={{ ...Fonts.whiteColor17Medium, marginTop: Sizes.fixPadding - 5.0 }}>
          {item.description}
        </Text>
      </View>
    </View>
  )

  return (
    <View style={{ marginVertical: Sizes.fixPadding * 2.0 }}>
      <Carousel
        ref={categoryRef}
        data={taskCategoryList}
        sliderWidth={screenWidth}
        itemWidth={screenWidth / 1.8}
        itemHeight={110.0}
        renderItem={renderItem}
        firstItem={1}
        autoplay={true}
        loop={true}
        containerCustomStyle={{ marginBottom: Sizes.fixPadding + 5.0 }}
        autoplayInterval={5000}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        dotColor={Colors.primaryColor}
        onSnapToItem={(index) => setCurrentScrollIndex(index)}
      />
      <View style={{ alignSelf: 'center', ...CommonStyles.rowAlignCenter }}>
        {
          taskCategoryList.map((item, index) => (
            <View
              key={`${item.id}`}
              style={{
                ...styles.paginationStyle,
                backgroundColor: currentScrollIndex == index ? Colors.primaryColor : '#D9D9D9'
              }}
            />
          ))
        }
      </View>
    </View>
  )
}

const Task = ({ data, category, navigation, onDelete }) => {
  const [selctedItemId, setselctedItemId] = useState();
  const [showMenu, setshowMenu] = useState(false);
  const [showDeleteDialog, setshowDeleteDialog] = useState(false);

  const optionsList = ['Delete task', 'Share task', 'Copy link']

  return (
    <View style={{ flex: 1, }}>
      {
        data.length == 0
          ?
          noDataInfo()
          :
          dataInfo()
      }
    </View>
  )

  function dataInfo() {
    const renderItem = ({ item }) => {
      return (
        <Touchable
          onPress={() => { navigation.push('TaskDetail', { item, category }) }}
          style={{ ...styles.taskCard }}>
          {
            category == 'complete'
              ?
              <View style={{ ...styles.doneIconWrapper, borderColor: item.fill, }}>
                <MaterialIcons
                  name='done'
                  color={item.fill}
                  size={24}
                />
              </View>
              :
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
                  color: item.fill
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
                name='ellipsis-vertical'
                color={Colors.lightGrayColor}
                size={18}
                onPress={() => { setselctedItemId(item.id); setshowMenu(true) }}
              />
            }
            onRequestClose={() => { setshowMenu(false) }}
          >
            <View style={{ paddingTop: Sizes.fixPadding - 5.0, borderRadius: Sizes.fixPadding }}>
              {
                optionsList.map((option, index) => (
                  <MenuItem
                    key={`${index}`}
                    textStyle={{ ...Fonts.blackColor16Medium }}
                    onPress={() => {
                      if (index == 0) {
                        Platform.OS == 'ios'
                          ?
                          setTimeout(() => {
                            setshowDeleteDialog(true);
                          }, 350)
                          :
                          setshowDeleteDialog(true);
                      }
                      setshowMenu(false);
                    }}
                  >
                    {option}
                  </MenuItem>
                ))
              }
            </View>
          </Menu>
        </Touchable>
      )
    }

    return (
      <>
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item, index }) => renderItem({ item, data, index })}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
        />
        {deleteDialog()}
      </>
    )
  }

  function deleteDialog() {
    return (
      <TaskDeleteDialog
        visible={showDeleteDialog}
        setVisible={() => { setshowDeleteDialog(false) }}
        onDelete={() => { onDelete({ id: selctedItemId }) }}
      />
    )
  }

  function noDataInfo() {
    return (
      <View style={{ flex: 1, ...CommonStyles.center }}>
        <Image
          source={require('../../assets/images/icons/empty_task.png')}
          style={{ width: 53.0, height: 53.0, resizeMode: 'contain' }}
        />
        <Text style={{ ...Fonts.grayColor16Medium, marginTop: Sizes.fixPadding - 5.0 }}>
          Empty task list
        </Text>
      </View>
    )
  }
};

export default TaskScreen;

const styles = StyleSheet.create({
  headerInfoWrapper: {
    ...CommonStyles.rowAlignCenter,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingTop: StatusBar.currentHeight + Sizes.fixPadding * 1.5,
    paddingBottom: Sizes.fixPadding + 2.0
  },
  paginationStyle: {
    width: 8.0,
    height: 8.0,
    borderRadius: 4.0,
    marginHorizontal: Sizes.fixPadding - 7.0
  },
  categoryWrapStyle: {
    borderRadius: Sizes.fixPadding,
    height: 110.0,
    paddingHorizontal: Sizes.fixPadding,
    ...CommonStyles.rowAlignCenter,
    marginHorizontal: Sizes.fixPadding
  },
  categoryTypeIconWrapper: {
    width: 43.0,
    height: 43.0,
    borderRadius: 21.5,
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.center
  },
  doneIconWrapper: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    borderWidth: 4.0,
    ...CommonStyles.center
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
  addButtonOuterCircle: {
    backgroundColor: Colors.primaryColor,
    position: 'absolute',
    bottom: 25.0,
    right: 20.0,
    width: 60.0,
    height: 60.0,
    borderRadius: 30.0,
  },
  addButtonInnerCircle: {
    backgroundColor: Colors.primaryColor,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 4.0,
    width: 60.0,
    height: 60.0,
    borderRadius: 30.0,
    ...CommonStyles.center,
    ...CommonStyles.buttonShadow,
    shadowColor: Colors.blackColor,
    shadowOpacity: 0.25,
  }
})