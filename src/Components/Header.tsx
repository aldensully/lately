import { Dimensions, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  style?: ViewStyle;
  headerLeft?: React.ReactNode;
  headerTitle?: React.ReactNode;
  headerRight?: React.ReactNode;
};

const { width } = Dimensions.get('window');
const endWidth = width / 4;
const centerWidth = width / 2;

const Header = (props: Props) => {
  const { style, headerLeft, headerTitle, headerRight } = props;
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[{
        paddingTop: top,
        height: 45 + top,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
      }, style]}
    >
      <View style={{
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        // flexBasis: 1,
        // flexGrow: 1,
        width: endWidth
      }}>
        {headerLeft}
      </View>
      {headerTitle && <View style={{
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: centerWidth,
        flexDirection: 'row',
        paddingBottom: 6,
        // flexBasis: 3,
        flexGrow: 1
      }}>
        {headerTitle}
      </View>
      }
      <View style={{
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        // flexBasis: 1,
        // flexGrow: 1,
        width: endWidth
      }}>
        {headerRight}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});