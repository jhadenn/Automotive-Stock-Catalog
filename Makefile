# Automotive-Stock-Catalog Makefile
# Provides standard build targets for development and deployment

.PHONY: setup build dev test clean deploy

# Default target
all: setup build

# Install dependencies
setup:
	@echo "Installing dependencies..."
	npm install

# Build the production application
build:
	@echo "Building application..."
	npm run build

# Run development server
dev:
	@echo "Starting development server..."
	npm run dev

# Run tests
test:
	@echo "Running tests..."
	npm test

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf .next
	rm -rf out

# Run database seed script
seed:
	@echo "Seeding database..."
	npm run seed

# Help target
help:
	@echo "Automotive-Stock-Catalog make targets:"
	@echo "  setup    - Install dependencies"
	@echo "  build    - Build production application"
	@echo "  dev      - Start development server"
	@echo "  test     - Run tests"
	@echo "  clean    - Remove build artifacts"
	@echo "  deploy   - Build and deploy application"
	@echo "  seed     - Run database seed script"
	@echo "  all      - Setup and build (default)"
	@echo "  help     - Show this help message" 