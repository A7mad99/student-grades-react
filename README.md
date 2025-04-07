# Set up the Backend
bash
`cd backend`
<br>
`npm install`
<br>
`npm start`
# Add a .env file with:
 MONGO_URI=your_mongodb_connection_string 
<br>
PORT=5000
<br>
`npm run dev`

# Set up the Frontend
bash
`cd frontend`
<br>
`npm install`
<br>
`npm start`

Frontend will run on http://localhost:3000
<br>
Backend will run on http://localhost:5000

** API Endpoints **

GET	/api/students	Get all students with averages
<br>
GET	/api/students/:id	Get a single student by ID
<br>
POST	/api/students/averages	Calculate group averages

Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Frontend     | React, Material-UI       |
| Backend      | Node.js, Express         |
| Database     | MongoDB, Mongoose        |
| Communication| RESTful APIs (Axios)     |


