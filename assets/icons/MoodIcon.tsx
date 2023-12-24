import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const MoodIcon = (props: SvgProps & IconProps) => (
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
          d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm6.5-2c-.195 0-.444.124-.606.448a1 1 0 0 1-1.788-.896C6.542 8.68 7.413 8 8.5 8c1.087 0 1.957.68 2.394 1.552a1 1 0 0 1-1.788.896C8.944 10.124 8.696 10 8.5 10Zm7 0c-.195 0-.444.124-.606.448a1 1 0 1 1-1.788-.896C13.543 8.68 14.413 8 15.5 8c1.087 0 1.957.68 2.394 1.552a1 1 0 0 1-1.788.896c-.162-.324-.41-.448-.606-.448Zm-6.896 4.338a1 1 0 0 1 1.412-.088c.53.468 1.223.75 1.984.75.761 0 1.455-.282 1.984-.75a1 1 0 1 1 1.324 1.5A4.984 4.984 0 0 1 12 17a4.984 4.984 0 0 1-3.308-1.25 1 1 0 0 1-.088-1.412Z"
          clipRule="evenodd"
        />
      </Svg>
    </View>
  </View>
);

export default MoodIcon;