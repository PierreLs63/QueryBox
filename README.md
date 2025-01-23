# QueryBox
web software like postman or insomnia.

to use this application 

````
# Clone the repository
git clone https://github.com/PierreLs63/QueryBox.git
cd QueryBox
# Install the dependencies
npm install
# Start the application
npm start
````

.env file should contain

````
ENV=development or production
MONGO_DB_URI=your mongodb database
JWT_SECRET=your secret key
PORT=port of the server
BASE_URL=https://localhost
PORT=3000
API_VERSION=v1
MAIL=your mail, for example : noreply@querybox.fr
HOST_MAIL=host for example : localhost
PORT_MAIL=port used to send mail, for example : 1025
CLIENT_URL=link to the client with the port, for example : http://localhost:5173
````

If you don't use MailDev you should provide a username and password

````
USER_MAIL=...
PASSWORD_MAIL=...
````

test
