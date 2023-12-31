import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const CreativeIcon = (props: SvgProps & IconProps) => (
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
          d="M21.038 22.086c.422.432 1.145.432 1.547 0a1.123 1.123 0 0 0 0-1.547l-9.553-9.582c-.421-.422-1.145-.422-1.546 0a1.126 1.126 0 0 0 0 1.557l9.552 9.572Zm.352-.693-6.198-6.207.502-.482 6.198 6.207c.18.17.22.372.06.552-.18.151-.371.121-.562-.07ZM8.653 22.247c.18 0 .311-.13.342-.321.321-2.682.452-2.753 3.184-3.195.21-.04.341-.14.341-.341 0-.191-.13-.312-.301-.342-2.752-.522-2.903-.512-3.224-3.194-.03-.19-.161-.321-.342-.321-.19 0-.321.13-.341.311-.352 2.722-.442 2.813-3.225 3.204a.332.332 0 0 0-.301.342c0 .19.13.301.301.341 2.783.533 2.863.533 3.225 3.215.02.17.15.301.341.301Zm-4.771-8.749c.14 0 .22-.1.251-.23.342-1.91.352-2.03 2.37-2.371.131-.03.232-.11.232-.252 0-.14-.1-.23-.231-.25-2.02-.352-2.03-.473-2.371-2.381-.03-.13-.11-.221-.251-.221-.14 0-.221.09-.251.22-.342 1.91-.352 2.03-2.37 2.381-.131.02-.232.11-.232.251 0 .141.1.221.231.252 2.02.341 2.03.462 2.37 2.37.03.13.111.231.252.231ZM9.386 7.07c.12 0 .181-.07.201-.181.342-1.607.322-1.668 2.01-2.01.11-.02.19-.09.19-.2 0-.12-.08-.19-.19-.211-1.688-.342-1.668-.402-2.01-1.999-.02-.11-.08-.19-.2-.19-.121 0-.181.08-.202.19-.341 1.597-.321 1.657-2.008 1.999-.111.02-.191.09-.191.21 0 .111.08.182.19.202 1.688.341 1.668.402 2.01 2.009.02.11.08.18.2.18Zm8.297 3.545c.14 0 .221-.09.251-.22.342-1.91.352-2.03 2.37-2.381.142-.02.232-.11.232-.251 0-.141-.09-.221-.231-.251-2.02-.342-2.03-.463-2.37-2.371-.03-.13-.111-.231-.252-.231-.14 0-.22.1-.25.231-.342 1.908-.352 2.029-2.371 2.37-.131.03-.231.111-.231.252 0 .14.1.23.23.25 2.02.352 2.03.473 2.371 2.381.03.13.11.221.251.221Z"
        />
      </Svg>
    </View>
  </View>
);

export default CreativeIcon;