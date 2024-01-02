import { Image, Dimensions, Pressable, StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, TextInput, ActionSheetIOS, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import React, { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '../../Theme/Themed';
import TemplateIcon from '../../../assets/icons/TemplateIcon';
import BackgroundIcon from '../../../assets/icons/BackgroundIcon';
import TextStyleIcon from '../../../assets/icons/TextStyleIcon';
import StickerIcon from '../../../assets/icons/StickerIcon';
import { PageElement, PageImageType, PageTextType } from '../../types';
import { blobToBase64, generateUUID, uriToBlob } from '../../Utils/utilFns';
import CloseIcon from '../../../assets/icons/CloseIcon';
import { BG_REMOVAL_API_KEY } from '../../Utils/Constants';

const BOTTOM_CONTAINER_HEIGHT = 50;
const { width, height } = Dimensions.get('window');

const SimpleTemplate = () => {
  const { bottom, top } = useSafeAreaInsets();
  const colors = useThemeColor();
  const imageRef = useRef<any>(null);
  const scrollRef = useRef<ScrollView>(null);
  const canvasHeight = height - (BOTTOM_CONTAINER_HEIGHT + bottom + top + 45 + 20);
  const canvasWidth = width - 24;
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [focusedText, setFocusedText] = useState<PageTextType | null>(null);
  const [lastKeyPress, setLastKeyPress] = useState({ key: '', time: 0 });
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<PageTextType>({
    id: generateUUID(),
    body: 'Positive Moments',
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
    size: 24,
    backgroundColor: null,
    scale: 1
  },
  );
  const [body, setBody] = useState<PageTextType>({
    id: generateUUID(),
    body: '',
    color: colors.primaryText,
    font: 'SingleDay',
    placeholder: 'Describe your day',
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
  const [images, setImages] = useState<PageElement[]>([
    {
      id: generateUUID(),
      type: 'image',
      uri: '',
      x: 0,
      y: 0,
      z: 1,
      rotate: 0,
      width: 100,
      height: 100,
      scale: 1,
      image_type: 'group',
      shape: 'inherit',
    },
  ]);


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

  return (
    <View style={{ flex: 1, gap: 10, alignItems: 'center' }}>
      <View style={{
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: backgroundColor,
        borderRadius: 12,
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
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{
              paddingHorizontal: 7,
              paddingBottom: 20
            }}
          >
            <TextInput
              multiline={true}
              scrollEnabled={false}
              value={title.body}
              onChangeText={(val) => {
                setTitle(t => ({ ...t, body: val }));
              }}
              style={{
                fontSize: title.size,
                fontWeight: title.weight,
                fontFamily: title.font,
                marginTop: 10,
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
            {images.map((e, i) => (
              <Pressable style={{}}>

              </Pressable>
            ))}
            <TextInput
              multiline={true}
              scrollEnabled={false}
              value={body.body}
              onChangeText={(val) => {
                setBody(t => ({ ...t, body: val }));
              }}
              style={{
                fontSize: body.size,
                fontWeight: body.weight,
                fontFamily: body.font,
                marginTop: 15,
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
      <BottomBar />
    </View>
  );
};


const BottomBar = () => {
  const colors = useThemeColor();

  return (
    <View style={{
      // width: width - 24,
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