import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import Header from "../../components/header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from "../../components/button";

const membersList = [
  {
    id: "i1",
    image: require("../../assets/images/users/user3.png"),
    name: "Jenny Wilson",
    profession: "Designer",
    selected: false,
  },
  {
    id: "i2",
    image: require("../../assets/images/users/user2.png"),
    name: "Esther Howard",
    profession: "Back-end developer",
    selected: false,
  },
  {
    id: "i3",
    image: require("../../assets/images/users/user5.png"),
    name: "Cameron Williamson",
    profession: "flutter develpoer",
    selected: false,
  },
  {
    id: "i4",
    image: require("../../assets/images/users/user7.png"),
    name: "Cameron Williamson",
    profession: "flutter develpoer",
    selected: false,
  },
  {
    id: "i5",
    image: require("../../assets/images/users/user4.png"),
    name: "Brooklyn Simmons",
    profession: "Back-end developer",
    selected: false,
  },
  {
    id: "i6",
    image: require("../../assets/images/users/user8.png"),
    name: "Cameron Williamson",
    profession: "Back-end developer",
    selected: false,
  },
  {
    id: "i7",
    image: require("../../assets/images/users/user6.png"),
    name: "Savannah Nguyen",
    profession: "ui ux designer",
    selected: false,
  },
  {
    id: "i8",
    image: require("../../assets/images/users/user10.png"),
    name: "Kristin Watson",
    profession: "flutter develpoer",
    selected: false,
  },
  {
    id: "i9",
    image: require("../../assets/images/users/user11.png"),
    name: "Leslie Alexander",
    profession: "flutter develpoer",
    selected: false,
  },
];

const InviteMemberScreen = ({ navigation, route }) => {
  const inviteFor = route.params?.inviteFor;
  const memberFor = route.params?.memberFor;

  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  useEffect(() => {
    console.warn("called member...");

    const fetchTeamMembers = async () => {
      console.warn("member...");
      try {
        const status = true;
        const response = await fetch(
          `http://192.168.8.101:8080/api/v1/member/status/${status}`
        );
        const result = await response.json();
        // console.warn(result);

        if (result.status === 200) {
          console.warn("Success");
          //   console.warn(result?.payload[0]);
          console.warn(result.payload[0][0].attachment.data);
          const membersList = result.payload[0].map((item, index) => ({
            id: item.id,
           image: `data:${item.attachment?.mimeType};base64,${item.attachment?.data}`,
            //   image: getProfileImage(index), // 👇 function to pick image
            name: item.name,
            profession: item.designation, // use designation field
            selected: false,
          }));
          setMembers(membersList);
          // handle payload here
        } else {
          console.warn(result.errorMessages?.[0] || "No records found");
          setMembers([]);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setisLoading(false);
      }
    };

    fetchTeamMembers(); // ✅ only here, not inside itself
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <Header header="Invite member" navigation={navigation} />
      {searchField()}
      {membersInfo()}
      {inviteButton()}
    </View>
  );

  function inviteButton() {
    return (
      <Button
        buttonText="Invite"
        onPress={() => {
          inviteFor == "task"
            ? navigation.navigate({
                name: "TaskDetail",
                params: {
                  members: members.filter((item) => item.selected),
                  inviteFor: inviteFor,
                },
                merge: true,
              })
            : inviteFor == "team"
            ? memberFor == "project"
              ? navigation.navigate({
                  name: "ProjectDetail",
                  params: {
                    members: members.filter((item) => item.selected),
                    inviteFor: inviteFor,
                  },
                  merge: true,
                })
              : memberFor == "team"
              ? navigation.navigate({
                  name: "CreateTeam",
                  params: { members: members.filter((item) => item.selected) },
                  merge: true,
                })
              : navigation.navigate({
                  name: "TaskDetail",
                  params: {
                    members: members.filter((item) => item.selected),
                    inviteFor: inviteFor,
                  },
                  merge: true,
                })
            : inviteFor == "addTask"
            ? navigation.navigate({
                name: "AddNew",
                params: {
                  members: members.filter((item) => item.selected),
                  inviteFor: inviteFor,
                },
                merge: true,
              })
            : null;
        }}
      />
    );
  }

  function updateMembers(id) {
    const updatedMembersData = members.map((item) => {
      if (item.id == id) {
        return { ...item, selected: !item.selected };
      } else {
        return item;
      }
    });
    setMembers(updatedMembersData);
  }

  function membersInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          updateMembers(item.id);
        }}
        style={styles.memberCard}
      >
        <Image
         source={{ uri: item.image }} 
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
        {item.selected ? (
          <MaterialIcons name="check" color={Colors.primaryColor} size={24} />
        ) : null}
      </TouchableOpacity>
    );
    return (
      <FlatList
        data={members}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
      />
    );
  }

  function searchField() {
    return (
      <View style={styles.searchFieldWrapper}>
        <Ionicons
          name="search"
          color={search ? Colors.primaryColor : Colors.grayColor}
          size={20}
        />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search here"
          placeholderTextColor={Colors.grayColor}
          style={{
            ...Fonts.blackColor16Medium,
            padding: 0,
            flex: 1,
            marginLeft: Sizes.fixPadding,
          }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
        />
      </View>
    );
  }
};

export default InviteMemberScreen;

const styles = StyleSheet.create({
  searchFieldWrapper: {
    ...CommonStyles.rowAlignCenter,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    ...CommonStyles.shadow,
    margin: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding + 5.0,
  },
  memberCard: {
    ...CommonStyles.rowAlignCenter,
    backgroundColor: Colors.whiteColor,
    ...CommonStyles.shadow,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
});
