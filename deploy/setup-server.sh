#!/bin/bash

# Server Setup Script for Portfolio Application
# Supports both static export and Node.js server deployments

set -e

# Configuration
DOMAIN="example.com"  # Change this to your domain
PROJECT_DIR="/var/www/portfolio"
REPO_URL=""  # Will be set during setup
DEPLOYMENT_TYPE=""  # Will be chosen during setup
NODE_VERSION="20"
PM2_APP_NAME="portfolio-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
       log_error "This script must be run as root"
       exit 1
    fi
}

# Get deployment configuration
get_config() {
    echo "==================== Portfolio Server Setup ===================="
    echo
    read -p "Enter your domain (e.g., example.com): " DOMAIN
    read -p "Enter Git repository URL: " REPO_URL
    echo
    echo "Choose deployment type:"
    echo "1) Static Export (Simpler, Faster, CDN-friendly)"
    echo "2) Node.js Server (Full-featured, ISR, Dynamic routes)"
    read -p "Enter choice (1 or 2): " choice

    case $choice in
        1)
            DEPLOYMENT_TYPE="static"
            log_info "Selected: Static Export Deployment"
            ;;
        2)
            DEPLOYMENT_TYPE="node"
            log_info "Selected: Node.js Server Deployment"
            ;;
        *)
            log_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Install system dependencies
install_dependencies() {
    log_info "Installing system dependencies..."

    apt update
    apt install -y \
        curl \
        git \
        nginx \
        certbot \
        python3-certbot-nginx \
        build-essential \
        ufw

    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs

    # Install PM2 globally for Node.js deployment
    if [[ "$DEPLOYMENT_TYPE" == "node" ]]; then
        npm install -g pm2
    fi

    log_info "Dependencies installed successfully"
}

# Setup firewall
setup_firewall() {
    log_info "Configuring firewall..."

    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable

    log_info "Firewall configured"
}

# Create application user
create_app_user() {
    log_info "Creating application user..."

    if ! id -u deploy > /dev/null 2>&1; then
        useradd -m -s /bin/bash deploy
        usermod -aG www-data deploy
        mkdir -p /home/deploy/.ssh
        chmod 700 /home/deploy/.ssh
        chown -R deploy:deploy /home/deploy/.ssh
    fi

    log_info "Application user created"
}

# Setup project directory
setup_project_dir() {
    log_info "Setting up project directory..."

    mkdir -p $PROJECT_DIR
    chown -R deploy:www-data $PROJECT_DIR
    chmod -R 755 $PROJECT_DIR

    log_info "Project directory ready"
}

# Clone repository
clone_repository() {
    log_info "Cloning repository..."

    cd $PROJECT_DIR
    sudo -u deploy git clone $REPO_URL .

    log_info "Repository cloned"
}

# Setup environment variables
setup_environment() {
    log_info "Setting up environment variables..."

    cat > $PROJECT_DIR/.env.production << EOF
# Production Environment Variables
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://${DOMAIN}

# Add your other environment variables here
# NEXT_PUBLIC_GA_ID=
# NEXT_PUBLIC_GTM_ID=
# DATABASE_URL=
# REDIS_URL=
EOF

    chown deploy:www-data $PROJECT_DIR/.env.production
    chmod 640 $PROJECT_DIR/.env.production

    log_info "Environment configured (edit $PROJECT_DIR/.env.production to add secrets)"
}

# Setup Nginx for static deployment
setup_nginx_static() {
    log_info "Configuring Nginx for static deployment..."

    cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    # SSL will be configured by certbot

    root /var/www/portfolio/out;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static file caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Next.js static files
    location /_next/static {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # 404 page
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
EOF

    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN
    ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

    log_info "Nginx configured for static deployment"
}

# Setup Nginx for Node.js deployment
setup_nginx_node() {
    log_info "Configuring Nginx for Node.js deployment..."

    cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
upstream portfolio_upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    # SSL will be configured by certbot

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Proxy cache settings
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=portfolio_cache:10m inactive=60m;
    proxy_cache_key "$scheme$request_method$host$request_uri";

    # Static files from public folder
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        proxy_pass http://portfolio_upstream;
        proxy_cache portfolio_cache;
        proxy_cache_valid 200 365d;
        expires 365d;
        add_header Cache-Control "public, immutable";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://portfolio_upstream;
        proxy_cache portfolio_cache;
        proxy_cache_valid 200 365d;
        expires 365d;
        add_header Cache-Control "public, immutable";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Main application
    location / {
        proxy_pass http://portfolio_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Cache HTML pages for 1 hour
        proxy_cache portfolio_cache;
        proxy_cache_valid 200 1h;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        add_header X-Cache-Status $upstream_cache_status;
    }
}
EOF

    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN
    ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

    # Create cache directory
    mkdir -p /var/cache/nginx
    chown www-data:www-data /var/cache/nginx

    log_info "Nginx configured for Node.js deployment"
}

# Setup PM2 for Node.js deployment
setup_pm2() {
    log_info "Configuring PM2 process manager..."

    cat > $PROJECT_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${PM2_APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '${PROJECT_DIR}',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '${PROJECT_DIR}/logs/pm2-error.log',
    out_file: '${PROJECT_DIR}/logs/pm2-out.log',
    log_file: '${PROJECT_DIR}/logs/pm2-combined.log',
    time: true
  }]
};
EOF

    # Create logs directory
    mkdir -p $PROJECT_DIR/logs
    chown -R deploy:www-data $PROJECT_DIR/logs

    # Setup PM2 startup
    sudo -u deploy pm2 startup systemd -u deploy --hp /home/deploy

    log_info "PM2 configured"
}

# Build application
build_application() {
    log_info "Building application..."

    cd $PROJECT_DIR
    sudo -u deploy npm ci --production=false

    if [[ "$DEPLOYMENT_TYPE" == "static" ]]; then
        sudo -u deploy npm run build
        log_info "Static build completed"
    else
        sudo -u deploy npm run build
        log_info "Production build completed"
    fi
}

# Start application (Node.js only)
start_application() {
    if [[ "$DEPLOYMENT_TYPE" == "node" ]]; then
        log_info "Starting Node.js application..."

        cd $PROJECT_DIR
        sudo -u deploy pm2 start ecosystem.config.js
        sudo -u deploy pm2 save

        log_info "Application started with PM2"
    fi
}

# Setup SSL
setup_ssl() {
    log_info "Setting up SSL certificate..."

    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

    # Setup auto-renewal
    systemctl enable certbot.timer
    systemctl start certbot.timer

    log_info "SSL certificate installed and auto-renewal configured"
}

# Test and reload Nginx
test_nginx() {
    log_info "Testing Nginx configuration..."

    nginx -t
    systemctl reload nginx

    log_info "Nginx reloaded successfully"
}

# Setup deployment webhook (optional)
setup_webhook() {
    log_info "Setting up deployment webhook..."

    cat > $PROJECT_DIR/deploy-webhook.sh << 'EOF'
#!/bin/bash
# Deployment webhook script
# Called when new commits are pushed to the repository

cd PROJECT_DIR_PLACEHOLDER

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production=false

# Build application
npm run build

if [[ "DEPLOYMENT_TYPE_PLACEHOLDER" == "node" ]]; then
    # Restart PM2 process
    pm2 reload PM2_APP_NAME_PLACEHOLDER
else
    # For static deployment, files are already in place after build
    echo "Static files updated"
fi

echo "Deployment completed at $(date)"
EOF

    sed -i "s|PROJECT_DIR_PLACEHOLDER|$PROJECT_DIR|g" $PROJECT_DIR/deploy-webhook.sh
    sed -i "s|DEPLOYMENT_TYPE_PLACEHOLDER|$DEPLOYMENT_TYPE|g" $PROJECT_DIR/deploy-webhook.sh
    sed -i "s|PM2_APP_NAME_PLACEHOLDER|$PM2_APP_NAME|g" $PROJECT_DIR/deploy-webhook.sh

    chmod +x $PROJECT_DIR/deploy-webhook.sh
    chown deploy:www-data $PROJECT_DIR/deploy-webhook.sh

    log_info "Deployment webhook script created at $PROJECT_DIR/deploy-webhook.sh"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up basic monitoring..."

    # Create monitoring script
    cat > /usr/local/bin/monitor-portfolio.sh << 'EOF'
#!/bin/bash
# Basic monitoring script

DOMAIN="DOMAIN_PLACEHOLDER"
WEBHOOK_URL=""  # Add Slack/Discord webhook URL if desired

# Check if site is responding
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)

if [ "$HTTP_CODE" != "200" ]; then
    echo "Site is down! HTTP Code: $HTTP_CODE"
    # Send alert if webhook is configured
    if [ ! -z "$WEBHOOK_URL" ]; then
        curl -X POST $WEBHOOK_URL -H 'Content-Type: application/json' \
            -d "{\"text\":\"Alert: $DOMAIN is down! HTTP Code: $HTTP_CODE\"}"
    fi
fi

# Check disk usage
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "Disk usage is high: $DISK_USAGE%"
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
if [ "$MEM_USAGE" -gt 80 ]; then
    echo "Memory usage is high: $MEM_USAGE%"
fi
EOF

    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /usr/local/bin/monitor-portfolio.sh
    chmod +x /usr/local/bin/monitor-portfolio.sh

    # Add to crontab
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-portfolio.sh >> /var/log/portfolio-monitor.log 2>&1") | crontab -

    log_info "Basic monitoring configured (runs every 5 minutes)"
}

# Main installation flow
main() {
    check_root
    get_config

    log_info "Starting server setup..."

    install_dependencies
    setup_firewall
    create_app_user
    setup_project_dir
    clone_repository
    setup_environment

    if [[ "$DEPLOYMENT_TYPE" == "static" ]]; then
        setup_nginx_static
    else
        setup_nginx_node
        setup_pm2
    fi

    build_application
    start_application
    test_nginx
    setup_ssl
    setup_webhook
    setup_monitoring

    echo
    echo "==================== Setup Complete ===================="
    echo
    echo "Your portfolio is now deployed!"
    echo "Domain: https://$DOMAIN"
    echo "Deployment type: $DEPLOYMENT_TYPE"
    echo
    echo "Next steps:"
    echo "1. Edit environment variables: $PROJECT_DIR/.env.production"
    echo "2. Configure deployment webhook in your Git provider"
    echo "3. Test the deployment: curl https://$DOMAIN"
    echo
    if [[ "$DEPLOYMENT_TYPE" == "node" ]]; then
        echo "PM2 commands:"
        echo "  pm2 status         - Check application status"
        echo "  pm2 logs          - View application logs"
        echo "  pm2 restart all   - Restart application"
        echo "  pm2 monit         - Real-time monitoring"
    fi
    echo
    echo "Logs location:"
    echo "  Nginx: /var/log/nginx/"
    echo "  Application: $PROJECT_DIR/logs/"
    echo
    log_info "Setup script completed successfully!"
}

# Run main function
main