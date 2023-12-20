import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const UserFillIcon = (props: SvgProps & IconProps) => (
  <View style={{
    width: props.size,
    height: props.size,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <View style={{ aspectRatio: 1 }}>
      <Svg
        width={'100%'}
        height={'100%'}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
      >
        <Path
          fill={props.color}
          d="M16.836 14.501a5 5 0 0 1 4.995 4.783l.005.217v1a2 2 0 0 1-1.85 1.995l-.15.005h-14a2 2 0 0 1-1.995-1.85l-.005-.15v-1a5 5 0 0 1 4.783-4.995l.217-.005h8Zm-4-12a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
        />
        {/* <Path
          fill={props.color}
          fillRule="evenodd"
          d="M7.952 17.306a1 1 0 0 1-1.904-.612L10.395 3.17a1.686 1.686 0 0 1 3.21 0l4.347 13.524a1 1 0 1 1-1.904.612L14.664 13H9.336l-1.384 4.306ZM9.979 11h4.042L12 4.712 9.979 11ZM4 21a1 1 0 0 1 1-1h14a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1Z"
          clipRule="evenodd"
        /> */}
      </Svg>
    </View>
  </View>
);

export default UserFillIcon;