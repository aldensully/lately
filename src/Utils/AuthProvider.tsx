import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import defaultStore from '../Stores/defaultStore';
import { NavigationScreens, User } from '../types';
import { navigationRef } from '../Navigation/NavigationRef';
import { db, auth } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDbUser, userHasDiary } from './utilFns';

const getTodaysStatus = async () => {
  const today = new Date().toLocaleDateString();
  console.log("TODAY: ", today);
  const res = await AsyncStorage.getItem('promptedToday');
  if (!res || res !== today) {
    AsyncStorage.setItem('promptedToday', today);
    return false;
  } else {
    AsyncStorage.removeItem('promptedToday');
    return true;
  }
};

const AuthProvider = ({ children }: any) => {
  const setUser = defaultStore(state => state.setUser);
  const setLoadingUser = defaultStore(state => state.setLoadingUser);
  const setHasAccount = defaultStore(state => state.setHasAccount);

  //uncomment this when you have firebase setup

  const handleNavigation = (route: keyof NavigationScreens) => {
    try {
      if (navigationRef?.isReady()) {
        //@ts-ignore
        navigationRef?.navigate(route);
      } else {
        setTimeout(() => {
          handleNavigation(route);
        }, 100);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const dbUser = await getDbUser(u.uid);
        if (dbUser) {
          setUser(dbUser);
          navigationRef?.navigate('Main');
          navigationRef?.navigate('TodaysPageScreen');

          // const hasSeenTodaysPrompt = await getTodaysStatus();
          // if (!hasSeenTodaysPrompt) {
          //   navigationRef?.navigate('TodaysPageScreen');
          // } else {
          //   navigationRef?.navigate('Main');
          // }
        } else {
          handleNavigation('EditProfileScreen');
          setLoadingUser(false);
        }
      } else {
        navigationRef?.navigate('Welcome');
        setLoadingUser(false);
      }

      setTimeout(() => {
        setLoadingUser(false);
      }, 100);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
};

export default AuthProvider;

const styles = StyleSheet.create({});