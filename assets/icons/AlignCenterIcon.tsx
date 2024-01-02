import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const AlignCenterIcon = (props: SvgProps & IconProps) => (
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
          d="M2.968 4.945H21.68a.765.765 0 0 0 .773-.763.763.763 0 0 0-.773-.753H2.968a.746.746 0 0 0-.754.753c0 .432.332.763.754.763Zm3.716 5.264h11.29a.757.757 0 0 0 .764-.764.755.755 0 0 0-.764-.753H6.684a.748.748 0 0 0-.763.753.75.75 0 0 0 .763.764Zm-3.716 5.263H21.68a.772.772 0 0 0 .773-.763.763.763 0 0 0-.773-.754H2.968a.746.746 0 0 0-.754.754c0 .422.332.763.754.763Zm3.716 5.254h11.29a.755.755 0 0 0 .764-.754.763.763 0 0 0-.764-.763H6.684a.757.757 0 0 0-.763.763c0 .422.331.753.763.753Z"
        />
      </Svg>
    </View>
  </View>
);

export default AlignCenterIcon;