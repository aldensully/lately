import UUID from 'react-native-uuid';
import { db, storage } from '../../firebaseConfig';
import { getStorage, ref, getDownloadURL, uploadString, uploadBytesResumable, uploadBytes } from "firebase/storage";
import { where, addDoc, collection, doc, getDoc, getDocs, QueryConstraint, getFirestore, query, setDoc, QueryFieldFilterConstraint, updateDoc, orderBy, arrayUnion } from 'firebase/firestore';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { Diary, Page, ResizeOptions, User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchDocuments<T>(key: string, queryConstraints: QueryFieldFilterConstraint[]): Promise<T[]> {
  try {
    const collectionRef = collection(db, key);
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return [];
    } else {
      return querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } as T;
      });
    }

  } catch (e) {
    console.log(e);
    return [];
  }
};

// export async function getActiveDiary() {
//   try {
//     const res = await AsyncStorage.getItem('activeDiary');
//     if (res == null) {
//       const diaries = await AsyncStorage.getItem('diaries');
//       const parsed = JSON.parse(diaries ?? '[]');
//       if (parsed.length == 0) return null;
//       return parsed[0].id;
//     };
//     return res;
//   } catch (e) {
//     return null;
//   }
// }

export async function apiSavePage(page: Page) {
  try {
    //make api call
  } catch (e) {

  }
}

export async function apiDeletePage(pageId: string, diary: Diary) {
  try {
    const pages = diary.pages.filter(p => p.id != pageId);
    const docRef = doc(collection(db, 'diaries'), diary.id);
    await updateDoc(docRef, {
      pages: pages
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function apiCreatePage(page: Page): Promise<Boolean> {
  try {
    const docRef = doc(collection(db, 'diaries'), page.diary_id);
    await updateDoc(docRef, {
      pages: arrayUnion(page)
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}



export async function apiListDiaries(user_id: string): Promise<Diary[]> {
  try {
    const res = await AsyncStorage.getItem('diaries');
    if (res == null) return [];
    return JSON.parse(res) as Diary[];
  } catch (e) {
    return [];
  }
}

export async function apiGetDiary(diaryId: string | null): Promise<Diary | null> {
  if (!diaryId) return null;
  try {
    const res = await AsyncStorage.getItem('diaries');
    if (res === null) return null;
    const d = JSON.parse(res);
    return d.find((diary: any) => diary.id == diaryId) ?? null;
  } catch (e) {
    return null;
  }
}

export async function getActiveDiary(user_id: string) {
  try {
    //if we enable entry without account creation we can use this
    const res = await AsyncStorage.getItem('activeDiaryId');
    const diaries = await apiFetchDiaries(user_id);
    if (diaries.length == 0) return null;

    if (res == null) {
      AsyncStorage.setItem('activeDiaryId', diaries[0].id);
      return diaries[0];
    }
    const diary = diaries.find(d => d.id == res);
    if (diary == undefined) return null;
    return diary;
    // const diaries = await AsyncStorage.getItem('diaries');
    // const parsed = JSON.parse(diaries ?? '[]') as Diary[];
    // if (parsed.length == 0) return null;
    // if (res === null) {
    //   return parsed[0];
    // };
    // return parsed.find(d => d.id == res) ?? null;
  } catch (e) {
    return null;
  }
}

export async function apiListCommunityPages(): Promise<Page[]> {
  try {
    //fetch from firestore
    return [];
  } catch (e) {
    return [];
  }
}

export async function uploadMedia(id: string, uri: string, resizeOptions?: ResizeOptions): Promise<string | null> {
  const storageRef = ref(storage, id);
  let finalUri = uri;
  if (resizeOptions) {
    const res = await resizeImage(resizeOptions.width, resizeOptions.height, uri);
    if (res) finalUri = res;
    else return null;
  }
  const blob = await uriToBlob(finalUri);
  const res = await uploadBytes(storageRef, blob)
    .then(res => {
      const url = getDownloadURL(res.ref).then((downloadURL) => {
        return downloadURL;
      })
        .catch(e => {
          return null;
        });
      return url;
    }).catch(err => {
      console.log(err);
      return null;
    });

  return res;
}

export async function getDbUser(uid: string): Promise<User | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: uid,
      ...docSnap.data(),
    } as User;
  }
  return null;
}

export async function userHasDiary(uid: string): Promise<Boolean> {
  try {
    const collectionRef = collection(db, 'diaries');
    const q = query(collectionRef, where("user_id", "==", uid));
    const docSnap = await getDocs(q);
    return !docSnap.empty;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function getCurrentDateTimeInUTC() {
  //return in format YYYY-MM-DD HH:MM:SS
  const dateString = new Date().toISOString().split('T')[0];
  const timeString = new Date().toISOString().split('T')[1].split('.')[0];
  return dateString + ' ' + timeString;
}


export async function apiFetchDiaries(user_id: string) {
  try {
    const collectionRef = collection(db, 'diaries');
    const q = query(collectionRef, where('user_id', '==', user_id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return [];
    } else {
      return querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } as Diary;
      });
    }

  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function apiCreateDiary(input: Diary) {
  try {
    const docRef = doc(collection(db, 'diaries'), input.id);
    await setDoc(docRef, input, { merge: true });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}



export async function apiCreateUser(input: User) {
  try {
    const docRef = doc(collection(db, 'users'), input.id);
    await setDoc(docRef, input, { merge: true });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function apiFetchStorageUrl(id: string) {
  const storage = getStorage();
  const picRef = ref(storage, id);
  const url = await getDownloadURL(picRef)
    .then((url) => {
      return url;
    })
    .catch((error) => {
      console.log("ERROR: ", error);
      switch (error.code) {
        case 'storage/object-not-found':
          return null;
        case 'storage/unauthorized':
          return null;
        case 'storage/canceled':
          return null;
        case 'storage/unknown':
          return null;
        default:
          return null;
      }
    });
  return url;
}

export function generateUUID() {
  return UUID.v4().toString();
}

export async function fetchImageFromUri(uri: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

export async function resizeImage(width: number, height: number, uri: string) {
  try {
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { height: height, width: width } }],
      { format: SaveFormat.PNG, compress: 0.2 }
    );
    return manipResult.uri;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function uriToBlob(fileUri: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", fileUri, true);
    xhr.send(null);
  }) as Promise<Blob>;
}
export async function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
