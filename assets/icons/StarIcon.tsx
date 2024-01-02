import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const StarIcon = (props: SvgProps & IconProps) => (
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
          d="M23.378 9.357a.923.923 0 0 0-.745-.627l-6.775-.984-3.03-6.14c-.312-.63-1.345-.63-1.656 0l-3.03 6.14-6.776.984a.923.923 0 0 0-.511 1.573l4.903 4.78-1.157 6.748a.924.924 0 0 0 1.339.973L12 19.617l6.06 3.186a.923.923 0 0 0 1.338-.973l-1.157-6.748 4.903-4.78a.922.922 0 0 0 .234-.945Z"
        />
      </Svg>
    </View>
  </View>
);


export default StarIcon;