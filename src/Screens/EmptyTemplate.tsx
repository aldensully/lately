import { ActionSheetIOS, Alert, Dimensions, ScrollView, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, TextInput, View, Image, Modal, Platform, ActivityIndicator, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import Location from 'expo-location';
import MaskedView from '@react-native-masked-view/masked-view';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Diary, ImageShape, LocationTag, Page, PageImageType, PageStickerType, PageTextType, ScreenProps, WeatherTag } from '../types';
import { Button, Container, Text, useThemeColor } from '../Theme/Themed';
import Header from '../Components/Header';
import BackButton from '../Components/BackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UndoIcon from '../../assets/icons/UndoIcon';
import StickerIcon from '../../assets/icons/StickerIcon';
import BackgroundIcon from '../../assets/icons/BackgroundIcon';
import TextIcon from '../../assets/icons/TextIcon';
import ImageIcon from '../../assets/icons/ImageIcon';
import { apiCreatePage, blobToBase64, generateUUID, getActiveDiary, uploadMedia, uriToBlob } from '../Utils/utilFns';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import AlignLeftIcon from '../../assets/icons/AlignLeftIcon';
import AlignCenterIcon from '../../assets/icons/AlignCenterIcon';
import AlignRightIcon from '../../assets/icons/AlignRightIcon';
import { useCameraPermissions } from 'expo-image-picker';
import CloseButton from '../Components/CloseButton';
import GraphBackground from '../../assets/svg-backgrounds/GraphBackground';
import GridBackground from '../../assets/svg-backgrounds/GridBackground';
import BubbleBackground from '../../assets/svg-backgrounds/BubbleBackground';
import defaultStore from '../Stores/defaultStore';
import TextColorIcon from '../../assets/icons/TextColorIcon';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { captureRef } from 'react-native-view-shot';
import { BG_REMOVAL_API_KEY, WEATHER_API_KEY } from '../Utils/Constants';
import LocationIcon from '../../assets/icons/LocationIcon';
import WeatherIcon from '../../assets/icons/WeatherIcon';
import MusicIcon from '../../assets/icons/MusicIcon';
import AudioIcon from '../../assets/icons/AudioIcon';
import MoodIcon from '../../assets/icons/MoodIcon';
import BottomSheet from '../Components/BottomSheet';
import ArrowDownIcon from '../../assets/icons/ArrowDownIcon';
import DoubleChevronLeft from '../../assets/icons/DoubleChevronLeft';
import KeyboardIcon from '../../assets/icons/KeyboardIcon';
import BoldIcon from '../../assets/icons/BoldIcon';
import CloseIcon from '../../assets/icons/CloseIcon';
import PlusCircleIcon from '../../assets/icons/PlusCircleIcon';
import PlusIcon from '../../assets/icons/PlusIcon';
import TextStyleIcon from '../../assets/icons/TextStyleIcon';
import { useNavigation } from '@react-navigation/native';


const DoneButton = ({ onPress }: { onPress: () => void; }) => {
  const colors = useThemeColor();
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 36,
        marginBottom: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderRadius: 40,
        borderCurve: 'continuous',
        backgroundColor: colors.primary,
        marginRight: 16
      }}>
      <Text type='h3' color={colors.primaryButtonText}>Save</Text>
    </Pressable>
  );
};


const MAX_SIZE = 500;
const BOTTOM_CONTAINER_HEIGHT = 50;
const { width, height } = Dimensions.get('window');

const BACKGROUND_COLORS = ['#F4F6F0', '#000000', '#FFFFFF', '#EDEDED', '#FF0000', '#FF7A00', '#FAF11D', '#37D300', '#00A3FF', '#9E00FF', '#FF00E6',
  '#FFABAB', '#FFCDA0', '#FFFCAD', '#D1EEC7', '#B6DBF0', '#DBBFEC', '#FFCBFA', '#'];

const TEXT_COLORS = ['#000000', '#FFFFFF', '#EDEDED', '#E5E7D6', '#FF0000', '#FF7A00', '#FAF11D', '#37D300', '#00A3FF', '#9E00FF', '#FF00E6',
  '#FFABAB', '#FFCDA0', '#FFFCAD', '#D1EEC7', '#B6DBF0', '#DBBFEC', '#FFCBFA'];

const TEXT_SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];

type PageElement = (PageTextType & {
  type: 'text';
  ref: React.RefObject<TextInput>;
}) | (PageImageType & { type: 'image'; });

const EmptyTemplate = () => {
  const { top, bottom } = useSafeAreaInsets();
  const canvasHeight = height - (BOTTOM_CONTAINER_HEIGHT + bottom + top + 45 + 20);
  const colors = useThemeColor();
  const [texts, setTexts] = useState<PageTextType[]>([]);
  const [images, setImages] = useState<PageImageType[]>([]);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [newText, setNewText] = useState('');
  const [focusedText, setFocusedText] = useState<PageTextType | null>(null);
  const [cropImage, setCropImage] = useState<PageImageType | null>(null);
  const navigation = useNavigation();
  const titleInputRef = useRef<TextInput>(null);
  const [mediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [stickerModalOpen, setStickerModalOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { data: activeDiary, isLoading } = useQuery({ queryKey: ['activeDiary'], queryFn: () => user && getActiveDiary(user.id) });
  const queryClient = useQueryClient();
  const user = defaultStore(state => state.user);
  const imageRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [backgroundColorPickerOpen, setBackgroundColorPickerOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const taskBarX = useSharedValue(0);
  const [weather, setWeather] = useState<WeatherTag | null>(null);
  const [location, setLocation] = useState<LocationTag | null>(null);
  const [elements, setElements] = useState<PageElement[]>([
    {
      id: generateUUID(),
      type: 'text',
      body: '',
      color: colors.primaryText,
      font: 'System',
      placeholder: 'Title',
      align: 'left',
      weight: 'normal',
      x: 0,
      y: 0,
      z: 1,
      rotate: 0,
      width: 100,
      height: 40,
      size: 26,
      backgroundColor: null,
      ref: React.createRef<TextInput>(),
      scale: 1
    },
    {
      id: generateUUID(),
      type: 'text',
      body: '',
      color: colors.primaryText,
      font: 'System',
      align: 'left',
      weight: 'normal',
      placeholder: 'Write...',
      x: 0,
      y: 0,
      z: 1,
      rotate: 0,
      width: 100,
      height: 30,
      size: 18,
      backgroundColor: null,
      ref: React.createRef<TextInput>(),
      scale: 1
    }]);
  const colorSize = (width - 30 - (10 * 6)) / 6;

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);


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


  const animatedTaskBar = useAnimatedStyle(() => {
    return {
      width: width,
      alignItems: 'center',
      // transform: [
      //   {
      //     translateX: taskBarX.value
      //   }
      // ]
    };
  });



  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    if (!activeDiary) {
      setLoading(false);
      Alert.alert("There was an error loading your diary!");
      return;
    }

    // const aspectRatio = width / canvasHeight;
    // const pageWidth = 300;
    // const pageHeight = pageWidth / aspectRatio;

    const pageCount = activeDiary.pages.length + 1;

    const [bigImg, smallImg] = await screenshotPreview();
    const imageUploadPromises = images.map(i => uploadMedia(i.id, i.uri));
    if (smallImg != null) imageUploadPromises.push(uploadMedia(generateUUID(), smallImg));
    if (bigImg != null) imageUploadPromises.push(uploadMedia(generateUUID(), bigImg));

    // Performing image uploads and screenshot capture concurrently
    const imageUploads = await Promise.allSettled(imageUploadPromises);

    const imgUrls = imageUploads.map(i => {
      if (i.status === 'rejected') {
        return '';
      }
      if (i.status === 'fulfilled' && i.value) {
        return i.value;
      }
      return '';
    });

    if (imgUrls.includes('')) {
      setLoading(false);
      Alert.alert("There was an error saving your page, please try again.");
      return;
    }

    const newImages: PageImageType[] = [];

    images.forEach((i, index) => {
      if (imgUrls[index] && imgUrls[index] != null) {
        newImages.push({
          ...i,
          uri: imgUrls[index]
        });
      }
    });

    const small_preview_url = imgUrls[imgUrls.length - 2] ?? null;
    const big_preview_url = imgUrls[imgUrls.length - 1] ?? null;

    const page: Page = {
      id: generateUUID(),
      count: pageCount,
      title: new Date().toISOString().split('T')[0],
      content: '',
      diary_id: activeDiary.id,
      images: newImages,
      texts: texts,
      small_preview_url: small_preview_url,
      big_preview_url: big_preview_url,
      stickers: [],
      background_color: backgroundColor,
      background_image_url: backgroundImage,
      template: 'defaultWritten',
      creation_date: new Date().toISOString()
    };

    createPageMutation.mutate(page);

    navigation.goBack();
  };

  const screenshotPreview = async (): Promise<[bigSize: string | null, smallSize: string | null]> => {
    try {
      const localUri = await captureRef(imageRef, {
        height: canvasHeight,
        width: width,
        format: 'jpg'
      });
      const bigImg = await manipulateAsync(
        localUri,
        [
          { resize: { height: 1000 } },
        ],
        { format: SaveFormat.JPEG, compress: 0.8 },
      );
      const smallImg = await manipulateAsync(
        localUri,
        [
          { resize: { height: 400 } },
        ],
        { format: SaveFormat.JPEG, compress: 0.8 },
      );
      return [bigImg.uri, smallImg.uri];
    } catch (e) {
      console.log(e);
      return [null, null];
    }
  };

  const handleBackPress = () => {
    if (texts.length === 0 && images.length === 0) {
      navigation.goBack();
      return;
    }
    Alert.alert('Save Page?', 'If you go back now, your changes will not be saved.', [
      {
        text: 'Save Changes',
        onPress: () => { },
        style: 'default'
      },
      {
        text: 'Keep Editing',
        style: 'default'
      },
      {
        text: "Don't Save",
        onPress: () => navigation.goBack(),
        style: 'destructive'
      },
    ]);
  };

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', (k) => {
      setKeyboardFocused(true);
      taskBarX.value = -width;
      setShowTextStyles(true);
      animFontStyleContainerOpacity.value = withTiming(1, { duration: 200 });
    });
    Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardFocused(false);
      setShowTextStyles(false);
      taskBarX.value = 0;
      animFontStyleContainerOpacity.value = withTiming(1);
    });
    return () => {
      Keyboard.removeAllListeners('keyboardWillShow');
      Keyboard.removeAllListeners('keyboardWillHide');
    };
  }, []);

  const handleImagePickerButtonPress = async () => {
    if (!mediaPermission) return;
    if (!mediaPermission.granted) {
      const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!res.granted) {
        Alert.alert('Permission required', 'Please allow media access to add images to the page.');
        return;
      }
    }
    try {
      if (keyboardFocused) Keyboard.dismiss();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false
      });
      if (result.canceled) {
        return;
      }

      const imageWidth = result.assets[0].width;
      const imageHeight = result.assets[0].height;

      let newWidth, newHeight, scaleFactor = 0;
      const MAX_SIZE_BG = 1000;

      if (imageWidth > imageHeight) {
        scaleFactor = MAX_SIZE_BG / imageWidth;
        newWidth = MAX_SIZE_BG;
        newHeight = imageHeight * scaleFactor;
      } else {
        scaleFactor = MAX_SIZE_BG / imageHeight;
        newHeight = MAX_SIZE_BG;
        newWidth = imageWidth * scaleFactor;
      }

      const manipResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { format: SaveFormat.JPEG }
      ).catch(e => {
        console.log(e);
        return { uri: null };
      });

      if (!manipResult.uri) return;

      setBackgroundImage(manipResult.uri);

    } catch (e) {
      console.log(e);
      Alert.alert('Something went wrong, please try again.');
    }
  };

  const openImage = async () => {
    try {
      if (keyboardFocused) Keyboard.dismiss();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false
      });
      if (result.canceled) {
        return;
      }

      const imageWidth = result.assets[0].width;
      const imageHeight = result.assets[0].height;

      let newWidth, newHeight, scaleFactor = 0;

      if (imageWidth > imageHeight) {
        scaleFactor = MAX_SIZE / imageWidth;
        newWidth = MAX_SIZE;
        newHeight = imageHeight * scaleFactor;
      } else {
        scaleFactor = MAX_SIZE / imageHeight;
        newHeight = MAX_SIZE;
        newWidth = imageWidth * scaleFactor;
      }

      const manipResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        { format: SaveFormat.JPEG }
      ).catch(e => {
        console.log(e);
        return { uri: null };
      });

      if (!manipResult.uri) return;

      Image.getSize(manipResult.uri, (w, h) => {
        const i: PageImageType = {
          id: generateUUID(),
          uri: manipResult.uri,
          x: 0,
          y: 0,
          z: 0,
          rotate: 0,
          scale: 1,
          shape: 'inherit',
          width: w / 2,
          height: h / 2
        };

        const focusedIndex = elements.findIndex(e => e.id === currentFocusedElement?.id);

        if (focusedIndex === -1) {
          setElements(e => [...e, { ...i, type: 'image' }]);
          return;
        }

        const newElements = [...elements];
        newElements.splice(focusedIndex + 1, 0, { ...i, type: 'image' },
          {
            id: generateUUID(),
            type: 'text',
            body: '',
            color: colors.primaryText,
            font: 'SingleDay',
            align: 'left',
            placeholder: 'Write...',
            weight: 'normal',
            x: 0,
            y: 0,
            z: 1,
            rotate: 0,
            width: 100,
            height: 30,
            size: 18,
            backgroundColor: null,
            scale: 1,
            ref: React.createRef<TextInput>()
          }
        );
        setElements(newElements);
      });

    } catch (e) {
      console.log(e);
      Alert.alert('Something went wrong, please try again.');
    }
  };


  const handleBackgroundPress = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Background Color', 'Background Image', 'Remove Background'],
      cancelButtonIndex: 0,
    }, (buttonIndex) => {
      if (buttonIndex === 1) {
        setBackgroundColorPickerOpen(true);
      }
      if (buttonIndex === 2) {
        handleImagePickerButtonPress();
      }
      if (buttonIndex === 3) {
        setBackgroundColor('#ffffff');
        setBackgroundImage(null);
      }
    });
  };

  function formatWeatherData(data: any) {
    const {
      main: { temp },
      weather: [details],
      name,
    } = data;

    const { main: weatherMain, description } = details;
    const tempInFahrenheit = ((temp - 273.15) * 9) / 5 + 32;
    setWeather({
      tempurature: tempInFahrenheit,
      description,
      main: weatherMain
    });
  }

  async function getLocationCoords() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('You must enable location services to use weather!');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  }

  async function getAndSetLocation() {
    let location = await Location.getCurrentPositionAsync({});
    const locationName = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      name: locationName[0].district + ', ' + locationName[0].region
    });
  }

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('You must enable location services to use this feature');
      return null;
    }
    getAndSetLocation();
  };

  const fetchWeather = async () => {
    const coords = await getLocationCoords();
    if (!coords) {
      Alert.alert('Unable to fetch weather data right now');
      return;
    }
    const { latitude, longitude } = coords;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      formatWeatherData(data);
    } else {
      Alert.alert('Unable to fetch weather data right now');
    }
  };


  const handleStickerButtonPress = () => {
    setStickerModalOpen(true);
  };

  const handleImageLongPress = (image: PageElement) => {
    if (image.type !== 'image') return;
    const isFullSize = image.width === (width - 30) / 2;
    const options = ['Cancel', 'Crop', 'Remove Background', 'Delete'];
    if (isFullSize) options.splice(2, 0, 'Half Size');
    else options.splice(2, 0, 'Full Size');

    console.log(image.width);

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: 4,
          cancelButtonIndex: 0
        },
        async buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            setCropImage(image);
          } else if (buttonIndex === 2) {
            const newWidth = isFullSize ? width / 2 : width;
            const newHeight = isFullSize ? image.height / 2 : image.height;
            const newElements = elements.map(t => {
              if (t.id === image.id) {
                return {
                  ...t,
                  width: newWidth,
                  height: newHeight
                };
              }
              return t;
            });
            setElements(newElements);
          } else if (buttonIndex === 3) {
            const blob = await uriToBlob(image.uri);
            const base64 = await blobToBase64(blob);

            const getUrl = await fetch('https://api.replicate.com/v1/predictions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${BG_REMOVAL_API_KEY}`
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
                  if (!dataUrl) {
                    console.log("NO DATA URL");
                    return;
                  };
                  const t: PageImageType = {
                    ...image,
                    uri: dataUrl
                  };
                  setElements(e => e.map(e => {
                    if (e.id === image.id) {
                      return { ...t, type: 'image' };
                    }
                    return e;
                  }));
                })
                .catch(error => console.error('Polling error:', error));
            } else {
              console.log('Error getting url');
            }
          } else if (buttonIndex === 4) {
            setElements(e => {
              return e.filter(e => e.id !== image.id);
            });
          }
        },
      );
    }
    else {
      //handle android
    }
  };

  const handleSetWeight = (weight: 'normal' | 'bold') => {
    if (!focusedText) return;
    const newElements = elements.map(t => {
      if (t.id === focusedText.id) {
        return { ...t, weight };
      }
      return t;
    });
    setElements(newElements);
  };

  const handleSetAlign = (align: 'left' | 'center' | 'right') => {
    if (!focusedText) return;
    const newElements = elements.map(t => {
      if (t.id === focusedText.id) {
        return { ...t, align };
      }
      return t;
    });
    setElements(newElements);
  };

  const handleSetFont = (font: string) => {
    if (!focusedText) return;
    const newElements = elements.map(t => {
      if (t.id === focusedText.id) {
        return { ...t, font };
      }
      return t;
    });
    setElements(newElements);
  };

  const handleSetSize = (size: number) => {
    if (!focusedText) return;
    const newElements = elements.map(t => {
      if (t.id === focusedText.id) {
        return { ...t, size };
      }
      return t;
    });
    setElements(newElements);
  };



  const handleFinishCrop = (img: PageImageType) => {
    setElements(e => e.map(e => {
      if (e.id === cropImage?.id) {
        return {
          ...e,
          uri: img.uri,
          width: img.width,
          height: img.height
        };
      }
      return e;
    }));
    setCropImage(null);
  };

  const addNewText = () => {
    const inputRef = React.createRef<TextInput>();
    setElements(e => [
      ...e,
      {
        id: generateUUID(),
        type: 'text',
        body: '',
        color: colors.primaryText,
        font: 'System',
        align: 'left',
        weight: 'normal',
        x: 0,
        y: 0,
        z: 1,
        placeholder: 'Write...',
        rotate: 0,
        width: 100,
        height: 30,
        size: 18,
        backgroundColor: null,
        scale: 1,
        ref: inputRef
      }
    ]);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const [lastKeyPress, setLastKeyPress] = useState({ key: '', time: 0 });

  const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>, id: string) => {
    const key = event.nativeEvent.key;
    const currentTime = new Date().getTime();

    const element = elements.find(e => e.id === id);
    if (!element || element.type === 'image') return;

    if (key === 'Backspace' && currentTime - lastKeyPress.time < 300 && element.body.length == 0) { // 300ms threshold for double press
      // Double backspace detected,remove text input from elements list
      const elms = elements.filter(e => e.id !== id);
      const inputsLeft = elms.filter(e => e.type === 'text');
      if (inputsLeft.length == 0) {
        return;
      } else {
        const lastInput = inputsLeft[inputsLeft.length - 1];
        if (lastInput.type === 'text') lastInput.ref.current?.focus();
      }
      setElements(elms);
    }
    setLastKeyPress({ key, time: currentTime });
  };

  const currentFocusedElement = useMemo(() => {
    if (!focusedText || elements.length == 0) return null;
    const el = elements.find(e => e.id === focusedText.id && e.type === 'text');
    if (el && el.type === 'text') return el;
  }, [elements, focusedText?.id]);

  const [textColorPickerOpen, setTextColorPickerOpen] = useState(false);
  const [textBgColorPickerOpen, setTextBgColorPickerOpen] = useState(false);
  const animFontStyleContainerOpacity = useSharedValue(1);
  const [showTextStyles, setShowTextStyles] = useState(false);
  const animFontStyleContainer = useAnimatedStyle(() => {
    return {
      height: 45,
      flexDirection: 'row',
      position: 'absolute',
      zIndex: 1000,
      left: 0,
      bottom: 0,
      alignItems: 'center',
      backgroundColor: '#E8E8E8',
      width: width,
      justifyContent: 'flex-start',
      gap: 8,
      opacity: animFontStyleContainerOpacity.value
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      <Header
        style={{ zIndex: 1000 }}
        headerLeft={<BackButton style={{ width: 36, height: 36, borderRadius: 36, backgroundColor: backgroundColor, marginBottom: 6, marginLeft: 12 }} onPress={handleBackPress} />}
        headerRight={<DoneButton onPress={handleSave} />}
      />
      <BottomSheet
        height={320}
        showBackDrop={false}
        showHeader={true}
        backgroundColor={colors.surface1}
        title='Background Color'
        open={backgroundColorPickerOpen}
        onClose={() => setBackgroundColorPickerOpen(false)}
      >
        <View style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 16,
          justifyContent: 'space-evenly',
          paddingHorizontal: 15,
          rowGap: 10
        }}>
          {BACKGROUND_COLORS.map(c => (
            <Pressable
              onPress={() => setBackgroundColor(c)}
              style={{
                width: colorSize,
                height: colorSize,
                backgroundColor: c,
                borderRadius: 8,
                borderCurve: 'continuous'
              }} key={c} />
          ))}
        </View>
      </BottomSheet>
      <CropModal
        image={cropImage}
        onFinish={handleFinishCrop}
        onClose={() => setCropImage(null)}
      />
      <StickerModal
        open={stickerModalOpen}
        onClose={() => setStickerModalOpen(false)}
      />
      {backgroundImage && <View
        style={{ position: 'absolute', zIndex: 0, left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#000000' }}
      >
        <Image
          resizeMode={'cover'}
          style={{ opacity: 0.75, width: '100%', height: '100%' }}
          source={{ uri: backgroundImage }}
        />
      </View>
      }
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        ref={imageRef}
        collapsable={false}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingHorizontal: 7,
            paddingBottom: 20
          }}
        >
          {elements.map((e, i) => (
            e.type === 'text' ?
              <TextInput
                key={e.id}
                multiline={true}
                scrollEnabled={false}
                value={e.body}
                onFocus={() => setFocusedText(e)}
                ref={e.ref}
                onKeyPress={(key) => handleKeyPress(key, e.id)}
                onChangeText={(val) => {
                  const newT: PageElement[] = elements.map(t => {
                    if (t.id === e.id && t.type === 'text') {
                      return {
                        ...t,
                        body: val
                      };
                    }
                    return t;
                  });
                  setElements(newT);
                }}
                style={{
                  fontSize: e.size,
                  fontWeight: e.weight,
                  fontFamily: e.font,
                  marginTop: 15,
                  lineHeight: e.size + 1,
                  paddingHorizontal: 8,
                  textAlign: e.align,
                  width: '100%',
                  color: e.color,
                  backgroundColor: e.backgroundColor ?? 'transparent'
                }}
                placeholder={e.placeholder ?? ''}
                placeholderTextColor={e.color + '88'}
              />
              : e.type === 'image' ?
                <Pressable
                  key={e.id}
                  onLongPress={() => handleImageLongPress(e)}
                  style={{ marginHorizontal: 8, marginTop: 15, borderRadius: 6, overflow: 'hidden', borderCurve: 'continuous', alignSelf: 'flex-start' }}
                >
                  <Pressable
                    onPress={() => {
                      setElements(elms => elms.filter(el => el.id !== e.id));
                    }}
                    style={{ position: 'absolute', zIndex: 100, right: 8, top: 8, borderRadius: 32, height: 26, width: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <CloseIcon size={20} color={colors.primaryText} />
                  </Pressable>
                  <Image
                    style={{
                      width: e.width,
                      height: e.height,
                      backgroundColor: 'transparent',
                    }}
                    source={{ uri: e.uri }}
                  />
                </Pressable>
                : null
          ))}
        </ScrollView>
        <View
          style={{
            width: '100%',
            paddingBottom: keyboardFocused ? 0 : bottom,
            overflow: 'hidden',
            backgroundColor: '#E8E8E8'
          }}>
          {textColorPickerOpen && <ScrollView
            keyboardShouldPersistTaps='always'
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: 50, width: width, backgroundColor: '#E8E8E8' }}
            contentContainerStyle={{ alignItems: 'center', paddingLeft: 15, gap: 10 }}
          >
            {TEXT_COLORS.map(c => (
              <Pressable
                onPress={() => {
                  setElements(e => e.map(e => {
                    if (e.id === currentFocusedElement?.id) {
                      return {
                        ...e,
                        color: c
                      };
                    }
                    return e;
                  }));
                  setTextColorPickerOpen(false);
                }}
                key={c}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 32,
                  backgroundColor: c
                }}
              />
            ))}
          </ScrollView>
          }
          {textBgColorPickerOpen && <ScrollView
            keyboardShouldPersistTaps='always'
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: 50, width: width, backgroundColor: colors.surface3 }}
            contentContainerStyle={{ alignItems: 'center', paddingLeft: 15, gap: 10 }}
          >
            {BACKGROUND_COLORS.map(c => (
              <Pressable
                onPress={() => setElements(e => e.map(e => {
                  if (e.id === currentFocusedElement?.id) {
                    return {
                      ...e,
                      backgroundColor: c
                    };
                  }
                  return e;
                }))}
                key={c}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 32,
                  backgroundColor: c
                }}
              />
            ))}
          </ScrollView>
          }
          <Animated.View
            style={animatedTaskBar}
          >
            <View style={{
              flexDirection: 'row', height: 45, alignItems: 'center', width: width, paddingHorizontal: 15, gap: keyboardFocused ? 8 : 16, justifyContent: keyboardFocused ? 'flex-start' : 'center',
            }}>
              <Pressable
                onPress={addNewText}
                style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
              >
                <PlusIcon size={keyboardFocused ? 26 : 30} color={colors.primaryText} />
              </Pressable>
              <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
              <Pressable
                onPress={openImage}
                style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
              >
                <ImageIcon size={keyboardFocused ? 26 : 30} color={colors.primaryText} backgroundColor='#E8E8E8' />
              </Pressable>
              <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
              <Pressable
                onPress={handleBackgroundPress}
                style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
              >
                <BackgroundIcon size={keyboardFocused ? 26 : 30} color={colors.primaryText} />
              </Pressable>
              {keyboardFocused && (
                <>
                  <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
                  <Pressable
                    onPress={() => {
                      setShowTextStyles(true);
                      animFontStyleContainerOpacity.value = withTiming(1, { duration: 100 });
                    }}
                    style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <TextStyleIcon size={26} color={colors.primaryText} />
                  </Pressable>
                </>
              )}
            </View>
            {showTextStyles && <Animated.View
              style={animFontStyleContainer}
            >
              <Pressable
                onPress={() => {
                  animFontStyleContainerOpacity.value = withTiming(0, { duration: 100 });
                  setTimeout(() => {
                    setShowTextStyles(false);
                  }, 100);
                }}
                style={{
                  width: 30,
                  height: 30,
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                }}
              >
                <DoubleChevronLeft size={20} color={colors.secondaryText} />
              </Pressable>
              <Pressable
                style={{
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                }}
                onPress={() => {
                  setTextBgColorPickerOpen(false);
                  setTextColorPickerOpen(o => !o);
                }}
              >
                <View style={{ width: 24, height: 24, borderRadius: 24, backgroundColor: currentFocusedElement?.color ?? colors.primaryText }} />
              </Pressable>
              <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
              <BoldStyleContainer weight={currentFocusedElement?.weight} setWeight={handleSetWeight} />
              <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
              <TextAlignContainer align={currentFocusedElement?.align} setAlign={handleSetAlign} />
              <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
              <FontStyleContainer font={currentFocusedElement?.font ?? 'SingleDay'} setFont={handleSetFont} />
              <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
              <TextSizeContainer size={currentFocusedElement?.size ?? 18} setSize={handleSetSize} />
            </Animated.View>
            }
          </Animated.View>
          {keyboardFocused && <Pressable
            onPress={() => {
              setKeyboardFocused(false);
              setTextBgColorPickerOpen(false);
              setTextColorPickerOpen(false);
              animFontStyleContainerOpacity.value = 1;
              Keyboard.dismiss();
            }}
            style={{
              position: 'absolute',
              height: 45,
              right: 0,
              bottom: 0,
              paddingRight: 15,
              backgroundColor: '#E8E8E8',
              gap: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
            <KeyboardIcon size={26} color={colors.primaryText} />
          </Pressable>
          }
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};


type TextSizeContainerProps = {
  size: number | undefined;
  setSize: (size: number) => void;
};

const TextSizeContainer = (props: TextSizeContainerProps) => {
  const { size, setSize } = props;
  const colors = useThemeColor();

  if (!size) return null;

  return (
    <Pressable
      onPress={() => setSize(TEXT_SIZES[(TEXT_SIZES.indexOf(size) + 1) % TEXT_SIZES.length])}
      style={{
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
      }}
    >
      <Text type='h3' style={{ fontFamily: 'System' }} color={colors.primaryText}>{size}</Text>
    </Pressable>
  );
};




type BoldStyleContainerProps = {
  weight: 'normal' | 'bold' | undefined;
  setWeight: (weight: 'normal' | 'bold') => void;
};

const BoldStyleContainer = (props: BoldStyleContainerProps) => {
  const { weight, setWeight } = props;
  const colors = useThemeColor();

  return (
    <Pressable
      onPress={() => setWeight(weight === 'bold' ? 'normal' : 'bold')}
      style={{
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        borderCurve: 'continuous',
        backgroundColor: weight === 'bold' ? '#DDD' : 'transparent'
      }}>
        <BoldIcon size={26} color={weight == 'bold' ? colors.primaryText : colors.secondaryText} />
      </View>
    </Pressable>
  );
};

type CropModalProps = {
  onClose: () => void;
  image: PageImageType | null;
  onFinish: (img: PageImageType) => void;
};
const CropModal = (props: CropModalProps) => {
  const { onClose, onFinish, image } = props;
  if (!image) return null;
  const { bottom, top } = useSafeAreaInsets();
  let containerHeight = height - bottom - 32 - 60 - 32 - top - 100;
  let containerWidth = width - 60;
  let scaleFactor = 1;

  const containerAspect = containerWidth / containerHeight;

  const imageAspect = image.width / image.height;

  if (imageAspect > containerAspect) {
    scaleFactor = containerWidth / image.width;
    containerHeight = image.height * scaleFactor;
    // containerWidth = image.width * scaleFactor;
  } else if (imageAspect < containerAspect) {
    scaleFactor = containerHeight / image.height;
    containerWidth = image.width * scaleFactor;
    // containerHeight = image.height * scaleFactor;
  }

  // if (image.width === image.height) {
  //   scaleFactor = containerWidth / image.width;
  //   containerHeight = image.height * scaleFactor;
  // }
  // else if (image.width > image.height) {
  //   scaleFactor = containerWidth / image.width;
  //   containerHeight = image.height * scaleFactor;
  // }
  // else {
  //   scaleFactor = containerHeight / image.height;
  //   containerWidth = image.width * scaleFactor;
  //   console.log(containerWidth, containerHeight, scaleFactor);
  // }


  // const scaleFactor = containerHeight / image.height;
  // const containerWidth = image.width * scaleFactor;
  const cropBaseOffset = useSharedValue({ x: 0, y: 0 });
  const lastCropBaseOffset = useSharedValue({ x: 0, y: 0 });
  const cropOffset = useSharedValue({ x: containerWidth, y: containerHeight });
  const lastCropOffset = useSharedValue({ x: containerWidth, y: containerHeight });
  const cropSize = useSharedValue({ width: containerWidth, height: containerHeight });
  const [showCrop, setShowCrop] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCrop = async () => {
    if (!image) {
      onClose();
      return;
    };

    if (loading) return;
    setLoading(true);

    const newWidth = cropSize.value.width * (1 / scaleFactor);
    const newHeight = cropSize.value.height * (1 / scaleFactor);

    const crop = {
      originX: cropBaseOffset.value.x * (1 / scaleFactor),
      originY: cropBaseOffset.value.y * (1 / scaleFactor),
      width: newWidth,
      height: newHeight
    };

    const manipResult = await manipulateAsync(
      image.uri,
      [{ crop }],
      { format: SaveFormat.JPEG, compress: 1, },
    );

    if (!manipResult.uri) {
      onClose();
      setLoading(false);
      return;
    }

    let newNewWidth = newWidth;
    let newNewHeight = newHeight;
    let newScaleFactor = 1;

    if (newNewWidth > newNewHeight) {
      newScaleFactor = MAX_SIZE / newNewWidth;
    } else {
      newScaleFactor = MAX_SIZE / newHeight;
    }

    const defaultPosX = scaleFactor === 1 ? 20 : (width - newWidth) / 2;
    const defaultPosY = 20;

    const posX = (width - newNewWidth) / 2;
    const posY = (height - 200 - newHeight) / 2;
    const relativeScaleToScreen = (width * 0.7) / newNewWidth;

    const newImage: PageImageType = {
      ...image,
      // scale: relativeScaleToScreen,
      x: posX,
      y: posY,
      uri: manipResult.uri,
      width: newWidth,
      height: newHeight
    };

    onFinish(newImage);
    setLoading(false);
  };

  const cropCornerGesture = Gesture.Pan()
    .onUpdate(e => {
      if (lastCropOffset.value.x + e.translationX < 0 && lastCropOffset.value.y + e.translationY < 0) return;
      if (lastCropOffset.value.x + e.translationX > containerWidth && lastCropOffset.value.y + e.translationY > containerHeight) return;

      let moveX = 0;
      let moveY = 0;

      if (lastCropOffset.value.x + e.translationX >= 0
        && lastCropOffset.value.x + e.translationX <= containerWidth
        && lastCropOffset.value.y + e.translationY >= 0
        && lastCropOffset.value.y + e.translationY <= containerHeight
      ) {
        moveX = e.translationX + lastCropOffset.value.x;
        moveY = e.translationY + lastCropOffset.value.y;
      } else {
        if (lastCropOffset.value.x + e.translationX < 0
          && lastCropOffset.value.y + e.translationY >= 0
          && lastCropOffset.value.y + e.translationY <= containerHeight) {
          moveY = e.translationY + lastCropOffset.value.y;
          moveX = 0;
        }
        else if (lastCropOffset.value.y + e.translationY < 0
          && lastCropOffset.value.x + e.translationX >= 0
          && lastCropOffset.value.x + e.translationX <= containerWidth) {
          moveX = e.translationX + lastCropOffset.value.x;
          moveY = 0;
        } else if (lastCropOffset.value.x + e.translationX > containerWidth
          && lastCropOffset.value.y + e.translationY >= 0
          && lastCropOffset.value.y + e.translationY <= containerHeight) {
          moveY = e.translationY + lastCropOffset.value.y;
          moveX = containerWidth;
        } else if (lastCropOffset.value.y + e.translationY >= containerHeight
          && lastCropOffset.value.x + e.translationX >= 0
          && lastCropOffset.value.x + e.translationX <= containerWidth) {
          moveX = e.translationX + lastCropOffset.value.x;
          moveY = containerHeight;
        } else if (lastCropOffset.value.x + e.translationX >= containerWidth
          && lastCropOffset.value.y + e.translationY >= containerHeight) {
          moveX = containerWidth;
          moveY = containerHeight;
        } else if (lastCropOffset.value.x + e.translationX > containerWidth
          && lastCropOffset.value.y + e.translationY < containerHeight) {
          moveX = containerWidth;
          moveY = 0;
        } else if (lastCropOffset.value.x + e.translationX < containerWidth
          && lastCropOffset.value.y + e.translationY > containerHeight) {
          moveX = 0;
          moveY = containerHeight;
        }
      }

      cropOffset.value = {
        x: moveX,
        y: moveY
      };

      cropSize.value = {
        width: containerWidth - (containerWidth - moveX),
        height: containerHeight - (containerHeight - moveY)
      };

    })
    .onEnd(e => {
      lastCropOffset.value = {
        x: cropOffset.value.x,
        y: cropOffset.value.y
      };
      setShowCrop(true);
    })
    .runOnJS(true);

  const cropDragGesture = Gesture.Pan()
    .onUpdate(e => {

      let moveX = 0;
      let moveY = 0;

      if (lastCropBaseOffset.value.x + e.translationX < 0 && lastCropBaseOffset.value.y + e.translationY < 0) return;
      if (lastCropBaseOffset.value.x + e.translationX > containerWidth && lastCropBaseOffset.value.y + e.translationY > containerHeight) return;

      if (lastCropBaseOffset.value.x + e.translationX + cropSize.value.width >= 0
        && lastCropBaseOffset.value.x + e.translationX + cropSize.value.width <= containerWidth
        && lastCropBaseOffset.value.y + e.translationY + cropSize.value.height >= 0
        && lastCropBaseOffset.value.y + e.translationY + cropSize.value.height <= containerHeight
      ) {
        moveX = e.translationX + lastCropBaseOffset.value.x;
        moveY = e.translationY + lastCropBaseOffset.value.y;
      } else {
        if (lastCropBaseOffset.value.x + e.translationX < 0
          && lastCropBaseOffset.value.y + e.translationY >= 0
          && lastCropBaseOffset.value.y + e.translationY + cropSize.value.height <= containerHeight) {
          moveY = e.translationY + lastCropBaseOffset.value.y;
          moveX = 0;
        }
        else if (lastCropBaseOffset.value.y + e.translationY < 0
          && lastCropBaseOffset.value.x + e.translationX >= 0
          && lastCropBaseOffset.value.x + e.translationX + cropSize.value.width <= containerWidth) {
          moveX = e.translationX + lastCropBaseOffset.value.x;
          moveY = 0;
        }
        else if (lastCropBaseOffset.value.x + e.translationX + cropSize.value.width > containerWidth
          && lastCropBaseOffset.value.y + e.translationY >= 0
          && lastCropBaseOffset.value.y + e.translationY + cropSize.value.height <= containerHeight) {
          moveY = e.translationY + lastCropBaseOffset.value.y;
          moveX = containerWidth;
        } else if (lastCropBaseOffset.value.y + e.translationY >= containerHeight
          && lastCropBaseOffset.value.x + e.translationX >= 0
          && lastCropBaseOffset.value.x + e.translationX <= containerWidth) {
          moveX = e.translationX + lastCropBaseOffset.value.x;
          moveY = containerHeight;
        } else if (lastCropBaseOffset.value.x + e.translationX >= containerWidth
          && lastCropBaseOffset.value.y + e.translationY >= containerHeight) {
          moveX = containerWidth;
          moveY = containerHeight;
        } else if (lastCropBaseOffset.value.x + e.translationX > containerWidth
          && lastCropBaseOffset.value.y + e.translationY < containerHeight) {
          moveX = containerWidth;
          moveY = 0;
        } else if (lastCropBaseOffset.value.x + e.translationX < containerWidth
          && lastCropBaseOffset.value.y + e.translationY > containerHeight) {
          moveX = 0;
          moveY = containerHeight;
        }
      }


      cropBaseOffset.value = {
        x: e.translationX + lastCropBaseOffset.value.x,
        y: e.translationY + lastCropBaseOffset.value.y
      };
    })
    .onEnd(e => {
      lastCropBaseOffset.value = {
        x: cropBaseOffset.value.x,
        y: cropBaseOffset.value.y
      };
    });



  const animCornerDraggerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: cropOffset.value.x + cropBaseOffset.value.x },
        { translateY: cropOffset.value.y + cropBaseOffset.value.y }
      ],
      left: -20,
      alignItems: 'center',
      justifyContent: 'center',
      top: -20,
      width: 40,
      height: 40,
      zIndex: 100000,
      borderRadius: 24,
      position: 'absolute',
    };
  });

  const animCropStyle = useAnimatedStyle(() => {
    return {
      // width: cropSize.value.width + 2,
      // height: cropSize.value.height + 2,
      width: image.width,
      height: image.height,
      position: 'absolute',
      zIndex: image.z + 1,
      borderWidth: 1,
      borderColor: '#ffffff',
      // transform: [
      //   { translateX: cropBaseOffset.value.x - 1 },
      //   { translateY: cropBaseOffset.value.y - 1 },
      // ]
    };
  });

  const colors = useThemeColor();

  const animBaseDraggerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: cropBaseOffset.value.x },
        { translateY: cropBaseOffset.value.y }
      ],
      width: cropSize.value.width,
      height: cropSize.value.height,
      borderWidth: 1,
      borderColor: '#FFF',
      zIndex: 1000,
      position: 'absolute',
      borderRadius: 0,
      // backgroundColor: '#000'
    };
  });


  const animInnerCropStyle = useAnimatedStyle(() => {
    return {
      width: cropSize.value.width,
      height: cropSize.value.height,
      transform: [
        { translateX: cropBaseOffset.value.x },
        { translateY: cropBaseOffset.value.y }
      ],
      backgroundColor: 'black'
    };
  });


  return (
    <Modal
      presentationStyle='overFullScreen'
      animationType='slide'
      visible={image !== null}
      onRequestClose={onClose}
    >
      <Container showInsetTop >
        <Header
          style={{ height: 50, paddingTop: 0, paddingHorizontal: 10 }}
          headerLeft={<CloseButton onPress={onClose} />}
          headerTitle={<Text style={{ marginBottom: 2 }} type='h2'>Crop Image</Text>}
        />
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'space-around', paddingBottom: bottom + 32 }}>
          {image && (<View style={{
            width: '100%',
            height: containerHeight,
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <View style={{ width: containerWidth, height: containerHeight }}>
              <GestureDetector gesture={cropCornerGesture}>
                <Animated.View style={animCornerDraggerStyle}>
                  <View style={{ width: 20, height: 20, borderRadius: 20, backgroundColor: '#FFFFFF' }} />
                </Animated.View>
              </GestureDetector>
              <GestureDetector gesture={cropDragGesture}>
                <Animated.View style={animBaseDraggerStyle} />
              </GestureDetector>
              <MaskedView
                maskElement={<Animated.View style={animInnerCropStyle} />}
                style={{ flex: 1, backgroundColor: 'transparent' }}
              >
                <Image
                  source={{ uri: image.uri }}
                  style={{
                    width: containerWidth,
                    height: containerHeight,
                    aspectRatio: image.width / image.height,
                  }}
                  resizeMode='cover'
                />
              </MaskedView>
              <Image
                source={{ uri: image.uri }}
                style={{
                  opacity: 0.5,
                  width: containerWidth,
                  height: containerHeight,
                  aspectRatio: image.width / image.height,
                }}
                resizeMode='cover'
              />
            </View>
          </View>
          )}
          <Button
            title="Crop"
            onPress={handleCrop}
            type='primary'
            loading={loading}
            disabled={loading}
            style={{ height: 55 }}
          />
        </View>
      </Container>
    </Modal >
  );
};


type StickerModalProps = {
  open: boolean;
  onClose: () => void;
};

const StickerModal = (props: StickerModalProps) => {
  const { open, onClose } = props;
  const itemWidth = (width - 40) / 3;
  const colors = useThemeColor();

  return (
    <Modal
      presentationStyle='pageSheet'
      animationType='slide'
      visible={open}
      onRequestClose={onClose}
    >
      <Container >
        <Header
          style={{ height: 50, paddingTop: 0, paddingHorizontal: 10 }}
          headerLeft={<CloseButton onPress={onClose} />}
          headerTitle={<Text style={{ marginBottom: 2 }} type='h2'>Stickers</Text>}
        />
        <ScrollView
          contentContainerStyle={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            paddingTop: 16,
            paddingHorizontal: 20,
            rowGap: 10,
            justifyContent: 'space-evenly'
          }}
        >
          <Pressable style={{ width: itemWidth, paddingVertical: 10, gap: 4, alignItems: 'center' }}>
            <LocationIcon size={24} color={colors.primaryText} />
            <Text type='h3'>Location</Text>
          </Pressable>
          <Pressable style={{ width: itemWidth, paddingVertical: 10, gap: 4, alignItems: 'center' }}>
            <WeatherIcon size={24} color={colors.primaryText} />
            <Text type='h3'>Weather</Text>
          </Pressable>
          <Pressable style={{ width: itemWidth, paddingVertical: 10, gap: 4, alignItems: 'center' }}>
            <MusicIcon size={24} color={colors.primaryText} />
            <Text type='h3'>Music</Text>
          </Pressable>
          <Pressable style={{ width: itemWidth, paddingVertical: 10, gap: 4, alignItems: 'center' }}>
            <AudioIcon size={24} color={colors.primaryText} />
            <Text type='h3'>Memo</Text>
          </Pressable>
          <Pressable style={{ width: itemWidth, paddingVertical: 10, gap: 4, alignItems: 'center' }}>
            <MoodIcon size={24} color={colors.primaryText} />
            <Text type='h3'>Mood</Text>
          </Pressable>
        </ScrollView>
      </Container>
    </Modal >
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

const TextAlignContainer = ({ align, setAlign }: { align: 'left' | 'center' | 'right' | undefined, setAlign: (align: 'left' | 'center' | 'right') => void; }) => {
  const colors = useThemeColor();
  if (align === 'left') {
    return (
      <Pressable
        onPress={() => setAlign('center')}
        style={{
          width: 30, height: 30,
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
          width: 30, height: 30,
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
          width: 30, height: 30,
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
    font === 'System' ?
      <Pressable
        onPress={() => setFont('SingleDay')}
        style={{
          width: 50,
          height: 28,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          borderCurve: 'continuous',
          backgroundColor: '#DDDDDD'
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
      <ImageIcon size={24} color={colors.primaryText} backgroundColor='#ffffff' />
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

export default EmptyTemplate;

const styles = StyleSheet.create({});