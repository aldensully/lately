import { Image, Dimensions, Pressable, StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, TextInput, ActionSheetIOS, NativeSyntheticEvent, TextInputKeyPressEventData, Alert, Modal, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, useThemeColor, Text, Button } from '../../Theme/Themed';
import TemplateIcon from '../../../assets/icons/TemplateIcon';
import BackgroundIcon from '../../../assets/icons/BackgroundIcon';
import TextStyleIcon from '../../../assets/icons/TextStyleIcon';
import StickerIcon from '../../../assets/icons/StickerIcon';
import { Diary, Page, PageElement, PageImageType, PageTextType, UseNavigationType } from '../../types';
import { apiCreatePage, blobToBase64, generateUUID, getActiveDiary, uploadMedia, uriToBlob } from '../../Utils/utilFns';
import CloseIcon from '../../../assets/icons/CloseIcon';
import { BG_REMOVAL_API_KEY } from '../../Utils/Constants';
import Header from '../../Components/Header';
import CloseButton from '../../Components/CloseButton';
import { useNavigation } from '@react-navigation/native';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import PlusCircleIcon from '../../../assets/icons/PlusCircleIcon';
import PlusIcon from '../../../assets/icons/PlusIcon';
import ImageIcon from '../../../assets/icons/ImageIcon';
import KeyboardIcon from '../../../assets/icons/KeyboardIcon';
import BottomSheet from '../../Components/BottomSheet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import defaultStore from '../../Stores/defaultStore';
import { captureRef } from 'react-native-view-shot';
import GraphBackground from '../../../assets/svg-backgrounds/GraphBackground';
import GridBackground from '../../../assets/svg-backgrounds/GridBackground';
import BubbleBackground from '../../../assets/svg-backgrounds/BubbleBackground';

const BOTTOM_CONTAINER_HEIGHT = 50;
const { width, height } = Dimensions.get('window');
const imageContainerHeight = height / 4;
const imageContainerWidth = width - 64;
const imagePreviewHeight = imageContainerHeight - 50;
const imagePreviewWidth = (imageContainerWidth - 20) / 2.5;
const imagePreviewWidthMini = (imageContainerWidth - 20) / 3;
const imagePreviewHeightMini = imagePreviewWidthMini * (5 / 4);



const BACKGROUND_COLORS = ['#F4F6F0', '#000000', '#FFFFFF', '#EDEDED', '#FF0000', '#FF7A00', '#FAF11D', '#37D300', '#00A3FF', '#9E00FF', '#FF00E6',
  '#FFABAB', '#FFCDA0', '#FFFCAD', '#D1EEC7', '#B6DBF0', '#DBBFEC', '#FFCBFA', '#'];

const TEXT_COLORS = ['#000000', '#FFFFFF', '#EDEDED', '#E5E7D6', '#FF0000', '#FF7A00', '#FAF11D', '#37D300', '#00A3FF', '#9E00FF', '#FF00E6',
  '#FFABAB', '#FFCDA0', '#FFFCAD', '#D1EEC7', '#B6DBF0', '#DBBFEC', '#FFCBFA'];

const TEXT_SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];



const SimpleTemplate = () => {
  const { bottom, top } = useSafeAreaInsets();

  const { data: activeDiary, isLoading } = useQuery({ queryKey: ['activeDiary'], queryFn: () => user && getActiveDiary(user.id) });
  const queryClient = useQueryClient();
  const user = defaultStore(state => state.user);

  const colors = useThemeColor();
  const imageRef = useRef<any>(null);
  const scrollRef = useRef<ScrollView>(null);
  const canvasHeight = height - (BOTTOM_CONTAINER_HEIGHT + bottom + top + 45 + 20);
  const canvasWidth = width - 30;
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [focusedText, setFocusedText] = useState<PageTextType | null>(null);
  const [lastKeyPress, setLastKeyPress] = useState({ key: '', time: 0 });
  const [loading, setLoading] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const navigation = useNavigation<UseNavigationType>();
  const [imageOpen, setImageOpen] = useState<PageImageType | null>(null);
  const [images, setImages] = useState<PageImageType[]>([]);
  const [texts, setTexts] = useState<PageTextType[]>([
    {
      id: generateUUID(),
      body: 'Positive Moments :)',
      color: colors.primaryText,
      font: 'SingleDay',
      placeholder: 'Positive Moments',
      align: 'center',
      weight: 'normal',
      x: 0,
      y: 0,
      z: 1,
      rotate: 0,
      width: canvasWidth,
      height: 30,
      size: 26,
      backgroundColor: null,
      scale: 1
    },
    {
      id: generateUUID(),
      body: '',
      color: colors.primaryText,
      font: 'SingleDay',
      placeholder: 'Describe a positive moment in your day. What happened? How did it make you feel?',
      align: 'left',
      weight: 'normal',
      x: 0,
      y: 0,
      z: 1,
      rotate: 0,
      width: canvasWidth,
      height: 30,
      size: 20,
      backgroundColor: null,
      scale: 1
    },
  ]);
  const [title, setTitle] = useState<PageTextType>({
    id: generateUUID(),
    body: 'Positive Moments :)',
    color: colors.primaryText,
    font: 'SingleDay',
    placeholder: 'Positive Moments',
    align: 'center',
    weight: 'normal',
    x: 0,
    y: 0,
    z: 1,
    rotate: 0,
    width: canvasWidth,
    height: 30,
    size: 26,
    backgroundColor: null,
    scale: 1
  },
  );
  const [body, setBody] = useState<PageTextType>({
    id: generateUUID(),
    body: '',
    color: colors.primaryText,
    font: 'SingleDay',
    placeholder: 'Describe a positive moment in your day. What happened? How did it make you feel?',
    align: 'left',
    weight: 'normal',
    x: 0,
    y: 0,
    z: 1,
    rotate: 0,
    width: canvasWidth,
    height: 30,
    size: 20,
    backgroundColor: null,
    scale: 1
  },
  );


  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', (k) => {
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




  const datestring = useMemo(() => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.toLocaleString('default', { day: 'numeric' });
    const year = date.toLocaleString('default', { year: 'numeric' });
    return `${month} ${day}, ${year}`;
  }, []);

  const handleImageLongPress = (image: PageElement) => {
    if (image.type !== 'image') return;
    const options = ['Cancel', 'Crop', 'Remove Background', 'Delete'];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: 3,
          cancelButtonIndex: 0
        },
        async buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            // setCropImage(image);
          } else if (buttonIndex === 2) {
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
                  setImages(e => e.map(e => {
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
          } else if (buttonIndex === 3) {
            setImages(e => {
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










  const openImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false
      });
      if (result.canceled) {
        return;
      }

      const imageWidth = result.assets[0].width;
      const imageHeight = result.assets[0].height;

      const MAX_SIZE = 800;
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
          width: w,
          height: h
        };
        setImages(e => [...e, i]);
      });

    } catch (e) {
      console.log(e);
      Alert.alert('Something went wrong, please try again.');
    }
  };

  const prompt = "Positive Moments :)";


  const JournalHeader = () => {
    return (
      <View style={{ width: '100%', height: 50, alignItems: 'center' }}>
        <Text type='h3' color={colors.secondaryText}>{datestring}</Text>
        <Text type='h1' color={colors.primaryText}>{prompt}</Text>
      </View>
    );
  };


  const RenderImages = () => {
    switch (images.length) {
      case 0:
        return <Pressable onPress={openImage} style={{
          borderStyle: 'dashed',
          backgroundColor: backgroundColor + '88',
          width: imageContainerWidth, height: imagePreviewHeight, gap: 4, borderWidth: 2, borderColor: colors.surface3, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderCurve: 'continuous', overflow: 'hidden'
        }}>
          <ImageIcon size={28} color={colors.secondaryText} backgroundColor={backgroundColor} />
          <Text type='h3' color={colors.secondaryText}>Add Image</Text>
        </Pressable>;
      case 1:
        return <View style={{ width: imageContainerWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Pressable onPress={() => setImageOpen(images[0])} style={{ zIndex: 10 }}>
            <Image
              source={{ uri: images[0].uri }}
              style={{ width: imagePreviewWidth, height: imagePreviewHeight, marginRight: -imagePreviewWidth / 3, borderRadius: 8, transform: [{ rotate: '-5deg' }] }}
              resizeMode='cover'
            />
          </Pressable>
          <Pressable
            onPress={openImage}
            style={{
              borderWidth: 2,
              borderStyle: 'dashed',
              backgroundColor: backgroundColor + '88',
              borderColor: colors.surface3, alignItems: 'center', justifyContent: 'center', width: imagePreviewWidth, height: imagePreviewHeight, borderRadius: 8, transform: [{ rotate: '5deg' }, { translateY: 10 }]
            }}
          >
            <PlusIcon size={28} color={colors.secondaryText} />
          </Pressable>
        </View>;
      case 2:
        return <View style={{ width: imageContainerWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Pressable onPress={() => setImageOpen(images[0])} style={{ zIndex: 10 }}>
            <Image
              source={{ uri: images[0].uri }}
              style={{ width: imagePreviewWidthMini, height: imagePreviewHeightMini, borderRadius: 8, transform: [{ rotate: '-5deg' }, { translateX: 10 }] }}
              resizeMode='cover'
            />
          </Pressable>
          <Pressable onPress={() => setImageOpen(images[1])} style={{ zIndex: 20 }}>
            <Image
              source={{ uri: images[1].uri }}
              style={{ zIndex: 10, width: imagePreviewWidthMini, height: imagePreviewHeightMini, borderRadius: 8, transform: [{ translateY: 10 }] }}
              resizeMode='cover'
            />
          </Pressable>
          <Pressable
            onPress={openImage}
            style={{
              borderStyle: 'dashed',
              backgroundColor: backgroundColor + '88',
              borderWidth: 2, borderColor: colors.surface3, alignItems: 'center', justifyContent: 'center', width: imagePreviewWidthMini, height: imagePreviewHeightMini, borderRadius: 8, transform: [{ rotate: '5deg' }, { translateY: 0 }, { translateX: -10 }]
            }}
          >
            <PlusIcon size={28} color={colors.secondaryText} />
          </Pressable>
        </View>;
      case 3:
        return <View style={{ width: imageContainerWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Pressable onPress={() => setImageOpen(images[0])} style={{ zIndex: 10 }}>
            <Image
              source={{ uri: images[0].uri }}
              style={{ width: imagePreviewWidthMini, height: imagePreviewHeightMini, borderRadius: 8, transform: [{ rotate: '-5deg' }, { translateX: 10 }] }}
              resizeMode='cover'
            />
          </Pressable>
          <Pressable onPress={() => setImageOpen(images[1])} style={{ zIndex: 20 }}>
            <Image
              source={{ uri: images[1].uri }}
              style={{ zIndex: 10, width: imagePreviewWidthMini, height: imagePreviewHeightMini, borderRadius: 8, transform: [{ translateY: 10 }] }}
              resizeMode='cover'
            />
          </Pressable>
          <Pressable onPress={() => setImageOpen(images[2])} style={{ zIndex: 10 }}>
            <Image
              source={{ uri: images[2].uri }}
              style={{ width: imagePreviewWidthMini, height: imagePreviewHeightMini, borderRadius: 8, transform: [{ rotate: '5deg' }, { translateY: 0 }, { translateX: -10 }] }}
              resizeMode='cover'
            />
          </Pressable>
        </View>;
      default:
        return null;
    }
  };




  const RenderTexts = () => {
    return texts.map((text, index) => {
      return (
        <TextInput
          multiline={true}
          scrollEnabled={false}
          value={body.body}
          onChangeText={(val) => {
            setBody(t => ({ ...t, body: val }));
          }}
          maxLength={1000}
          style={{
            fontSize: body.size,
            fontWeight: body.weight,
            fontFamily: body.font,
            lineHeight: body.size + 1,
            paddingHorizontal: 8,
            textAlign: body.align,
            width: '100%',
            color: body.color,
            backgroundColor: body.backgroundColor ?? 'transparent'
          }}
          placeholder={body.placeholder ?? ''}
          placeholderTextColor={body.color + '88'}
        />
      );
    });
  };



  const [textStylesOpen, setTextStylesOpen] = useState(false);



  return (
    <View style={{ flex: 1 }}>
      <Header
        style={{ zIndex: 1000 }}
        headerLeft={<CloseButton
          style={{ width: 40, height: 40, borderRadius: 36, marginLeft: 12 }}
          onPress={() => navigation.navigate('Main')}
          color={colors.secondaryText}
        />
        }
        headerRight={<Pressable
          onPress={handleSave}
          style={{ marginRight: 10, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}><Text color={colors.primary} type='h3'>Save</Text></Pressable>}
      />
      <BottomSheet
        height={420}
        // showBackDrop={false}
        showHeader={true}
        backgroundColor={colors.surface2}
        title='Text Styles'
        open={textStylesOpen}
        onClose={() => setTextStylesOpen(false)}
      >
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
          <Pressable style={{ width: 24, height: 24, borderRadius: 24, backgroundColor: textColor }} />
        </View>
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
          {/* {BACKGROUND_COLORS.map(c => (
            <Pressable
              onPress={() => setBackgroundColor(c)}
              style={{
                width: colorSize,
                height: colorSize,
                backgroundColor: c,
                borderRadius: 8,
                borderCurve: 'continuous'
              }} key={c} />
          ))} */}
        </View>
      </BottomSheet>
      <Modal
        visible={imageOpen !== null}
        animationType='slide'
        presentationStyle='fullScreen'
        onRequestClose={() => setImageOpen(null)}
      >
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.surface1 }}>
          <Header
            headerLeft={<CloseButton
              style={{ width: 36, height: 36, borderRadius: 36, marginBottom: 6, marginLeft: 12 }}
              onPress={() => setImageOpen(null)}
              color={colors.primaryText}
            />
            }
          />
          <Image
            source={{ uri: imageOpen?.uri }}
            style={{ width: canvasWidth, height: canvasHeight }}
            resizeMode='cover'
          />
          <Button
            onPress={() => {
              setImages(e => e.filter(e => e.id !== imageOpen?.id));
              setImageOpen(null);
            }}
            title='Remove Image'
            style={{ marginTop: 10 }}
          />
        </View>
      </Modal>
      <View style={{ flex: 1, gap: 10, alignItems: 'center', marginTop: 16 }}>
        <View style={{
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: backgroundColor,
          borderRadius: 10,
          overflow: 'hidden',
          borderCurve: 'continuous',
        }}>
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
            keyboardVerticalOffset={100}
          >
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={{
                paddingHorizontal: 7,
                paddingBottom: 20
              }}
            >
              <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, zIndex: 0 }}>
                <GridBackground />
                {/* <BubbleBackground /> */}
              </View>
              <Text style={{ textAlign: 'center', marginTop: 20 }} color={colors.secondaryText}>{datestring}</Text>
              <TextInput
                multiline={true}
                scrollEnabled={false}
                value={title.body}
                onChangeText={(val) => {
                  setTitle(t => ({ ...t, body: val }));
                }}
                editable={false}
                style={{
                  fontSize: title.size,
                  fontWeight: title.weight,
                  fontFamily: title.font,
                  lineHeight: title.size + 1,
                  paddingHorizontal: 8,
                  textAlign: title.align,
                  width: '100%',
                  color: title.color,
                  backgroundColor: title.backgroundColor ?? 'transparent'
                }}
                placeholder={title.placeholder ?? ''}
                placeholderTextColor={title.color + '88'}
              />
              <View style={{ alignItems: 'center', width: '100%', marginVertical: 32, justifyContent: 'space-between' }}>
                <RenderImages />
              </View>
              <TextInput
                multiline={true}
                scrollEnabled={false}
                value={body.body}
                onChangeText={(val) => {
                  setBody(t => ({ ...t, body: val }));
                }}
                maxLength={1000}
                blurOnSubmit
                returnKeyLabel='done'
                returnKeyType='done'
                style={{
                  fontSize: body.size,
                  fontWeight: body.weight,
                  fontFamily: body.font,
                  lineHeight: body.size + 1,
                  paddingHorizontal: 8,
                  textAlign: body.align,
                  width: '100%',
                  color: body.color,
                  backgroundColor: body.backgroundColor ?? 'transparent'
                }}
                placeholder={body.placeholder ?? ''}
                placeholderTextColor={body.color + '88'}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>


        {/* <View style={{
          height: BOTTOM_CONTAINER_HEIGHT,
          backgroundColor: '#ffffff',
          borderRadius: 50,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          gap: 10,
          justifyContent: 'space-evenly',
          borderCurve: 'continuous'
        }}>
          <Pressable
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <TemplateIcon size={24} color={colors.primaryText} />
          </Pressable>
          <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
          <Pressable
            onPress={() => setTextStylesOpen(true)}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <TextStyleIcon size={24} color={colors.primaryText} />
          </Pressable>
          <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
          <Pressable
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <StickerIcon size={24} color={colors.primaryText} />
          </Pressable>
          <View style={{ width: 1, height: 28, backgroundColor: colors.surface3 }} />
          <Pressable
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <BackgroundIcon size={24} color={colors.primaryText} />
          </Pressable>
        </View> */}

      </View>
    </View>
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









export default SimpleTemplate;

const styles = StyleSheet.create({});