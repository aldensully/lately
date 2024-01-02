import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const TemplateIcon = (props: SvgProps & IconProps) => (
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
          d="M15.573 12.97H7.949a.614.614 0 0 0-.633.614c0 .351.271.622.633.622h7.624a.605.605 0 0 0 .612-.622.603.603 0 0 0-.612-.613Zm0 3.507H7.949a.624.624 0 0 0-.633.632c0 .342.271.603.633.603h7.624a.594.594 0 0 0 .612-.603c0-.351-.26-.632-.612-.632Zm-9.03 5.916H17.21c2.08 0 3.114-1.055 3.114-3.144v-9.12c0-1.296-.151-1.859-.955-2.683l-5.534-5.635c-.764-.783-1.396-.954-2.521-.954H6.542C4.473.857 3.43 1.922 3.43 4.011V19.25c0 2.1 1.034 3.144 3.113 3.144Zm.07-1.617c-1.035 0-1.567-.553-1.567-1.557V4.04c0-.994.532-1.567 1.577-1.567h4.47V8.31c0 1.266.633 1.889 1.888 1.889h5.725v9.02c0 1.004-.532 1.557-1.576 1.557H6.613Zm6.549-12.094c-.402 0-.553-.16-.553-.563V2.786l5.786 5.896h-5.233Z"
        />
      </Svg>
    </View>
  </View>
);

export default TemplateIcon;