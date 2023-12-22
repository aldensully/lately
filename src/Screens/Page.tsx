import { ActionSheetIOS, Alert, StyleSheet, Image, Text, View } from 'react-native';
import React from 'react';
import { Diary, ScreenProps } from '../types';
import { Container, useThemeColor } from '../Theme/Themed';
import Header from '../Components/Header';
import BackButton from '../Components/BackButton';
import OptionsButton from '../Components/OptionsButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiListDiaries } from '../Utils/utilFns';
import defaultStore from '../Stores/defaultStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Page = ({ navigation, route }: ScreenProps<'Page'>) => {
  const { page, diary } = route.params;
  const colors = useThemeColor();
  const user = defaultStore(state => state.user);
  const queryClient = useQueryClient();

  const deletePageMutation = useMutation({
    mutationFn: async ({ pageId, diaryId }: { pageId: string; diaryId: string; }) => {
      if (!user) return;
      const diaries = await apiListDiaries(user.id);
      const newDiaries = diaries.map(d => {
        if (d.id === diaryId) {
          return {
            ...d,
            pages: [...d.pages.filter(p => p.id !== pageId)]
          };
        }
        return d;
      });
      AsyncStorage.setItem('diaries', JSON.stringify(newDiaries)),
        queryClient.setQueryData(['diaries'], newDiaries);
      queryClient.setQueryData(['activeDiary'], (d: Diary | undefined) => d ? { ...d, pages: [...d.pages.filter(p => p.id !== pageId)] } : undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
      queryClient.invalidateQueries({ queryKey: ['activeDiary'] });
    },
    onError: (e) => {
      console.log(e);
      Alert.alert('There was an error saving your page, please try again.');
    }
  });



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
              deletePageMutation.mutate({ pageId: route.params.page.id, diaryId: route.params.diary.id });
              navigation.goBack();
            }
          }
        ]);
      } else if (buttonIndex === 2) {
        // edit action
      }
    });
  };

  return (
    <Container>
      <Header
        style={{ backgroundColor: colors.surface1, paddingRight: 10 }}
        headerLeft={<BackButton navigate />}
        headerRight={<OptionsButton onPress={openOptions} />}
      />
      <View style={{ flex: 1, zIndex: 1, overflow: 'hidden', backgroundColor: colors.surface2 }}>
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
      </View>
    </Container>
  );
};

export default Page;

const styles = StyleSheet.create({});