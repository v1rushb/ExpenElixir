import express from 'express';
const app = express();
const PORT = 2077;
app.get('/*', (req, res) => {
    res.status(404).send('Not Found');
});
app.listen(PORT, () => {
    console.log(`Server is ON and running on PORT: ${PORT}`);
});
