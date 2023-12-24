import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const TextStyleIcon = (props: SvgProps & IconProps) => (
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
          d="M2.712 18.135c-.273 0-.495-.062-.665-.188a.768.768 0 0 1-.29-.494c-.035-.217.005-.456.119-.717l4.505-9.984c.148-.33.325-.563.53-.7a1.27 1.27 0 0 1 .733-.221c.262 0 .495.074.7.221.216.137.398.37.546.7l4.523 9.984c.125.261.17.5.136.717a.78.78 0 0 1-.29.512c-.16.113-.37.17-.631.17-.319 0-.57-.074-.751-.222-.17-.159-.325-.398-.461-.716l-1.11-2.577.922.597H4.026l.922-.597-1.092 2.577c-.148.33-.302.569-.461.716-.16.148-.387.222-.683.222ZM7.61 8.34l-2.389 5.683-.444-.546h5.7l-.426.546L7.644 8.34H7.61ZM17.835 18.17c-.603 0-1.143-.114-1.621-.342a2.938 2.938 0 0 1-1.11-.956 2.4 2.4 0 0 1-.392-1.348c0-.614.16-1.098.478-1.45.319-.365.836-.626 1.553-.785.717-.16 1.678-.24 2.884-.24h.853v1.23h-.836c-.705 0-1.268.033-1.69.102-.42.068-.722.187-.904.358-.17.16-.256.387-.256.683 0 .375.131.682.393.921.261.24.625.359 1.092.359.375 0 .705-.086.99-.256a1.97 1.97 0 0 0 .7-.734c.17-.307.255-.66.255-1.058V12.69c0-.569-.125-.978-.375-1.229-.25-.25-.671-.375-1.263-.375-.33 0-.688.04-1.075.12-.375.08-.774.216-1.195.409-.216.102-.41.13-.58.085a.653.653 0 0 1-.375-.273.896.896 0 0 1-.137-.478c0-.17.046-.335.137-.494a.813.813 0 0 1 .46-.376 7.742 7.742 0 0 1 1.502-.46c.49-.092.933-.137 1.331-.137.82 0 1.49.125 2.014.375.535.25.933.632 1.195 1.144.261.5.392 1.149.392 1.945v4.096c0 .353-.085.626-.256.82-.17.181-.415.272-.734.272-.318 0-.568-.09-.75-.273-.171-.193-.256-.466-.256-.819v-.82h.136a2.312 2.312 0 0 1-1.348 1.707c-.353.16-.757.24-1.212.24Z"
        />
      </Svg>
    </View>
  </View>
);

export default TextStyleIcon;