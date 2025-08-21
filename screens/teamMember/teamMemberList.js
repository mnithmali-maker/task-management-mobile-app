import { FlatList, ImageBackground, StatusBar, StyleSheet, Text, Image, View, SafeAreaView, Switch } from 'react-native';
import React, { useState } from 'react';
import { Colors, Fonts, Sizes, CommonStyles } from '../../constants/styles';
import { Touchable } from '../../components/touchable';
import { Menu } from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const teamOptions = ['Designer team', 'Developer team', 'HR team', 'Marketing team', 'Management team'];

const allTeamMembers = [
    {
        id: '1',
        image: require('../../assets/images/users/user3.png'),
        name: 'Jenny Wilson',
        email: 'jenny@example.com',
        teams: ['Designer team', 'HR team'],
        isActive: true,
    },
    {
        id: '2',
        image: require('../../assets/images/users/user2.png'),
        name: 'Esther Howard',
        email: 'esther@example.com',
        teams: ['Developer team'],
        isActive: false,
    },
    {
        id: '3',
        image: require('../../assets/images/users/user4.png'),
        name: 'Brooklyn Simmons',
        email: 'brooklyn@example.com',
        teams: ['Marketing team', 'Management team'],
        isActive: true,
    },
    {
        id: '4',
        image: require('../../assets/images/users/user5.png'),
        name: 'Cameron Williamson',
        email: 'cameron@example.com',
        teams: ['Designer team'],
        isActive: true,
    },
];

const TeamScreen = ({ navigation }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(teamOptions[0]);
    const [memberList, setMemberList] = useState(allTeamMembers);

    const toggleStatus = (id) => {
        const updatedList = memberList.map(member => {
            if (member.id === id) return { ...member, isActive: !member.isActive };
            return member;
        });
        setMemberList(updatedList);
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            {header()}
            <FlatList
                data={memberList}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2, paddingBottom: Sizes.fixPadding * 5 }}
            />
        </View>
    );

    function header() {
        return (
            <View style={{ backgroundColor: Colors.primaryColor }}>
                <ImageBackground
                    source={require('../../assets/images/top_image2.png')}
                    style={{ width: '100%' }}
                    tintColor='rgba(241, 183,255,0.8)'
                >
                    <SafeAreaView />
                    <View style={styles.headerWrapStyle}>
                        <Touchable onPress={() => { navigation.pop() }}>
                            <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} />
                        </Touchable>
                        <Text numberOfLines={1} style={{ flex: 1, marginHorizontal: Sizes.fixPadding, ...Fonts.whiteColor18SemiBold }}>
                            Team Members
                        </Text>
                        {/* <Menu
                            visible={showMenu}
                            anchor={
                                <Touchable
                                    activeOpacity={0.8}
                                    onPress={() => setShowMenu(true)}
                                    style={{ ...CommonStyles.rowAlignCenter }}
                                >
                                    <Text numberOfLines={1} style={{ ...Fonts.whiteColor14SemiBold }}>
                                        {selectedTeam}
                                    </Text>
                                    <MaterialIcons
                                        name='keyboard-arrow-down'
                                        color={Colors.whiteColor}
                                        size={22}
                                        style={{ marginLeft: Sizes.fixPadding - 5 }}
                                    />
                                </Touchable>
                            }
                            onRequestClose={() => setShowMenu(false)}
                        >
                            <View style={{ paddingVertical: Sizes.fixPadding, borderRadius: Sizes.fixPadding }}>
                                {teamOptions.map((option, index) => (
                                    <Text
                                        key={index}
                                        style={{ ...Fonts.blackColor16Medium, marginHorizontal: Sizes.fixPadding * 2, marginVertical: Sizes.fixPadding }}
                                        onPress={() => {
                                            setSelectedTeam(option);
                                            setShowMenu(false);
                                        }}
                                    >
                                        {option}
                                    </Text>
                                ))}
                            </View>
                        </Menu> */}
                    </View>
                </ImageBackground>
            </View>
        );
    }

    function renderItem({ item }) {
        return (
            <View style={{ ...styles.memberInfoBox, ...CommonStyles.rowAlignCenter }}>
                <Image source={item.image} style={{ width: 52, height: 52, borderRadius: 26 }} />
                <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>{item.name}</Text>
                    <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>{item.email}</Text>
                    <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium, marginTop: 2 }}>Teams: {item.teams.join(', ')}</Text>
                </View>
                <Switch
                    value={item.isActive}
                    onValueChange={() => toggleStatus(item.id)}
                    trackColor={{ false: Colors.grayColor, true: Colors.primaryColor }}
                    thumbColor={Colors.whiteColor}
                />
                <Touchable onPress={() => navigation.push('Chat', { item })}>
                    <Ionicons name='chatbox-ellipses-outline' color={Colors.primaryColor} size={22} style={{ marginLeft: Sizes.fixPadding }} />
                </Touchable>
            </View>
        );
    }
};

export default TeamScreen;

const styles = StyleSheet.create({
    headerWrapStyle: {
        ...CommonStyles.rowAlignCenter,
        paddingHorizontal: Sizes.fixPadding * 2,
        paddingTop: StatusBar.currentHeight + Sizes.fixPadding * 1.5,
        paddingBottom: Sizes.fixPadding + 5,
    },
    memberInfoBox: {
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2,
        marginBottom: Sizes.fixPadding * 2,
        backgroundColor: Colors.whiteColor,
        ...CommonStyles.shadow,
    },
});
