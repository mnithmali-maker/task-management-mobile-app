import { ScrollView, StyleSheet, Text, TextInput, View, Image, Switch } from 'react-native';
import React, { useState } from 'react';
import { Colors, Fonts, Sizes, CommonStyles } from '../../constants/styles';
import Header from '../../components/header';
import { Touchable } from '../../components/touchable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../components/button';
import * as ImagePicker from 'expo-image-picker';

const teamOptions = ['Designer team', 'Developer team', 'HR team', 'Marketing team', 'Management team'];

const AddNewMemberScreen = ({ navigation }) => {

    const [memberName, setMemberName] = useState('');
    const [email, setEmail] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [isActive, setIsActive] = useState(true); // Active by default

    const pickDocument = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                alert("Permission to access gallery is required!");
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setAttachment(result.assets[0]);
            }
        } catch (error) {
            console.log("Error picking file:", error);
        }
    };

    const removeAttachment = () => setAttachment(null);

    const toggleTeam = (team) => {
        if (selectedTeams.includes(team)) {
            setSelectedTeams(selectedTeams.filter(t => t !== team));
        } else {
            setSelectedTeams([...selectedTeams, team]);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <Header header='Add New Member' navigation={navigation} />
            <ScrollView showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets={true}>
                {memberNameInfo()}
                {emailInfo()}
                {teamInfo()}
                {statusToggle()}
                {attachmentInfo()}
            </ScrollView>
            {saveButton()}
        </View>
    );

    function saveButton() {
        return (
            <Button
                buttonText='Save'
                onPress={() => {
                    console.log({ memberName, email, selectedTeams, isActive, attachment });
                    navigation.pop();
                }}
            />
        );
    }

    function memberNameInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Member Name</Text>
                <View style={styles.infoBox}>
                    <TextInput
                        value={memberName}
                        onChangeText={setMemberName}
                        placeholder='Enter member name'
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
            </View>
        );
    }

    function emailInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Email</Text>
                <View style={styles.infoBox}>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder='Enter email'
                        placeholderTextColor={Colors.grayColor}
                        style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                        keyboardType='email-address'
                        cursorColor={Colors.primaryColor}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
            </View>
        );
    }

    function teamInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Select Teams</Text>
                <View style={{ marginTop: Sizes.fixPadding }}>
                    {teamOptions.map((team, index) => (
                        <Touchable
                            key={index}
                            onPress={() => toggleTeam(team)}
                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Sizes.fixPadding }}
                        >
                            <View style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                borderWidth: 1,
                                borderColor: Colors.grayColor,
                                backgroundColor: selectedTeams.includes(team) ? Colors.primaryColor : Colors.whiteColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {selectedTeams.includes(team) && (
                                    <MaterialIcons name="check" size={16} color={Colors.whiteColor} />
                                )}
                            </View>
                            <Text style={{ ...Fonts.blackColor15Medium, marginLeft: 10 }}>{team}</Text>
                        </Touchable>
                    ))}
                </View>
            </View>
        );
    }

    function statusToggle() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ ...Fonts.blackColor16Medium, flex: 1 }}>Status</Text>
                <Switch
                    value={isActive}
                    onValueChange={setIsActive}
                    trackColor={{ false: Colors.grayColor, true: Colors.primaryColor }}
                    thumbColor={Colors.whiteColor}
                />
                <Text style={{ marginLeft: 8, ...Fonts.blackColor15Medium }}>
                    {isActive ? 'Active' : 'Inactive'}
                </Text>
            </View>
        );
    }

    function attachmentInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Attachment</Text>
                <Touchable
                    onPress={pickDocument}
                    style={{ ...styles.infoBox, ...CommonStyles.rowAlignCenter }}
                >
                    <Text style={{ ...Fonts.grayColor15Medium, flex: 1 }}>
                        {attachment ? "Replace attachment" : "Upload attachment"}
                    </Text>
                    <View style={styles.addIconOuterCircle}>
                        <View style={styles.addIconinnerCircle}>
                            <MaterialIcons
                                name='attach-file'
                                color={Colors.whiteColor}
                                size={12}
                            />
                        </View>
                    </View>
                </Touchable>

                {attachment && (
                    <View style={[styles.attachmentRow, { marginTop: Sizes.fixPadding }]}>
                        <Image
                            source={{ uri: attachment.uri }}
                            style={{ width: 70, height: 70, borderRadius: 6 }}
                        />
                        <Text style={{ ...Fonts.blackColor14Regular, flex: 1, marginLeft: 8 }}>
                            {attachment.fileName || "Selected File"}
                        </Text>
                        <Touchable onPress={removeAttachment}>
                            <MaterialIcons name="close" size={20} color={Colors.redColor} />
                        </Touchable>
                    </View>
                )}
            </View>
        );
    }
};

export default AddNewMemberScreen;

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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding,
        ...CommonStyles.shadow,
    },
});
