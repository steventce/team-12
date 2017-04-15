# CPSC 319 Team 12 - HSBC Reservation System

The HSBC Reservation System is a webapp that allows employees to reserve desk resources and for admins to manage these resources. It is built using React (with the [create-react-app](https://github.com/facebookincubator/create-react-app) starter) on the front-end, Node.js (with the [Sequelize ORM](http://docs.sequelizejs.com/en/v3/) (object-relational mapping) on the server, and supported by a MySQL database.

This README contains specific instructions to aid developers to setup their environment.

If the local environment is setup already, follow the instructions below to quickly get started. If starting from scratch, go to the [New Installation](#new-installation) section:

## Developer quick start guide

The instructions in this section will guide developers to quickly start developing, assuming they already have a database to connect to. The client and server code can be changed independently of each other and will reload whenever the developer makes a change. Therefore, it is unnecessary to rebuild the app every single time.

Go into the server directory:
```bash
cd server
```
Install the required modules:
```bash
npm install
```
Start listening on <http://localhost:8000>:
```bash
npm run serve-dev
```
Then change into the client directory:
```bash
cd ../client
```
Install the required modules:
```bash
npm install
```
Edit the proxy option in `client/package.json` to direct requests from client to server's listening port:
```js
"proxy": "http://localhost:8000",
```
Start the client on <http://localhost:3000>:
```bash
npm start
```

## <a name="new-installation"></a>New Installation

If this is a new installation of the project and a database has **not** been setup locally already, follow the instructions below.

### Building the project
Install Node and npm if they are not installed already.

Run the following command to retrieve and install dependencies in the `client` and `server` subdirectories, and to also package up the client code.
```
npm run [--prefix <path-to-root>] build-all
```
Only include the `[...]` part if you are not at the project root, which includes client and server folders (eg. if you are in the server folder, then put `--prefix ../`)

### Using a local DB
The instructions below outline how to install and start MySQL.

1. Install MySQL Community Server, MySQL command line tools, and optionally MySQL Workbench (take note of 'root' password given after installing MySQL Server) from [here](https://www.mysql.com/products/)
2. Start MySQL Server instance (referred to as DB in the rest of this README)
3. Reset the 'root' password provided after server installation before using the DB locally. 

First, from the command line, connect to the DB.
```bash
mysql -u root -p <root password>
```

After connected, reset root password.
```sql
SET PASSWORD = PASSWORD('<your new password>')
```

### <a name="edit-config"></a>Edit config.json in `server/config/` to connect to the DB 
```js
{
  "development": {
    "username": "username",
    "password": "password",
    "database": "Resource_Booker",
    "host": "localhost",
    "dialect": "mysql"
  },
  ...config for other envs (test, production)
}
```
- `host`	:	URL of the intended database, either an Amazon RDS MySQL instance (eg. dbinstance.cbfzrjzvg8ac.us-west-2.rds.amazonaws.com) or a local DB instance (eg. localhost)
- `user`	:	user name to connect as, for RDS instance look for it in Amazon RDS console, for localhost it should be 'root' by default
- `password`	:	user password, for RDS instance it should have been set / reset from the RDS console, for localhost it is the new password set after the above section
- `database`	:	database name to connect to (eg. if you create a database within MySQL called Resource_Booker, then put Resource_Booker here)

To connect to the DB, run `mysql` from the command line:
```bash
mysql -u <user> -h <host> -P 3306 -p<db password>
```

### Generating the DB schema
The instructions below outlines how to generate the database schema for the app. The [Sequelize CLI](https://github.com/sequelize/cli) is used to create migrations in order to allow developers to write incremental changes to the database later on.

Run the same command as above, but pass the CreateDB.sql script in to create a new database:
```bash
mysql -u <user> -h <host> -P 3306 -p<db password> < DB_Scripts/CreateDB.sql
```

Ensure sequelize-cli is installed:
```bash
cd server/
npm install
```

Run the migrations (this will create all the necessary tables, constraints etc.):
```bash
sequelize db:migrate
```
Changes to the existing schema should be done by writing a new database migration and then running the migration command above, see [Sequelize CLI](https://github.com/sequelize/cli) for more information.

### <a name="init-db-data"></a>Initialize DB data
Following the instructions below will add desk data and a default admin to the tables generated in the previous section.

Navigate to the DB_Scripts folder from the project root:
```bash
cd DB_Scripts
```
Manually change all `<repo root>` keywords in PopulateData.sql to the ABSOLUTE path of Desks.csv.

Run PopulateData.sql from project root to add in the initial data:
```bash
mysql -u <user> -h <host> -P 3306 -p<db password> < DB_Scripts/PopulateData.sql
```
Note: The warnings after running PopulateData.sql are due to the DeskNumber column in Resources table truncating the Desks.csv DeskNum entries with '- FUTURE' in it into '-'

### [Optional] Starting the archive reservations event
The achive reservations event is a MySQL event that automatically checks and moves old reservations to an archive table once every day. After generating the DB schema, follow the instructions below: 

Within mysql, start the event scheduler daemon as a SQL statement:
```sql
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
```sql
SHOW PROCESSLIST;
```

Source the .sql file:
```sql
source ArchiveReservations.sql
```

Ensure that the event has been created:
```sql
SHOW EVENTS
```

### <a name="starting-the-server"></a>Starting the server
Start the development server. It will use port 3000 by default: 
```bash
npm run [--prefix <path-to-root>] serve-dev
```

OR Start production server on http port 80 (requires sudo):
```bash
npm run [--prefix <path-to-root>] serve
```

**For Windows environment, which will use port 3000:
```bash
npm run [--prefix <path-to-root>] serve-win
```

If there are build problems, you can try running the line below and repeat the `build-all` line at the top:
```bash
npm run [--prefix <path-to-root>] clean
```
The above deletes the `node_modules` folders on both the client and server, and also the build folder in the client folder.

## AWS
If using Amazon Web Services, refer to the instructions below.

### [Optional] Edit ses.json in server/config/ to use Amazon's email service
```js
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

## Notes
- For git pull update to main server instance on AWS EC2, do all of the above except [Using a local DB](#Using a local DB) section
- For a brand new deployment, same as above, but do the [Edit config.json](#edit-config) and [Initialize DB data](#init-db-data) section to set your initial database connection config and data. Then to make sure the config file is read-only and not tracked by git:
```bash
chmod 400 config.json
git update-index --assume-unchanged config.json
```

## Testing
The team uses Mocha, Chai, and Supertest for unit testing backend server code. Install these if they are not installed already from previous steps.
```bash
cd server
npm install
```

Create a database devoted for testing from mysql. Login to mysql and run a create database command:
```SQL
CREATE DATABASE Resource_Booker_Test
```

Fill in the required information in the test section of the `server/config.json` file.
```js
{
  ...development config
  "test": {
    "username": "username",
    "password": "password",
    "database": "Resource_Booker_Test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "pool": {
      "maxIdleTime": 600000
    },
    "logging": false
  },
  ...production config
}
```

Inside the `server` directory, run:
```bash
npm run test
```
Seed files will be generated in the `server/data` directory and files inside the `server/test` directory with a `.test.js` extension will run as a test. 

For Windows, use `npm run testwin`

## Folder Structure:
Below is a tree of the app's folder structure for reference. The project is separated into the client and server directories.
```
.
├── client
│   ├── build
│   │   ├── asset-manifest.json
│   │   ├── favicon.ico
│   │   ├── hsbc.ico
│   │   ├── index.html
│   │   └── static
│   │       ├── css (compiled css files)
│   │       ├── js (compiled js files)
│   │       └── media (fonts and other static media files)
│   ├── etc
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── hsbc.ico
│   │   └── index.html
│   ├── README.md
│   └── src
│       ├── components
│       │   ├── AlertMessage
│       │   │   ├── AlertMessage.js
│       │   │   └── index.js
│       │   ├── ConfirmRequestModal
│       │   │   ├── ConfirmRequestModal.css
│       │   │   ├── ConfirmRequestModal.js
│       │   │   └── index.js
│       │   ├── HeaderNavbar
│       │   │   └── HeaderNavbar.js
│       │   ├── index.js
│       │   ├── Loader
│       │   │   ├── index.js
│       │   │   ├── Loader.css
│       │   │   └── Loader.js
│       │   ├── Locations
│       │   │   ├── AddLocationForm
│       │   │   │   ├── AddLocationForm.js
│       │   │   │   └── index.js
│       │   │   ├── EditLocationForm
│       │   │   │   ├── EditLocationForm.js
│       │   │   │   └── index.js
│       │   │   ├── index.js
│       │   │   ├── LocationsModal
│       │   │   │   ├── index.js
│       │   │   │   └── LocationsModal.js
│       │   │   └── LocationsTable
│       │   │       ├── index.js
│       │   │       └── LocationsTable.js
│       │   ├── ReservedTable
│       │   │   ├── ReservedTableAdmin.css
│       │   │   ├── ReservedTableAdmin.js
│       │   │   ├── ReservedTable.css
│       │   │   └── ReservedTable.js
│       │   └── Resources
│       │       ├── AddResourceForm
│       │       │   ├── AddResourceForm.js
│       │       │   └── index.js
│       │       ├── EditResourceForm
│       │       │   ├── EditResourceForm.js
│       │       │   └── index.js
│       │       ├── ResourcesModal
│       │       │   ├── index.js
│       │       │   └── ResourcesModal.js
│       │       └── ResourcesTable
│       │           ├── index.js
│       │           └── ResourcesTable.js
│       ├── containers
│       │   ├── Admin
│       │   │   ├── Admin.js
│       │   │   ├── Locations
│       │   │   │   ├── index.js
│       │   │   │   └── Locations.js
│       │   │   ├── Reservations
│       │   │   │   └── Reservations.js
│       │   │   └── Resources
│       │   │       ├── index.js
│       │   │       └── ResourcesContainer.js
│       │   ├── App
│       │   │   ├── App.css
│       │   │   ├── App.js
│       │   │   └── App.test.js
│       │   ├── index.js
│       │   ├── Request
│       │   │   ├── index.js
│       │   │   ├── RequestContainer.js
│       │   │   ├── Request.css
│       │   │   └── Request.js
│       │   └── Reservations
│       │       └── Reservations.js
│       ├── images
│       │   ├── floor_1.png
│       │   ├── floor_2.png
│       │   ├── floor_3.png
│       │   └── floor_4.png
│       ├── index.css
│       ├── index.js
│       ├── redux
│       │   ├── modules
│       │   │   ├── AdminReducer.js
│       │   │   ├── LocationReducer.js
│       │   │   ├── ReservationReducer.js
│       │   │   └── ResourceReducer.js
│       │   └── store.js
│       ├── resources
│       │   ├── desks.js
│       │   ├── locations.js
│       │   └── reservations.js
│       ├── service.js
│       └── utils
│           └── formatter.js
├── DB_Scripts
│   ├── ArchiveReservations.sql
│   ├── CreateDB.sql
│   ├── Desks.csv
│   ├── PopulateData.sql
│   └── TestReservations.sql
├── output.sql
├── output.txt
├── package.json
├── README.md
└── server
    ├── app.js
    ├── components
    │   ├── admin.js
    │   ├── locations.js
    │   ├── reservations.js
    │   └── resources.js
    ├── config
    │   ├── config.json
    │   ├── login.js
    │   └── ses.json
    ├── coverage
    │   ├── coverage.json
    │   ├── lcov.info
    │   └── lcov-report (report files)
    ├── data
    │   ├── desks.csv
    │   ├── desks.seed.json
    │   ├── locations.seed.json
    │   ├── resources.seed.json
    │   ├── resourceTypes.seed.json
    │   └── test.csv
    ├── etc
    ├── migrations
    │   ├── 20170320094417-initial.js
    │   ├── 20170320105040-update-reservation-resource-fk.js
    │   ├── 20170331045101-add_reservations_archive.js
    │   └── sql
    │       ├── admins.sql
    │       ├── desks.sql
    │       ├── locations.sql
    │       ├── reservations_archive.sql
    │       ├── reservations.sql
    │       ├── resources.sql
    │       └── resource_types.sql
    ├── models
    │   ├── admin.js
    │   ├── desk.js
    │   ├── index.js
    │   ├── location.js
    │   ├── reservation.js
    │   ├── resource.js
    │   └── resourceType.js
    ├── package.json
    ├── README.md
    ├── seeders
    └── test
        ├── components
        │   ├── adminReservations.test.js
        │   ├── adminResources.test.js
        │   ├── admin.test.js
        │   ├── locations.test.js
        │   ├── reservations.test.js
        │   └── resources.test.js
        ├── models
        ├── nightwatch-test
        │   ├── bin
        │   │   ├── geckodriver.exe
        │   │   └── selenium-server-standalone-3.0.1.jar
        │   ├── nightwatch.js
        │   ├── nightwatch.json
        │   └── tests
        │       ├── adminReservations.js
        │       ├── home.js
        │       ├── locations.js
        │       ├── request.js
        │       └── resources.js
        └── utils
            ├── dbUtils.js
            └── generateSeeds.js
```
