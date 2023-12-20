import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { getActiveDiary } from './utilFns';
import defaultStore from '../Stores/defaultStore';

let fonts = {
  'SingleDay': require('../../assets/fonts/Single_Day/SingleDay-Regular.ttf'),
  'Nunito-Bold': require('../../assets/fonts/Nunito/Nunito-Bold.ttf'),
  'Nunito-Regular': require('../../assets/fonts/Nunito/Nunito-Regular.ttf'),
  'Nunito-SemiBold': require('../../assets/fonts/Nunito/Nunito-SemiBold.ttf'),
  'Nunito-Black': require('../../assets/fonts/Nunito/Nunito-Black.ttf'),
  'Nunito-ExtraBold': require('../../assets/fonts/Nunito/Nunito-ExtraBold.ttf'),
};

const initializeResources = () => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {

        SplashScreen.preventAutoHideAsync();

        //load any resources
        const Promises: Promise<any>[] = [
          Font.loadAsync(fonts),
        ];

        const res = await Promise.allSettled(Promises);

        res.forEach((r, i) => {
          if (r.status === 'rejected') {
            console.log(r.reason);
          }
        });
      } catch (e) {
        console.log("ERROR LOADING RESOURCES", e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
};

export default initializeResources;
