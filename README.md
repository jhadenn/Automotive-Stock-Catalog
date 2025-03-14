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

  



