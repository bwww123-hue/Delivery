import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey:            "AIzaSyClVAW2aOkU8Ies8KBSGz8BelFn-9QFW4k",
  authDomain:        "rebrix-warehouse.firebaseapp.com",
  projectId:         "rebrix-warehouse",
  storageBucket:     "rebrix-warehouse.firebasestorage.app",
  messagingSenderId: "67742153266",
  appId:             "1:67742153266:web:a2bac5b41f2837b03d1a2b",
  databaseURL:       "https://rebrix-warehouse-default-rtdb.firebaseio.com",
}

const apps = getApps()
export const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig)
export const fsDb = getFirestore(firebaseApp)
export const rtDb = getDatabase(firebaseApp)
