import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const AlignLeftIcon = (props: SvgProps & IconProps) => (
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
          d="M2.468 4.945H21.18a.765.765 0 0 0 .773-.763.763.763 0 0 0-.773-.753H2.468a.746.746 0 0 0-.754.753c0 .432.332.763.754.763Zm0 5.264h11.3a.757.757 0 0 0 .763-.764.755.755 0 0 0-.763-.753h-11.3a.746.746 0 0 0-.754.753c0 .432.332.764.754.764Zm0 5.263H21.18a.772.772 0 0 0 .773-.763.763.763 0 0 0-.773-.754H2.468a.746.746 0 0 0-.754.754c0 .422.332.763.754.763Zm0 5.254h11.3a.755.755 0 0 0 .763-.754.763.763 0 0 0-.763-.763h-11.3a.754.754 0 0 0-.754.763c0 .422.332.753.754.753Z"
        />
      </Svg>
    </View>
  </View>
);

export default AlignLeftIcon;