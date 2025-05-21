const express = require('express');
const app = express.Router();

app.get('/progress', async (req, res) => {
	try {
		const client = await pool.connect();
		const LessonsData = await client.query('SELECT level, status FROM public.lessons WHERE record_status = 0');
		client.release();
		if (LessonsData.rows.length > 0) {
			let counts = {
				easy: 0,
				medium: 0,
				hard: 0
			};
			let doneStatus = {
				easy: 0,
				medium: 0,
				hard: 0
			};

			LessonsData.rows.forEach(lesson => {
				if (lesson.level === 'Easy') {
					if (lesson.status === 'Done') {
						doneStatus.easy++;
					}
					counts.easy++;
				} else if (lesson.level === 'Medium') {
					if (lesson.status === 'Done') {
						doneStatus.medium++;
					}
					counts.medium++;
				} else if (lesson.level === 'Hard') {
					if (lesson.status === 'Done') {
						doneStatus.hard++;
					}
					counts.hard++;
				}
			});

			const easy = Math.round((doneStatus.easy / counts.easy) * 100);
			const medium = Math.round((doneStatus.medium / counts.medium) * 100);
			const hard = Math.round((doneStatus.hard / counts.hard) * 100);
			return res.status(200).json({ easy, medium, hard });
		} else {
			return res.status(404).json({ message: 'Lesson not found' });
		}

	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error', error });
	}
});

module.exports = app;