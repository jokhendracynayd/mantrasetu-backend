#!/bin/bash

# MantraSetu Docker Utilities Script
# This script provides utility functions for Docker management

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
    echo "MantraSetu Docker Utilities Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  prune       Clean up unused Docker resources"
    echo "  logs        Show logs for all containers"
    echo "  stats       Show resource usage statistics"
    echo "  health      Check health of all services"
    echo "  network     Show network information"
    echo "  volumes     Show volume information"
    echo "  images      Show Docker images"
    echo "  containers  Show all containers"
    echo "  monitor     Monitor containers in real-time"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 prune    # Clean up unused resources"
    echo "  $0 health   # Check service health"
    echo "  $0 monitor  # Monitor containers"
}

# Function to prune Docker resources
prune_resources() {
    print_status "Cleaning up unused Docker resources..."
    
    print_warning "This will remove:"
    echo "  - Stopped containers"
    echo "  - Unused networks"
    echo "  - Dangling images"
    echo "  - Build cache"
    echo ""
    print_warning "Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        docker system prune -f
        print_success "Docker resources cleaned up!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show logs for all containers
show_all_logs() {
    print_status "Showing logs for all MantraSetu containers..."
    
    # Get all containers with mantrasetu in the name
    containers=$(docker ps -a --filter "name=mantrasetu" --format "{{.Names}}")
    
    if [ -z "$containers" ]; then
        print_warning "No MantraSetu containers found."
        return
    fi
    
    for container in $containers; do
        echo ""
        print_status "=== Logs for $container ==="
        docker logs --tail=50 "$container"
    done
}

# Function to show resource usage statistics
show_stats() {
    print_status "Docker resource usage statistics:"
    docker stats --no-stream
    
    echo ""
    print_status "Docker system information:"
    docker system df
}

# Function to check health of all services
check_health() {
    print_status "Checking health of all MantraSetu services..."
    
    # Check if containers are running
    containers=$(docker ps --filter "name=mantrasetu" --format "{{.Names}}:{{.Status}}")
    
    if [ -z "$containers" ]; then
        print_warning "No MantraSetu containers are running."
        return
    fi
    
    echo ""
    print_status "Container Health Status:"
    for container_info in $containers; do
        container_name=$(echo "$container_info" | cut -d: -f1)
        container_status=$(echo "$container_info" | cut -d: -f2-)
        
        if [[ "$container_status" == *"Up"* ]]; then
            echo -e "  ${GREEN}✓${NC} $container_name: $container_status"
        else
            echo -e "  ${RED}✗${NC} $container_name: $container_status"
        fi
    done
    
    # Check application health endpoint
    echo ""
    print_status "Application Health Check:"
    if curl -s http://localhost:3000/api/v1/health > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Application is responding"
    else
        echo -e "  ${RED}✗${NC} Application is not responding"
    fi
}

# Function to show network information
show_network_info() {
    print_status "Docker network information:"
    docker network ls
    
    echo ""
    print_status "MantraSetu network details:"
    if docker network ls | grep -q "mantrasetu"; then
        docker network inspect mantrasetu-network 2>/dev/null || print_warning "mantrasetu-network not found"
    else
        print_warning "No MantraSetu networks found"
    fi
}

# Function to show volume information
show_volume_info() {
    print_status "Docker volume information:"
    docker volume ls
    
    echo ""
    print_status "MantraSetu volume details:"
    volumes=$(docker volume ls --filter "name=mantrasetu" --format "{{.Name}}")
    
    if [ -z "$volumes" ]; then
        print_warning "No MantraSetu volumes found"
    else
        for volume in $volumes; do
            echo ""
            print_status "Volume: $volume"
            docker volume inspect "$volume"
        done
    fi
}

# Function to show Docker images
show_images() {
    print_status "Docker images:"
    docker images
    
    echo ""
    print_status "MantraSetu images:"
    docker images --filter "reference=mantrasetu*"
}

# Function to show all containers
show_containers() {
    print_status "All Docker containers:"
    docker ps -a
    
    echo ""
    print_status "MantraSetu containers:"
    docker ps -a --filter "name=mantrasetu"
}

# Function to monitor containers in real-time
monitor_containers() {
    print_status "Monitoring MantraSetu containers (Press Ctrl+C to exit)..."
    docker stats --filter "name=mantrasetu"
}

# Main script logic
case "${1:-help}" in
    prune)
        prune_resources
        ;;
    logs)
        show_all_logs
        ;;
    stats)
        show_stats
        ;;
    health)
        check_health
        ;;
    network)
        show_network_info
        ;;
    volumes)
        show_volume_info
        ;;
    images)
        show_images
        ;;
    containers)
        show_containers
        ;;
    monitor)
        monitor_containers
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
