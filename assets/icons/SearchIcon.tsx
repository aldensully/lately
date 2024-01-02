import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const SearchIcon = (props: SvgProps & IconProps) => (
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
          d="M2.727 10.294c0 4.42 3.596 8.015 8.016 8.015a7.946 7.946 0 0 0 4.66-1.506l4.943 4.952c.23.23.532.341.854.341.683 0 1.155-.512 1.155-1.185 0-.321-.12-.613-.332-.824l-4.912-4.942a7.921 7.921 0 0 0 1.648-4.851c0-4.42-3.596-8.016-8.016-8.016s-8.016 3.596-8.016 8.016Zm1.718 0a6.302 6.302 0 0 1 6.298-6.298 6.302 6.302 0 0 1 6.298 6.298 6.302 6.302 0 0 1-6.298 6.298 6.302 6.302 0 0 1-6.298-6.298Z"
        />
      </Svg>
    </View>
  </View>
);


export default SearchIcon;