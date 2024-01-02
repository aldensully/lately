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

const NewPage = ({ navigation }: ScreenProps<'NewPage'>) => {
  const colors = useThemeColor();
  const [template, setTemplate] = useState<'Empty' | 'Creative' | null>(null);


  const handleBrowse = () => {

  };

  switch (template) {
    case 'Empty':
      return <EmptyTemplate />;
    case 'Creative':
      return <CreativeTemplate />;
    default:
      return (
        <View style={{ flex: 1 }}>
          <Header
            style={{ zIndex: 1000 }}
            headerLeft={<BackButton style={{ width: 36, height: 36, borderRadius: 36, marginBottom: 6, marginLeft: 12 }}
              onPress={() => navigation.goBack()}
            />}
          />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text color={colors.secondaryText} type='h3'>New Page</Text>
            <Text type='h1' style={{ marginTop: 4, fontSize: 34 }}>Choose A Template</Text>
            <View style={{ alignItems: 'center', marginTop: 32, gap: 16 }}>
              <Pressable
                onPress={() => setTemplate('Empty')}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderCurve: 'continuous',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: colors.secondary
                }}>
                <StarIcon size={20} color={'#FFF500'} />
                <Text type='h3' color={colors.primary}>Today's Template</Text>
              </Pressable>
              <Text color={colors.secondaryText} type='h3'>or</Text>
              <View style={{ alignItems: 'center', gap: 10 }}>
                <Pressable
                  onPress={() => setTemplate('Empty')}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderCurve: 'continuous',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: 150,
                    backgroundColor: colors.surface2
                  }}>
                  <EmptyPageIcon size={20} color={colors.primaryText} />
                  <Text type='h3' color={colors.primaryText}>Empty Page</Text>
                </Pressable>
                <Pressable
                  onPress={() => setTemplate('Creative')}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderCurve: 'continuous',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: 150,
                    backgroundColor: colors.surface2
                  }}>
                  <CreativeIcon size={20} color={colors.primaryText} />
                  <Text type='h3' color={colors.primaryText}>Creative</Text>
                </Pressable>
                <Pressable
                  onPress={handleBrowse}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderCurve: 'continuous',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: 150,
                    backgroundColor: colors.surface2
                  }}>
                  <SearchIcon size={20} color={colors.primaryText} />
                  <Text type='h3' color={colors.primaryText}>Browse All</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      );
  }
};

export default NewPage;

const styles = StyleSheet.create({});