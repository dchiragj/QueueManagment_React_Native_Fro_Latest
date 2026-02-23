import { Platform, Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');

export const indent = 16;
export const halfindent = indent / 2;
export const lessIndent = indent - 4;

export const borderRadius = 15;
export const ModalBGborderRadius = 8;

export const headerIconSize = 24;

export const InputVerticalPadding = Platform.OS === 'ios' ? 11 : 6;
export const borderWidth = Platform.OS === 'android' ? 1 : 0.5;
