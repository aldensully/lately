import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const TemplateIcon = (props: SvgProps & IconProps) => (
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
          d="M6.907 3.908A1.25 1.25 0 0 1 9.02 3.79l.073.117L11 7.34V6a2 2 0 0 1 1.85-1.995L13 4h6a2 2 0 0 1 1.995 1.85L21 6v6a2 2 0 0 1-1.85 1.995L19 14h-2.207a5.5 5.5 0 1 1-10.66.29l.074-.29H3.425a1.25 1.25 0 0 1-1.147-1.747l.054-.11 4.575-8.235ZM11.5 12a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM19 6h-6v4.207A5.504 5.504 0 0 1 15.743 12H19V6ZM8 6.06 4.7 12h2.557a5.505 5.505 0 0 1 2.735-1.79l.274-.071L8 6.06Z"
          clipRule="evenodd"
        />
      </Svg>
    </View>
  </View>
);

export default TemplateIcon;