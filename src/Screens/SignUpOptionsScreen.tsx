import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScreenProps } from '../types';
import { Button, Container } from '../Theme/Themed';

const SignUpOptionsScreen = ({ navigation }: ScreenProps<'SignUpOptionsScreen'>) => {
  return (
    <Container>
      <Text>SignUpOptionsScreen</Text>
    </Container>
  );
};

export default SignUpOptionsScreen;

const styles = StyleSheet.create({});