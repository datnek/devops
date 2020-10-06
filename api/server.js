process.env.NODE_ENV = 'production';

const app = require('./app');


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});


