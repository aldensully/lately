import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';
import { useThemeColor } from '../../src/Theme/Themed';

const BubbleBackground = () => {
  const colors = useThemeColor();
  const { width, height } = Dimensions.get('window');
  return (
    <Svg width={width} height={height}>
      <Defs>
        <Pattern id="pattern" patternUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <Path
            fill={'#f9f9f9'}
            fillRule="evenodd"
            d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm48 25a7 7 0 1 0 0-14 7 7 1 1 0 0 14Zm-43-7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm63 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM34 90a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm56-76a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 86a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm28-65a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm23-11a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-6 60a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm29 22a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM32 63a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm57-13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-9-21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM60 91a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM35 41a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 60a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
            clipRule="evenodd"
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" height={height} width={width} fill="url(#pattern)" />
    </Svg>
  );
};

export default BubbleBackground;