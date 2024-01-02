import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const AlignRightIcon = (props: SvgProps & IconProps) => (
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
          d="M2.468 4.945H21.18a.765.765 0 0 0 .773-.763.763.763 0 0 0-.773-.753H2.468a.746.746 0 0 0-.754.753c0 .432.332.763.754.763Zm0 10.527H21.18a.772.772 0 0 0 .773-.763.763.763 0 0 0-.773-.754H2.468a.746.746 0 0 0-.754.754c0 .422.332.763.754.763ZM9.89 10.21h11.29a.765.765 0 0 0 .773-.764.763.763 0 0 0-.773-.753H9.89a.748.748 0 0 0-.764.753.75.75 0 0 0 .764.764Zm0 10.517h11.29a.763.763 0 0 0 .773-.754.772.772 0 0 0-.773-.763H9.89a.757.757 0 0 0-.764.763c0 .422.332.753.764.753Z"
        />
      </Svg>
    </View>
  </View>
);

export default AlignRightIcon;