# Node.js Blog Application
This is a simple blog application built using Node.js, Express and PostgreSQL.

## Features
- View blog posts on the home page
- Add, edit, and delete posts via the admin panel
- Responsive design using CSS and Tailwind (optional)

## Technologies
- **Node.js**: Backend runtime
- **Express**: Web framework for handling routes
- **PostgreSQL**: Database for storing blog posts

## Installation
Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (for database)

1. Clone the repository:
    ```bash
    git clone https://github.com/tarretarre/NodeJs-Blog.git
    cd NodeJs-Blog
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Copy `.env.example` file to your .env-file and add in the root directory with the your database credentials.

4. Create a table with posts in your database with these columns:
   - Title
   - Body

5. Run the application:
    ```bash
    npm start
    ```

6. Visit `http://localhost:5000` in your browser.

## Usage
- **Home Page**: Displays the latest blog posts.
- **About Page**: Information about the blogger.
- **Contact Page**: Contact details.
- **Admin Page**: Editing posts.

## Live Demo
You can check the live version of this project here:  
[NodeJs Blog on Render](https://nodejs-blog-l7en.onrender.com/)
