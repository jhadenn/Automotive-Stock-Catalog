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

## Deployment

For deployment, you can:

1. Build the application with `make build` or `npm run build`
2. Deploy the built files (in the `.next` directory)

Custom deployment commands can be added to the `deploy` target in the Makefile.

## Troubleshooting

- **"Module not found" errors:**
  Try deleting the `node_modules` folder and running `npm install` again.

- **Build errors:**
  Make sure you have the correct version of Node.js installed.

- **Tests failing:**
  Check the test output for details on which tests are failing and why.
```

## Summary for Your TA

When explaining this to your TA, you can highlight:

1. **Standardized Build Process**: The Makefile provides a standardized interface for building, testing, and running the application regardless of platform.

2. **Cross-Platform Support**: The project includes both Windows batch scripts and Unix shell scripts to support different development environments.

3. **Developer Onboarding**: The comprehensive documentation in BUILD.md makes it easy for new developers to get started with the project.

4. **CI/CD Readiness**: The scripts are structured in a way that makes them easy to integrate with CI/CD pipelines.

5. **Build Automation**: The scripts automate common tasks and include error handling to catch issues early in the development process.

This approach maintains the existing npm scripts while providing a more standardized interface for building and running the application, which is particularly helpful for new developers who might not be familiar with the specific npm commands used in the project. 