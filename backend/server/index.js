const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')
const multer = require('multer');
const path = require('path');

//middleware
app.use(cors())
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, '../', 'images')));

//ROUTES//

// upload a photo to backend 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../images'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}_${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

  // Route to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path; // The path where the file was saved

        // Insert file information into your PostgreSQL database
        const query = 'INSERT INTO files (filename, filepath) VALUES ($1, $2) RETURNING *';
        const values = [req.file.originalname, filePath];
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// create user

app.post('/olx', async (req, res) => {
    try {
        const { username, password } = req.body
        const newUser = await pool.query("INSERT INTO olx_user (userName, password) VALUES($1, $2) RETURNING *", [username, password])
        res.json(newUser.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

// create post

app.post('/add_post', upload.array('images'), async (req, res) => {
    try {
        // Save file information in the `files` table
        const filePromises = req.files.map(async file => {
            const query = 'INSERT INTO files (filename, filepath) VALUES ($1, $2) RETURNING file_id';
            const values = [file.originalname, file.path];
            const result = await pool.query(query, values);
            return result.rows[0].file_id;
        });
        
        const fileIds = await Promise.all(filePromises);

        // Create a new post
        const { post_title, contact_person_id, category, post_description, price, location, contact_person, email, phone_number } = req.body;
        const insertQuery = 'INSERT INTO post (post_title, contact_person_id, category, post_description, price, location, contact_person, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING post_id';
        const insertValues = [post_title, contact_person_id, category, post_description, price, location, contact_person, email, phone_number];
        const insertResult = await pool.query(insertQuery, insertValues);
        const postId = insertResult.rows[0].post_id;

        // Establish relationships between post and files in the junction table
        const postFilesQuery = 'INSERT INTO post_files (post_id, file_id) VALUES ($1, $2)';
        for (const fileId of fileIds) {
            await pool.query(postFilesQuery, [postId, fileId]);
        }

        res.json({ message: 'Post created successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// create chat

app.post('/create_chat', async (req, res) => {
    try {
        const { message, contact_person_id, uid } = req.body
        const chat = await pool.query("INSERT INTO chat (history, contact_person_id, user_id) VALUES($1, $2, $3) RETURNING *", [[message], contact_person_id, uid])
        res.json(chat.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// get user

app.get('/olx/:username/:password', async (req, res) => {
    try {
        const { username, password } = req.params
        const user = await pool.query("SELECT * FROM olx_user WHERE userName = $1 AND password = $2", [username, password])
        res.json(user.rows[0])
    } catch (error) {
        console.log(error.message)
    }
})

// get post

app.get('/post/:post_id', async (req, res) => {
    try {
        const { post_id } = req.params
        const postResult = await pool.query("SELECT * FROM post WHERE post_id = $1", [post_id]);

        if (postResult.rows.length > 0) {
            const post = postResult.rows[0];

            const imageQuery = 'SELECT filepath FROM files f INNER JOIN post_files pf ON f.file_id = pf.file_id WHERE pf.post_id = $1';
            const imageResult = await pool.query(imageQuery, [post_id]);
            const imageUrls = imageResult.rows.map(row => row.filepath);

            post.imageUrls = imageUrls;
            res.json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        console.error(error.message)
    }
})

// get all posts of specific category

app.get('/posts/:category/:uid', async (req, res) => {
    try {
        const { category, uid } = req.params
        const page = parseInt(req.query.page) || 1
        const offset = (page - 1) * 10
        const min_price = parseInt(req.query.min_price)
        const max_price = parseInt(req.query.max_price)
        const countQuery = 'SELECT COUNT(*) FROM post WHERE category = $1 AND NOT contact_person_id = $2 AND price > $3 AND price < $4';
        const countResult = await pool.query(countQuery, [category, uid, min_price, max_price]);
        const totalCount = parseInt(countResult.rows[0].count);
        const cat_posts = await pool.query("SELECT * FROM post WHERE category = $1 AND price > $4 AND price < $5 AND NOT contact_person_id = $2 LIMIT 10 OFFSET $3", [category, uid, offset, min_price, max_price])
        const posts = cat_posts.rows;
        for (const post of posts) {
            const imageQuery = 'SELECT filepath FROM files f INNER JOIN post_files pf ON f.file_id = pf.file_id WHERE pf.post_id = $1';
            const imageResult = await pool.query(imageQuery, [post.post_id]);
            post.imageUrls = imageResult.rows.map(row => row.filepath);
        }

        res.json({posts, totalCount});
    } catch (error) {
        console.error(error.message)
    }
})

// get images to specific post

app.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../', 'images', filename);
    res.sendFile(imagePath);
});

// get chat

app.get('/chat/:user_id/:contact_person_id', async (req, res) => {
    const { user_id, contact_person_id } = req.params
    const chat = await pool.query("SELECT chat_id, history FROM chat WHERE user_id = $1 AND contact_person_id = $2", [user_id, contact_person_id])
    if (chat.rows.length > 0) {
        res.json(chat.rows[0])
    } else {
        res.json([])
    }
})

// get chats of specific user

app.get('/chats/:user_id', async (req, res) => {
    const { user_id } = req.params
    const chats = await pool.query("SELECT * FROM chat WHERE user_id = $1 OR contact_person_id = $1", [user_id])
    if (chats.rows.length > 0) {
        res.json(chats.rows)
    } else {
        res.json('no chats')
    }
})

// get posts by search term

app.get('/search/:searchTerm', async (req, res) => {
    try {
        const { searchTerm } = req.params
        const page = parseInt(req.query.page) || 1
        const offset = (page - 1) * 10
        const min_price = parseInt(req.query.min_price)
        const max_price = parseInt(req.query.max_price)
        const countQuery = "SELECT COUNT(*) FROM post WHERE LOWER(post_title) LIKE '%' || LOWER($1) || '%' AND price > $2 AND price < $3";
        const countResult = await pool.query(countQuery, [searchTerm, min_price, max_price]);
        const totalCount = parseInt(countResult.rows[0].count);
        const search_posts = await pool.query("SELECT * FROM post WHERE LOWER(post_title) LIKE '%' || LOWER($1) || '%' AND price > $3 AND price < $4 LIMIT 10 OFFSET $2", [searchTerm, offset, min_price, max_price])
        const posts = search_posts.rows

        for (const post of posts) {
            const imageQuery = 'SELECT filepath FROM files f INNER JOIN post_files pf ON f.file_id = pf.file_id WHERE pf.post_id = $1';
            const imageResult = await pool.query(imageQuery, [post.post_id]);
            post.imageUrls = imageResult.rows.map(row => row.filepath);
        }

        res.json({posts, totalCount});
    } catch (error) {
        console.log(error.message)
    }
})

// get usernames of users the client have a chat with

app.get('/users', async (req, res) => {
    try {
        const userIds = req.query.userIds.split(',').map(id => parseInt(id));
        const queryString = 'SELECT userName FROM olx_user WHERE uid = ANY($1::integer[])'
        const users = await pool.query(queryString, [userIds])

        res.json(users.rows)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'An error occurred' })
    }
});

// update chat

app.put('/update_history/:chat_id', async (req, res) => {
    const { chat_id } = req.params
    const { history } = req.body
    const updated_chat = await pool.query("UPDATE chat SET history = $1 WHERE chat_id = $2", [history, chat_id])
    res.json(updated_chat)
})

app.put('/add_liked/:post_id', async(req, res) => {
    try {
        const { post_id } = req.params
        const { uid } = req.body
        console.log(post_id, uid)
        const updateUser = `
                UPDATE olx_user
                SET liked_posts = array_append(liked_posts, $1)
                WHERE uid = $2;
            `;
        await pool.query(updateUser, [post_id, uid]);
        res.json(updateUser)
    } catch (error) {
        console.error(error.message)
    }
})

app.put('/remove_liked/:post_id', async (req, res) => {
    const { post_id } = req.params;
    const { uid } = req.body;

    const updateUser = `
        UPDATE olx_user
        SET liked_posts = array_remove(liked_posts, $1)
        WHERE uid = $2;
    `;

    try {
        await pool.query(updateUser, [post_id, uid]);
        res.json({ message: 'Post removed from liked_posts array' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(5000, () => {
    console.log('server has started on port 5000')
})