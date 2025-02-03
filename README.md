
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
   - MongoDB: Recommended for storing test results and environment configurations. (used only if you are willing to self-host your database)

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
VIEWER_GRADE=10
ADMIN_GRADE=20
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

The application requires a `.env` file in the `backend` directory to store environment variables.  

#### Backend `.env` File  

Create a `.env` file in the `backend` directory and include the following [variables](#example-env-file).  

#### Frontend  `src/utils/variables.js`  File

Change a  `src/utils/variables.js`  file in the  `frontend`  directory and include the following variable :

```plaintext
BaseURL=http://localhost:5173/api/v1
```

### Step 4: Launch Maildev or Use Your Own SMTP Server  

## Maildev
If you want to test email functionality locally, you can use Maildev, a simple SMTP server that captures outgoing emails for testing purposes.  

First, ensure that Docker Desktop is installed and running on your computer. Then, run the following command in the bash terminal (you may need administrator privileges):  

```bash
docker run -p 1080:1080 -p 1025:1025 maildev/maildev
```  

After that, you can open your browser and go to `http://localhost:1080` to access the Maildev web interface.

Update the `.env` file, set the `PORT_MAIL` to `1025`. The `MAIL` and `HOST_MAIL` values can be any valid values, for example :  

```plaintext
MAIL=noreply@querybox.com
HOST_MAIL=smtp.querybox.com
PORT_MAIL=1025
```  


## Using Your Own SMTP Server  

If you prefer a real SMTP server, you can configure the application to use Gmail, Outlook, or any custom SMTP provider.  

Example with Gmail:  

```plaintext
MAIL=querybox@gmail.com
HOST_MAIL=smtp.gmail.com
PORT_MAIL=587
```

Please note that it may not work if:  
- **You have two-factor authentication (2FA) enabled**: You must generate an [App Password](https://myaccount.google.com/apppasswords) instead of using your regular password.  
- **Less Secure Apps is disabled**: Google has restricted this option for security reasons.  
- **Your provider blocks SMTP connections**: Some networks or ISPs may restrict outgoing SMTP traffic.  

For other providers, update `MAIL`, `HOST_MAIL` and `PORT_MAIL` accordingly.

### Step 5: Run the Application

Start both the frontend and backend:

#### Start the Backend

In the  `backend`  directory:

```bash
npm start
```
or
```bash
npm run nodemon
```
If you prefer to use Nodemon

#### Start the Frontend

In the  `frontend`  directory:

```bash
npm run dev
``` 

### Access the Application

-   **Frontend:**  Open your browser and go to  `http://localhost:5173`.
-   **Backend:**  The API will run on  `http://localhost:5001`.

## 5. Project Structure

The project is structured into various directories and files to ensure maintainability and scalability. Below is a description of the main components:

### Frontend directory 

### Root Directory
- `.env`: Contains the environment variables needed for the application, such as API keys, database URLs, and other configurations.
- `.gitignore`: Specifies files and directories to be ignored by Git.
- `package.json`: Manages dependencies, scripts, and project metadata.
- `package-lock.json`: Automatically generated file to lock dependency versions.
- `vite.config.js`: Configuration file for Vite, used to optimize and build the frontend.

### Directories

#### **public**
Contains static assets that do not need processing by the bundler. These files are directly served as they are.

#### **src**
This is the main source folder containing all the application code and resources. It is further divided into subdirectories:
  
- **`assets`**: Stores images, fonts, and other static resources used in the application.
- **`components`**: Houses reusable React components to build the user interface.
- **`context`**: Contains context providers for managing global states using React Context API.
- **`hooks`**: Custom hooks to encapsulate and reuse logic across components.
- **`pages`**: Represents individual pages or views of the application.
- **`utils`**: Includes utility functions and helpers, such as `variables.js`.
- **`zustand`**: A folder that appears to store configurations or files related to the `zustand` state management library.

### Key Files in `src`
- `variables.js`: A utility file that might define constants or configuration variables used throughout the app.

### Other Key Files
- `App.jsx`: The main application component that defines the overall structure of the app.
- `main.jsx`: The entry point of the React application, where the root component is rendered.
- `index.html`: The HTML template file used by Vite to inject the bundled JavaScript.

This structured organization ensures clarity, making the codebase easy to understand and modify.

### Backtend directory 

The backend of the application is organized to ensure clarity and maintainability. Below is the detailed structure and purpose of each directory and file:

### Root Directory
- `.Dockerfile`: The Docker configuration file used to containerize the backend application.
- `.env`: Contains environment variables required for the backend (e.g., database URI, JWT secret, API keys).
- `.gitignore`: Specifies files and directories to exclude from version control.
- `index.js`: The main entry point of the backend application.
- `package.json`: Manages the backend dependencies, scripts, and metadata.
- `package-lock.json`: Locks the exact dependency versions for consistency.
- `README.md`: Documentation file for the backend.

### Directories

#### **controllers**
Contains the logic for handling various API requests. Each file corresponds to a specific feature:
- `auth.js`: Handles authentication-related operations (e.g., login, signup).
- `collection.js`: Manages operations related to collections.
- `history.js`: Handles request or response history-related logic.
- `request.js`: Processes API requests.
- `response.js`: Manages API responses.
- `workspace.js`: Handles operations related to workspaces.

#### **middleware**
This folder contains middleware functions used to intercept and process requests:
- `protectRoute.js`: Ensures routes are accessible only to authenticated users.
- `verifiedUser.js`: Confirms if a user is verified before granting access.

#### **models**
Defines the data models used by the application to interact with the database:
- `Collection.js`: Represents a collection entity in the database.
- `ParamRequest.js`: Defines parameters for API requests.
- `Request.js`: Represents API requests stored in the database.
- `Response.js`: Represents API responses stored in the database.
- `User.js`: Represents user information.
- `Workspace.js`: Represents a workspace entity.

#### **routes**
Defines the API endpoints and their respective controllers:
- `auth.js`: Routes related to authentication (e.g., `/login`, `/signup`).
- `collection.js`: Routes for managing collections.
- `history.js`: Routes for accessing request/response history.
- `request.js`: Routes for API request management.
- `response.js`: Routes for managing API responses.
- `workspace.js`: Routes for workspace management.

#### **utils**
Contains utility functions to support the backend:
- `connectMongoDB.js`: Handles the connection to the MongoDB database.
- `generateToken.js`: Generates JWT tokens for user authentication.
- `sendMail.js`: Handles sending emails (e.g., verification, password reset).

#### **public**
A placeholder directory for static files that might be served by the backend.

#### **node_modules**
Contains all the installed dependencies for the backend project.



