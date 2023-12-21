import { Image, Dimensions, StyleSheet, View, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, useThemeColor } from '../Theme/Themed';
import { Diary, ScreenProps } from '../types';
import { Container } from '../Theme/Themed';
import defaultStore from '../Stores/defaultStore';
import React, { useState } from 'react';
import { JournalThemes } from '../Theme/themes';
import ArrowRightIcon from '../../assets/icons/ArrowRightIcon';
import { apiCreateDiary, apiCreateUser, generateUUID, getCurrentDateTimeInUTC, uploadMedia } from '../Utils/utilFns';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskedView from '@react-native-masked-view/masked-view';

const CreateFirstDiaryScreen = ({ navigation, route }: ScreenProps<'CreateFirstDiaryScreen'>) => {
  const { newUser, imageUri } = route.params;
  const { width, height } = Dimensions.get('window');
  const bookWidth = width * 0.65;
  const bookHeight = bookWidth * 1.3;
  const spineWidth = bookWidth * 0.1;
  const imageSize = bookWidth * 0.27;
  const colors = useThemeColor();
  const setUser = defaultStore(state => state.setUser);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('My Journal');
  const [bgColor, setBgColor] = useState(JournalThemes[0].backgroundColor);
  const [spineColor, setSpineColor] = useState(JournalThemes[0].spineColor);
  const [textColor, setTextColor] = useState(JournalThemes[0].textColor);
  const [font, setFont] = useState('SingleDay');

  const handleNext = async () => {
    if (loading || !newUser) return;
    setLoading(true);

    //upload thumbnail first
    let thumbnailUri;
    if (imageUri) {
      const res = await uploadMedia(generateUUID(), imageUri, { width: 200, height: 200 });
      if (res) thumbnailUri = res;
      else {
        setLoading(false);
        return Alert.alert('Failed to upload image. Please try again.');
      }
    }

    //if thumbnail uri is returned add it to the user object
    if (thumbnailUri) newUser.thumbnail = thumbnailUri;

    const newDiary: Diary = {
      id: generateUUID(),
      user_id: newUser.id,
      title,
      backgroundColor: bgColor,
      spineColor,
      textColor,
      image: newUser?.thumbnail,
      font,
      pages: [],
      creation_date: getCurrentDateTimeInUTC()
    };

    const res = await Promise.allSettled([
      apiCreateUser(newUser),
      apiCreateDiary(newDiary)
    ]);

    let allGood = true;
    res.forEach(r => {
      if (r.status === 'rejected') allGood = false;
    });

    if (allGood) {
      setUser(newUser);
      AsyncStorage.setItem('activeDiaryId', newDiary.id);
      queryClient.setQueryData(['diaries'], [{ ...newDiary }]);
      queryClient.setQueryData(['activeDiary'], { ...newDiary });
      navigation.navigate('Main');
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again');
    }
  };


  return (
    <Container showInsetBottom showInsetTop >
      <View style={{ alignItems: 'center', paddingTop: 48, flex: 1, paddingHorizontal: 15 }}>
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text type='h2' style={{ textAlign: 'center', fontSize: 28 }}>Customize Your Journal </Text>
          <Text color={colors.secondaryText} type='sm' >You can always change this later</Text>
        </View>
        <View style={{ marginTop: 48 }}>
          <View style={{
            width: bookWidth,
            height: bookHeight,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderCurve: 'continuous',
            backgroundColor: bgColor,
            // flexDirection: 'row'
          }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: spineColor,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                width: spineWidth,
                height: bookHeight,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: '50%',
                right: -6,
                marginTop: - spineWidth * 0.75,
                backgroundColor: spineColor,
                borderTopLeftRadius: 50,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                width: spineWidth * 2,
                height: spineWidth * 1.75,
              }}
            />
            <View style={{
              flex: 1, alignItems: 'center',
              paddingHorizontal: spineWidth * 1.5,
              paddingVertical: bookHeight * 0.1
            }}>

              {imageUri ?
                <MaskedView
                  maskElement={<Ionicons name='heart' size={imageSize} color='black' />}
                >
                  <Image
                    source={{ uri: imageUri }}
                    resizeMode='cover'
                    style={{
                      width: imageSize,
                      height: imageSize,
                      aspectRatio: 1,
                    }}
                  />
                </MaskedView>
                :
                <Ionicons name='heart' size={imageSize} color={spineColor} />
              }
              <TextInput
                maxLength={40}
                multiline
                value={title}
                onChangeText={setTitle}
                style={{
                  color: textColor,
                  fontFamily: font,
                  lineHeight: 25,
                  fontSize: 32,
                  textAlign: 'center',
                  marginTop: bookHeight * 0.05,
                }}
                blurOnSubmit
                returnKeyLabel='done'
                returnKeyType='done'
                placeholder='Title'
                placeholderTextColor={colors.secondaryText}
              />
            </View>
          </View>
        </View>

        <View style={{ width: '100%', gap: 16, alignItems: 'center', marginTop: 48 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
            {/* <Text type='p' style={{ width: 100, textAlign: 'right' }} color={colors.primaryText}>Background</Text> */}
            <View style={{
              height: 40,
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              width: 40 * 4 + 8 * 3,
            }}>
              {JournalThemes.map(theme => (
                <Pressable
                  key={theme.name}
                  style={{ width: 40, height: 40, borderRadius: 10, borderCurve: 'continuous', backgroundColor: theme.backgroundColor }}
                  onPress={() => {
                    setBgColor(theme.backgroundColor);
                    setSpineColor(theme.spineColor);
                    setTextColor(theme.textColor);
                  }}
                />
              ))}
              {/* <LinearGradient
                colors={colorArray}
                start={[0, 0]}
                end={[1, 1]}
                style={{ width: colorPickerWidth, height: 18, borderRadius: 20 }}
              />
              <GestureDetector gesture={colorDragGesture}>
                <Animated.View
                  style={animColorDragStyle}
                />
              </GestureDetector> */}
            </View>
          </View>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
            <Text type='p' style={{ width: 100, textAlign: 'right' }} color={colors.primaryText}>Text</Text>
            <View style={{
              height: 40,
              justifyContent: 'center',
            }}>
              <LinearGradient
                colors={colorArray2}
                start={[0, 0]}
                end={[1, 1]}
                style={{ width: colorPickerWidth, height: 18, borderRadius: 20 }}
              />
              <GestureDetector gesture={color2DragGesture}>
                <Animated.View
                  style={animColor2DragStyle}
                />
              </GestureDetector>
            </View>
          </View> */}
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text type='p' style={{ width: 100, textAlign: 'right' }} color={colors.primaryText}>Font</Text>
            <View style={{
              height: 40,
              width: colorPickerWidth,
              justifyContent: 'center',
            }}>
              <Pressable style={{ height: 40, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface2, borderRadius: 6 }}>
                <Text type='p' color={colors.primaryText} style={{ fontFamily: font }}>Abc</Text>
              </Pressable>
            </View>
          </View> */}
        </View>
      </View>
      <Button
        type='primary'
        onPress={handleNext}
        loading={loading}
        style={{
          marginBottom: 32,
          height: 55,
          width: 180, flexDirection: 'row', alignItems: 'center', gap: 6
        }}
      >
        <>
          <Text type='h1' color={colors.primary}>Next</Text>
          <ArrowRightIcon size={20} color={colors.primary} />
        </>
      </Button>
    </Container >
  );
};

export default CreateFirstDiaryScreen;

const styles = StyleSheet.create({});