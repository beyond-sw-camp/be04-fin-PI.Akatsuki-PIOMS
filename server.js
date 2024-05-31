const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// 'dist' 폴더를 정적 파일로 제공
app.use(express.static(path.join(__dirname, 'dist')));

// 모든 요청에 대해 'index.html'을 제공
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
