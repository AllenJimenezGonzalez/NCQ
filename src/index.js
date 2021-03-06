const express = require('express');
const morgan = require('morgan');
const expHdbs = require('express-handlebars');
const path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');

//Initialize
const app = express();

//Settings
app.set('PORT', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', expHdbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
//Middlewares


app.use(morgan('dev'));
app.use(express.urlencoded({ extended: 'false' }));
app.use(express.json());

//Global variables

app.use((req, res, next) => {
    next();
})

//Routes
app.use(require('./routes/main.js'));
app.use(require('./routes/branchOffice'));
app.use(require('./routes/client'));
app.use(require('./routes/costCenter'));
app.use(require('./routes/work'));
app.use(require('./routes/reason'));
app.use(require('./routes/vehicle'));
app.use(require('./routes/support'));
app.use(require('./routes/employee'));
app.use(require('./routes/transport_viatic'));
app.use(require('./routes/workType'));
app.use(require('./routes/viatic'));
app.use(require('./routes/event'));
app.use(require('./routes/viaticType'));
//Public 

app.use(express.static(path.join(__dirname, 'public')));


//Start server
app.listen(app.get('PORT'), () => {
    console.log("Server on port: ", app.get('PORT'))
});