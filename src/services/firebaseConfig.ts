import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyC3Wqume9D4C4tewjmR1FmkyklkDGGFKpw',
	authDomain: 'bankas-skafis.firebaseapp.com',
	projectId: 'bankas-skafis',
	storageBucket: 'bankas-skafis.appspot.com',
	messagingSenderId: '723059913775',
	appId: '1:723059913775:web:fb0bd4b7f84b8ee64302da'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
