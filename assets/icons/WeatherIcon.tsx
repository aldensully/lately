import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const WeatherIcon = (props: SvgProps & IconProps) => (
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
          d="M7.91 6.91a5.501 5.501 0 0 1 10.267.23 5.001 5.001 0 0 1 .525 9.562A5 5 0 0 1 14 20H6.36a4.36 4.36 0 0 1-1.852-8.308A5.502 5.502 0 0 1 7.91 6.91Zm2.615-.385a5.504 5.504 0 0 1 4.652 3.614 5.005 5.005 0 0 1 3.772 4.142 3 3 0 0 0-1.653-5.267 1 1 0 0 1-.88-.778 3.502 3.502 0 0 0-5.89-1.711h-.001Z"
          clipRule="evenodd"
        />
      </Svg>
    </View>
  </View>
);

export default WeatherIcon;