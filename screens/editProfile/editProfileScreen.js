import { ScrollView, StyleSheet, Text, Modal, Image, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes, CommonStyles } from '../../constants/styles'
import Header from '../../components/header'
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from '../../components/button';

const EditProfileScreen = ({ navigation }) => {

    const [userName, setUserName] = useState('Nipuni Madushani');
    const [email, setEmail] = useState('Robertfox@mail.com');
    const [mobileNo, setMobileNo] = useState('+91 1234567890');
    const [showOptionsSheet, setShowOptionsSheet] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <Header header='Edit profile' navigation={navigation} />
            <ScrollView showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets={true}>
                {userPicWithChangeOption()}
                {userNameInfo()}
                {emailInfo()}
                {mobileNumberInfo()}
            </ScrollView>
            {updateButton()}
            {optionsSheet()}
        </View>
    )

    function optionsSheet() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showOptionsSheet}
                onRequestClose={() => { setShowOptionsSheet(false) }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { setShowOptionsSheet(false); }}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "flex-end", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={styles.sheetWrapStyle}
                        >
                            <Text style={{ ...Fonts.blackColor16SemiBold }}>
                            Change profile Photo
                            </Text>
                            {optionSort({ iconName: 'camera', color: Colors.darkBlueColor, option: 'Camera' })}
                            {optionSort({ iconName: 'image', color: Colors.darkGreenColor, option: 'Gallery' })}
                            {optionSort({ iconName: 'trash', color: Colors.redColor, option: 'Remove image' })}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function optionSort({ iconName, color, option }) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { setShowOptionsSheet(false) }}
                style={{ ...CommonStyles.rowAlignCenter, marginTop: Sizes.fixPadding * 2.0 }}
            >
                <View style={styles.optionCircle}>
                    <Ionicons
                        name={iconName}
                        color={color}
                        size={22}
                    />
                </View>
                <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium, flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
                    {option}
                </Text>
            </TouchableOpacity>
        )
    }


    function updateButton() {
        return (
            <Button
                buttonText='Update'
                onPress={() => { navigation.pop() }}
            />
        )
    }

    function mobileNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                    Mobile number
                </Text>
                <View style={styles.infoBox}>
                    <TextInput
                        value={mobileNo}
                        onChangeText={setMobileNo}
                        placeholder='Enter mobile number'
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                        keyboardType='number-pad'
                    />
                </View>
            </View>
        )
    }

    function emailInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                    Email address
                </Text>
                <View style={styles.infoBox}>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder='Enter email address'
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                        keyboardType='email-address'
                    />
                </View>
            </View>
        )
    }

    function userNameInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                    User name
                </Text>
                <View style={styles.infoBox}>
                    <TextInput
                        value={userName}
                        onChangeText={setUserName}
                        placeholder='Enter user name'
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
            </View>
        )
    }

    function userPicWithChangeOption() {
        return (
            <View style={{ alignSelf: 'center', margin: Sizes.fixPadding * 4.0 }}>
                <Image
                    source={require('../../assets/images/users/user1.jpeg')}
                    style={{ width: 140.0, height: 140.0, borderRadius: 70.0 }}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { setShowOptionsSheet(true) }}
                    style={styles.changePicIconWrapper}
                >
                    <Ionicons
                        name='camera-outline'
                        color={Colors.primaryColor}
                        size={20}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

export default EditProfileScreen

const styles = StyleSheet.create({
    changePicIconWrapper: {
        width: 35.0,
        height: 35.0,
        borderRadius: 17.5,
        backgroundColor: Colors.whiteColor,
        position: 'absolute',
        bottom: 5.0,
        right: 0,
        ...CommonStyles.center
    },
    infoBox: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        ...CommonStyles.shadow,
        padding: Sizes.fixPadding + 2.0,
        marginTop: Sizes.fixPadding,
    },
    sheetWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding * 2.5
    },
    optionCircle: {
        width: 40.0,
        height: 40.0,
        borderRadius: 20.0,
        backgroundColor: Colors.whiteColor,
        ...CommonStyles.shadow,
        ...CommonStyles.center
    }
})