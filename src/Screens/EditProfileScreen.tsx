import { Alert, Dimensions, Image, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlipType, manipulateAsync } from 'expo-image-manipulator';
import { Button, Container, useThemeColor } from '../Theme/Themed';
import defaultStore from '../Stores/defaultStore';
import CloseButton from '../Components/CloseButton';
import CloseIcon from '../../assets/icons/CloseIcon';
import CheckIcon from '../../assets/icons/CheckIcon';
import { Text } from '../Theme/Themed';
import { ScreenProps, User } from '../types';
import ContextMenu from '../Components/ContextMenu';
import ArrowRightIcon from '../../assets/icons/ArrowRightIcon';
import { apiCreateUser, generateUUID, getCurrentDateTimeInUTC, uploadMedia } from '../Utils/utilFns';
import { auth } from '../../firebaseConfig';


const generateUsername = () => {
  //return in form user-123456789

  const random = Math.floor(Math.random() * 1000000);
  return `user-${random}`;

};

const EditProfileScreen = ({ navigation, route }: ScreenProps<'EditProfileScreen'>) => {
  const colors = useThemeColor();
  const setUser = defaultStore(state => state.setUser);
  const cameraRef = useRef<Camera>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();

  const handleNext = async () => {
    const finalUsername = username.length === 0 ? generateUsername() : username;
    const input: User = {
      id: generateUUID(),
      username: finalUsername,
      creation_date: getCurrentDateTimeInUTC()
    };
    navigation.navigate('CreateFirstDiaryScreen', { newUser: input, imageUri: image });
  };


  const openImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Please allow access to your photos in your settings.");
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        aspect: [1, 1]
      });
      if (result.canceled) {
        return;
      }
      setImage(result.assets[0].uri);
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const { width, height } = Dimensions.get('window');

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const photo = await cameraRef.current.takePictureAsync();
    const manipResult = await manipulateAsync(
      photo.uri,
      [{ flip: FlipType.Horizontal }]
    );
    setImage(manipResult.uri);
  };

  const openCamera = async () => {
    if (!cameraPermission) return;
    if (!cameraPermission.granted) {
      if (!cameraPermission.canAskAgain) {
        Alert.alert("Please allow access to your camera in your settings.");
        return;
      }
      const res = await requestCameraPermission();
      if (!res.granted) {
        Alert.alert("Please allow access to your camera in your settings.");
        return;
      }
    }
    setCameraOpen(true);
  };


  const { bottom } = useSafeAreaInsets();


  return (
    <Container showInsetBottom showInsetTop>
      <Modal style={{
        flex: 1,
      }}
        presentationStyle='pageSheet'
        animationType='slide'
        visible={cameraOpen}
        onRequestClose={() => setCameraOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#000', paddingBottom: bottom + 32 }}>
          <View style={{ paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', minHeight: 70 }}>
            <CloseButton onPress={() => setCameraOpen(false)} color="#fff" />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {image ?
              <Image
                source={{ uri: image }}
                style={{ width, height: width, borderRadius: width }}
              />
              : <View style={{ borderRadius: width, overflow: 'hidden' }}>
                <Camera
                  ref={cameraRef}
                  style={{
                    height: width, width: width,
                    alignItems: 'center',
                    padding: 16,
                    justifyContent: 'center',
                    zIndex: 10000
                  }}
                  type={CameraType.front}
                >
                  {/* <View style={{ width: width - 20, height: width - 20, borderRadius: width, borderWidth: 3, borderColor: 'white' }} /> */}
                </Camera>
              </View>
            }
          </View>
          <View style={{ width: '100%', height: '15%', alignItems: 'center', justifyContent: 'center' }}>
            {image ?
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 32 }}>
                <Pressable
                  onPress={() => setImage(undefined)}
                  style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: 70, borderRadius: 70, backgroundColor: colors.danger }}>
                  <CloseIcon size={30} stroke={colors.surface2} />
                </Pressable>
                <Pressable
                  onPress={() => setCameraOpen(false)}
                  style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: 70, borderRadius: 70, backgroundColor: colors.primary }}>
                  <CheckIcon size={30} stroke={colors.surface2} />
                </Pressable>
              </View>
              : <Pressable
                onPress={takePhoto}
                style={{ width: 80, height: 80, borderRadius: 80, borderWidth: 5, borderColor: 'white' }}
              />
            }
          </View>
        </View>
      </Modal>
      <View style={{ flex: 1, gap: 32, paddingTop: 48, alignItems: 'center' }}>
        <View style={{ gap: 8 }}>
          <Text type='h2' style={{ textAlign: 'center', fontSize: 28 }}>Edit Profile</Text>
          <Text color={colors.secondaryText} type='sm' >You can always change this later</Text>
        </View>
        <Pressable
          onPress={() => setMenuOpen(true)}
          style={{ marginTop: 16 }}
        >
          {image ? <Image
            source={{ uri: image }}
            style={{
              width: 140,
              height: 140,
              borderRadius: 140
            }}
          />
            : <View style={{
              width: 140,
              height: 140,
              borderRadius: 100,
              backgroundColor: colors.surface2,
              borderCurve: 'continuous',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Ionicons name='person' size={42} color={colors.surface3} />
            </View>
          }
          <ContextMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            offsetY={50}
            offsetX={0}
            style={{ left: -50, bottom: 20 }}
            options={[{
              name: 'Take Photo',
              icon: <Ionicons name='camera' size={20} color={colors.primaryText} />,
              alignment: 'center',
              color: colors.primaryText
            }, {
              name: 'Camera Roll',
              icon: <Ionicons name='image' size={20} color={colors.primaryText} />,
              color: colors.primaryText,
              alignment: 'center'
            }]}
            selected={''}
            onSelect={(val: string) => {
              if (val === 'Take Photo') {
                setCameraOpen(true);
                openCamera();
              } else {
                openImage();
              }
              setMenuOpen(false);
            }}
          />
        </Pressable>
        <View style={{ width: '100%', gap: 8, marginTop: 16, paddingHorizontal: 30 }}>
          <Text type='h3' color={colors.primaryText}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder={generateUsername()}
            maxLength={15}
            numberOfLines={1}
            allowFontScaling={false}
            returnKeyLabel='done'
            returnKeyType='done'
            blurOnSubmit
            style={{
              // textAlign: 'center',
              paddingHorizontal: 16,
              color: colors.primaryText,
              fontSize: 24,
              backgroundColor: colors.surface2,
              borderRadius: 12,
              height: 50,
              fontFamily: 'SingleDay',
            }}
          />
        </View>
      </View>
      {/* <Pressable
        onPress={handleNext}
        style={{ width: '30%', gap: 5, height: 50, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
        <Text type='h1' color={colors.primary}>Next</Text>
        <ArrowRightIcon size={18} color={colors.primary} />
      </Pressable> */}
      <Button
        type='primary'
        onPress={handleNext}
        loading={loading}
        style={{ marginBottom: 32, width: 180, flexDirection: 'row', alignItems: 'center', gap: 6 }}
      >
        <>
          <Text type='h1' color={colors.primary}>Next</Text>
          <ArrowRightIcon size={20} color={colors.primary} />
        </>
      </Button>
    </Container>
  );
};

export default EditProfileScreen;