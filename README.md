# QueryBox
web software like postman or insomnia.

to use this application 

````
# Clone the repository
git clone https://github.com/your-username/QueryBox.git
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
MAIL=your mail, for example : noreply@querybox.fr
HOST_MAIL=host for example : localhost
PORT_MAIL=port used to send mail, for example : 1025
````

If you don't use MailDev you should provide a username and password

````
USER_MAIL=...
PASSWORD_MAIL=...
````