<h1 align="center" id="title">Automotive Inventory 🚗</h1>

# About 
<p id="description">

This project will be a comprehensive inventory management and cataloging application for an auto retail business. It will be the centre of the store's inventory management for vehicles, parts, and tools, and its functionality will cater towards different users - owners, managers, employees, and customers. The application will allow for the adding, editing, and removing of products, searching and filtering the catalog, managing stock levels, and secure access control. The application will also offer features such as guest browsing and relevancy-based searching for customers, and analytics reporting to drive decision-making.

  
<h2>🧐 Features</h2>


Here're some of the project's best features:

*   Creating, deleting, and editing products
*   Login System
*   Editing Stock Levels
*   More coming soon...


<h2>💻 Built with</h2>

Technologies used in the project:

*   Next.js
*   React
*   Tailwind CSS
*   Supabase

<h2> Docs </h2>

How to run (website hosting is a work in progress!)

First, create a env.local file in the project's root directory with these environment variables obtained from DOUBLE J DUBZ INC (please email jhaden.goy@ontariotechu.net). 
```
NEXT_PUBLIC_SUPABASE_URL= *insert url here*
NEXT_PUBLIC_SUPABASE_ANON_KEY= *insert api key here*
SUPABASE_SERVICE_ROLE_KEY=*insert role key here*
```

To get started, clone the repository:
```console
git clone https://github.com/jhadenn/Automotive-Stock-Catalog
```

Then, make sure you have node.js installed, and install node_modules by running: 
```console
npm install
```

If you want to start from a fresh database with the default mock products run (Optional step: if not ran, our current database will show):
```console
npm run seed
```

To run the application run: 
```console
npm run dev
```

## Testing
To run the available unit tests we have created for the program (i.e CRUD operations and Image Uploading)
```console
npm test
```

# Build Instructions for Automotive-Stock-Catalog


This document provides detailed instructions for building, testing, and running the Automotive-Stock-Catalog application.


## Prerequisites


- Node.js (v18 or later recommended)
- npm (comes with Node.js)
- Git


## Getting Started


1. Clone the repository:
   ```
   git clone <repository-url>
   cd Automotive-Stock-Catalog
   ```


2. Choose your preferred build method:
   - [Using Make](#using-make)
   - [Using Windows Scripts](#using-windows-scripts)
   - [Using Unix Scripts](#using-unix-scripts)
   - [Using npm Directly](#using-npm-directly)


## Using Make


If you have Make installed, you can use the following commands:


- **Setup (install dependencies):**
  ```
  make setup
  ```


- **Build the application:**
  ```
  make build
  ```


- **Run development server:**
  ```
  make dev
  ```


- **Run tests:**
  ```
  make test
  ```


- **Clean build artifacts:**
  ```
  make clean
  ```


- **See all available commands:**
  ```
  make help
  ```


## Using Windows Scripts


On Windows, you can use the batch scripts in the `scripts` directory:


- **Setup (install dependencies):**
  ```
  scripts\setup.bat
  ```


- **Build the application:**
  ```
  scripts\build.bat
  ```


- **Run development server:**
  ```
  scripts\dev.bat
  ```


- **Run tests:**
  ```
  scripts\test.bat
  ```


- **Complete setup (install, build, and test):**
  ```
  scripts\run-all.bat
  ```


## Using Unix Scripts


On Unix-based systems (Linux, macOS), you can use the shell scripts in the `scripts` directory:


- **Setup (install dependencies):**
  ```
  ./scripts/setup.sh
  ```


- **Build the application:**
  ```
  ./scripts/build.sh
  ```


- **Run development server:**
  ```
  ./scripts/dev.sh
  ```


- **Run tests:**
  ```
  ./scripts/test.sh
  ```


- **Complete setup (install, build, and test):**
  ```
  ./scripts/run-all.sh
  ```


Note: If you get a "Permission denied" error, make the scripts executable:


```bash
chmod +x scripts/*.sh
```


## Using npm Directly


You can also use npm commands directly:


- **Setup (install dependencies):**
  ```
  npm install
  ```


- **Build the application:**
  ```
  npm run build
  ```


- **Run development server:**
  ```
  npm run dev
  ```


- **Run tests:**
  ```
  npm test
  ```


## Database Seeding


To populate the database with sample data:


```
npm run seed
```


or using Make:


```
make seed
```


## Development Workflow


1. Install dependencies
2. Run tests to ensure everything is working
3. Start the development server
4. Make your changes
5. Run tests again to ensure your changes didn't break anything
6. Build the application to make sure it builds successfully



## Troubleshooting


- **"Module not found" errors:**
  Try deleting the `node_modules` folder and running `npm install` again.


- **Build errors:**
  Make sure you have the correct version of Node.js installed.


- **Tests failing:**
  Check the test output for details on which tests are failing and why.
```
  



