import express, { Request, Response } from 'express';
const router = express.Router();
const pool = require('../db');

// Define interfaces for User and Post
interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	address: {
		street: string;
		suite: string;
		city: string;
		zipcode: string;
		geo: {
			lat: string;
			lng: string;
		};
	};
	phone: string;
	website: string;
	company: {
		name: string;
		catchPhrase: string;
		bs: string;
	};
}

interface Post {
	userId: number;
	id: number;
	title: string;
	body: string;
}

// User Tables
router.get('/createUserTables', async (req: Request, res: Response) => {
	try {
		const client = await pool.connect();

		// Recreate users table
		const recreateUsersQuery = `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        username VARCHAR(100),
        email VARCHAR(255),
        password VARCHAR(255) DEFAULT 'password',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
		await client.query(recreateUsersQuery);

		// Recreate user_data table
		const recreateUserDataQuery = `
      CREATE TABLE user_data (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
				address_street VARCHAR(255),
				address_suite VARCHAR(100),
				address_city VARCHAR(100),
				address_zipcode VARCHAR(100),
				address_lat VARCHAR(100),
				address_lng VARCHAR(100),
				phone VARCHAR(100),
				website VARCHAR(255),
				company_name VARCHAR(255),
				catch_phrase VARCHAR(255),
				bs VARCHAR(255)
      );
    `;
		await client.query(recreateUserDataQuery);

		res.send('Tables recreated successfully!');
		client.release();
	} catch (err) {
		console.error('Error recreating tables:', err);
		res.status(500).send('Failed to recreate tables');
	}
});

router.get('/populateUserTables', async (req: Request, res: Response) => {
	try {
		// Fetch JSON data from URL
		const response = await fetch('https://jsonplaceholder.typicode.com/users');
		const users = (await response.json()) as User[];

		const client = await pool.connect();

		// Insert each user into tables
		for (const user of users) {
			// Insert into users table
			const userQuery = `
        INSERT INTO users (name, username, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `;
			const userValues = [user.name, user.username, user.email, 'password'];
			const userResult = await client.query(userQuery, userValues);
			const userId = userResult.rows[0].id;

			// Insert into user_data table
			const userDataQuery = `
			  INSERT INTO user_data (user_id, address_street, address_suite, address_city, address_zipcode, address_lat, address_lng, phone, website, company_name, catch_phrase, bs)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
			`;

			const userDataValues = [
				userId,
				user.address.street,
				user.address.suite,
				user.address.city,
				user.address.zipcode,
				user.address.geo.lat,
				user.address.geo.lng,
				user.phone,
				user.website,
				user.company.name,
				user.company.catchPhrase,
				user.company.bs,
			];
			await client.query(userDataQuery, userDataValues);
		}

		res.send('Users inserted successfully!');
		client.release();
	} catch (err) {
		console.error('Error inserting users:', err);
		res.status(500).send('Failed to insert users');
	}
});

// Post Tabless
router.get('/createPostTables', async (req: Request, res: Response) => {
	try {
		const client = await pool.connect();

		// Recreate posts table
		const recreatePostsQuery = `
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
				user_id INT REFERENCES users(id),
				title VARCHAR(255),
				body TEXT
      );
    `;
		await client.query(recreatePostsQuery);

		res.send('Posts Table recreated successfully!');
		client.release();
	} catch (err) {
		console.error('Error recreating tables:', err);
		res.status(500).send('Failed to recreate Post table');
	}
});

router.get('/populatePostsTables', async (req: Request, res: Response) => {
	try {
		// Fetch JSON data from URL
		const response = await fetch('https://jsonplaceholder.typicode.com/posts');
		const posts = (await response.json()) as Post[];

		const client = await pool.connect();

		// Insert each post into tables
		for (const post of posts) {
			// Insert into post table
			const postQuery = `
				INSERT INTO posts (user_id, title, body)
				VALUES ($1, $2, $3)
      `;
			const postValues = [post.userId, post.title, post.body];
			await client.query(postQuery, postValues);
		}

		res.send('Posts inserted successfully!');
		client.release();
	} catch (err) {
		console.error('Error inserting posts:', err);
		res.status(500).send('Failed to insert posts');
	}
});

module.exports = router;
