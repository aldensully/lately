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
  WrittenPage: undefined;
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
  thumbnail: string | null;
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
  alignment: 'list-item' | 'center' | 'space';
  color: string;
};

export type Diary = {
  id: string;
  title: string;
  backgroundColor: string;
  spineColor: string;
  textColor: string;
  font: string;
  image: string | null;
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
  weight: 'bold' | 'normal';
  backgroundColor: string | null;
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

export type PageTemplate = 'defaultWritten' | 'defaultCanvas';

export type Page = {
  id: string;
  count: number;
  title: string;
  content: string;
  diary_id: string;
  images: PageImageType[];
  texts: PageTextType[];
  stickers: PageStickerType[];
  small_preview_url: string | null;
  big_preview_url: string | null;
  creation_date: string;
  background_color: string;
  background_image_url: string | null;
  template: PageTemplate;
};

export type WeatherTag = {
  tempurature: number;
  description: string;
  main: string;
};

export type LocationTag = {
  latitude: number;
  longitude: number;
  name: string;
};

export type IconProps = {
  color?: string;
  size: number;
};

export type ResizeOptions = {
  width: number;
  height: number;
};

