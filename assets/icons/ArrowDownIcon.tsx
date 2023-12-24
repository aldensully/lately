import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const ArrowDownIcon = (props: SvgProps & IconProps) => (
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
          d="m18.344 14.866-5.657 5.657a1 1 0 0 1-1.414 0l-5.657-5.657a1 1 0 0 1 1.414-1.414l3.95 3.95V4.16a1 1 0 0 1 2 0v13.243l3.95-3.95a1 1 0 1 1 1.414 1.414Z"
        />
      </Svg>
    </View>
  </View>
);

export default ArrowDownIcon;