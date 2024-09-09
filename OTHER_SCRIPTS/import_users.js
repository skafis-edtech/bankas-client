import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config('../.env');

const serviceAccountPath = process.env.SDK_LOCAL_PATH;
const backupPath = process.env.BACKUP_PATH;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore via the Admin SDK
const db = admin.firestore();

// Read your JSON file
const userData = JSON.parse(fs.readFileSync(`${backupPath}/auth/filename.json`, 'utf8'));

// Function to create a user with a custom UID
async function createUserWithCustomUID(email, password, customUID) {
	try {
		// Create user in Firebase Authentication
		const userRecord = await admin.auth().createUser({
			uid: customUID,
			email: email,
			password: password
		});
		console.log('Successfully created new user:', userRecord.uid);

		// Store user data in Firestore
		await db
			.collection('users')
			.doc(customUID)
			.set({
				id: customUID,
				bio: '',
				username: email.split('@')[0],
				role: 'USER',
				email: email
			});
		console.log(`User data successfully written to Firestore for: ${customUID}`);
	} catch (error) {
		console.error('Error creating new user:', error);
	}
}

if (Array.isArray(userData.users)) {
	userData.users.forEach((user) => {
		createUserWithCustomUID(user.email, 'SUPERSECRET', user.uid);
	});
} else {
	console.error('Unexpected userData structure:', userData);
}
