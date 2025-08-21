import { ScrollView, StyleSheet, Text, TextInput, View, Image, Switch } from 'react-native';
import React, { useState } from 'react';
import { Colors, Fonts, Sizes, CommonStyles } from '../../constants/styles';
import Header from '../../components/header';
import { Touchable } from '../../components/touchable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../components/button';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';

const teamOptions = ['Designer team', 'Developer team', 'HR team', 'Marketing team', 'Management team'];

const AddNewMemberScreen = ({ navigation }) => {

    const pickDocument = async (setFieldValue) => {
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
                setFieldValue('attachment', result.assets[0]);
            }
        } catch (error) {
            console.log("Error picking file:", error);
        }
    };

    const toggleTeam = (team, selectedTeams, setFieldValue) => {
        if (selectedTeams.includes(team)) {
            setFieldValue('selectedTeams', selectedTeams.filter(t => t !== team));
        } else {
            setFieldValue('selectedTeams', [...selectedTeams, team]);
        }
    };

    const validationSchema = Yup.object().shape({
        memberName: Yup.string().required('Member name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        attachment: Yup.object().required('Attachment is required'),
        selectedTeams: Yup.array().min(1, 'Select at least one team'),
    });

    return (
        <Formik
            initialValues={{
                memberName: '',
                email: '',
                attachment: null,
                selectedTeams: [],
                isActive: true,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                console.log(values);
                navigation.pop();
            }}
        >
            {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
                <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                    <Header header='Add New Member' navigation={navigation} />
                    <ScrollView showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets={true}>
                        {/* Member Name */}
                        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                            <Text style={{ ...Fonts.blackColor16Medium }}>Member Name</Text>
                            <View style={styles.infoBox}>
                                <TextInput
                                    value={values.memberName}
                                    onChangeText={handleChange('memberName')}
                                    placeholder='Enter member name'
                                    placeholderTextColor={Colors.grayColor}
                                    style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                                    cursorColor={Colors.primaryColor}
                                    selectionColor={Colors.primaryColor}
                                />
                            </View>
                            {touched.memberName && errors.memberName && <Text style={{ color: 'red' }}>{errors.memberName}</Text>}
                        </View>

                        {/* Email */}
                        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                            <Text style={{ ...Fonts.blackColor16Medium }}>Email</Text>
                            <View style={styles.infoBox}>
                                <TextInput
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    placeholder='Enter email'
                                    placeholderTextColor={Colors.grayColor}
                                    style={{ ...Fonts.blackColor15Medium, padding: 0 }}
                                    keyboardType='email-address'
                                    cursorColor={Colors.primaryColor}
                                    selectionColor={Colors.primaryColor}
                                />
                            </View>
                            {touched.email && errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                        </View>

                        {/* Team Selection */}
                        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                            <Text style={{ ...Fonts.blackColor16Medium }}>Select Teams</Text>
                            <View style={{ marginTop: Sizes.fixPadding }}>
                                {teamOptions.map((team, index) => (
                                    <Touchable
                                        key={index}
                                        onPress={() => toggleTeam(team, values.selectedTeams, setFieldValue)}
                                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Sizes.fixPadding }}
                                    >
                                        <View style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 4,
                                            borderWidth: 1,
                                            borderColor: Colors.grayColor,
                                            backgroundColor: values.selectedTeams.includes(team) ? Colors.primaryColor : Colors.whiteColor,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            {values.selectedTeams.includes(team) && (
                                                <MaterialIcons name="check" size={16} color={Colors.whiteColor} />
                                            )}
                                        </View>
                                        <Text style={{ ...Fonts.blackColor15Medium, marginLeft: 10 }}>{team}</Text>
                                    </Touchable>
                                ))}
                            </View>
                            {touched.selectedTeams && errors.selectedTeams && <Text style={{ color: 'red' }}>{errors.selectedTeams}</Text>}
                        </View>

                        {/* Status Toggle */}
                        <View style={{ margin: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ ...Fonts.blackColor16Medium, flex: 1 }}>Status</Text>
                            <Switch
                                value={values.isActive}
                                onValueChange={(val) => setFieldValue('isActive', val)}
                                trackColor={{ false: Colors.grayColor, true: Colors.primaryColor }}
                                thumbColor={Colors.whiteColor}
                            />
                            <Text style={{ marginLeft: 8, ...Fonts.blackColor15Medium }}>
                                {values.isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>

                        {/* Attachment */}
                        <View style={{ margin: Sizes.fixPadding * 2.0 }}>
                            <Text style={{ ...Fonts.blackColor16Medium }}>Attachment</Text>
                            <Touchable
                                onPress={() => pickDocument(setFieldValue)}
                                style={{ ...styles.infoBox, ...CommonStyles.rowAlignCenter }}
                            >
                                <Text style={{ ...Fonts.grayColor15Medium, flex: 1 }}>
                                    {values.attachment ? "Replace attachment" : "Upload attachment"}
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

                            {values.attachment && (
                                <View style={[styles.attachmentRow, { marginTop: Sizes.fixPadding }]}>
                                    <Image
                                        source={{ uri: values.attachment.uri }}
                                        style={{ width: 70, height: 70, borderRadius: 6 }}
                                    />
                                    <Text style={{ ...Fonts.blackColor14Regular, flex: 1, marginLeft: 8 }}>
                                        {values.attachment.fileName || "Selected File"}
                                    </Text>
                                    <Touchable onPress={() => setFieldValue('attachment', null)}>
                                        <MaterialIcons name="close" size={20} color={Colors.redColor} />
                                    </Touchable>
                                </View>
                            )}
                            {touched.attachment && errors.attachment && <Text style={{ color: 'red' }}>{errors.attachment}</Text>}
                        </View>

                    </ScrollView>

                    {/* Save Button */}
                    <Button buttonText='Save' onPress={handleSubmit} />

                </View>
            )}
        </Formik>
    );
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
