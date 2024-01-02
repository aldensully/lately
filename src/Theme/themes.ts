import { JournalTheme } from "../types";

type BrandTheme = {
  colors: {
    background: string,
    card: string,
    text: string,
    border: string,
    notification: string,
    primary: string,
    secondary: string,
    primaryText: string,
    secondaryText: string,
    danger: string,
    primaryButtonText: string,
    surface1: string,
    surface2: string,
    surface3: string;
  },
  dark: boolean;
};

export const LightTheme: BrandTheme = {
  colors: {
    background: '#F0F3E9',
    card: '#F4F6F0',
    text: '#20202A',
    border: '#fff',
    notification: '#000',
    primary: '#608E06',
    secondary: '#D2E5AB',
    primaryText: '#292C24',
    secondaryText: '#888D7F',
    danger: '#FF3D00',
    primaryButtonText: '#608E06',
    surface1: '#F0F3E9',
    surface2: '#ffffff',
    surface3: '#DDE1D4'
  },
  dark: false
};

export const JournalThemes: JournalTheme[] = [
  {
    name: 'Blue',
    backgroundColor: '#3E81E5',
    spineColor: '#3471CC',
    textColor: '#FFFFFF',
    font: 'SingleDay'
  },
  {
    name: 'Pink',
    backgroundColor: '#E8A7C6',
    spineColor: '#DD96B8',
    textColor: '#FFFFFF',
    font: 'SingleDay'
  },
  {
    name: 'Red',
    backgroundColor: '#F75A52',
    spineColor: '#D64740',
    textColor: '#FFFFFF',
    font: 'SingleDay'
  },
  {
    name: 'Green',
    backgroundColor: '#73C577',
    spineColor: '#64B068',
    textColor: '#FFFFFF',
    font: 'SingleDay'
  },
  {
    name: 'Gray',
    backgroundColor: '#D6D1C6',
    spineColor: '#C0BBAF',
    textColor: '#333333',
    font: 'SingleDay'
  },
  {
    name: 'Black',
    backgroundColor: '#2E3537',
    spineColor: '#262D2F',
    textColor: '#FFFFFF',
    font: 'SingleDay'
  },
  {
    name: 'Teal',
    backgroundColor: '#218185',
    spineColor: '#1C6467',
    textColor: '#FFFFFF',
    font: 'SingleDay'
  },
  {
    name: 'Purple',
    backgroundColor: '#D9ABE5',
    spineColor: '#C493D0',
    textColor: '#FFFFFF',
    font: 'SingleDay'
  },
];