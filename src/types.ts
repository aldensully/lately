import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LegacyRef, ReactNode } from 'react';
import { TextInput } from 'react-native';

//main stack
export type NavigationScreens = {
  Home: undefined;
  Welcome: undefined;
  Main: undefined;
  OnboardingTheme: undefined;
  CreateAccount: undefined;
  CustomizeScreen: undefined;
  FeedbackScreen: undefined;
  Menu: undefined;
  NewPage: undefined;
  SignUpOptionsScreen: undefined; //choose apple or google sign up. its a modal
  EditProfileScreen: undefined; //choose apple or google sign up. its a modal
  CreateFirstDiaryScreen: { newUser: User; imageUri?: string | undefined; };
  Page: { page: Page, diary: Diary; };
};

//screen props
// export type ScreenProps = NativeStackScreenProps<RootStackParamList<T>>;
export type ScreenProps<Screen extends keyof NavigationScreens> = NativeStackScreenProps<NavigationScreens, Screen>;
export type UseNavigationType = NavigationProp<NavigationScreens>;
export type User = {
  id: string;
  username: string;
  thumbnail?: string;
  creation_date: string;
};

export type JournalTheme = {
  name: string;
  backgroundColor: string;
  spineColor: string;
  textColor: string;
  font: string;
};

export type ContextMenuOption = {
  name: string;
  icon: ReactNode;
  alignment: 'list-item' | 'center';
  color: string;
};

export type Diary = {
  id: string;
  title: string;
  backgroundColor: string;
  spineColor: string;
  textColor: string;
  font: string;
  image?: string | null;
  user_id: string;
  pages: Page[];
  creation_date: string;
};

export type ImageShape = 'polaroid' | 'circle' | 'square' | 'heart' | 'inherit';

export type PageImageType = {
  id: string;
  uri: string;
  x: number;
  y: number;
  z: number;
  rotate: number;
  shape: ImageShape;
  width: number;
  height: number;
  scale: number;
};

export type PageTextType = {
  id: string;
  body: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  size: number;
  scale: number;
  align: 'left' | 'center' | 'right';
  rotate: number;
  color: string;
  backgroundColor?: string | null;
  font: string;
};

export type PageStickerType = {
  id: string;
  key: string;
  x: number;
  y: number;
  z: number;
  size: number;
};

export type Page = {
  id: string;
  count: number;
  title: string;
  content: string;
  diary_id: string;
  images: PageImageType[];
  texts: PageTextType[];
  stickers: PageStickerType[];
  creation_date: string;
};

export type IconProps = {
  color?: string;
  size: number;
};

export type ResizeOptions = {
  width: number;
  height: number;
};

