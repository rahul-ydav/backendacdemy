const express = require('express');
const app = express.Router();

app.get('/lessons', async (req, res) => {
	try {
		const client = await pool.connect();
		let result = await client.query('SELECT * FROM public.lessons WHERE record_status = 0');
		client.release();
		if (result.rows.length > 0) {
			let lessons = result.rows;

			let titles = new Set();
			for (let lesson of lessons) {
				titles.add(lesson.title);
			}
			let lessonData = [];
			for (let title of titles) {
				let lessonsWithSameTitle = lessons.filter(lesson => lesson.title === title)
				// .map(lesson => {
				// 	return {
				// 		name: lesson.name,
				// 		leetcode: lesson.title,
				// 		youtube: lesson.youtube,
				// 		article: lesson.article,
				// 		level: lesson.level,
				// 		status: lesson.status
				// 	};
				// });
				let lessonObj = {
					title: title,
					tableData: lessonsWithSameTitle
				};
				lessonData.push(lessonObj);
			}
			return res.status(200).json(lessonData);
		} else {
			return res.status(404).json({ message: 'Lesson not found' });
		}

	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error', error });
	}
});

module.exports = app;