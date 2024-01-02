import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const DoubleChevronLeft = (props: SvgProps & IconProps) => (
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
          d="M19.798 20.605a.92.92 0 0 0 .653.271.9.9 0 0 0 .924-.914.964.964 0 0 0-.271-.653l-7.855-7.694v1.075l7.855-7.684a.983.983 0 0 0 .271-.653.91.91 0 0 0-.924-.924c-.251 0-.472.1-.653.27l-7.955 7.785a.882.882 0 0 0-.302.673c0 .252.11.482.302.673l7.955 7.775Z"
        />
        <Path
          fill={props.color}
          d="M10.828 20.605c.17.17.392.271.653.271a.893.893 0 0 0 .914-.914c0-.251-.1-.482-.261-.653l-7.865-7.694v1.075l7.865-7.684a.973.973 0 0 0 .261-.653.9.9 0 0 0-.914-.924c-.261 0-.482.1-.653.27l-7.955 7.785a.882.882 0 0 0-.302.673c0 .252.1.482.292.673l7.965 7.775Z"
        />
      </Svg>
    </View>
  </View>
);

export default DoubleChevronLeft;