import { Dimensions, Platform } from "react-native";

export const Colors = {
  primaryColor: "#9672FB",
  blackColor: "#333333",
  whiteColor: "#FFFFFF",
  grayColor: "#949494",
  lightGrayColor: "#B4B4B4",
  extraLightGrayColor: "#EDEDED",
  bodyBackColor: "#F5F5F5",
  purpleColor: "#A28FD8",
  greenColor: "#39BDA8",
  pitchColor: "#FC8C8C",
  pinkColor: "#D88CFC",
  woodenColor: "#DA9887",
  lightWoodenColor: "#E5D3C4",
  parrotColor: "#66C390",
  lightParrotColor: "#BADACA",
  tomatoColor: "#E5716E",
  lightTomatoColor: "#DFB3B5",
  blueColor: "#6982E0",
  lightBlueColor: "#DAE2E8",
  yellowColor: "#D3BD46",
  lightYellowColor: "#DAE2E8",
  darkBlueColor: "#1E4799",
  darkGreenColor: "#1E996D",
  redColor: "#EF1717",
};

export const Sizes = {
  fixPadding: 10.0,
};

export const FontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
};

export const Fonts = {
  whiteColor14Medium: {
    color: Colors.whiteColor,
    fontSize: 14.0,
    fontFamily: FontFamily.medium,
  },

  whiteColor15Medium: {
    color: Colors.whiteColor,
    fontSize: 15.0,
    fontFamily: FontFamily.medium,
  },

  whiteColor16Medium: {
    color: Colors.whiteColor,
    fontSize: 16.0,
    fontFamily: FontFamily.medium,
  },

  whiteColor17Medium: {
    color: Colors.whiteColor,
    fontSize: 17.0,
    fontFamily: FontFamily.medium,
  },

  whiteColor18Medium: {
    color: Colors.whiteColor,
    fontSize: 18.0,
    fontFamily: FontFamily.medium,
  },

  whiteColor30Medium: {
    color: Colors.whiteColor,
    fontSize: 30.0,
    fontFamily: FontFamily.medium,
  },

  whiteColor14SemiBold: {
    color: Colors.whiteColor,
    fontSize: 14.0,
    fontFamily: FontFamily.semiBold,
  },

  whiteColor16SemiBold: {
    color: Colors.whiteColor,
    fontSize: 16.0,
    fontFamily: FontFamily.semiBold,
  },

  whiteColor18SemiBold: {
    color: Colors.whiteColor,
    fontSize: 18.0,
    fontFamily: FontFamily.semiBold,
  },

  whiteColor22SemiBold: {
    color: Colors.whiteColor,
    fontSize: 22.0,
    fontFamily: FontFamily.semiBold,
  },

  whiteColor24SemiBold: {
    color: Colors.whiteColor,
    fontSize: 24.0,
    fontFamily: FontFamily.semiBold,
  },

  blackColor14Regular: {
    color: Colors.blackColor,
    fontSize: 14.0,
    fontFamily: FontFamily.regular,
  },

  blackColor14Medium: {
    color: Colors.blackColor,
    fontSize: 14.0,
    fontFamily: FontFamily.medium,
  },

  blackColor15Medium: {
    color: Colors.blackColor,
    fontSize: 15.0,
    fontFamily: FontFamily.medium,
  },

  blackColor16Medium: {
    color: Colors.blackColor,
    fontSize: 16.0,
    fontFamily: FontFamily.medium,
  },

  blackColor12SemiBold: {
    color: Colors.blackColor,
    fontSize: 12.0,
    fontFamily: FontFamily.semiBold,
  },

  blackColor15SemiBold: {
    color: Colors.blackColor,
    fontSize: 15.0,
    fontFamily: FontFamily.semiBold,
  },

  blackColor16SemiBold: {
    color: Colors.blackColor,
    fontSize: 16.0,
    fontFamily: FontFamily.semiBold,
  },

  blackColor18SemiBold: {
    color: Colors.blackColor,
    fontSize: 18.0,
    fontFamily: FontFamily.semiBold,
  },

  primaryColor14Medium: {
    color: Colors.primaryColor,
    fontSize: 14.0,
    fontFamily: FontFamily.medium,
  },

  primaryColor16Medium: {
    color: Colors.primaryColor,
    fontSize: 16.0,
    fontFamily: FontFamily.medium,
  },

  primaryColor18Medium: {
    color: Colors.primaryColor,
    fontSize: 18.0,
    fontFamily: FontFamily.medium,
  },

  primaryColor20Medium: {
    color: Colors.primaryColor,
    fontSize: 20.0,
    fontFamily: FontFamily.medium,
  },

  primaryColor16SemiBold: {
    color: Colors.primaryColor,
    fontSize: 16.0,
    fontFamily: FontFamily.semiBold,
  },

  primaryColor18SemiBold: {
    color: Colors.primaryColor,
    fontSize: 18.0,
    fontFamily: FontFamily.semiBold,
  },

  grayColor12Medium: {
    color: Colors.grayColor,
    fontSize: 12.0,
    fontFamily: FontFamily.medium,
  },

  grayColor13Medium: {
    color: Colors.grayColor,
    fontSize: 13.0,
    fontFamily: FontFamily.medium,
  },

  grayColor14Medium: {
    color: Colors.grayColor,
    fontSize: 14.0,
    fontFamily: FontFamily.medium,
  },

  grayColor15Medium: {
    color: Colors.grayColor,
    fontSize: 15.0,
    fontFamily: FontFamily.medium,
  },

  grayColor16Medium: {
    color: Colors.grayColor,
    fontSize: 16.0,
    fontFamily: FontFamily.medium,
  },

  grayColor17Medium: {
    color: Colors.grayColor,
    fontSize: 17.0,
    fontFamily: FontFamily.medium,
  },

  grayColor18Medium: {
    color: Colors.grayColor,
    fontSize: 18.0,
    fontFamily: FontFamily.medium,
  },

  grayColor12SemiBold: {
    color: Colors.grayColor,
    fontSize: 12.0,
    fontFamily: FontFamily.semiBold,
  },

  grayColor14SemiBold: {
    color: Colors.grayColor,
    fontSize: 14.0,
    fontFamily: FontFamily.semiBold,
  },

  grayColor16SemiBold: {
    color: Colors.grayColor,
    fontSize: 16.0,
    fontFamily: FontFamily.semiBold,
  },

  lightGrayColor16Medium: {
    color: Colors.lightGrayColor,
    fontSize: 16.0,
    fontFamily: FontFamily.medium,
  },

  redColor16Medium: {
    color: Colors.redColor,
    fontSize: 16.0,
    fontFamily: FontFamily.medium,
  },
};

export const screenWidth = Dimensions.get("window").width;

export const screenHeight = Dimensions.get("window").height;

export const CommonStyles = {
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  shadow: {
    shadowColor: Colors.blackColor,
    shadowOpacity: 0.2,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 3,
    elevation: 1.0,
    borderColor: Colors.bodyBackColor,
    borderWidth: Platform.OS == "ios" ? 0 : 1.0,
  },
  buttonShadow: {
    shadowColor: Colors.primaryColor,
    shadowOpacity: 0.2,
    shadowOffset: { x: 0, y: 6 },
    shadowRadius: 12,
    elevation: 5.0,
  },
};
