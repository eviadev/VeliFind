import {StyleProp, ViewStyle} from "react-native";
import React from "react";


export type ButtonProps = {
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
	children?: React.ReactNode;
};