# To-Do List

This is a simple To-Do List application. It allows you to add, edit and delete tasks. It also allows you to mark tasks as completed and remove them when needed.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installing

Clone the repository:
```bash
git clone https://github.com/j-rutkowski/todo-bookingcom.git
```
#### Server
1. Install the dependencies for the server:
```bash
cd todo-bookingcom/server
npm install
```
2. Set up the database:
```bash
npm run db:setup
```
3. Start the server:
```bash
npm start
```
The server will be running on port 3000, you can change it in the server/.env file.

#### Client
1. Install the dependencies for the client:
```bash
cd ../client
npm install
```
2. Start the client:
```bash
npm run dev
```

Now you can access the application at http://localhost:5173/