import { ActionSheetIOS, Alert, Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View, Image, Modal } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
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
import { generateUUID } from '../Utils/utilFns';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { TapGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/tapGesture';
import ColorPicker, { HueSlider, Panel1, Preview } from 'reanimated-color-picker';
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
  const activeDiaryId = defaultStore(state => state.activeDiaryId);
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
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [camPermission, requestPermission] = useCameraPermissions();
  const [mediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [stickerModalOpen, setStickerModalOpen] = useState(false);
  const [backgroundPickerModalOpen, setBackgroundPickerModalOpen] = useState(false);

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


  const handleUndo = () => {
  };

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
    if (focusedTextId) {
      const t = texts.find(t => t.id === focusedTextId) ?? null;
      if (!t) return;
      const newT = {
        ...t,
        color,
        font,
        body: newText,
        align
      };
      handleUpdateText(newT);
      setFocusedTextId(null);
      setOpenInput(false);
      setNewText('');
      return;
    }
    const t: PageTextType = {
      id: generateUUID(),
      body: newText,
      color: color,
      font: font,
      align,
      x: 20,
      y: height / 4,
      z: 3,
      rotate: 0,
      size: 22,
      scale: 1
    };
    setTexts([...texts, t]);
    setOpenInput(false);
    setFocusedTextId(null);
    setNewText('');
  };

  const handleInputFocus = () => {
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
      });
      if (result.canceled) {
        return;
      }

      Image.getSize(result.assets[0].uri, (w, h) => {
        const aspectRatio = w / h;
        const newWidth = 200;
        const newHeight = newWidth / aspectRatio;
        const i: PageImageType = {
          id: generateUUID(),
          uri: result.assets[0].uri,
          x: width / 4,
          y: height / 4,
          z: 3,
          rotate: 0,
          scale: 1,
          shape: 'inherit',
          width: newWidth,
          height: newHeight
        };
        setImages([...images, i]);
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
        return t;
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
    setOpenInput(true);
  };

  const handleImageFocus = (id: string) => {
  };

  const handleUpdateImage = (i: PageImageType) => {
    setImages(images.map(img => {
      if (img.id === i.id) {
        return i;
      }
      return img;
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    let diaries = await AsyncStorage.getItem('diaries');
    const parsed = JSON.parse(diaries ?? '[]');
    const diary = parsed.find((d: Diary) => d.id === activeDiaryId);

    let pageNum = 0;
    // let diary

    // const page: Page = {
    //   id: generateUUID(),
    //   number: diary.pages.length,
    //   title: '',
    //   content: '',
    //   diary_id: '',
    //   images: images,
    //   texts: texts,
    //   stickers: [],
    //   creation_date: new Date().toISOString()
    // };
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
      {overlaysShown && <Header
        style={{ backgroundColor: colors.surface1 }}
        headerLeft={<BackButton navigate />}
        headerRight={<DoneButton onPress={handleSave} />}
      />
      }
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
              placeholderTextColor={colors.secondaryText}
              style={{
                paddingHorizontal: 16,
                minHeight: 36,
                fontFamily: font,
                lineHeight: 22,
                fontSize: 22,
                textAlign: align,
                paddingBottom: 10,
                color: color
              }}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
            />
            <View style={{ height: 40, gap: 10, width: '100%', paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center' }}>
              {colorPickerOpen && <View style={{
                position: 'absolute',
                zIndex: 1000,
                left: 20,
                bottom: 150,
                width: 200,
                height: 200,
              }}>
                <ColorPicker style={{ gap: 16 }} onChange={(val) => setColor(val.hex)}>
                  <Panel1 style={{ borderRadius: 12 }} />
                  <HueSlider />
                </ColorPicker>
              </View>
              }
              <Pressable
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  backgroundColor: color
                }}
                onPress={() => setColorPickerOpen(o => !o)}
              />
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
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <KeyboardIcon size={24} color={colors.primaryText} />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      }
      <View style={{ flex: 1, zIndex: 1, overflow: 'hidden', backgroundColor: colors.surface2 }}>
        {background && background.type === 'image' ? <Image style={{ position: 'absolute', zIndex: 0, left: 0, top: 0, right: 0, bottom: 0 }} source={{ uri: background.uri }} /> : <SvgBackground bgKey={background?.bgKey} />}
        {texts?.map(t => t.id !== focusedTextId && (
          <MovableText key={t.id} text={t}
            onChange={handleUpdateText}
            onFocus={() => handleTextFocus(t.id)}
          />
        ))}
        {images?.map(img => (
          <MovableImage key={img.id} image={img} onChange={handleUpdateImage} onFocus={handleImageFocus} />
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
};

const MovableImage = (props: MovableImageProps) => {
  const { image, onChange, onFocus } = props;
  const lastOffset = useSharedValue({ x: image.x, y: image.y });
  const offset = useSharedValue({ x: image.x, y: image.y });
  const lastScale = useSharedValue(image.scale);
  const imageScale = useSharedValue(image.scale);
  const lastRotation = useSharedValue(image.rotate);
  const rotation = useSharedValue(image.rotate);
  const minSize = Math.min(image.width, image.height);
  const colors = useThemeColor();

  const animImageStyle = useAnimatedStyle(() => {
    return {
      width: image.width,
      height: image.height,
      position: 'absolute',
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: imageScale.value },
        { rotate: `${rotation.value}deg` }
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

  const tapGesture = Gesture.Tap().onEnd(() => {
    // onFocus(image.id);
    if (image.shape === 'inherit') handleSetImageShape('square');
    if (image.shape === 'square') handleSetImageShape('circle');
    if (image.shape === 'circle') handleSetImageShape('heart');
    if (image.shape === 'heart') handleSetImageShape('inherit');
  }).runOnJS(true);

  const handleSetImageShape = (shape: ImageShape) => {
    console.log('setting shape: ', shape);
    const t: PageImageType = {
      ...image,
      shape
    };
    onChange(t);
  };

  // const composed = Gesture.Race(rotateGesture, tapGesture, dragGesture, pinchGesture);
  const composed = Gesture.Simultaneous(
    tapGesture,
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



  return (
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
  );
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

const MovableText = ({ text, onChange, onFocus }: {
  text: PageTextType;
  onChange: (t: PageTextType) => void;
  onFocus: () => void;
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
  const containerSize = useSharedValue({ width: 0, height: 40 });

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
    tapGesture,
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

  const colors = useThemeColor();

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: textScale.value },
        { rotate: `${rotation.value}deg` }
      ],
      borderWidth: 1,
      borderColor: colors.secondaryText,
      width: containerSize.value.width,
      height: containerSize.value.height,
      paddingVertical: 10,
      paddingHorizontal: 15,
      zIndex: text.z,
      textAlign: text.align,
      fontSize: text.size,
      color: text.color,
    };
  });

  const animGrabberStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x + (containerSize.value.width * textScale.value) },
        { translateY: offset.value.y + (containerSize.value.height / 2 * textScale.value) / 2 - 24 },
      ],
      zIndex: 1000,
      width: 20,
      height: 20,
      backgroundColor: 'pink',
      borderRadius: 20
    };
  });

  const grabGesture = Gesture.Pan()
    .onUpdate((e) => {
      grabberOffset.value = {
        x: e.translationX + grabberStart.value.x,
        y: e.translationY + grabberStart.value.y,
      };
      containerSize.value = {
        width: grabberOffset.value.x - offset.value.x,
        height: grabberOffset.value.y - offset.value.y,
      };
    })
    .onEnd(() => {
      grabberStart.value = {
        x: grabberOffset.value.x,
        y: grabberOffset.value.y,
      };
    });

  return (
    <>
      <GestureDetector gesture={composed}>
        <Animated.Text
          onLayout={(e) => {
            containerSize.value = {
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height
            };
          }}
          style={[animStyle, { fontFamily: text.font }]}
        >
          {text.body}
        </Animated.Text>
      </GestureDetector>
      <GestureDetector gesture={grabGesture}>
        <Animated.View style={animGrabberStyle} />
      </GestureDetector>
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