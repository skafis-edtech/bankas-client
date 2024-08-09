import admin from 'firebase-admin';
import fs from 'fs';

// Initialize the Firebase Admin SDK
import serviceAccount from '/path/to/firebase-admin.json' assert { type: 'json' };
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function backupCollection(collectionName) {
	const snapshot = await db.collection(collectionName).get();
	const data = [];

	snapshot.forEach((doc) => {
		data.push({ id: doc.id, ...doc.data() });
	});

	const jsonString = JSON.stringify(data, null, 2);
	fs.writeFileSync(`${collectionName}-backup.json`, jsonString);
	console.log(`Backup of ${collectionName} completed successfully.`);
}

const collectionName = 'categories';
backupCollection(collectionName).catch(console.error);
