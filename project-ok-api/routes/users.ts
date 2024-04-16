import express, { Request, Response } from 'express';
const router = express.Router();
const pool = require('../db');

const formatUserData = require('../util/formatUserData');

router.get('/', async (req: Request, res: Response) => {
	try {
		const client = await pool.connect();

		const query = `
      SELECT
        u.id AS user_id,
        u.name,
        u.username,
        u.email,
        u.password,
        u.created_at,
        u.modified_at,
        ud.address_street,
        ud.address_suite,
        ud.address_city,
        ud.address_zipcode,
        ud.address_lat,
        ud.address_lng,
        ud.phone,
        ud.website,
        ud.company_name,
        ud.catch_phrase,
        ud.bs
      FROM users u
      JOIN user_data ud ON u.id = ud.user_id;
    `;
		const result = await client.query(query);
		// Format the JSON output
		const formattedUserData = result.rows.map(formatUserData);

		// Send the formatted user data as JSON response
		res.json(formattedUserData);

		client.release();
	} catch (err) {
		console.error('Error fetching user data:', err);
		res.status(500).send('Failed to fetch user data');
	}
});

module.exports = router;
