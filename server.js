const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'dist')));

// 모든 경로에 대해 index.html 서빙
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
