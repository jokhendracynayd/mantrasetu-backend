#!/bin/bash

# MantraSetu Docker Development Script
# This script helps manage Docker development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show help
show_help() {
    echo "MantraSetu Docker Development Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start development environment"
    echo "  start-logs  Start development environment and show logs"
    echo "  stop        Stop development environment"
    echo "  restart     Restart development environment"
    echo "  build       Build Docker images"
    echo "  logs        Show application logs"
    echo "  shell       Open shell in app container"
    echo "  clean       Clean up containers and volumes"
    echo "  status      Show container status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start the development environment"
    echo "  $0 logs     # View application logs"
    echo "  $0 shell    # Open shell in app container"
}

# Function to start development environment
start_dev() {
    print_status "Starting MantraSetu development environment..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    # Start services
    docker-compose -f docker-compose.dev.yml up -d
    
    print_success "Development environment started!"
    print_status "Application: http://localhost:3000/api/v1"
    print_status "Health Check: http://localhost:3000/api/v1/health"
    
    # Show container status
    docker-compose -f docker-compose.dev.yml ps
    
    # Wait a moment for services to start
    print_status "Waiting for services to initialize..."
    sleep 3
    
    # Ask user if they want to see logs
    echo ""
    print_warning "Would you like to see the application logs? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Showing application logs (Press Ctrl+C to exit)..."
        docker-compose -f docker-compose.dev.yml logs -f app
    else
        print_status "Development environment is running. Use './docker.sh dev logs' to view logs later."
    fi
}

# Function to start development environment with logs
start_dev_with_logs() {
    print_status "Starting MantraSetu development environment with logs..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    # Start services
    docker-compose -f docker-compose.dev.yml up -d
    
    print_success "Development environment started!"
    print_status "Application: http://localhost:3000/api/v1"
    print_status "Health Check: http://localhost:3000/api/v1/health"
    
    # Show container status
    docker-compose -f docker-compose.dev.yml ps
    
    # Wait a moment for services to start
    print_status "Waiting for services to initialize..."
    sleep 3
    
    # Show logs automatically
    print_status "Showing application logs (Press Ctrl+C to exit)..."
    docker-compose -f docker-compose.dev.yml logs -f app
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping MantraSetu development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped!"
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting MantraSetu development environment..."
    docker-compose -f docker-compose.dev.yml restart
    print_success "Development environment restarted!"
}

# Function to build Docker images
build_images() {
    print_status "Building Docker images..."
    docker-compose -f docker-compose.dev.yml build --no-cache
    print_success "Docker images built successfully!"
}

# Function to show logs
show_logs() {
    print_status "Showing application logs (Press Ctrl+C to exit)..."
    docker-compose -f docker-compose.dev.yml logs -f app
}

# Function to open shell in app container
open_shell() {
    print_status "Opening shell in app container..."
    docker-compose -f docker-compose.dev.yml exec app sh
}

# Function to clean up
cleanup() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show status
show_status() {
    print_status "Container Status:"
    docker-compose -f docker-compose.dev.yml ps
    
    echo ""
    print_status "Docker System Info:"
    docker system df
}

# Main script logic
case "${1:-help}" in
    start)
        start_dev
        ;;
    start-logs)
        start_dev_with_logs
        ;;
    stop)
        stop_dev
        ;;
    restart)
        restart_dev
        ;;
    build)
        build_images
        ;;
    logs)
        show_logs
        ;;
    shell)
        open_shell
        ;;
    clean)
        cleanup
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
