# CPSC 319 Team 12 - HSBC Reservation System
###
To retrieve dependencies and build client and server:
```
npm run build-all
```
Start development server on port 3000: 
```
npm run serve-dev
```
Start production server on http port 80 (requires root):
```
npm run serve
```
If there are build problems, you can try running the below and repeat the first step:
```
npm run clean
```
The above delete node_modules folders on both client and server, and the build folder on client

## Client Side Quick Start
This project uses [create-react-app](https://github.com/facebookincubator/create-react-app) as a starter for the team's front-end.

To get started, change into the client directory:
```
cd client
```
Install the required modules:
```
npm install
```
Start developing on <http://localhost:3000>:
```
npm start
```
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
