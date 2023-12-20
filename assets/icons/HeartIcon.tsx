import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const HeartIcon = (props: SvgProps & IconProps) => (
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
          d="M12 21a1.5 1.5 0 0 1-.844-.261c-3.684-2.5-5.279-4.216-6.159-5.288-1.875-2.285-2.772-4.63-2.747-7.171C2.28 5.368 4.615 3 7.457 3c2.066 0 3.497 1.164 4.33 2.133a.28.28 0 0 0 .425 0C13.046 4.163 14.477 3 16.543 3c2.842 0 5.177 2.368 5.207 5.28.025 2.541-.873 4.887-2.747 7.172-.88 1.072-2.475 2.787-6.16 5.287A1.5 1.5 0 0 1 12 21Z"
        />
      </Svg>
    </View>
  </View>
);

export default HeartIcon;