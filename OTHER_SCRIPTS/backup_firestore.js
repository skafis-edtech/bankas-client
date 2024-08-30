import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config('../.env'); // Correctly loading the .env file with the path

const serviceAccountPath = process.env.SDK_LOCAL_PATH;
const backupPath = process.env.BACKUP_PATH;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

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
	fs.writeFileSync(
		`${backupPath}/firestore/${collectionName}-backup-${new Date().toISOString()}.json`,
		jsonString
	);
	console.log(`Backup of ${collectionName} completed successfully.`);
}

const validCollections = ['categories', 'problems', 'users', 'sources', 'meta'];

const args = process.argv.slice(2); // Skip the first two arguments (node and script name)

if (args.length > 0) {
	const collectionName = args[0];
	if (validCollections.includes(collectionName)) {
		backupCollection(collectionName).catch(console.error);
	} else {
		console.error(`Error: '${collectionName}' is not a valid collection name.`);
		console.error(`Valid collection names are: ${validCollections.join(', ')}`);
	}
} else {
	// No CLI argument provided, backup all collections
	Promise.all(validCollections.map(backupCollection))
		.then(() => console.log('All collections backed up successfully.'))
		.catch(console.error);
}
