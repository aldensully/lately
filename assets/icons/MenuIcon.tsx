import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const MenuIcon = (props: SvgProps & IconProps) => (
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
        {/* <Path
          fill={props.color}
          d="M8 6.983a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H8ZM7 12a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm1 3.017a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2H8Z"
        />
        <Path
          fill={props.color}
          d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
          fillRule="evenodd"
          clipRule="evenodd"
        /> */}
        <Path
          fill={props.color}
          d="M20 18.5a1 1 0 0 1 .117 1.992L20 20.5H4a1 1 0 0 1-.117-1.993L4 18.5h16Zm0-7a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2h16Zm0-7a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2h16Z"
        />
        {/* <Path
          fill={props.color}
          d="M8.5 7.492a1 1 0 1 0 0 2l8-.088a1 1 0 1 0 0-2l-8 .088Zm-1 4.67a1 1 0 0 1 1-1l8-.162a1 1 0 0 1 0 2l-8 .162a1 1 0 0 1-1-1Zm1 2.648a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-8Z"
        />
        <Path
          fill={props.color}
          fillRule="evenodd"
          d="M22.5 12c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10Zm-2 0a8 8 0 1 1-16.001 0A8 8 0 0 1 20.5 12Z"
          clipRule="evenodd"
        /> */}
      </Svg>
    </View>
  </View>
);

export default MenuIcon;