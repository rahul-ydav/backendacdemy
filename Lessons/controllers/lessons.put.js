const express = require('express');
const app = express.Router();

app.put('/lessonstatus', async (req, res) => {
	const { id_lesson, status } = req.body;
	try {
		const client = await pool.connect();
		const result = await client.query('UPDATE public.lessons SET status = $1 WHERE id_lesson = $2', [status, id_lesson]);
		client.release();
		if (result.rowCount > 0) {
			return res.status(200).json({ message: 'Lesson updated successfully' });
		} else {
			return res.status(404).json({ message: 'Lesson not found' });
		}

	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error', error });
	}
});

module.exports = app;
