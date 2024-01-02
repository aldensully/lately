import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const PlusCircleIcon = (props: SvgProps & IconProps) => (
  <View style={{
    width: props.size ?? 24,
    height: props.size ?? 24,
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
        {/* <Path
          stroke={props.color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-3-3v6m-9-3a9 9 0 1 0 18.001 0A9 9 0 0 0 3 12Z"
        /> */}
        <Path
          fill={props.color}
          d="M11.96 22.205c5.605 0 10.245-4.65 10.245-10.245 0-5.605-4.65-10.246-10.255-10.246-5.595 0-10.236 4.64-10.236 10.246 0 5.595 4.651 10.245 10.246 10.245Zm0-1.707a8.497 8.497 0 0 1-8.528-8.538c0-4.741 3.777-8.538 8.518-8.538a8.514 8.514 0 0 1 8.548 8.538 8.505 8.505 0 0 1-8.538 8.538Z"
        />
        <Path
          fill={props.color}
          d="M7.3 11.96c0 .492.34.823.853.823h2.953v2.964c0 .502.342.854.834.854.502 0 .854-.342.854-.854v-2.963h2.963c.502 0 .853-.332.853-.824 0-.502-.351-.854-.853-.854h-2.963V8.153c0-.512-.352-.864-.854-.864-.492 0-.834.352-.834.864v2.953H8.153c-.512 0-.854.352-.854.854Z"
        />
      </Svg>
    </View>
  </View>
);


export default PlusCircleIcon;