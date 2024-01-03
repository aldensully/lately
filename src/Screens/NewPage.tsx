import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, useThemeColor } from '../Theme/Themed';
import React, { useState } from 'react';
import { ScreenProps } from '../types';
import Header from '../Components/Header';
import BackButton from '../Components/BackButton';
import StarIcon from '../../assets/icons/StarIcon';
import EmptyPageIcon from '../../assets/icons/EmptyPageIcon';
import CreativeIcon from '../../assets/icons/CreativeIcon';
import SearchIcon from '../../assets/icons/SearchIcon';
import EmptyTemplate from './EmptyTemplate';
import CreativeTemplate from './Templates/CreativeTemplate';
import SimpleTemplate from './Templates/SimpleTemplate';

const NewPage = ({ navigation }: ScreenProps<'NewPage'>) => {
  const colors = useThemeColor();
  const [template, setTemplate] = useState<'Empty' | 'Creative' | null>(null);


  const handleBrowse = () => {

  };

  return (
    <SimpleTemplate />
  );

  // switch (template) {
  //   case 'Empty':
  //     return <EmptyTemplate />;
  //   case 'Creative':
  //     return <CreativeTemplate />;
  //   default:
  //     return (null);
  // }
};

export default NewPage;

const styles = StyleSheet.create({});