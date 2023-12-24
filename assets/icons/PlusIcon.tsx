import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const PlusIcon = (props: SvgProps & IconProps) => (
  <View style={{
    width: props.size,
    height: props.size,
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
          d="M10.5 20.158a1.5 1.5 0 1 0 3 0v-6.5H20a1.5 1.5 0 1 0 0-3h-6.5v-6.5a1.5 1.5 0 1 0-3 0v6.5H4a1.5 1.5 0 1 0 0 3h6.5v6.5Z"
        />
      </Svg>
    </View>
  </View>
);


export default PlusIcon;