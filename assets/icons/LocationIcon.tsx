import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { IconProps } from "../../src/types";
import { View } from "react-native";

const LocationIcon = (props: SvgProps & IconProps) => (
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
          d="M7 7a5 5 0 1 1 6 4.9V17a1 1 0 0 1-2 0v-5.1A5.002 5.002 0 0 1 7 7Zm2.489 9.1a1 1 0 0 1-.838 1.14c-1.278.195-2.293.489-2.96.815-.335.164-.534.313-.637.422a.702.702 0 0 0-.021.023c.033.039.09.096.19.169.28.207.749.435 1.418.644C7.968 19.728 9.863 20 12 20s4.032-.272 5.359-.687c.67-.209 1.138-.437 1.418-.644.1-.073.157-.13.19-.169a.65.65 0 0 0-.021-.023c-.103-.109-.302-.258-.637-.422-.667-.326-1.682-.62-2.96-.815a1 1 0 1 1 .301-1.977c1.388.21 2.622.547 3.539.996.457.224.884.5 1.208.842.33.347.603.82.603 1.399 0 .811-.524 1.4-1.034 1.777-.53.392-1.233.702-2.01.945-1.57.49-3.674.778-5.956.778-2.282 0-4.387-.288-5.955-.778-.778-.243-1.48-.553-2.01-.945C3.524 19.9 3 19.311 3 18.5c0-.58.273-1.052.603-1.4.325-.342.751-.617 1.208-.84.917-.45 2.152-.786 3.538-.997a.999.999 0 0 1 1.14.837Z"
          clipRule="evenodd"
        />
      </Svg>
    </View>
  </View>
);

export default LocationIcon;