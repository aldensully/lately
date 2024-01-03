import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Container, Text, useThemeColor } from '../Theme/Themed';
import Header from '../Components/Header';
import BackButton from '../Components/BackButton';
import { ScreenProps } from '../types';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import CloseButton from '../Components/CloseButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleTemplate from './Templates/SimpleTemplate';
import ArrowRightIcon from '../../assets/icons/ArrowRightIcon';

const TodaysPageScreen = ({ navigation }: ScreenProps<'TodaysPageScreen'>) => {
  const colors = useThemeColor();
  const { top, bottom } = useSafeAreaInsets();

  const animDateOpacity = useSharedValue(0);
  const animContainerY = useSharedValue(0);
  const animPromptOpacity = useSharedValue(0);
  const animButtonOpacity = useSharedValue(0);
  const containerHeight = (Dimensions.get('window').height - top - bottom) / 2;
  const containerOpacity = useSharedValue(1);

  const [showButton, setShowButton] = useState(false);
  const [prompt, setPrompt] = useState('');

  const datestring = useMemo(() => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.toLocaleString('default', { day: 'numeric' });
    const year = date.toLocaleString('default', { year: 'numeric' });
    return `${month} ${day}, ${year}`;
  }, []);

  useEffect(() => {
    getPrompt();
  }, []);

  useEffect(() => {
    animDateOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));
    animPromptOpacity.value = withDelay(2000, withTiming(1, { duration: 1000 }));
    animButtonOpacity.value = withDelay(3000, withTiming(1, { duration: 1000 }));
    // setTimeout(() => {
    //   setShowButton(true);
    // }, 3500);
  }, []);


  async function getPrompt() {
    setPrompt(`What was a positive moment in your day?`);
  }

  const handleStart = () => {
    animContainerY.value = withTiming(-containerHeight, { duration: 1000 });
    containerOpacity.value = withTiming(0, { duration: 1000 });
  };

  const animDateStyle = useAnimatedStyle(() => {
    return {
      opacity: animDateOpacity.value,
      alignItems: 'center',
      justifyContent: 'center'
    };
  });

  const animContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: animContainerY.value
        }
      ],
      gap: 16,
      position: 'absolute',
      opacity: containerOpacity.value,
    };
  });

  const animPromptStyle = useAnimatedStyle(() => {
    return {
      opacity: animPromptOpacity.value,
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center',
      transform: [
        {
          translateY: 0
        }
      ]
    };
  });

  const animButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: animButtonOpacity.value,
      position: 'absolute',
      bottom: 64 + bottom
    };
  });


  return (
    <Container>
      {showButton && <Header
        style={{ zIndex: 1000 }}
        headerTitle={<View style={{ height: 40, justifyContent: 'center' }}>
          <Text type='h3' color={colors.secondaryText}>{datestring}</Text>
        </View>
        }
        headerLeft={<CloseButton
          style={{ width: 36, height: 36, borderRadius: 36, marginBottom: 6, marginLeft: 12 }}
          onPress={() => navigation.navigate('Main')}
          color={colors.secondaryText}
        />
        }
      />
      }
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
        <Animated.View style={animContainerStyle}>
          <Animated.View style={animDateStyle}>
            <Text type='h2' color={colors.secondaryText}>{datestring}</Text>
          </Animated.View>
          <Animated.View style={animPromptStyle}>
            <Text style={{ textAlign: 'center' }} type='h1'>{prompt}</Text>
          </Animated.View>
        </Animated.View>
        <Animated.View style={animButtonStyle}>
          {/* <Button
              title='Start'
              type='primary'
              onPress={handleStart}
            /> */}
          <Pressable
            onPress={() => navigation.navigate('NewPage')}
            style={{ gap: 5, height: 50, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
            <Text type='h2' color={colors.primary}>Tap To Start</Text>
            {/* <ArrowRightIcon size={20} color={colors.primary} /> */}
          </Pressable>
        </Animated.View>
      </View>
    </Container >
  );
};

export default TodaysPageScreen;

const styles = StyleSheet.create({});