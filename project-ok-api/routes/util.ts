import express, { Request, Response } from 'express';
const router = express.Router();
const pool = require('../db');

interface Row {
	table_name: string;
	column_name: string;
}

router.get('/testdb', async (req: Request, res: Response) => {
	try {
		const client = await pool.connect();
		res.send('Database connected successfully!');
		client.release();
	} catch (err) {
		console.error('Error connecting to database:', err);
		res.status(500).send('Failed to connect to database');
	}
});

router.get('/listTables', async (req: Request, res: Response) => {
	try {
		const client = await pool.connect();
		const query = `
					SELECT table_name, column_name
					FROM information_schema.columns
					WHERE table_schema = 'public'
					ORDER BY table_name, ordinal_position;
			`;
		const result = await client.query(query);

		// Group columns by table name
		const tables: { [key: string]: string[] } = {};
		result.rows.forEach((row: Row) => {
			const { table_name, column_name } = row;
			if (!tables[table_name]) {
				tables[table_name] = [column_name];
			} else {
				tables[table_name].push(column_name);
			}
		});

		res.json(tables);
		client.release();
	} catch (err) {
		console.error('Error listing tables:', err);
		res.status(500).send('Failed to list tables');
	}
});

router.get('/dropAllTables', async (req: Request, res: Response) => {
	try {
		const client = await pool.connect();

		// Drop user_data table and all dependent objects
		await client.query('DROP TABLE IF EXISTS user_data CASCADE;');

		// Drop users table
		await client.query('DROP TABLE IF EXISTS users;');

		res.send('All tables dropped successfully!');
		client.release();
	} catch (err) {
		console.error('Error dropping tables:', err);
		res.status(500).send('Failed to drop tables');
	}
});

module.exports = router;
