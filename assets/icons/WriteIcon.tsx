import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const WriteIcon = (props: SvgProps & IconProps) => (
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
          fillRule="evenodd"
          d="M19.53 19a1 1 0 0 1 .117 1.993L19.53 21h-7a1 1 0 0 1-.117-1.993L12.53 19h7ZM16.626 4.368a2.5 2.5 0 0 1 3.657 3.405l-.122.13L9.265 18.8a1.501 1.501 0 0 1-.32.244l-.12.06-3.804 1.73c-.808.367-1.638-.417-1.365-1.225l.04-.1 1.73-3.805a1.5 1.5 0 0 1 .213-.34l.09-.1L16.626 4.368Zm2.12 1.414a.5.5 0 0 0-.637-.057l-.07.057L7.209 16.614l-.59 1.297 1.297-.59L18.747 6.49a.5.5 0 0 0 0-.708Z"
          clipRule="evenodd"
        />
      </Svg>
    </View>
  </View>
);

export default WriteIcon;