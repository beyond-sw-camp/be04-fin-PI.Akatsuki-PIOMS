const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Define the path to the distribution directory
const distPath = path.resolve(__dirname, 'dist');

// Serve static files from the distribution directory
app.use(express.static(distPath));

// Handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
