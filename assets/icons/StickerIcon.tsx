import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const StickerIcon = (props: SvgProps & IconProps) => (
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
          d="M18.389 2A3.611 3.611 0 0 1 22 5.611v7.643a2.5 2.5 0 0 1-.732 1.767l-6.246 6.247a2.5 2.5 0 0 1-1.768.732H5.611A3.611 3.611 0 0 1 2 18.389V5.61A3.611 3.611 0 0 1 5.611 2H18.39Zm0 1.667H5.61A1.944 1.944 0 0 0 3.667 5.61V18.39c0 1.073.87 1.944 1.944 1.944h7.5V16.93a7.375 7.375 0 0 1-.748.073l-.363.01a7.038 7.038 0 0 1-4.087-1.268.834.834 0 1 1 .95-1.37 5.374 5.374 0 0 0 3.137.97c.513 0 1.003-.063 1.471-.19a3.608 3.608 0 0 1 3.015-2.035l.236-.008h3.611v-7.5a1.944 1.944 0 0 0-1.944-1.944Zm.765 11.11h-2.43a1.944 1.944 0 0 0-1.938 1.786l-.007.16-.001 2.431 4.376-4.376ZM8.667 7.28a1.389 1.389 0 1 1 0 2.777 1.389 1.389 0 0 1 0-2.777Zm6.666 0a1.39 1.39 0 1 1 .079 2.777 1.39 1.39 0 0 1-.079-2.777Z"
        />
      </Svg>
    </View>
  </View>
);

export default StickerIcon;