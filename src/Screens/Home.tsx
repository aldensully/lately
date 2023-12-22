import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ContextMenuOption, Diary, Page, ScreenProps, UseNavigationType } from '../types';
import { Container, Text, useThemeColor } from '../Theme/Themed';
import Header from '../Components/Header';
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon';
import MenuButton from '../Components/MenuButton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import defaultStore from '../Stores/defaultStore';
import { apiFetchDiaries, apiGetDiary, apiListCommunityPages, apiListDiaries, getActiveDiary } from '../Utils/utilFns';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ContextMenu from '../Components/ContextMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlusIcon from '../../assets/icons/PlusIcon';
import PlusCircleIcon from '../../assets/icons/PlusCircleIcon';
import HeartIcon from '../../assets/icons/HeartIcon';

const Home = ({ navigation, route }: ScreenProps<'Home'>) => {
  const user = defaultStore(state => state.user);
  if (!user) return null;
  const { top, bottom } = useSafeAreaInsets();
  const { data: diary, isLoading } = useQuery({ queryKey: ['activeDiary'], queryFn: () => getActiveDiary(user.id) });
  const { data: communityDiary, isLoading: isLoadingCommunityDiary } = useQuery({ queryKey: ['community'], queryFn: apiListCommunityPages });
  const { width, height } = Dimensions.get('window');
  const cellWidth = (width - 40) / 2;
  const colors = useThemeColor();

  return (
    <Container>
      <Header
        headerLeft={<HeaderDropDown />}
        headerRight={<MenuButton />}
        style={{ zIndex: 100 }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          minHeight: height - top - 55,
          paddingBottom: 100
        }}
      >
        <View style={{
          paddingHorizontal: 13,
          columnGap: 5,
          rowGap: 5,
          flex: 1,
          flexDirection: 'row',
          width: '100%', flexWrap: 'wrap'
        }}>
          {diary && diary.pages && diary?.pages?.length > 0 ?
            diary.pages?.reverse().map(p => p && (
              <Pressable
                onPress={() => navigation.navigate('Page', { page: p, diary: diary })}
                style={{
                  width: cellWidth,
                  height: cellWidth * (9 / 6),
                  margin: 2,
                  backgroundColor: colors.surface2,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                key={p.id}
              >
                {p.preview_url ?
                  <Image style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 6,
                    resizeMode: 'cover'
                  }}
                    source={{ uri: p.preview_url }}
                  />
                  :
                  <Text type='h3'>{p.title}</Text>
                }
              </Pressable>
            )) :
            <View style={{ flex: 1, gap: 8, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 }}>
              <Text type='h2'>This diary is empty</Text>
              <Text type='p'>Click the plus button to create a new page</Text>
            </View>
          }
        </View>
      </ScrollView>
      <NewPageButton />
    </Container>
  );
};


const NewPageButton = () => {
  const navigation = useNavigation<UseNavigationType>();
  const colors = useThemeColor();
  const { bottom } = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => navigation.navigate('NewPage')}
      style={{
        position: 'absolute',
        right: 30,
        bottom: bottom + 32,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface2,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}>
      <Feather name='plus' size={32} color={colors.primary} />
    </Pressable>
  );
};

const HeaderDropDown = () => {
  const colors = useThemeColor();
  const user = defaultStore(state => state.user);
  const navigation = useNavigation<UseNavigationType>();
  if (!user) return null;
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: diaries, isLoading } = useQuery({ queryKey: ['diaries'], queryFn: () => apiFetchDiaries(user.id) });
  const { data: activeDiary, isLoading: isLoadingActiveDiary } = useQuery({ queryKey: ['activeDiary'], queryFn: () => getActiveDiary(user.id) });
  const queryClient = useQueryClient();
  const showCommunity = defaultStore(state => state.showCommunity);
  const setShowCommunity = defaultStore(state => state.setShowCommunity);

  const handleOptionPress = (option: string) => {
    setMenuOpen(false);
    if (option === 'Create') {
      //check if user has account yet
      return;
    }
    if (option === 'Community') {
      //check if user has account yet
      setShowCommunity(true);
      return;
    }

    setShowCommunity(false);
    const diaryId = diaries?.find(d => d.title === option)?.id;
    if (!diaryId) return;
    AsyncStorage.setItem('activeDiaryId', diaryId);
    queryClient.setQueryData(['activeDiary'], diaries?.find(d => d.id === diaryId));
  };

  const options: ContextMenuOption[] = [
    ...diaries?.map(d => ({
      name: d.title,
      icon: <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: d.backgroundColor }} />,
      color: colors.primaryText,
      alignment: 'list-item'
    } as ContextMenuOption)) ?? [],
    {
      name: 'Community',
      color: colors.primaryText,
      icon: <View style={{
        width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
        borderRadius: 4,
        // backgroundColor: colors.secondary
      }} >
        <HeartIcon size={20} color={colors.primary} />
      </View>,
      alignment: 'list-item'
    },
    // {
    //   name: 'New Diary',
    //   color: colors.primary,
    //   icon: <PlusIcon size={20} color={colors.primary} />,
    //   alignment: 'center'
    // }
  ];

  if (isLoading || isLoadingActiveDiary) return null;

  return (
    <View style={{
      height: '100%',
    }}>
      <Pressable
        onPress={() => setMenuOpen(!menuOpen)}
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          height: '100%',
          alignItems: 'center',
          gap: 6
        }}
      >
        <Text type='h1'>{showCommunity ? 'Community' : activeDiary?.title}</Text>
        <ChevronDownIcon size={24} color={colors.primaryText} />
      </Pressable>
      {diaries && <ContextMenu
        offsetX={110}
        offsetY={90}
        style={{ marginTop: -35, marginLeft: -95 }}
        anchor={'top-left'}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        options={options}
        selected={showCommunity ? 'Community' : activeDiary?.title ?? ''}
        onSelect={handleOptionPress}
      />
      }
    </View>
  );
};













export default Home;

const styles = StyleSheet.create({});