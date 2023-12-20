import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const CropIcon = (props: SvgProps & IconProps) => (
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
          d="M5.53 17.842a2 2 0 0 1 2 2v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1Zm15 0a1 1 0 0 1 .117 1.993l-.117.007h-1v1a1 1 0 0 1-1.993.117l-.007-.117v-1a2 2 0 0 1 1.85-1.995l.15-.005h1Zm-4-11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h8Zm0 2h-8v8h8v-8Zm-10-5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Zm12 0a1 1 0 0 1 .993.883l.007.117v1h1a1 1 0 0 1 .117 1.993l-.117.007h-1a2 2 0 0 1-1.995-1.85l-.005-.15v-1a1 1 0 0 1 1-1Z"
        />
      </Svg>
    </View>
  </View>
);

export default CropIcon;