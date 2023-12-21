import { ActionSheetIOS, Alert, Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View, Image, Modal } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Diary, ImageShape, Page, PageImageType, PageTextType, ScreenProps } from '../types';
import { Container, Text, useThemeColor } from '../Theme/Themed';
import Header from '../Components/Header';
import BackButton from '../Components/BackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UndoIcon from '../../assets/icons/UndoIcon';
import StickerIcon from '../../assets/icons/StickerIcon';
import BackgroundIcon from '../../assets/icons/BackgroundIcon';
import TextIcon from '../../assets/icons/TextIcon';
import ImageIcon from '../../assets/icons/ImageIcon';
import BrushIcon from '../../assets/icons/BrushIcon';
import { apiCreatePage, apiListDiaries, blobToBase64, generateUUID, getActiveDiary, uriToBlob } from '../Utils/utilFns';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import AlignLeftIcon from '../../assets/icons/AlignLeftIcon';
import AlignCenterIcon from '../../assets/icons/AlignCenterIcon';
import AlignRightIcon from '../../assets/icons/AlignRightIcon';
import KeyboardIcon from '../../assets/icons/KeyboardIcon';
import { useCameraPermissions } from 'expo-image-picker';
import CloseButton from '../Components/CloseButton';
import GraphBackground from '../../assets/svg-backgrounds/GraphBackground';
import GridBackground from '../../assets/svg-backgrounds/GridBackground';
import BubbleBackground from '../../assets/svg-backgrounds/BubbleBackground';
import defaultStore from '../Stores/defaultStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import TextColorIcon from '../../assets/icons/TextColorIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ContextMenu from '../Components/ContextMenu';
import { useTheme } from '@react-navigation/native';
import CropIcon from '../../assets/icons/CropIcon';
import TrashIcon from '../../assets/icons/TrashIcon';
import { query } from 'firebase/firestore';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';


const DoneButton = ({ onPress }: { onPress: () => void; }) => {
  const colors = useThemeColor();
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginRight: 10
      }}>
      <Text type='h3' color={colors.primary}>Done</Text>
    </Pressable>
  );
};


const BOTTOM_CONTAINER_HEIGHT = 50;
const { width, height } = Dimensions.get('window');
const BACKGROUNDS = [
  { key: 'graph', svg: <GraphBackground /> },
  { key: 'grid', svg: <GridBackground /> },
  { key: 'bubble', svg: <BubbleBackground /> },
];

const cellWidth = (width - 60) / 3;



const NewPage = ({ navigation }: ScreenProps<'NewPage'>) => {
  const { top, bottom } = useSafeAreaInsets();
  const [overlaysShown, setOverlaysShown] = useState(true);
  const [hasBackAction, setHasBackAction] = useState(false);
  const [texts, setTexts] = useState<PageTextType[]>([]);
  const [images, setImages] = useState<PageImageType[]>([]);
  const [background, setBackground] = useState<{ type: 'image' | 'pattern', uri: string | undefined, bgKey: string; } | null>(null);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [openInput, setOpenInput] = useState(false);
  const [newText, setNewText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [focusedTextId, setFocusedTextId] = useState<string | null>(null);
  const [font, setFont] = useState('SingleDay');
  const [color, setColor] = useState('#000000');
  const [backgroundTextColor, setBackgroundTextColor] = useState<string | null>(null);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [camPermission, requestPermission] = useCameraPermissions();
  const [mediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [stickerModalOpen, setStickerModalOpen] = useState(false);
  const [backgroundPickerModalOpen, setBackgroundPickerModalOpen] = useState(false);
  const [bgColorPickerOpen, setBgColorPickerOpen] = useState(false);
  const lastColorOffsetX = useSharedValue(0);
  const colorOffsetX = useSharedValue(0);
  const bgLastColorOffsetX = useSharedValue(0);
  const bgColorOffsetX = useSharedValue(0);
  const colorArray = ['#000000', '#FF0000', '#FF7A00', '#FAF11D', '#37D300', '#00A3FF', '#9E00FF', '#FF00E6', '#FFFFFF'];
  const [maxZ, setMaxZ] = useState(1);
  const { data: activeDiary, isLoading } = useQuery({ queryKey: ['activeDiary'], queryFn: () => user && getActiveDiary(user.id) });
  const queryClient = useQueryClient();
  const user = defaultStore(state => state.user);

  const createPageMutation = useMutation({
    mutationFn: async (newPage: Page) => apiCreatePage(newPage),
    onMutate: async (newPage: Page) => {
      const oldDiaries = queryClient.getQueryData(['diaries']) as Diary[];
      const newDiaries = oldDiaries.map(d => {
        if (d.id === activeDiary?.id) {
          return {
            ...d,
            pages: [newPage, ...d.pages]
          };
        }
        return d;
      });
      queryClient.setQueryData(['diaries'], newDiaries);
      queryClient.setQueryData(['activeDiary'], newDiaries.find(d => d.id === activeDiary?.id));
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

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardFocused(true);
    });
    Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardFocused(false);
    });
    return () => {
      Keyboard.removeAllListeners('keyboardWillShow');
      Keyboard.removeAllListeners('keyboardWillHide');
    };
  }, []);

  const handleTextButtonPress = () => {
    if (keyboardFocused) {
      Keyboard.dismiss();
      return;
    }
    setOpenInput(true);
  };

  const handleInputBlur = () => {
    setColorPickerOpen(false);
    setOpenInput(false);
    bgColorOffsetX.value = 50;
    colorOffsetX.value = 0;
    setBackgroundTextColor(null);
    setColor('#000000');
    setColorPickerOpen(false);
    setBgColorPickerOpen(false);

    if (focusedTextId) {
      if (newText.length === 0) {
        const newT = texts.filter(t => t.id !== focusedTextId);
        setTexts(newT);
        setFocusedTextId(null);
        setNewText('');
        return;
      }
      const t = texts.find(t => t.id === focusedTextId) ?? null;
      if (!t) return;
      const newT: PageTextType = {
        ...t,
        color,
        font,
        body: newText,
        align,
        z: maxZ,
        backgroundColor: backgroundTextColor ?? null
      };
      handleUpdateText(newT);
      setFocusedTextId(null);
      setOpenInput(false);
      setNewText('');
      setMaxZ(z => z + 1);
      return;
    }
    if (newText.length === 0) return;
    const t: PageTextType = {
      id: generateUUID(),
      body: newText,
      color: color,
      font: font,
      align,
      x: 20,
      y: height / 4,
      z: maxZ,
      rotate: 0,
      width: 100, //placeholder values
      height: 30,//placeholder values
      size: 22,
      scale: 1
    };
    if (backgroundTextColor) t.backgroundColor = backgroundTextColor;
    setTexts([...texts, t]);
    setOpenInput(false);
    setFocusedTextId(null);
    setNewText('');
    setMaxZ(z => z + 1);
  };

  const handleImagePickerButtonPress = async () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Take Photo', 'Choose from Library'],
      cancelButtonIndex: 0,
    }, async (buttonIndex) => {
      if (buttonIndex === 1) {
        // navigation.navigate('Camera');
        //open camera
        if (!camPermission) return;
        if (!camPermission.granted) {
          const res = await requestPermission();
          if (!res.granted) {
            Alert.alert('Permission required', 'Please allow camera access to add images to the page.');
            return;
          }
        }
        //open camera
      }
      if (buttonIndex === 2) {
        if (!mediaPermission) return;
        if (!mediaPermission.granted) {
          const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!res.granted) {
            Alert.alert('Permission required', 'Please allow media access to add images to the page.');
            return;
          }
        }
        //open image picker
        openImage();
      }
    });
  };

  const openImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ImagePicker.MediaTypeOptions.Images,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false
      });
      if (result.canceled) {
        return;
      }

      const manipResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 400 } }],
        { format: SaveFormat.PNG, compress: 0.4 }
      );

      if (!manipResult.uri) return;

      Image.getSize(manipResult.uri, (w, h) => {
        const aspectRatio = w / h;
        const newWidth = 200;
        const newHeight = newWidth / aspectRatio;
        const i: PageImageType = {
          id: generateUUID(),
          uri: manipResult.uri,
          x: width / 4,
          y: height / 4,
          z: maxZ,
          rotate: 0,
          scale: 1,
          shape: 'inherit',
          width: newWidth,
          height: newHeight
        };
        setImages([...images, i]);
        setMaxZ(z => z + 1);
      });

    } catch (e) {
      console.log(e);
      Alert.alert('Something went wrong, please try again.');
    }
  };

  const { width, height } = Dimensions.get('window');

  const handleStickerButtonPress = () => {
    setStickerModalOpen(true);
  };

  const handleBackgroundButtonPress = () => {
    setBackgroundPickerModalOpen(true);
  };

  const handlePencilButtonPress = () => {
  };

  const colors = useThemeColor();


  const handleUpdateText = (t: PageTextType) => {
    const newT = texts.map(text => {
      if (text.id === t.id) {
        return { ...t, z: maxZ };
      }
      return text;
    });
    setTexts(newT);
  };

  const handleTextFocus = (id: string) => {
    const focused = texts.find(t => t.id === id) ?? null;
    if (!focused) return;
    setFocusedTextId(focused.id);
    setColor(focused.color);
    setFont(focused.font);
    setNewText(focused.body);
    setBackgroundTextColor(focused.backgroundColor ?? null);
    setOpenInput(true);
  };

  const handleImageFocus = (id: string) => {
  };

  const handleUpdateImage = (i: PageImageType) => {
    setImages(images.map(img => {
      if (img.id === i.id) {
        return { ...i };
      }
      return img;
    }));
  };

  const bringImageToFront = (imageId: string) => {
    setImages(imgs => imgs.map(i => {
      if (i.id === imageId) {
        return { ...i, z: maxZ };
      }
      return i;
    }));
    setMaxZ(z => z + 1);
  };

  const bringTextToFront = (textId: string) => {
    setTexts(texts => texts.map(t => {
      if (t.id === textId) {
        return { ...t, z: maxZ };
      }
      return t;
    }));
    setMaxZ(z => z + 1);
  };

  const sendTextToBack = (textId: string) => {
    setTexts(texts => texts.map(t => {
      if (t.id === textId) {
        return { ...t, z: 1 };
      }
      return { ...t, z: t.z + 1 };
    }));
    setImages(imgs => imgs.map(i => ({ ...i, z: i.z + 1 })));
  };

  const sendImageToBack = (imageId: string) => {
    setImages(imgs => imgs.map(i => {
      if (i.id === imageId) {
        return { ...i, z: 1 };
      }
      return { ...i, z: i.z + 1 };
    }));
    setTexts(texts => texts.map(t => ({ ...t, z: t.z + 1 })));
  };


  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    if (!activeDiary) {
      setLoading(false);
      Alert.alert("There was an error loading your diary!");
      return;
    }

    const pageCount = activeDiary.pages.length + 1;

    const page: Page = {
      id: generateUUID(),
      count: pageCount,
      title: new Date().toISOString().split('T')[0],
      content: '',
      diary_id: activeDiary.id,
      images: images,
      texts: texts,
      stickers: [],
      creation_date: new Date().toISOString()
    };

    createPageMutation.mutate(page);

    navigation.goBack();
  };

  const bgAnimColorDragStyle = useAnimatedStyle(() => {
    const c = interpolateColor(bgColorOffsetX.value, [0, 25, 50, 75, 100, 125, 150, 175, 200], colorArray);
    return {
      width: 20,
      transform: [{
        translateX: bgColorOffsetX.value + 10
      }],
      borderRadius: 20,
      height: 20,
      backgroundColor: c,
      borderWidth: 1,
      borderColor: '#444',
      position: 'absolute',
    };
  });

  const bgColorDragGesture = Gesture.Pan()
    .onStart(() => {
      bgLastColorOffsetX.value = bgColorOffsetX.value;
    })
    .onUpdate(e => {
      if (e.translationX + bgLastColorOffsetX.value < 0 || e.translationX + bgLastColorOffsetX.value > 200) return;
      bgColorOffsetX.value = bgLastColorOffsetX.value + e.translationX;
      const newColor = interpolateColor(bgColorOffsetX.value, [0, 25, 50, 75, 100, 125, 150, 175, 200], colorArray);
      setBackgroundTextColor(newColor);
    })
    .onEnd(e => {
      const newColor = interpolateColor(bgColorOffsetX.value, [0, 25, 50, 75, 100, 125, 150, 175, 200], colorArray);
      setBackgroundTextColor(newColor);
    })
    .runOnJS(true);



  const animColorDragStyle = useAnimatedStyle(() => {
    const c = interpolateColor(colorOffsetX.value, [0, 25, 50, 75, 100, 125, 150, 175, 200], colorArray);
    return {
      width: 20,
      transform: [{
        translateX: colorOffsetX.value + 10
      }],
      borderRadius: 20,
      height: 20,
      backgroundColor: c,
      borderWidth: 1,
      borderColor: '#444',
      position: 'absolute',
    };
  });

  const colorDragGesture = Gesture.Pan()
    .onStart(() => {
      lastColorOffsetX.value = colorOffsetX.value;
    })
    .onUpdate(e => {
      if (e.translationX + lastColorOffsetX.value < 0 || e.translationX + lastColorOffsetX.value > 200) return;
      colorOffsetX.value = lastColorOffsetX.value + e.translationX;
      const newColor = interpolateColor(colorOffsetX.value, [0, 25, 50, 75, 100, 125, 150, 175, 200], colorArray);
      setColor(newColor);
    })
    .onEnd(e => {
      const newColor = interpolateColor(colorOffsetX.value, [0, 25, 50, 75, 100, 125, 150, 175, 200], colorArray);
      setColor(newColor);
    })
    .runOnJS(true);


  const handleDeleteImage = (id: string) => {
    setImages(images.filter(i => i.id !== id));
  };

  const handleDeleteText = (id: string) => {
    setTexts(texts.filter(t => t.id !== id));
  };


  return (
    <Container backgroundColor='#fff'>
      <Modal
        presentationStyle='pageSheet'
        animationType='slide'
        visible={stickerModalOpen}
        onRequestClose={() => setStickerModalOpen(false)}
      >
        <Container >
          <Header
            style={{ height: 50, paddingTop: 0, paddingHorizontal: 10 }}
            headerLeft={<CloseButton onPress={() => setStickerModalOpen(false)} />}
            headerTitle={<Text style={{ marginBottom: 2 }} type='h2'>Stickers</Text>}
          />
        </Container>
      </Modal>
      <Modal
        presentationStyle='pageSheet'
        animationType='slide'
        visible={backgroundPickerModalOpen}
        onRequestClose={() => setBackgroundPickerModalOpen(false)}
      >
        <Container >
          <Header
            style={{ height: 50, paddingTop: 0, paddingHorizontal: 10 }}
            headerLeft={<CloseButton onPress={() => setBackgroundPickerModalOpen(false)} />}
            headerTitle={<Text style={{ marginBottom: 2 }} type='h2'>Background</Text>}
          />
          <View style={{ flex: 1, paddingTop: 16, columnGap: 15, paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
            {BACKGROUNDS.map(b => (
              <Pressable
                onPress={() => {
                  setBackground({
                    bgKey: b.key,
                    type: 'pattern',
                    uri: undefined
                  });
                }}
                key={b.key}
                style={{
                  width: cellWidth,
                  borderRadius: 8,
                  borderCurve: 'continuous',
                  height: cellWidth * 9 / 6,
                  borderWidth: 1,
                  borderColor: background?.bgKey === b.key ? colors.primary : colors.surface3,
                  overflow: 'hidden'
                }}>
                {b.svg}
                {/* <GraphBackground /> */}
              </Pressable>
            ))}
          </View>
        </Container>
      </Modal>
      <Header
        style={{ backgroundColor: colors.surface1 }}
        headerLeft={<BackButton navigate />}
        headerRight={<DoneButton onPress={handleSave} />}
      />
      {openInput &&
        <KeyboardAvoidingView
          behavior={'height'}
          style={{
            flex: 1,
            position: 'absolute',
            zIndex: 1000,
            left: 0,
            top: 0,
            right: 0,
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            bottom: 0
          }}
        >
          <Pressable
            onPress={handleInputBlur}
            style={{ position: 'absolute', height: height, top: 0, left: 0, right: 0 }} />
          <View style={{ width: '100%', paddingTop: 10, backgroundColor: colors.surface1 }}>
            <TextInput
              numberOfLines={5}
              multiline
              autoFocus
              scrollEnabled={false}
              maxLength={200}
              ref={inputRef}
              value={newText}
              onChangeText={setNewText}
              placeholder='Start typing...'
              placeholderTextColor={color}
              style={{
                paddingHorizontal: 16,
                backgroundColor: backgroundTextColor ?? 'transparent',
                minHeight: 30,
                fontFamily: font,
                lineHeight: 24,
                fontSize: 22,
                textAlign: align,
                paddingBottom: 4,
                color: color
              }}
              onBlur={handleInputBlur}
            />
            {colorPickerOpen && <View style={{
              paddingHorizontal: 20,
              height: 40,
              justifyContent: 'center',
            }}>
              <LinearGradient
                colors={colorArray}
                start={[0, 0]}
                end={[1, 1]}
                style={{ width: 200, height: 12, borderRadius: 20 }}
              />
              <GestureDetector gesture={colorDragGesture}>
                <Animated.View
                  style={animColorDragStyle}
                />
              </GestureDetector>
            </View>
            }
            {bgColorPickerOpen && <View style={{
              paddingHorizontal: 20,
              height: 40,
              justifyContent: 'center',
            }}>
              <LinearGradient
                colors={colorArray}
                start={[0, 0]}
                end={[1, 1]}
                style={{ width: 200, height: 12, borderRadius: 20 }}
              />
              <GestureDetector gesture={bgColorDragGesture}>
                <Animated.View
                  style={bgAnimColorDragStyle}
                />
              </GestureDetector>
            </View>
            }
            <View style={{ height: 40, gap: 10, width: '100%', paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                style={{
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                }}
                onPress={() => setColorPickerOpen(o => !o)}
              >
                <TextColorIcon size={24} color={color} />
              </Pressable>
              <View style={{ width: 1, height: 20, backgroundColor: colors.surface3 }} />
              <Pressable
                style={{
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderCurve: 'continuous',
                  borderRadius: 6,
                  backgroundColor: backgroundTextColor ?? colors.surface3
                }}
                onPress={() => {
                  if (bgColorPickerOpen) {
                    setBgColorPickerOpen(false);
                  } else if (backgroundTextColor) {
                    setBackgroundTextColor(null);
                  }
                  else {
                    bgColorOffsetX.value = 25;
                    const newColor = interpolateColor(25, [0, 25, 50, 75, 100, 125, 150, 175, 200], colorArray);
                    setBackgroundTextColor(newColor);
                    setBgColorPickerOpen(true);
                  }
                }}
              >
                <BackgroundIcon size={16} color={color} />
                {/* <TextColorIcon size={24} color={color} /> */}
              </Pressable>
              <View style={{ width: 1, height: 20, backgroundColor: colors.surface3 }} />
              <TextAlignContainer align={align} setAlign={setAlign} />
              <View style={{ width: 1, height: 20, backgroundColor: colors.surface3 }} />
              <FontStyleContainer font={font} setFont={setFont} />
              <View style={{ width: 1, height: 20, backgroundColor: colors.surface3 }} />
              <Pressable
                onPress={handleInputBlur}
                style={{
                  width: 40,
                  height: 40,
                  flexDirection: 'row',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <KeyboardIcon size={24} color={colors.primaryText} />
                <Ionicons name='arrow-down' size={16} color={colors.primaryText} />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      }
      <View style={{ flex: 1, zIndex: 1, overflow: 'hidden', backgroundColor: colors.surface2 }}>
        {background && background.type === 'image' ? <Image style={{ position: 'absolute', zIndex: 0, left: 0, top: 0, right: 0, bottom: 0 }} source={{ uri: background.uri }} /> : <SvgBackground bgKey={background?.bgKey} />}
        {texts?.map(t => t.id !== focusedTextId && (
          <MovableText
            key={t.id}
            text={t}
            onChange={handleUpdateText}
            onDelete={handleDeleteText}
            onFocus={() => handleTextFocus(t.id)}
            onBringTextToFront={bringTextToFront}
            onSendTextToBack={sendTextToBack}
          />
        ))}
        {images?.map(img => (
          <MovableImage
            key={img.id}
            image={img}
            onChange={handleUpdateImage}
            onFocus={handleImageFocus}
            onDelete={handleDeleteImage}
            onBringImageToFront={bringImageToFront}
            onSendImageToBack={sendImageToBack}
          />
        ))}
      </View>
      {overlaysShown && <View style={{
        width: '100%',
        // position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: bottom,
        height: BOTTOM_CONTAINER_HEIGHT + bottom,
        backgroundColor: colors.surface1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        zIndex: 2
      }}>
        {/* <UndoButton hasBackAction={hasBackAction} onPress={handleUndo} /> */}
        <TextButton onPress={handleTextButtonPress} />
        <ImagePickerButton onPress={handleImagePickerButtonPress} />
        <StickerButton onPress={handleStickerButtonPress} />
        <BackgroundButton onPress={handleBackgroundButtonPress} />
        {/* <PencilButton /> */}
      </View>
      }
    </Container>
  );
};

type MovableImageProps = {
  image: PageImageType;
  onChange: (i: PageImageType) => void;
  onFocus: (id: string) => void;
  onDelete: (id: string) => void;
  onBringImageToFront: (id: string) => void;
  onSendImageToBack: (id: string) => void;
};

const MovableImage = (props: MovableImageProps) => {
  const { image, onChange, onFocus, onDelete, onBringImageToFront, onSendImageToBack } = props;
  const lastOffset = useSharedValue({ x: image.x, y: image.y });
  const offset = useSharedValue({ x: image.x, y: image.y });
  const lastScale = useSharedValue(image.scale);
  const imageScale = useSharedValue(image.scale);
  const lastRotation = useSharedValue(image.rotate);
  const rotation = useSharedValue(image.rotate);
  const minSize = Math.min(image.width, image.height);
  const [menuOpen, setMenuOpen] = useState(false);

  const animImageStyle = useAnimatedStyle(() => {
    return {
      width: image.width,
      height: image.height,
      position: 'absolute',
      zIndex: image.z,
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: imageScale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  const animContextStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      zIndex: 100000,

      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y }
      ],
    };
  });

  const rotateGesture = Gesture.Rotation()
    .onStart(() => {
      lastRotation.value = rotation.value;
    })
    .onUpdate((e) => {
      rotation.value = lastRotation.value + e.rotation * 180 / Math.PI;
    })
    .onEnd(() => {
      handleSetRotation(rotation.value);
    })
    .runOnJS(true);

  const pinchGesture = Gesture.Pinch()
    .onStart((ctx) => {
      lastScale.value = imageScale.value;
    })
    .onUpdate((e) => {
      const { scale, focalX, focalY, } = e;
      imageScale.value = scale * lastScale.value;
    })
    .onEnd(() => {
      handleSetScale(imageScale.value);
    })
    .runOnJS(true);

  const dragGesture = Gesture.Pan()
    .onStart((_e) => {
    })
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + lastOffset.value.x,
        y: e.translationY + lastOffset.value.y,
      };
    })
    .onEnd(() => {
      lastOffset.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
      handleSetOffsets(offset.value.x, offset.value.y);
    })
    .runOnJS(true);

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      if (image.shape === 'inherit') handleSetImageShape('square');
      if (image.shape === 'square') handleSetImageShape('circle');
      if (image.shape === 'circle') handleSetImageShape('inherit');
      // if (image.shape === 'heart') handleSetImageShape('inherit');
    })
    .runOnJS(true);

  const longPress = Gesture.LongPress()
    .onStart(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setMenuOpen(true);
    })
    .runOnJS(true);

  const handleSetImageShape = (shape: ImageShape) => {
    const t: PageImageType = {
      ...image,
      shape
    };
    onChange(t);
  };

  // const composed = Gesture.Race(rotateGesture, tapGesture, dragGesture, pinchGesture);
  const composed = Gesture.Simultaneous(
    tapGesture,
    longPress,
    Gesture.Simultaneous(dragGesture, pinchGesture, rotateGesture)
  );

  const handleSetOffsets = (x: number, y: number) => {
    const t: PageImageType = {
      ...image,
      x,
      y,
    };
    onChange(t);
  };

  const handleSetRotation = (rotate: number) => {
    const t: PageImageType = {
      ...image,
      rotate
    };
    onChange(t);
  };

  const handleSetScale = (scale: number) => {
    const t: PageImageType = {
      ...image,
      scale
    };
    onChange(t);
  };

  const handleOptionSelect = async (option: string) => {
    if (option === 'Delete') {
      onDelete(image.id);
    }
    if (option === 'Bring To Front') {
      onBringImageToFront(image.id);
    }
    if (option === 'Send To Back') {
      onSendImageToBack(image.id);
    }
    if (option === 'Remove Background') {
      const apiKey = 'r8_cqA8gRrmhMkWcJHzBYYQZorrj1RTbZF3tDUs6';
      const blob = await uriToBlob(image.uri);
      const base64 = await blobToBase64(blob);

      const getUrl = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${apiKey}`
        },
        body: JSON.stringify({
          version: 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
          input: { image: base64 }
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.error == null && data.status == 'starting') {
            return data.urls.get;
          }
          return null;
        })
        .catch(error => {
          console.error('Error:', error);
          return null;
        });

      if (getUrl) {
        pollUrl(getUrl)
          .then((dataUrl: string | null | undefined) => {
            if (!dataUrl) return;
            const t: PageImageType = {
              ...image,
              uri: dataUrl
            };
            onChange(t);
          })
          .catch(error => console.error('Polling error:', error));
      } else {
        console.log('Error getting url');
      }
    }
    setMenuOpen(false);
  };

  const colors = useThemeColor();

  return (
    <>
      <Animated.View style={animContextStyle}>
        <ContextMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          options={[
            { name: 'Crop', color: colors.primaryText, icon: <CropIcon size={20} color={colors.primaryText} />, alignment: 'center' },
            { name: 'Remove Background', color: colors.primaryText, icon: <CropIcon size={20} color={colors.primaryText} />, alignment: 'center' },
            { name: 'Send To Back', color: colors.primaryText, icon: <CropIcon size={20} color={colors.primaryText} />, alignment: 'center' },
            { name: 'Bring To Front', color: colors.primaryText, icon: <CropIcon size={20} color={colors.primaryText} />, alignment: 'center' },
            { name: 'Delete', color: colors.danger, icon: <TrashIcon size={20} color={colors.danger} />, alignment: 'center' },
          ]}
          selected={''}
          onSelect={handleOptionSelect}
        />
      </Animated.View>
      <GestureDetector gesture={composed}>
        <Animated.View style={animImageStyle}>
          <MaskedView
            style={{ flex: 1, backgroundColor: 'transparent' }}
            maskElement={
              image.shape === 'heart'
                ? <Ionicons name='heart' size={minSize} color='black' />
                : image.shape === 'circle' ? <View style={{ width: minSize, height: minSize, backgroundColor: 'black', borderRadius: image.width }} />
                  : image.shape === 'square' ? <View style={{ width: minSize, height: minSize, backgroundColor: 'black', borderRadius: 0 }} />
                    : <View style={{ width: image.width, height: image.height, backgroundColor: 'black' }}></View>
            }
          >
            <Image
              source={{ uri: image.uri }}
              style={{ width: image.width, height: image.height }}
              resizeMode='cover'
            />
          </MaskedView>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const pollUrl = async (url: string, timeout = 10000, interval = 500): Promise<string | null | undefined> => {
  const startTime = Date.now();
  const apiKey = 'r8_cqA8gRrmhMkWcJHzBYYQZorrj1RTbZF3tDUs6';

  const poll = async (resolve: any, reject: any) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`
      }
    });
    const data = await response.json();

    if (data.status === 'succeeded') {
      resolve(data.output);
    } else if (Date.now() - startTime >= timeout) {
      reject(new Error('Polling timed out'));
    } else {
      setTimeout(() => poll(resolve, reject), interval);
    }
  };

  return new Promise(poll);
};

const TextAlignContainer = ({ align, setAlign }: { align: 'left' | 'center' | 'right', setAlign: (align: 'left' | 'center' | 'right') => void; }) => {
  const colors = useThemeColor();
  if (align === 'left') {
    return (
      <Pressable
        onPress={() => setAlign('center')}
        style={{
          width: 32, height: 32,
          borderRadius: 4,
          alignItems: 'center', justifyContent: 'center'
        }}>
        <AlignLeftIcon size={24} color={colors.primaryText} />
      </Pressable>
    );
  }
  if (align === 'center') {
    return (
      <Pressable
        onPress={() => setAlign('right')}
        style={{
          width: 32, height: 32,
          borderRadius: 4,
          alignItems: 'center', justifyContent: 'center'
        }}>
        <AlignCenterIcon size={24} color={colors.primaryText} />
      </Pressable>
    );
  }
  if (align === 'right') {
    return (
      <Pressable
        onPress={() => setAlign('left')}
        style={{
          width: 32, height: 32,
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <AlignRightIcon size={24} color={colors.primaryText} />
      </Pressable>
    );
  }
};


//TODO
const SvgBackground = ({ bgKey }: { bgKey: string | null | undefined; }) => {
  switch (bgKey) {
    case 'graph':
      return <GraphBackground />;
    case 'grid':
      return <GridBackground />;
    case 'bubble':
      return <BubbleBackground />;
    default:
      return null;
  }
};


const FONTS = [
  'SingleDay',
  'System',
];

type FontStyleContainerProps = {
  font: string,
  setFont: (font: string) => void;
};

const FontStyleContainer = (props: FontStyleContainerProps) => {
  const { font, setFont } = props;
  const colors = useThemeColor();
  return (
    <ScrollView
      horizontal
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{
        gap: 8,
        width: 130,
        height: 40, alignItems: 'center'
      }}
    >
      {font === 'System' ?
        <Pressable
          onPress={() => setFont('SingleDay')}
          style={{
            width: 50,
            height: 28,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            borderCurve: 'continuous',
            backgroundColor: colors.surface3
          }}>
          <Text type='p' style={{ fontFamily: 'System' }} color={colors.primaryText}>Abc</Text>
        </Pressable>
        :
        font === 'SingleDay' ?
          <Pressable
            onPress={() => setFont('System')}
            style={{
              height: 28,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              borderCurve: 'continuous',
              backgroundColor: colors.surface3
            }}>
            <Text type='p' style={{ fontFamily: 'SingleDay' }} color={colors.primaryText}>Abc</Text>
          </Pressable>
          :
          null
      }
    </ScrollView>
  );
};

const MovableText = ({ text, onChange, onFocus, onBringTextToFront, onSendTextToBack, onDelete }: {
  text: PageTextType;
  onChange: (t: PageTextType) => void;
  onFocus: () => void;
  onBringTextToFront: (id: string) => void;
  onSendTextToBack: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const start = useSharedValue({ x: text.x, y: text.y });
  const offset = useSharedValue({ x: text.x, y: text.y });
  const grabberOffset = useSharedValue({ x: text.x, y: text.y });
  const grabberStart = useSharedValue({ x: text.x, y: text.y });
  const textScale = useSharedValue(text.scale);
  const lastScale = useSharedValue(text.scale);
  const fontSize = useSharedValue(text.size);
  const lastRotation = useSharedValue(text.rotate);
  const rotation = useSharedValue(text.rotate);
  const containerSize = useSharedValue({ width: text.width, height: 40 });
  const isSnapped = useSharedValue(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const colors = useThemeColor();

  const rotateGesture = Gesture.Rotation()
    .onStart(() => {
      lastRotation.value = rotation.value;
    })
    .onUpdate((e) => {
      if (e.rotation > -0.04 && e.rotation < 0.04) {
        if (!isSnapped.value) {
          isSnapped.value = true;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        rotation.value = 0;
      } else if (e.rotation < -0.04 || e.rotation > 0.04) {
        isSnapped.value = false;
        rotation.value = lastRotation.value + e.rotation * 180 / Math.PI;
      }
      else {
        rotation.value = lastRotation.value + e.rotation * 180 / Math.PI;
      }
    })
    .onEnd(() => {
      handleSetRotation(rotation.value);
    })
    .runOnJS(true);

  const longPress = Gesture.LongPress()
    .onStart(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setMenuOpen(true);
    })
    .runOnJS(true);


  const pinchGesture = Gesture.Pinch()
    .onStart((ctx) => {
      lastScale.value = textScale.value;
    })
    .onUpdate((e) => {
      const { scale, focalX, focalY, } = e;
      textScale.value = scale * lastScale.value;
    })
    .onEnd(() => {
      handleSetFontSize(fontSize.value);
    })
    .runOnJS(true);

  const dragGesture = Gesture.Pan()
    .onStart((_e) => {
    })
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
      handleSetOffsets(offset.value.x, offset.value.y);
    })
    .runOnJS(true);

  const tapGesture = Gesture.Tap().onEnd(() => {
    onFocus();
  })
    .runOnJS(true);


  // const composed = Gesture.Race(rotateGesture, tapGesture, dragGesture, pinchGesture);
  const composed = Gesture.Simultaneous(
    longPress,
    Gesture.Simultaneous(dragGesture, pinchGesture, rotateGesture)
  );

  const handleSetOffsets = (x: number, y: number) => {
    const t: PageTextType = {
      ...text,
      x,
      y,
    };
    onChange(t);
  };

  const handleSetFontSize = (size: number) => {
    const t: PageTextType = {
      ...text,
      scale: textScale.value
    };
    onChange(t);
  };

  const handleSetRotation = (rotate: number) => {
    const t: PageTextType = {
      ...text,
      rotate
    };
    onChange(t);
  };

  const handleOptionSelect = async (option: string) => {
    if (option === 'Delete') {
      onDelete(text.id);
    }
    if (option === 'Bring To Front') {
      onBringTextToFront(text.id);
    }
    if (option === 'Send To Back') {
      onSendTextToBack(text.id);
    }
    if (option === 'Edit') {
      onFocus();
    }
    setMenuOpen(false);
  };

  const animContextStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      zIndex: 100000,

      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y }
      ],
    };
  });

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: textScale.value },
        { rotate: `${rotation.value}deg` }
      ],
      backgroundColor: text.backgroundColor ?? 'transparent',
      flexShrink: 1,
      paddingVertical: 6,
      paddingHorizontal: 10,
      zIndex: text.z,
      position: 'absolute',
      textAlign: text.align,
      color: text.color,
    };
  });

  return (
    <>
      <Animated.View style={animContextStyle}>
        <ContextMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          options={[
            { name: 'Send To Back', color: colors.primaryText, icon: <CropIcon size={20} color={colors.primaryText} />, alignment: 'center' },
            { name: 'Bring To Front', color: colors.primaryText, icon: <CropIcon size={20} color={colors.primaryText} />, alignment: 'center' },
            { name: 'Edit', color: colors.primaryText, icon: <CropIcon size={20} color={colors.primaryText} />, alignment: 'center' },
            { name: 'Delete', color: colors.danger, icon: <TrashIcon size={20} color={colors.danger} />, alignment: 'center' },
          ]}
          selected={''}
          onSelect={handleOptionSelect}
        />
      </Animated.View>
      <GestureDetector gesture={composed}>
        <Animated.View style={animStyle}>
          <Text
            style={{
              fontFamily: text.font,
              fontSize: text.size,
              textAlign: text.align,
              color: text.color,
              flexShrink: 1
            }}
          >
            {text.body}
          </Text>
        </Animated.View>
      </GestureDetector>
      {/* <GestureDetector gesture={grabGesture}>
        <Animated.View style={animGrabberStyle} />
      </GestureDetector> */}
    </>
  );
};

type PencilButtonProps = {
  onPress?: () => void;
};

const PencilButton = (props: PencilButtonProps) => {
  const { onPress } = props;
  const colors = useThemeColor();
  return (
    <Pressable style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={onPress}>
      <BrushIcon size={24} color={colors.primaryText} />
    </Pressable>
  );
};

type BackgroundButtonProps = {
  onPress: () => void;
};
const BackgroundButton = (props: BackgroundButtonProps) => {
  const { onPress } = props;
  const colors = useThemeColor();
  return (
    <Pressable style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={onPress}>
      <BackgroundIcon size={24} color={colors.primaryText} />
    </Pressable>
  );
};

type StickerButtonProps = {
  onPress: () => void;
};

const StickerButton = (props: StickerButtonProps) => {
  const { onPress } = props;
  const colors = useThemeColor();
  return (
    <Pressable style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={onPress}>
      <StickerIcon size={24} color={colors.primaryText} />
    </Pressable>
  );
};

type ImagePickerButtonProps = {
  onPress: () => void;
};

const ImagePickerButton = (props: ImagePickerButtonProps) => {
  const { onPress } = props;
  const colors = useThemeColor();
  return (
    <Pressable style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={onPress}>
      {/* <Ionicons name="images-outline" size={24} color={colors.primaryText} /> */}
      <ImageIcon size={24} color={colors.primaryText} />
    </Pressable>
  );
};

type TextButtonProps = {
  onPress: () => void;
};

const TextButton = (props: TextButtonProps) => {
  const { onPress } = props;
  const colors = useThemeColor();
  return (
    <Pressable style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={onPress}>
      {/* <Ionicons name='text' size={24} color={colors.primaryText} /> */}
      <TextIcon size={24} color={colors.primaryText} />
    </Pressable>
  );
};

type UndoProps = {
  onPress?: () => void;
  hasBackAction: boolean;
};

const UndoButton = (props: UndoProps) => {
  const { onPress, hasBackAction } = props;
  const colors = useThemeColor();
  return (
    <Pressable style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} disabled={!hasBackAction} onPress={onPress}>
      <UndoIcon size={24} color={hasBackAction ? colors.primaryText : colors.secondaryText} />
    </Pressable>
  );
};

export default NewPage;

const styles = StyleSheet.create({});