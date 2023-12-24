import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const CanvasIcon = (props: SvgProps & IconProps) => (
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
          d="M12 3a1 1 0 0 1 1 1v1h8a1 1 0 1 1 0 2v9a1 1 0 0 1 0 2h-4.586l1.293 1.293a1 1 0 0 1-1.414 1.414L13.586 18h-3.172l-2.707 2.707a1 1 0 0 1-1.414-1.414L7.586 18H3a1 1 0 0 1 0-2V7a1 1 0 0 1 0-2h8V4a1 1 0 0 1 1-1Zm7 13V7H5v9h14Z"
          clipRule="evenodd"
        />
      </Svg>
    </View>
  </View>
);

export default CanvasIcon;