const mongoose = require('mongoose');
const express = require('express');
const path = require('path')
const app = express();
const port = 3000;
const router = express.Router();

// const Book = require('./models/book'); // Assuming the model is in 'models/book.js'

// Route to fetch books data
router.get('/books', async (req, res) => {
    try {
        const books = await mybooks.find({});
        res.render('books', { books });
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});
// Route to fetch books data as JSON
app.get('/api/books', async (req, res) => {
    try {
        const books = await mybooks.find({});  // Fetch all books from the database
        res.json(books);  // Return the books data as JSON
        console.log(books);
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});


module.exports = router;

const path = require('path');
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, './')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});


// Set the correct MIME type for CSS files
app.get('*.css', function(req, res, next) {
    res.type('text/css');
    next();
});

app.get('/search', async (req, res) => {
  const searchQuery = req.query.query;
  try {
    const results = await findDocuments(searchQuery);
    console.log(results); // Log the search results
    res.sendFile(path.join(__dirname, './booksearch.html'));
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).send('An error occurred while searching');
  }
});

mongoose.connect('mongodb://127.0.0.1/ebookdb');

var db = mongoose.connection;
db.on('error' ,console.error.bind(console,' MongoDB Connection error: \n\n'));
db.once('open',function(){
    console.log("DB connected")
});

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publication: String,
    link: String,
    description: String,
})
var mybooks = db.model('bookmodel', bookSchema);
module.exports = mybooks;

// bookSchema.methods.speak = function () {
//     var titleis = "Title:- " + this.title
//     console.log(titleis)
// }

    
var newbook = new mybooks({
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J.K. Rowling',
    publication: "Bloomsbury Children's Books",
    link: 'https://www.amazon.in/Harry-Potter-Philosophers-Stone-Rowling/dp/1408855658',
    description: "Escape to Hogwarts with the unmissable series that has sparked a lifelong reading journey for children and families all over the world. The magic starts here.Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. The magic starts here!These editions of the classic and internationally bestselling Harry Potter series feature thrilling jacket artwork by award-winning illustrator Jonny Duddle. They are the perfect starting point for anyone who's ready to lose themselves in the greatest children's story of all time."
});
newbook.save();

async function findDocuments(name) {
    // Define the query
    const query = {
        $or: [
            { name: { $regex: 'title', $options: 'i' } },
            { name: { $regex: 'author', $options: 'i' } },
            { name: { $regex: 'publication', $options: 'i' } }
    ]
};
// Execute the query
const documents = await mybooks.find(query).exec();
console.log(documents);
}
findDocuments().catch(console.error);


run()
async function run(){
    const bookinfo = await mybooks.find();
    console.log(bookinfo);
}


// kittySchema.methods.speak = function () {
// if (typeof document !== 'undefined') {
    //     document.addEventListener('DOMContentLoaded', function() {
        //         const searchForms = document.querySelectorAll('.search-bar');
        //         searchForms.forEach(form => {
            //             form.addEventListener('submit', function(event) {
                //                 event.preventDefault();
                //                 const query = form.querySelector('.search-input').value;
                //                 findDocuments(query).catch(console.error);
                //             });
                //         });
                //     });
                // }
                


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});