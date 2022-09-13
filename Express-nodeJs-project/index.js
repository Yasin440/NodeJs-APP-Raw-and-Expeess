const express = require('express');
const app = express();
const admin = express();

app.use(express.text());
app.use('/admin', admin);

admin.get('/', (req, res) => {
    res.send('this is admin page')
})
app.get('/', (req, res) => {
    res.send('this is home page')
})
app.post('/', (req, res) => {
    res.send('this is home page with post');
    console.log(req.body);
})

app.listen(4000, () => {
    console.log('express running on 4000 port');
})