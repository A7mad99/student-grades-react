Set up the Backend
bash
cd backend
npm install
# Add a .env file with:
# MONGO_URI=your_mongodb_connection_string
# PORT=5000
npm run dev

Set up the Frontend
bash
cd ../frontend
npm install
npm start

Frontend will run on http://localhost:3000
Backend will run on http://localhost:5000

API Endpoints
Method	Endpoint	Description
GET	/api/students	Get all students with averages
GET	/api/students/:id	Get a single student by ID
POST	/api/students/averages	Calculate group averages

Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Frontend     | React, Material-UI       |
| Backend      | Node.js, Express         |
| Database     | MongoDB, Mongoose        |
| Communication| RESTful APIs (Axios)     |


