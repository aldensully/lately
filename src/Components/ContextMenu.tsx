import { ReactNode, useEffect, useState } from "react";
import { Dimensions, Pressable, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../Theme/Themed";
import { useThemeColor } from "../Theme/Themed";
import CheckIcon from "../../assets/icons/CheckIcon";
import { ContextMenuOption } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  options: ContextMenuOption[];
  selected: string;
  onSelect: (option: string) => void;
  passedRef?: React.RefObject<View>;
  anchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offsetY?: number;
  offsetX?: number;
  menuWidth?: number;
  style?: ViewStyle;
};
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const ContextMenu = (props: Props) => {
  const { open, style, menuWidth = 240, onClose, passedRef, offsetY = 0, offsetX = 0, options, onSelect, selected } = props;
  const animScale = useSharedValue(0);
  const [visible, setVisible] = useState(false);
  const colors = useThemeColor();
  const optionHeight = 48;
  const menuHeight = options.length * optionHeight;
  const translateY = useSharedValue(offsetY);
  const translateX = useSharedValue(offsetX);
  const bottom = useSharedValue(32);
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    if (open) {
      setVisible(true);
      animScale.value = withSpring(1, {
        damping: 11,
        stiffness: 140,
        mass: 0.4
      });
      translateY.value = withSpring(offsetY, {
        damping: 11,
        stiffness: 140,
        mass: 0.4
      });
      translateX.value = withSpring(offsetX, {
        damping: 11,
        stiffness: 140,
        mass: 0.4
      });
      passedRef?.current?.measure((x, y, width, height, pageX, pageY) => {
        const trimmedContainerHeight = pageY - top;
        const remainingSpace = trimmedContainerHeight - menuHeight;
        if (remainingSpace < 0) {
          bottom.value = remainingSpace;
        }
      });
    } else {
      setTimeout(() => {
        setVisible(false);
      }, 200);
      animScale.value = withSpring(0, {
        damping: 11,
        stiffness: 140,
        mass: 0.4
      });
    }
  }, [open]);

  const animBgStyle = useAnimatedStyle(() => {
    return {
      width: windowWidth * 3,
      height: windowHeight * 3,
      position: 'absolute',
      left: -windowWidth,
      top: -windowHeight,
      zIndex: 2000
    };
  });

  const animMenuStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: animScale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: animScale.value,
      position: 'absolute',
      zIndex: 10000,
      width: menuWidth,
      height: menuHeight,
      borderRadius: 13,
      borderCurve: 'continuous',
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 0
      },
      backgroundColor: '#FFF',
      ...style
    };
  }, [style]);

  const localClose = () => {
    setTimeout(() => {
      setVisible(false);
    }, 200);
    animScale.value = withSpring(0, {
      damping: 5,
      stiffness: 70,
      mass: 0.18
    });
  };

  const handlePress = (option: string) => {
    onSelect(option);
    localClose();
  };

  return !visible ? null : (
    <>
      <Animated.View style={animBgStyle}>
        <Pressable style={{ flex: 1 }} onPress={onClose}>
        </Pressable>
      </Animated.View>
      <Animated.View style={animMenuStyle}>
        {options.map((option, index) => (
          <Pressable
            key={option.name}
            onPress={() => handlePress(option.name)}
            style={{
              height: optionHeight,
              width: '100%',
              borderBottomWidth: 0.5,
              paddingHorizontal: 16,
              borderBottomColor: index === (options.length - 1) ? 'transparent' : '#DDD',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: option.alignment === ('list-item' || 'space') ? 'space-between' : 'center'
            }}>
            {option.alignment === 'space' ?
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Text type='p' color={option.color}>{option.name}</Text>
                  {option.icon}
                </View>
              </>
              :
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {option.icon}
                  <Text type='p' color={option.color}>{option.name}</Text>
                </View>
                {option.name === selected && <CheckIcon size={16} color={colors.primaryText} />}
              </>
            }
          </Pressable>
        ))}
      </Animated.View>
    </>
  );
};
export default ContextMenu;