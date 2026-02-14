const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const {logger} = require('./middleware/logEvents')
const errorHandlers = require('./middleware/errorHandlers')
const routerSubdir = require('./routes/subdir')
const routerRoot = require('./routes/root')
const routerEmployees = require('./routes/api/employees')
const corsOptions = require('./config/corsOptions')
const routerRegister = require('./routes/api/register')
const routerAuth = require('./routes/api/auth')

app.use(express.urlencoded({ extended: false}))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

app.use('/', routerRoot)
app.use('/subdir', routerSubdir)
app.use('/employees', routerEmployees)
app.use('/register', routerRegister)
app.use('/auth', routerAuth)

// custom middleware
app.use(logger)

app.use(cors(corsOptions));

// routes handlers / middleware
app.get(/hello(.html)?/, (req, res, next) => {
    console.log('attempted to the route /hello')
    next()
}, (req, res) => {
    res.send('hello from hello routes')
})


// route-level middleware
app.get('/test',
    (req, res, next) => {
        console.log('Middleware 1');
        next();
    },
    (req, res, next) => {
        console.log('Middleware 2');
        next();
    },
    (req, res, next) => {
        console.log('Middleware 3');
        next();
    },
    (req, res) => {
        console.log('Final handler');
        res.send('Final handler');
    }
);


app.all(/.*/, (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({error : '404 not found'})
    } else {
        res.type('txt').send('404 not found')
    }
})

app.use(errorHandlers)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})