import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const BoldIcon = (props: SvgProps & IconProps) => (
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
          d="M7.698 19.507h5.233c3.074 0 5.012-1.617 5.012-4.099 0-1.958-1.416-3.374-3.455-3.485v-.08c1.667-.231 2.802-1.487 2.802-3.084 0-2.24-1.717-3.616-4.5-3.616H7.698C6.623 5.143 6 5.776 6 6.88v10.898c0 1.095.623 1.728 1.698 1.728Zm1.617-2.32v-3.988h2.52c1.759 0 2.743.683 2.743 1.968 0 1.316-.944 2.02-2.672 2.02H9.315Zm0-6.078V7.503h2.47c1.407 0 2.24.643 2.24 1.748 0 1.165-.923 1.858-2.49 1.858h-2.22Z"
        />
      </Svg>
    </View>
  </View>
);

export default BoldIcon;