import express from 'express';

const app = express();
const PORT = 2077;

app.get('/health',(req,res)=> {
    res.status(200).send('Full HP');
});

app.get('/*',(req,res)=> { 
        res.status(404).send('Not Found');
});

app.listen(PORT,()=> {
    console.log(`Server is ON and running on PORT: ${PORT}`);
});
