import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config('../.env');

const serviceAccountPath = process.env.SDK_LOCAL_PATH;
const backupPath = path.join(process.env.BACKUP_PATH, 'storage');

if (!serviceAccountPath || !backupPath) {
	throw new Error('SDK_LOCAL_PATH or BACKUP_PATH is not defined in the .env file');
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET // Add your storage bucket name in .env
});

const storage = admin.storage().bucket();

async function backupFolder(folderName) {
	const folderPath = path.join(backupPath, folderName + new Date().toISOString());
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true });
	}

	const [files] = await storage.getFiles({ prefix: `${folderName}/` });

	if (files.length === 0) {
		console.log(`No files found in ${folderName}`);
		return;
	}

	for (const file of files) {
		const destination = path.join(folderPath, file.name.replace(`${folderName}/`, ''));
		const fileDirectory = path.dirname(destination);

		// Ensure directory exists
		if (!fs.existsSync(fileDirectory)) {
			fs.mkdirSync(fileDirectory, { recursive: true });
		}

		// Download the file
		await file.download({ destination });
		console.log(`Downloaded ${file.name} to ${destination}`);
	}

	console.log(`Backup of ${folderName} completed successfully.`);
}

async function backupStorage() {
	try {
		await backupFolder('problems');
		await backupFolder('answers');
		console.log('All storage folders backed up successfully.');
	} catch (error) {
		console.error('Error backing up storage:', error);
	}
}

backupStorage();
