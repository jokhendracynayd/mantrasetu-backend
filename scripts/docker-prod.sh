#!/bin/bash

# MantraSetu Docker Production Script
# This script helps manage Docker production environment

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
    echo "MantraSetu Docker Production Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start production environment"
    echo "  stop        Stop production environment"
    echo "  restart     Restart production environment"
    echo "  build       Build production Docker images"
    echo "  deploy      Deploy to production (build + start)"
    echo "  logs        Show application logs"
    echo "  shell       Open shell in app container"
    echo "  backup      Backup production data"
    echo "  restore     Restore production data"
    echo "  status      Show container status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy   # Build and deploy to production"
    echo "  $0 logs     # View production logs"
    echo "  $0 backup   # Backup production data"
}

# Function to start production environment
start_prod() {
    print_status "Starting MantraSetu production environment..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    # Check if production compose file exists
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_error "Production compose file not found. Please create docker-compose.prod.yml"
        exit 1
    fi
    
    # Start services
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Production environment started!"
    print_status "Application: http://localhost:3000/api/v1"
    print_status "Health Check: http://localhost:3000/api/v1/health"
    
    # Show container status
    docker-compose -f docker-compose.prod.yml ps
}

# Function to stop production environment
stop_prod() {
    print_status "Stopping MantraSetu production environment..."
    docker-compose -f docker-compose.prod.yml down
    print_success "Production environment stopped!"
}

# Function to restart production environment
restart_prod() {
    print_status "Restarting MantraSetu production environment..."
    docker-compose -f docker-compose.prod.yml restart
    print_success "Production environment restarted!"
}

# Function to build production images
build_prod() {
    print_status "Building production Docker images..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    print_success "Production Docker images built successfully!"
}

# Function to deploy to production
deploy_prod() {
    print_status "Deploying MantraSetu to production..."
    
    # Build images
    build_prod
    
    # Start services
    start_prod
    
    print_success "Production deployment completed!"
}

# Function to show logs
show_logs() {
    print_status "Showing production logs (Press Ctrl+C to exit)..."
    docker-compose -f docker-compose.prod.yml logs -f app
}

# Function to open shell in app container
open_shell() {
    print_status "Opening shell in production app container..."
    docker-compose -f docker-compose.prod.yml exec app sh
}

# Function to backup production data
backup_data() {
    print_status "Creating production data backup..."
    
    # Create backup directory
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup database (if using containerized database)
    if docker-compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
        print_status "Backing up PostgreSQL database..."
        docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U mantrasetu_user mantrasetu_prod > "$BACKUP_DIR/database.sql"
    fi
    
    # Backup Redis data (if using containerized Redis)
    if docker-compose -f docker-compose.prod.yml ps redis | grep -q "Up"; then
        print_status "Backing up Redis data..."
        docker-compose -f docker-compose.prod.yml exec -T redis redis-cli --rdb - > "$BACKUP_DIR/redis.rdb"
    fi
    
    # Backup application logs
    print_status "Backing up application logs..."
    docker-compose -f docker-compose.prod.yml exec -T app tar -czf - /app/logs > "$BACKUP_DIR/logs.tar.gz"
    
    print_success "Backup completed: $BACKUP_DIR"
}

# Function to restore production data
restore_data() {
    print_warning "This will restore production data from backup. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Please enter backup directory path:"
        read -r backup_path
        
        if [ ! -d "$backup_path" ]; then
            print_error "Backup directory not found: $backup_path"
            exit 1
        fi
        
        print_status "Restoring production data from: $backup_path"
        
        # Restore database
        if [ -f "$backup_path/database.sql" ]; then
            print_status "Restoring PostgreSQL database..."
            docker-compose -f docker-compose.prod.yml exec -T postgres psql -U mantrasetu_user -d mantrasetu_prod < "$backup_path/database.sql"
        fi
        
        # Restore Redis data
        if [ -f "$backup_path/redis.rdb" ]; then
            print_status "Restoring Redis data..."
            docker-compose -f docker-compose.prod.yml exec -T redis redis-cli --pipe < "$backup_path/redis.rdb"
        fi
        
        print_success "Data restore completed!"
    else
        print_status "Restore cancelled."
    fi
}

# Function to show status
show_status() {
    print_status "Production Container Status:"
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    print_status "Docker System Info:"
    docker system df
    
    echo ""
    print_status "Resource Usage:"
    docker stats --no-stream
}

# Main script logic
case "${1:-help}" in
    start)
        start_prod
        ;;
    stop)
        stop_prod
        ;;
    restart)
        restart_prod
        ;;
    build)
        build_prod
        ;;
    deploy)
        deploy_prod
        ;;
    logs)
        show_logs
        ;;
    shell)
        open_shell
        ;;
    backup)
        backup_data
        ;;
    restore)
        restore_data
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
