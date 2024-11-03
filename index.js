const mongoose = require('mongoose');
const express = require('express');
const path = require('path')
const app = express();
const port = 3000;
// const router = express.Router();
const bodyParser = require('body-parser');

// Middleware to parse JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './')));

//connect to mongodb
mongoose.connect('mongodb://127.0.0.1/ebookdb');

var db = mongoose.connection;
db.on('error' ,console.error.bind(console,' MongoDB Connection error: \n\n'));
db.once('open',function(){
    console.log("DB connected")
});

//define schema and model
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publication: String,
    link: String,
    description: String,
})
var mybooks = db.model('bookmodel', bookSchema);


// Serve static files for home page and admin page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, './addbook.html'));
});

//////////////////            Search Book        ////////////////////////
app.get('/search', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, './booksearch.html'));
    } catch (error) {
        console.error('Error searching documents:', error);
        res.status(500).send('An error occurred while searching');
    }
});

async function findDocuments(searchQuery) {
    // Define the query
    const query = {
        $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { author: { $regex: searchQuery, $options: 'i' } },
            { publication: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } }
        ]
    };
    // Execute the query
    const documents = await mybooks.find(query).exec();
    console.log(documents);
    return documents;
}

// Route to fetch books data as JSON with search capability
app.get('/api/books', async (req, res) => {
    const searchQuery = req.query.query;  // Capture the search query from the fetch request
    console.log("Search query received:", searchQuery);
    try {
        const books = await findDocuments(searchQuery);  // Pass the search query to findDocuments
        res.json(books);  // Return books data as JSON
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
});

//////////////////            Search Book End        ////////////////////////

//////////////////            Add Book        ////////////////////////
app.use(express.urlencoded({ extended: true }));  // To parse form data

app.post('/addbook', async (req, res) => {
    try {
        // Create a new book document from form data
        const newBook = new mybooks({
            title: req.body.title,
            author: req.body.author,
            publication: req.body.publication,
            link: req.body.link,
            description: req.body.description
        });
        
        // Save the new book to the database
        await newBook.save();
        
        console.log('Book added successfully');
        res.send('<script>alert("Book added successfully");window.open("/", "_self");</script>');
        // res.redirect('/');  // Redirect to home or any other page
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(500).send('Error adding book');
    }
});
////////////////          Add Book End        ////////////////////////  




// bookSchema.methods.speak = function () {
//     var titleis = "Title:- " + this.title
//     console.log(titleis)
// }

    
// var newbook = new mybooks({
//     title: "Harry Potter and the Philosopher's Stone",
//     author: 'J.K. Rowling',
//     publication: "Bloomsbury Children's Books",
//     link: 'https://www.amazon.in/Harry-Potter-Philosophers-Stone-Rowling/dp/1408855658',
//     description: "Escape to Hogwarts with the unmissable series that has sparked a lifelong reading journey for children and families all over the world. The magic starts here.Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. The magic starts here!These editions of the classic and internationally bestselling Harry Potter series feature thrilling jacket artwork by award-winning illustrator Jonny Duddle. They are the perfect starting point for anyone who's ready to lose themselves in the greatest children's story of all time."
// });
// newbook.save();


// run()
async function run(){
    const bookinfo = await mybooks.find();
    console.log(bookinfo);
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});