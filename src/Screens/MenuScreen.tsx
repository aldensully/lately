import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { ReactElement, useEffect, useState } from 'react';
import { Container, View as ThemeView, Text, useThemeColor } from '../Theme/Themed';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import defaultStore from '../Stores/defaultStore';
import Thumbnail from '../Components/Thumbnail';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import { Diary, NavigationScreens, ScreenProps, UseNavigationType } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserFillIcon from '../../assets/icons/UserFillIcon';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchDiaries } from '../Utils/utilFns';
import { deleteUser, getAuth, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const MenuScreen = () => {
  const colors = useThemeColor();
  const navigation = useNavigation();
  return (
    <Container showInsetTop>
      {/* <View style={{ paddingHorizontal: 10 }}>
        <BackButton onPress={() => navigation.dispatch(DrawerActions.closeDrawer())} />
      </View> */}
      <View style={{
        flex: 1,
        paddingTop: 16,
        backgroundColor: colors.surface1,
        gap: 32,
        paddingHorizontal: 15
      }}>
        <UserSection />
        <GeneralSection />
        <DiarySection />
        <DangerSection />
      </View>
    </Container>
  );
};

const DiarySection = () => {
  const user = defaultStore(state => state.user);
  if (!user) return null;
  const { data: diaries, isLoading } = useQuery({ queryKey: ['diaries'], queryFn: () => apiFetchDiaries(user.id) });


  const handleDiaryPress = (id: string) => {
  };

  return (
    <View style={{ gap: 8 }}>
      <Text type='h3' style={{ color: useThemeColor().secondaryText, marginLeft: 12 }}>Journals</Text>
      <View
        style={{
          width: '100%',
          backgroundColor: useThemeColor().surface2,
          borderRadius: 12,
        }}>
        {diaries?.map(diary => (
          <DiaryItem key={diary.id} diary={diary} onPress={() => handleDiaryPress(diary.id)} />
        ))}
      </View>
    </View>
  );
};

const DiaryItem = ({ diary, onPress }: { diary: Diary; onPress: () => void; }) => {
  const colors = useThemeColor();
  return (
    <Pressable onPress={onPress} style={{ width: '100%', paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 45 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: diary.backgroundColor }} />
        <Text type='h3'>{diary.title}</Text>
      </View>
      {/* <ChevronRightIcon size={16} color={colors.primaryText} /> */}
      <Text color={colors.secondaryText} type='h3'>{diary.pages.length}</Text>
    </Pressable>
  );
};

const UserSection = () => {
  const colors = useThemeColor();
  const user = defaultStore(state => state.user);
  const hasAccount = defaultStore(state => state.hasAccount);
  const navigation = useNavigation<UseNavigationType>();

  return (
    <ThemeView
      style={{
        width: '100%',
        backgroundColor: colors.surface2,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
      <Thumbnail
        username={user?.username}
        id={user?.id ?? ''}
        size='lg'
        url={user?.thumbnail}
      />
      <View style={{ marginLeft: 12, gap: 4 }}>
        <Text type='h3'>{user?.username}</Text>
        <Text color={colors.secondaryText} type='sm'>Joined {user?.creation_date.split(' ')[0]}</Text>
      </View>
      {/* <View style={{ width: '100%', gap: 4, }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 32, height: 32, borderRadius: 14, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center' }}>
              <UserFillIcon size={16} color={colors.secondaryText} />
            </View>
            <Text type='h3'>Guest</Text>
          </View>
          <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text color={colors.primary} style={{ maxWidth: '80%' }} type='sm'>Create an account to backup your diaries</Text>
            <ChevronRightIcon size={16} color={colors.primaryText} />
          </View>
        </View> */}
    </ThemeView>
  );
};

const Item = ({ title, icon, onPress }: { title: string, icon: ReactElement, onPress: () => void; }) => {
  const colors = useThemeColor();
  return (
    <Pressable onPress={onPress} style={{ width: '100%', paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {/* {icon} */}
        <Text type='h3'>{title}</Text>
      </View>
      <ChevronRightIcon size={16} color={colors.primaryText} />
    </Pressable>
  );
};



const GeneralSection = () => {
  const colors = useThemeColor();
  const user = defaultStore(state => state.user);
  const navigation = useNavigation<UseNavigationType>();

  const items = [
    {
      icon: <Ionicons name='color-palette-outline' size={18} color={colors.primaryText} />,
      title: 'Customize',
      key: 'customize'
    },
    {
      icon: <Ionicons name='chatbubble-outline' size={18} color={colors.primaryText} />,
      title: 'Send Feedback',
      key: 'feedback'
    },
    {
      icon: <Ionicons name='star-outline' size={18} color={colors.primaryText} />,
      title: 'Rate Lately',
      key: 'rate'
    },
  ];

  const handlePress = (key: string) => {
    console.log("presed");
    switch (key) {
      case 'customize':
        console.log('navigating');
        navigation.navigate('CustomizeScreen');
        break;
      case 'feedback':
        navigation.navigate('FeedbackScreen');
        break;
      case 'rate':
        break;
      default:
        break;
    }
  };

  return (
    <View style={{ gap: 8 }}>
      <Text type='h3' style={{ color: colors.secondaryText, marginLeft: 12 }}>General</Text>
      <View
        style={{
          width: '100%',
          backgroundColor: colors.surface2,
          borderRadius: 12,
        }}>
        {items.map(item => (
          <Item key={item.title} icon={item.icon} title={item.title} onPress={() => handlePress(item.key)} />
        ))}
      </View>
    </View>
  );
};


const DangerSection = () => {
  const colors = useThemeColor();
  const authUser = auth.currentUser;

  const items = [
    {
      icon: <></>,
      title: 'Sign Out'
    },
    {
      icon: <></>,
      title: 'Delete Account'
    },
  ];

  const queryClient = useQueryClient();
  const setUser = defaultStore(state => state.setUser);

  const handlePress = (title: string) => {
    if (title == 'Sign Out') {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          onPress: () => {
            signOut(auth).then(() => {
              setUser(null);
              queryClient.clear(),
                AsyncStorage.clear();
            });
          },
          style: 'default'
        }
      ]);
    }
    if (title == 'Delete Account') {
      if (!authUser) return;
      Alert.prompt(
        'Delete Account?',
        'Type the word "delete" to delete your account',
        [
          {
            text: 'Cancel',
            onPress: () => { },
            style: 'cancel'
          },
          {
            text: 'Delete',
            onPress: async deleteText => {
              if (deleteText == 'delete') {
                deleteUser(authUser).then(() => {
                  setUser(null);
                  queryClient.clear(),
                    AsyncStorage.clear();
                }).catch((error) => {
                  console.log(error);
                  Alert.alert('Error', "Failed to delete user. Please contact aw.sullivan17@gmail.com");
                });
              }
            },
            style: 'destructive'
          }
        ],
        "plain-text",
        "",
        "default"
      );
    }
  };

  return (
    <View style={{ gap: 8 }}>
      <Text type='h3' style={{ color: colors.secondaryText, marginLeft: 12 }}>General</Text>
      <View
        style={{
          width: '100%',
          backgroundColor: colors.surface2,
          borderRadius: 12,
        }}>
        {items.map(item => (
          <Item key={item.title} icon={item.icon} title={item.title} onPress={() => handlePress(item.title)} />
        ))}
      </View>
    </View>
  );
};




export default MenuScreen;

const styles = StyleSheet.create({});