# CPSC 319 Team 12 - HSBC Reservation System

## Getting started:
Retrieve dependencies and build client and server:
```
npm run [--prefix <path-to-root>] build-all
```
Only include the `[...]` part if you are not at the project root, which includes client and server folders (eg. if you are in server folder, then put `--prefix ../`)

## Setup development environment to develop the server
### Using a local DB
1. Install MySQL Community Server, MySQL command line tools, and optionally MySQL Workbench, take note of 'root' password given after installing MySQL Server
https://www.mysql.com/products/
2. Start MySQL Server instance (referred to as DB in the rest of this doc)
3. You need to reset 'root' password given after server installation before using the db locally. First, from the command line, connect to the db.
```
mysql -u root -p <root password>
```
After connected, reset root password.
```
SET PASSWORD = PASSWORD('<your new password>')
```
### <a name="edit-config"></a>Edit config.json in server/config/ to connect to the DB 
```
{
  "development": {
    "username": "username",
    "password": "password",
    "database": "Resource_Booker",
    "host": "localhost",
    "dialect": "mysql"
  },
  ...config for other envs
}
```
- `host`	:	URL of the intended database, either an Amazon RDS MySQL instance (eg. dbinstance.cbfzrjzvg8ac.us-west-2.rds.amazonaws.com) or a local DB instance (eg. localhost)
- `user`	:	user name to connect as, for RDS instance look for it in Amazon RDS console, for localhost it should be 'root' by default
- `password`	:	user password, for RDS instance it should have been set / reset from the RDS console, for localhost it is the new password set after the above section
- `database`	:	database name to connect to (eg. if you create a database within MySQL called Resource_Booker, then put Resource_Booker here)

To connect to the DB, run mysql from the command line.
```
mysql -u <user> -h <host> -P 3306 -p<db password>
```

### Generating the DB schema
1. Run the same command as above, but pass the CreateDB.sql script in
```
mysql -u <user> -h <host> -P 3306 -p<db password> < DB_Scripts/CreateDB.sql
```
2. Ensure sequelize-cli is installed
3. In the /server/ directory, run `sequelize db:migrate`
4. Changes to the existing schema should be done by writing a new database migration, see [Sequelize CLI](https://github.com/sequelize/cli) for more information

### <a name="init-db-data"></a>Initialize DB data
This will add desk data and a default admin to the tables
1. Navigate to DB_Scripts folder from project root
2. Manually change all 'import-path' keywords in PopulateData.sql to the ABSOLUTE path of Desks.csv
3. Run PopulateData.sql from project root to add in the initial data
```
mysql -u <user> -h <host> -P 3306 -p<db password> < DB_Scripts/PopulateData.sql
```
Note: The warnings after running PopulateData.sql are due to the DeskNumber column in Resources table truncating the Desks.csv DeskNum entries with '- FUTURE' in it into '-'

### Starting the archive reservations event
After generating the DB schema, start the event scheduler daemon as a SQL statement:
```SQL
SET GLOBAL event_scheduler = ON;
```
Or set it in a config file so that it will start automatically every time (my.cnf or my.ini on Windows):
```bash
locate my.cnf
locate my.ini
```
Set the config variable at the end of the file:
```
[mysqld]
event_scheduler=ON
```
Ensure that the process is running (look for User: event_scheduler):
```SQL
SHOW PROCESSLIST;
```
Source the .sql file:
```SQL
source ArchiveReservations.sql
```
Ensure that the event has been created:
```SQL
SHOW EVENTS
```
### Edit ses.json in server/config/ to use amazon's email service
```
{
"enable": "true",
"username": "admin@mylasagna.ca",
"nodeMailerConf": {
  "service": "SES-US-WEST-2",
  "auth": {
    "user": "AKIAIBDEKDOWLGPY54IQ",
    "pass": "ApsfD/fWjGLiOLceshisiTO7dS/GW8KGyLLMAAa+S4ZM"
    }
  }
}
```
- `enable` : this file will be ignored if set to false, then the server will use the test gmail account to send emails (see `server/components/reservations.js`)
- `username` : what the receiver will sees as the sender of the email. Note that admin@mylasagna.ca or mylasagna.ca have to be registered with Amazon's SES console
- `nodeMailerConf` : config options for nodemailer library, see its document at `https://nodemailer.com/smtp/`. Basically, `service` should be one of `https://nodemailer.com/smtp/well-known/`, or you can specify the host and port of the smtp server manually based on your SES settings. `user` and `pass` are generated during the SES user creation wizard

## <a name="starting-the-server"></a>Starting the server
Start development server on port 3000: 
```
npm run [--prefix <path-to-root>] serve-dev
```
OR Start production server on http port 80 (requires sudo):
```
npm run [--prefix <path-to-root>] serve
```
If there are build problems, you can try running the below and repeat the `build-all` at the top:
```
npm run [--prefix <path-to-root>] clean
```
The above deletes node_modules folders on both client and server, and the build folder on client

## Note
- For git pull update to main server instance on AWS EC2, do all of the above except [Using a local DB](#Using a local DB) section
- For brand new deployment, same as above, but do the [Edit config.json](#edit-config) and [Initialize DB data](#init-db-data) section to set your initial database connection config and data. Then to make sure the config file is read-only, not tracked by git:
```
chmod 400 config.json
git update-index --assume-unchanged config.json
```
## Testing
1. Create a database devoted for testing and fill in the required information in the test section of the config.json file
2. Inside the server directory, run `npm run test` - seed files will be generated in the data directory and files with a `.test.js` extension will run as a test 

For windows, use `npm run testwin`

## Folder Structure:
```
.
├── components
│   ├── HeaderNavbar
│   └── index.js
├── containers
│   ├── Admin
│   │   ├── Locations
│   │   └── Reservations
│   ├── App
│   ├── index.js
│   ├── Request
│   └── Reservations
├── index.css
├── index.js
└── redux
    ├── modules
    └── store.js
```

## Developer quick guide
To get started, go into the server directory:
```
cd server
```
Install the required modules:
```
npm install
```
Start listening on <http://localhost:8000>:
```
node app.js
```
Then change into the client directory:
```
cd ../client
```
Install the required modules:
```
npm install
```
Edit the `package.json` file to direct requests from client to server's listening port
```
"proxy": "http://localhost:8000",
```
Start client on <http://localhost:3000>:
```
npm start
```

By doing this, client and server codes can be changed independently of each other, without having to rebuild the app everytime
 





