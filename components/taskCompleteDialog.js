import { StyleSheet, Text, View, Modal, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Sizes, CommonStyles, Colors, Fonts } from '../constants/styles'

const TaskCompleteDialog = (props) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => { props.setVisible() }}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => { props.setVisible() }}
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <View style={{ justifyContent: "center", flex: 1 }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { }}
                        style={styles.dialogStyle}
                    >
                        <Image
                            source={require('../assets/images/icons/complete.png')}
                            style={styles.dialogImageStyle}
                        />
                        <Text style={{ textAlign: 'center', ...Fonts.blackColor16Medium }}>
                            {props.message ? props.message : 'Are you sure you want to delete this task'}
                        </Text>
                        <View style={{ ...CommonStyles.rowAlignCenter, marginTop: Sizes.fixPadding + 5.0 }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { props.setVisible() }}
                                style={{
                                    ...styles.dialogButtonStyle,
                                    backgroundColor: Colors.whiteColor,
                                    ...CommonStyles.shadow,
                                    marginRight: Sizes.fixPadding,
                                }}
                            >
                                <Text style={{ ...Fonts.primaryColor18Medium }}>
                                    No
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { props.onDelete(); props.setVisible() }}
                                style={{
                                    ...styles.dialogButtonStyle,
                                    backgroundColor: Colors.primaryColor,
                                    ...CommonStyles.buttonShadow,
                                    marginLeft: Sizes.fixPadding
                                }}
                            >
                                <Text style={{ ...Fonts.whiteColor18Medium }}>
                                    Yes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default TaskCompleteDialog

const styles = StyleSheet.create({
    dialogButtonStyle: {
        flex: 1,
        ...CommonStyles.center,
        padding: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding,
    },
    dialogImageStyle: {
        width: 80.0,
        height: 80.0,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: Sizes.fixPadding - 5.0
    },
    dialogStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding * 2.0,
        width: '80%',
        alignSelf: 'center',
    },
})