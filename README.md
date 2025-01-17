
# Documentation for QueryBox

## 1. Introduction

### Application Name
QueryBox

### Description
This application is an API testing tool similar to Postman or Insomnia. It allows developers and testers to send, receive, and analyze HTTP requests and responses, simplifying the debugging and integration process.

### Target Audience
- **End Users:** Developers and QA testers who need to test APIs during development.
- **Administrators:** Those responsible for managing API environments and configurations.
- **Organizations:** Teams requiring a centralized and efficient tool for API testing and collaboration.

---

## 2. Prerequisites

### Hardware Requirements
- Minimum:
  - **Processor:** Dual-core 2 GHz
  - **Memory:** 4 GB RAM
  - **Storage:** 200 MB available disk space
- Recommended:
  - **Processor:** Quad-core 3 GHz
  - **Memory:** 8 GB RAM
  - **Storage:** 1 GB available disk space

### Software Requirements
1. **Node.js**
   - Recommended version: `>=18.0.0`
   - [Download Node.js here](https://nodejs.org/)
2. **Package Manager**
   - NPM (comes with Node.js) or Yarn (optional).
3. **Database** (if applicable)
   - MongoDB: Recommended for storing test results and environment configurations.

### Supported Operating Systems
- **Windows:** 10 or later
- **Mac OS:** 10.15 (Catalina) or later
- **Linux:** Ubuntu 20.04 or later, or equivalent distributions.

### Environment Variables
The following environment variables are required to configure the application:
- `VIEWER_GRADE`: Default user permissions for API testers.
- `ADMIN_GRADE`: Administrator-level permissions.
- `BASE_URL`: The base URL for the application.
- `PORT`: The port number the application runs on (e.g., 5001).
- `API_VERSION`: Version of the API being tested.
- `ENV`: Application environment (e.g., development, production).
- `MONGO_DB_URI`: Connection string for the MongoDB database.
- `JWT_SECRET`: Secret key for JSON Web Token authentication.
- `MAIL`: Email address for notifications.
- `HOST_MAIL`: SMTP server for email.
- `PORT_MAIL`: SMTP server port.

### Example `.env` File
```plaintext
VIEWER_GRADE=user
ADMIN_GRADE=admin
BASE_URL=http://localhost
PORT=5001
API_VERSION=v1
ENV=development
MONGO_DB_URI=mongodb://user:password@localhost:27017/dbname
JWT_SECRET=your_jwt_secret
MAIL=support@example.com
HOST_MAIL=smtp.example.com
PORT_MAIL=587
```
## 3. Installation

Follow these steps to set up the application on your local machine:

### Step 1: Clone the Repository
Clone the repository from GitHub and navigate to the project directory:
```bash
git clone https://github.com/PierreLs63/QueryBox.git
cd QueryBox
```

### Step 2: Install Dependencies

The application is divided into two parts:  `frontend`  and  `backend`. You need to install dependencies for both:

#### Backend

Navigate to the  `backend`  directory and install dependencies:

`cd backend
npm install` 

#### Frontend

Navigate to the  `frontend`  directory and install dependencies:

```bash
cd ../frontend
npm install
```

### Step 3: Configure the Application

The application requires a  `.env`  file in both the  `frontend`  and  `backend`  directories to store environment variables.

#### Backend  `.env`  File

Create a  `.env`  file in the  `backend`  directory and include the following [variables](#Example-`.env`-File):

#### Frontend  `.env`  File

Create a  `.env`  file in the  `frontend`  directory and include the following variable:

```plaintext
REACT_APP_API_BASE_URL=http://localhost:5137/api/v1`
```

### Step 4: Run the Application

Start both the frontend and backend:

#### Start the Backend

In the  `backend`  directory:

```bash
npm start`
```

#### Start the Frontend

In the  `frontend`  directory:

```bash
npm run
``` 

### Access the Application

-   **Frontend:**  Open your browser and go to  `http://localhost:3000`.
-   **Backend:**  The API will run on  `http://localhost:5001`.
