import { StyleSheet, Image, View, Pressable, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScreenProps } from '../../types';
import { Container, Text, useThemeColor } from '../../Theme/Themed';
import * as AppleAuthentication from 'expo-apple-authentication';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import ArrowRightIcon from '../../../assets/icons/ArrowRightIcon';
import ArrowLeftIcon from '../../../assets/icons/ArrowLeftIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import defaultStore from '../../Stores/defaultStore';

const WelcomeScreen = ({ navigation, route }: ScreenProps<'Welcome'>) => {
  const [animStep, setAnimStep] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const colors = useThemeColor();
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);
  const opacity4 = useSharedValue(0);
  const opacity5 = useSharedValue(0);
  const opacity6 = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const [showButtons, setShowButtons] = useState(true);
  const { bottom } = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');

  const signIn = async () => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { identityToken } = appleCredential;
      if (identityToken) {
        const provider = new OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');
        const credential = provider.credential({
          idToken: identityToken,
        });
        const user = await signInWithCredential(auth, credential);
        console.log("USER: ", user.user.uid);
      }
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    switch (animStep) {
      case 0:
        opacity2.value = withTiming(0, {
          duration: 400,
        });
        opacity1.value = withDelay(400, withTiming(1, {
          duration: 400,
        }));
        buttonOpacity.value = withSequence(withTiming(0, { duration: 400 }), withTiming(1, { duration: 400 }));
        break;
      case 1:
        opacity1.value = withTiming(0, {
          duration: 400
        });
        opacity3.value = withTiming(0, {
          duration: 400
        });
        buttonOpacity.value = withSequence(withTiming(0, { duration: 400 }), withTiming(1, { duration: 400 }));
        opacity2.value = withDelay(400, withTiming(1, {
          duration: 400,
        }));
        break;
      case 2:
        opacity2.value = withTiming(0, {
          duration: 400
        });
        opacity4.value = withTiming(0, {
          duration: 400
        });
        buttonOpacity.value = withSequence(withTiming(0, { duration: 400 }), withTiming(1, { duration: 400 }));
        opacity3.value = withDelay(400, withTiming(1, {
          duration: 400
        }));
        break;
      case 3:
        opacity3.value = withTiming(0, {
          duration: 400
        });
        opacity5.value = withTiming(0, {
          duration: 400
        });
        buttonOpacity.value = withSequence(withTiming(0, { duration: 400 }), withTiming(1, { duration: 400 }));
        opacity4.value = withDelay(400, withTiming(1, {
          duration: 400
        }));
        break;
      case 4:
        opacity4.value = withTiming(0, {
          duration: 400
        });
        opacity6.value = withTiming(0, {
          duration: 400
        });
        buttonOpacity.value = withSequence(withTiming(0, { duration: 400 }), withTiming(1, { duration: 400 }));
        opacity5.value = withDelay(400, withTiming(1, {
          duration: 400
        }));
        break;
      case 5:
        opacity5.value = withTiming(0, {
          duration: 400
        });
        buttonOpacity.value = withTiming(0, { duration: 400 });
        opacity6.value = withDelay(400, withTiming(1, {
          duration: 400
        }));

        setTimeout(() => {
          setShowButtons(false);
          setShowSignIn(true);
        }, 400);
        break;
      default:
        break;
    }

    if (animStep === 0) {
      setTimeout(() => {
        setShowBack(false);
      }, 400);
    }
    else {
      setTimeout(() => {
        setShowBack(true);
      }, 400);
    }

  }, [animStep]);



  const animText1Style = useAnimatedStyle(() => {
    return {
      opacity: opacity1.value,
      position: 'absolute'
    };
  });

  const animText2Style = useAnimatedStyle(() => {
    return {
      opacity: opacity2.value,
      position: 'absolute'
    };
  });

  const animText3Style = useAnimatedStyle(() => {
    return {
      opacity: opacity3.value,
      position: 'absolute',
      alignItems: 'center',
      gap: 48,
      justifyContent: 'center',
      top: '20%'
    };
  });

  const animText4Style = useAnimatedStyle(() => {
    return {
      opacity: opacity4.value,
      position: 'absolute',
      alignItems: 'center',
      gap: 48,
      justifyContent: 'center',
      top: '30%'
    };
  });

  const animText5Style = useAnimatedStyle(() => {
    return {
      opacity: opacity5.value,
      position: 'absolute',
      alignItems: 'center',
      gap: 48,
      justifyContent: 'center',
      top: '30%'
    };
  });

  const animText6Style = useAnimatedStyle(() => {
    return {
      opacity: opacity6.value,
      position: 'absolute',
    };
  });



  const animButtonContainerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      opacity: buttonOpacity.value,
      bottom: '10%',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 50
    };
  });

  return (
    <Container showInsetBottom>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
        <Animated.View
          style={animText1Style}
        >
          <Text style={{ textAlign: 'center' }} type='h1'>
            Welcome to <Text type='h1' color={colors.primary}>Lately</Text>, {"your new\n personal journal"}
          </Text>
        </Animated.View>
        <Animated.View
          style={animText2Style}
        >
          <Text style={{ textAlign: 'center' }} type='h1'>
            Record your thoughts, feelings, memories, and ideas in a fun and creative way
          </Text>
        </Animated.View>
        <Animated.View
          style={animText3Style}
        >
          <Text style={{ textAlign: 'center' }} type='h1'>
            Each page can be fully customized with words, images, stickers, music & more!
          </Text>
          <Image
            source={require('../../../assets/images/scrap3.png')}
            style={{ width: 200, height: 300, resizeMode: 'contain' }}
          />
        </Animated.View>
        <Animated.View
          style={animText4Style}
        >
          <Text style={{ textAlign: 'center' }} type='h1'>
            Or use templates to get started quickly
          </Text>
          <Image
            source={require('../../../assets/images/scrap4.png')}
            style={{ width: width * 0.8, height: 220, resizeMode: 'contain' }}
          />
        </Animated.View>
        <Animated.View
          style={animText5Style}
        >
          <Text style={{ textAlign: 'center' }} type='h1'>
            Share your pages in the community and find inspo from other creators
          </Text>
          <Image
            source={require('../../../assets/images/scrap5.png')}
            style={{ width: width * 0.8, height: 220, resizeMode: 'contain' }}
          />
        </Animated.View>
        <Animated.View
          style={animText6Style}
        >
          <Text style={{ textAlign: 'center' }} type='h1'>
            Ready to create?
          </Text>
        </Animated.View>
        {showButtons && <Animated.View style={animButtonContainerStyle}>
          {showBack && <Pressable
            onPress={() => setAnimStep(a => a - 1)}
            style={{ width: '30%', justifyContent: 'center', height: 50, gap: 5, flexDirection: 'row', alignItems: 'center' }}>
            <ArrowLeftIcon size={20} color={'#6D6D6D'} />
            <Text type='h1' color={'#6D6D6D'}>Back</Text>
          </Pressable>
          }
          <Pressable
            onPress={() => setAnimStep(a => a + 1)}
            style={{ width: '30%', gap: 5, height: 50, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
            <Text type='h1' color={colors.primary}>Next</Text>
            <ArrowRightIcon size={20} color={colors.primary} />
          </Pressable>
        </Animated.View>
        }
      </View>
      {showSignIn && <View style={{
        position: 'absolute',
        bottom: 32 + bottom,
        paddingHorizontal: 40,
        width: '100%'
      }}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={50}
          style={{ width: '100%', height: 60 }}
          onPress={signIn}
        />
      </View>
      }
    </Container>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});