import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const PlusIcon = (props: SvgProps & IconProps) => (
  <View style={{
    width: props.size,
    height: props.size,
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
          d="M3.429 11.715c0 .493.411.894.894.894h6.498v6.5c0 .481.402.893.894.893a.911.911 0 0 0 .905-.894V12.61h6.488a.902.902 0 0 0 .894-.894.911.911 0 0 0-.894-.904H12.62V4.323a.911.911 0 0 0-.904-.894.903.903 0 0 0-.894.894v6.488H4.323a.911.911 0 0 0-.894.904Z"
        />
      </Svg>
    </View>
  </View>
);


export default PlusIcon;