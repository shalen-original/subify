/**
 * Server
 */

/* Imports */
import * as express from 'express';
import * as path from 'path';
import * as compression from 'compression';

/* Controllers */
import * as pagesController from './controllers/pages';

/* Set default env to dev */
var env = process.env.NODE_ENV || 'development'

/* Create express server */
const app = express();

/* Express configuration */
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "../views"));
app.set('port', (process.env.PORT || 8080));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */
app.get('/', pagesController.index);
//app.get('/docs', pagesController.docs); // Removed
app.get('/app', pagesController.app);
app.get('/about', pagesController.about);
app.get('/*', pagesController.error);

/* Start express server */
let server = app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
  
module.exports = server; // for testing