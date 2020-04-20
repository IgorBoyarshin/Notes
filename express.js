// app.use(express.bodyParser());
// ...is equivalent to:
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.multipart()); <<==== bad for security
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies

app.use(cors());
app.options('*', cors());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get('/', (req, res) => res.send('Hello World and Me!'));

app.post('/create', createUser);
app.post('/login', loginUser);
app.post('/relogin', checkJwt, reloginUser);
app.get('/languages', checkJwt, retrieveLanguages);
app.get('/entries', checkJwt, retrieveEntries);
// app.get('/users', retrieveUsers);
app.post('/entries', checkJwt, addEntry);
app.put('/entries/:id', checkJwt, updateEntry);
app.delete('/entries/:id', checkJwt, deleteEntry);

const port = 1234;
app.listen(port, () => console.log(`################## ............Starting on port ${port}!............##################`));
