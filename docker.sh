#!/bin/bash

# MantraSetu Docker Management Script
# Main entry point for all Docker operations

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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show help
show_help() {
    echo "MantraSetu Docker Management Script"
    echo ""
    echo "Usage: $0 [ENVIRONMENT] [COMMAND]"
    echo ""
    echo "Environments:"
    echo "  dev         Development environment"
    echo "  prod        Production environment"
    echo "  utils       Utility functions"
    echo ""
    echo "Development Commands:"
    echo "  start       Start development environment"
    echo "  start-logs  Start development environment and show logs"
    echo "  stop        Stop development environment"
    echo "  restart     Restart development environment"
    echo "  build       Build development images"
    echo "  logs        Show development logs"
    echo "  shell       Open shell in dev container"
    echo "  clean       Clean up dev resources"
    echo "  status      Show dev container status"
    echo ""
    echo "Production Commands:"
    echo "  start       Start production environment"
    echo "  stop        Stop production environment"
    echo "  restart     Restart production environment"
    echo "  build       Build production images"
    echo "  deploy      Deploy to production"
    echo "  logs        Show production logs"
    echo "  shell       Open shell in prod container"
    echo "  backup      Backup production data"
    echo "  restore     Restore production data"
    echo "  status      Show prod container status"
    echo ""
    echo "Utility Commands:"
    echo "  prune       Clean up unused Docker resources"
    echo "  logs        Show logs for all containers"
    echo "  stats       Show resource usage statistics"
    echo "  health      Check health of all services"
    echo "  network     Show network information"
    echo "  volumes     Show volume information"
    echo "  images      Show Docker images"
    echo "  containers  Show all containers"
    echo "  monitor     Monitor containers in real-time"
    echo ""
    echo "Examples:"
    echo "  $0 dev start     # Start development environment"
    echo "  $0 dev start-logs # Start development environment with logs"
    echo "  $0 prod deploy   # Deploy to production"
    echo "  $0 utils health  # Check service health"
    echo "  $0 dev logs      # View development logs"
    echo "  $0 prod backup   # Backup production data"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Main script logic
if [ $# -lt 1 ]; then
    show_help
    exit 1
fi

ENVIRONMENT=$1
COMMAND=${2:-help}

case $ENVIRONMENT in
    dev|development)
        print_status "Running development command: $COMMAND"
        exec "$SCRIPT_DIR/scripts/docker-dev.sh" "$COMMAND"
        ;;
    prod|production)
        print_status "Running production command: $COMMAND"
        exec "$SCRIPT_DIR/scripts/docker-prod.sh" "$COMMAND"
        ;;
    utils|utility)
        print_status "Running utility command: $COMMAND"
        exec "$SCRIPT_DIR/scripts/docker-utils.sh" "$COMMAND"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown environment: $ENVIRONMENT"
        echo ""
        show_help
        exit 1
        ;;
esac
