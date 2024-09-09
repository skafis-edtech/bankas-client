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

async function exportUsers() {
	const users = [];
	let nextPageToken;

	do {
		const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
		listUsersResult.users.forEach((userRecord) => {
			users.push(userRecord.toJSON());
		});
		nextPageToken = listUsersResult.pageToken;
	} while (nextPageToken);

	// Save the users to a JSON file
	fs.writeFileSync(
		`${backupPath}/auth/users-${new Date().toISOString()}.json`,
		JSON.stringify(users, null, 2)
	);
	console.log('Exported', users.length, 'users');
}

exportUsers().catch((error) => console.error('Error exporting users:', error));
