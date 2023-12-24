import { ActionSheetIOS, Alert, StyleSheet, Image, Text, View, Dimensions } from 'react-native';
import React from 'react';
import { Diary, ScreenProps } from '../types';
import { Button, Container, useThemeColor } from '../Theme/Themed';
import Header from '../Components/Header';
import BackButton from '../Components/BackButton';
import OptionsButton from '../Components/OptionsButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDeletePage, apiListDiaries } from '../Utils/utilFns';
import defaultStore from '../Stores/defaultStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const Page = ({ navigation, route }: ScreenProps<'Page'>) => {
  const { page, diary } = route.params;
  if (!page || !diary) return null;

  const user = defaultStore(state => state.user);
  const colors = useThemeColor();
  const queryClient = useQueryClient();

  const deletePageMutation = useMutation({
    mutationFn: async ({ pageId, diary }: { pageId: string; diary: Diary; }) => apiDeletePage(pageId, diary),
    onMutate: async ({ pageId, diary }) => {
      const oldDiaries = queryClient.getQueryData(['diaries']);
      const oldActiveDiary = queryClient.getQueryData(['activeDiary']);
      if (oldDiaries) {
        queryClient.setQueryData(['diaries'], (diaries: Diary[]) => diaries.map(d => {
          if (d.id === diary.id) {
            return {
              ...d,
              pages: [...d.pages.filter(p => p.id !== pageId)]
            };
          }
          return d;
        }));
      }
      if (oldActiveDiary) {
        queryClient.setQueryData(['activeDiary'], (d: Diary | undefined) => d ? { ...d, pages: [...d.pages.filter(p => p.id !== pageId)] } : undefined);
      }

      return { oldDiaries, oldActiveDiary };

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
      queryClient.invalidateQueries({ queryKey: ['activeDiary'] });
    },
    onSettled(data, error, variables, context) {
      if (error || !data) {
        queryClient.setQueryData(['diaries'], context?.oldDiaries);
        queryClient.setQueryData(['activeDiary'], context?.oldActiveDiary);
      }
    },
    onError: (e) => {
      console.log(e);
      Alert.alert('There was an error saving your page, please try again.');
    }
  });

  const handleShare = async () => {
    if (!page.big_preview_url) return;

    const fileDetails = {
      extension: '.png',
      shareOptions: {
        mimeType: 'image/png',
        dialosTitle: 'Check out this image!',
        UTI: 'image/png',
      },
    };

    const { uri: localUrl } = await FileSystem.downloadAsync(
      page.big_preview_url,
      FileSystem.documentDirectory + page.id + fileDetails.extension
    ).catch((e) => {
      console.log(e);
      return { uri: null };
    });

    if (!localUrl) return;

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Uh oh, sharing isn't available on your platform");
      return;
    }
    await Sharing.shareAsync(localUrl, fileDetails.shareOptions);
  };


  const openOptions = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Delete', 'Edit'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
    }, buttonIndex => {
      if (buttonIndex === 1) {
        // destructive action
        Alert.alert('Are you sure you want to delete this page?', 'This action cannot be undone.', [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deletePageMutation.mutate({ pageId: page.id, diary: diary });
              navigation.goBack();
            }
          }
        ]);
      } else if (buttonIndex === 2) {
        // edit action
      }
    });
  };


  const BOTTOM_CONTAINER_HEIGHT = 50;
  const { width, height } = Dimensions.get('window');
  const { top, bottom } = useSafeAreaInsets();
  const canvasWidth = width - 30;
  const canvasHeight = height - 30 - (BOTTOM_CONTAINER_HEIGHT + bottom + top + 45);

  return (
    <Container showInsetBottom>
      <Header
        style={{ backgroundColor: colors.surface1, paddingRight: 10 }}
        headerLeft={<BackButton navigate />}
        headerRight={<OptionsButton onPress={openOptions} />}
      />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{
          zIndex: 0,
          marginLeft: 15,
          marginTop: 15,
          width: canvasWidth,
          height: canvasHeight,
          borderRadius: 10,
          borderCurve: 'continuous',
          overflow: 'hidden',
          backgroundColor: colors.surface2
        }}>
          {page.big_preview_url ?
            <Image style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              resizeMode: 'cover'
            }}
              source={{ uri: page.big_preview_url }}
            />
            :
            <>
              {page.texts?.map(t => (
                <Text
                  key={t.id}
                  style={{
                    position: 'absolute',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    transform: [{
                      translateX: t.x
                    }, {
                      translateY: t.y
                    },
                    {
                      rotate: `${t.rotate}deg`
                    },
                    {
                      scale: t.scale
                    }
                    ],
                    fontFamily: t.font,
                    fontSize: t.size,
                    color: t.color,
                    backgroundColor: t.backgroundColor ?? 'transparent',
                  }}

                >{t.body}</Text>
              ))}
              {page.images?.map(img => (
                <Image
                  key={img.id}
                  source={{ uri: img.uri }}
                  style={{
                    position: 'absolute',
                    zIndex: img.z,
                    left: -img.width / 2,
                    top: -img.height / 2,
                    width: img.width,
                    height: img.height,
                    transform: [{
                      translateX: img.x
                    }, {
                      translateY: img.y
                    },
                    {
                      rotate: `${img.rotate}deg`
                    },
                    {
                      scale: img.scale
                    }
                    ]
                  }}
                />
              ))}
            </>
          }
        </View>
        <View style={{
          width: '100%',
          height: BOTTOM_CONTAINER_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          flexDirection: 'row'
        }}>
          <Button
            title="Edit"
            type='secondary'
            onPress={handleShare}
          />
          <Button
            title="Share"
            type='primary'
            onPress={handleShare}
          />
        </View>
      </View>
    </Container>
  );
};

export default Page;

const styles = StyleSheet.create({});