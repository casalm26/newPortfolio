#!/bin/bash

# Deployment Script for Portfolio Application
# Can be run locally or on CI/CD to deploy to the server

set -e

# Configuration (set via environment variables or modify here)
SERVER_HOST="${DEPLOY_HOST:-your-server.com}"
SERVER_USER="${DEPLOY_USER:-deploy}"
SERVER_PORT="${DEPLOY_PORT:-22}"
PROJECT_DIR="${DEPLOY_DIR:-/var/www/portfolio}"
DEPLOYMENT_TYPE="${DEPLOY_TYPE:-static}"  # static or node
BRANCH="${DEPLOY_BRANCH:-main}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Helper functions
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

log_step() {
    echo -e "${BLUE}→${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_step "Checking prerequisites..."

    # Check if we can connect to the server
    if ! ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "echo 'Connection successful'" > /dev/null 2>&1; then
        log_error "Cannot connect to server. Please check SSH configuration."
    fi

    # Check if rsync is available
    if ! command -v rsync &> /dev/null; then
        log_error "rsync is not installed. Please install it first."
    fi

    log_info "Prerequisites checked"
}

# Build the application locally
build_local() {
    log_step "Building application locally..."

    # Clean previous builds
    rm -rf out .next

    # Install dependencies
    npm ci --production=false

    # Build based on deployment type
    if [[ "$DEPLOYMENT_TYPE" == "static" ]]; then
        # Build and export static files
        npm run build

        # Check if export was successful
        if [ ! -d "out" ]; then
            log_error "Static export failed. 'out' directory not found."
        fi
        log_info "Static build completed"
    else
        # Build for Node.js deployment
        npm run build
        log_info "Production build completed"
    fi
}

# Deploy static files
deploy_static() {
    log_step "Deploying static files to server..."

    # Create backup of current deployment
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
        if [ -d "$PROJECT_DIR/out" ]; then
            sudo mv $PROJECT_DIR/out $PROJECT_DIR/out.backup.\$(date +%Y%m%d_%H%M%S)
            sudo find $PROJECT_DIR -name "out.backup.*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
        fi
EOF

    # Sync static files
    rsync -avz --delete \
        -e "ssh -p $SERVER_PORT" \
        ./out/ \
        $SERVER_USER@$SERVER_HOST:$PROJECT_DIR/out.tmp/

    # Move files into place atomically
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
        sudo mv $PROJECT_DIR/out.tmp $PROJECT_DIR/out
        sudo chown -R www-data:www-data $PROJECT_DIR/out
        sudo chmod -R 755 $PROJECT_DIR/out

        # Clear Nginx cache
        sudo rm -rf /var/cache/nginx/*
        sudo nginx -s reload
EOF

    log_info "Static files deployed successfully"
}

# Deploy Node.js application
deploy_node() {
    log_step "Deploying Node.js application to server..."

    # Create deployment package
    log_step "Creating deployment package..."
    tar -czf deploy.tar.gz \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=.env* \
        --exclude=deploy \
        --exclude=e2e \
        --exclude=tests \
        --exclude=.github \
        .

    # Upload package
    log_step "Uploading package to server..."
    scp -P $SERVER_PORT deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

    # Deploy on server
    log_step "Deploying on server..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'EOF'
        set -e

        # Variables
        PROJECT_DIR="/var/www/portfolio"
        TEMP_DIR="/tmp/portfolio-deploy-$(date +%s)"

        # Create temp directory
        mkdir -p $TEMP_DIR
        cd $TEMP_DIR

        # Extract package
        tar -xzf /tmp/deploy.tar.gz
        rm /tmp/deploy.tar.gz

        # Copy environment file
        if [ -f "$PROJECT_DIR/.env.production" ]; then
            cp $PROJECT_DIR/.env.production .env.production
        fi

        # Install dependencies
        npm ci --production

        # Build application
        npm run build

        # Create backup
        if [ -d "$PROJECT_DIR" ]; then
            sudo mv $PROJECT_DIR ${PROJECT_DIR}.backup.$(date +%Y%m%d_%H%M%S)
            sudo find /var/www -name "portfolio.backup.*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
        fi

        # Move new deployment
        sudo mv $TEMP_DIR $PROJECT_DIR
        sudo chown -R deploy:www-data $PROJECT_DIR

        # Restart application
        cd $PROJECT_DIR
        pm2 reload ecosystem.config.js --update-env
        pm2 save

        # Clear Nginx cache
        sudo rm -rf /var/cache/nginx/*
        sudo nginx -s reload

        echo "Deployment completed successfully"
EOF

    # Clean up local package
    rm -f deploy.tar.gz

    log_info "Node.js application deployed successfully"
}

# Deploy using Git (alternative method)
deploy_git() {
    log_step "Deploying via Git pull on server..."

    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
        set -e

        cd $PROJECT_DIR

        # Stash any local changes
        git stash

        # Pull latest changes
        git fetch origin
        git checkout $BRANCH
        git pull origin $BRANCH

        # Install dependencies
        npm ci --production=false

        # Build application
        npm run build

        if [[ "$DEPLOYMENT_TYPE" == "node" ]]; then
            # Restart PM2
            pm2 reload ecosystem.config.js --update-env
            pm2 save
        fi

        # Clear Nginx cache and reload
        sudo rm -rf /var/cache/nginx/*
        sudo nginx -s reload

        echo "Git deployment completed"
EOF

    log_info "Git deployment successful"
}

# Run post-deployment checks
post_deploy_checks() {
    log_step "Running post-deployment checks..."

    # Check if site is responding
    sleep 3
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$SERVER_HOST)

    if [ "$HTTP_CODE" == "200" ]; then
        log_info "Site is responding correctly (HTTP $HTTP_CODE)"
    else
        log_warn "Site returned HTTP $HTTP_CODE"
    fi

    # Check application status for Node.js deployment
    if [[ "$DEPLOYMENT_TYPE" == "node" ]]; then
        log_step "Checking PM2 status..."
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "pm2 status"
    fi
}

# Show deployment menu
show_menu() {
    echo
    echo "==================== Deployment Options ===================="
    echo
    echo "Server: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
    echo "Project: $PROJECT_DIR"
    echo "Type: $DEPLOYMENT_TYPE"
    echo
    echo "1) Build locally and deploy (Recommended)"
    echo "2) Deploy via Git pull on server"
    echo "3) Deploy with zero-downtime (Blue-Green)"
    echo "4) Rollback to previous deployment"
    echo "5) Check deployment status"
    echo "6) Exit"
    echo
    read -p "Select option (1-6): " option

    case $option in
        1)
            deploy_standard
            ;;
        2)
            check_prerequisites
            deploy_git
            post_deploy_checks
            ;;
        3)
            deploy_blue_green
            ;;
        4)
            rollback
            ;;
        5)
            check_status
            ;;
        6)
            exit 0
            ;;
        *)
            log_error "Invalid option"
            ;;
    esac
}

# Standard deployment (build local, deploy to server)
deploy_standard() {
    check_prerequisites
    build_local

    if [[ "$DEPLOYMENT_TYPE" == "static" ]]; then
        deploy_static
    else
        deploy_node
    fi

    post_deploy_checks
}

# Blue-Green deployment for zero downtime
deploy_blue_green() {
    log_step "Starting blue-green deployment..."

    if [[ "$DEPLOYMENT_TYPE" != "node" ]]; then
        log_error "Blue-green deployment is only available for Node.js deployments"
    fi

    check_prerequisites

    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'EOF'
        set -e

        # Determine current deployment (blue or green)
        if [ -L "/var/www/portfolio" ]; then
            CURRENT=$(readlink /var/www/portfolio | xargs basename)
        else
            CURRENT="blue"
        fi

        # Set target deployment
        if [ "$CURRENT" = "blue" ]; then
            TARGET="green"
            TARGET_PORT="3001"
        else
            TARGET="blue"
            TARGET_PORT="3000"
        fi

        echo "Current deployment: $CURRENT"
        echo "Target deployment: $TARGET"

        # Deploy to target
        TARGET_DIR="/var/www/portfolio-$TARGET"

        # Clone/update target
        if [ ! -d "$TARGET_DIR" ]; then
            git clone $REPO_URL $TARGET_DIR
        fi

        cd $TARGET_DIR
        git pull origin main
        npm ci --production=false
        npm run build

        # Start target with different port
        PORT=$TARGET_PORT pm2 start ecosystem.config.js --name "portfolio-$TARGET"

        # Health check
        sleep 5
        if curl -f http://localhost:$TARGET_PORT > /dev/null 2>&1; then
            echo "Target deployment healthy"

            # Switch symlink
            sudo ln -sfn $TARGET_DIR /var/www/portfolio

            # Reload Nginx
            sudo nginx -s reload

            # Stop old deployment after 30 seconds
            sleep 30
            pm2 stop "portfolio-$CURRENT" || true

            echo "Blue-green deployment completed"
        else
            echo "Target deployment failed health check"
            pm2 stop "portfolio-$TARGET"
            exit 1
        fi
EOF

    post_deploy_checks
}

# Rollback to previous deployment
rollback() {
    log_step "Rolling back to previous deployment..."

    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
        set -e

        cd /var/www

        # Find latest backup
        BACKUP=\$(ls -t portfolio.backup.* 2>/dev/null | head -1)

        if [ -z "\$BACKUP" ]; then
            echo "No backup found"
            exit 1
        fi

        echo "Rolling back to: \$BACKUP"

        # Restore backup
        if [ -d "portfolio" ]; then
            sudo mv portfolio portfolio.failed.\$(date +%Y%m%d_%H%M%S)
        fi
        sudo mv \$BACKUP portfolio

        if [[ "$DEPLOYMENT_TYPE" == "node" ]]; then
            cd portfolio
            pm2 reload ecosystem.config.js --update-env
        fi

        sudo nginx -s reload

        echo "Rollback completed"
EOF

    post_deploy_checks
}

# Check deployment status
check_status() {
    log_step "Checking deployment status..."

    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << EOF
        echo "=== System Information ==="
        uname -a
        echo

        echo "=== Disk Usage ==="
        df -h /var/www
        echo

        echo "=== Project Directory ==="
        ls -la $PROJECT_DIR | head -10
        echo

        if [[ "$DEPLOYMENT_TYPE" == "node" ]]; then
            echo "=== PM2 Status ==="
            pm2 status
            echo

            echo "=== Recent Logs ==="
            pm2 logs --nostream --lines 10
        fi

        echo "=== Nginx Status ==="
        sudo systemctl status nginx --no-pager | head -10
        echo

        echo "=== Site Response ==="
        curl -I http://localhost 2>/dev/null | head -5
EOF
}

# Main execution
main() {
    echo "==================== Portfolio Deployment Script ===================="
    echo

    # Check if running in CI/CD environment
    if [ ! -z "$CI" ]; then
        log_info "Running in CI/CD environment"
        deploy_standard
    else
        # Interactive mode
        while true; do
            show_menu
        done
    fi
}

# Handle script arguments
case "${1:-}" in
    --build-deploy)
        deploy_standard
        ;;
    --git-deploy)
        check_prerequisites
        deploy_git
        post_deploy_checks
        ;;
    --rollback)
        rollback
        ;;
    --status)
        check_status
        ;;
    *)
        main
        ;;
esac