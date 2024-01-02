import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const EmptyPageIcon = (props: SvgProps & IconProps) => (
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
          d="M7.042 22.957H17.71c2.08 0 3.114-1.055 3.114-3.144v-9.12c0-1.296-.151-1.859-.955-2.683l-5.534-5.635c-.764-.783-1.396-.954-2.521-.954H7.042c-2.069 0-3.113 1.065-3.113 3.154v15.238c0 2.1 1.034 3.144 3.113 3.144Zm.07-1.617c-1.034 0-1.566-.553-1.566-1.557V4.605c0-.994.532-1.567 1.577-1.567h4.47v5.836c0 1.266.633 1.889 1.888 1.889h5.725v9.02c0 1.004-.532 1.557-1.576 1.557H7.113Zm6.55-12.094c-.402 0-.553-.16-.553-.563V3.35l5.786 5.896h-5.233Z"
        />
      </Svg>
    </View>
  </View>
);

export default EmptyPageIcon;