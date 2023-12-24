import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from '../Theme/Themed';
import BackIcon from '../../assets/icons/BackIcon';

type BackProps = {
  navigate?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

const BackButton = (props: BackProps) => {
  const { navigate, onPress, style } = props;
  const colors = useThemeColor();
  const navigation = useNavigation();

  const handlePress = () => {
    if (navigate) {
      navigation.goBack();
    }
    props.onPress && props.onPress();
  };
  return (
    <Pressable
      onPress={handlePress}
      style={[{
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
      }, style]}
    >
      <BackIcon size={28} color={colors.primaryText} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({});