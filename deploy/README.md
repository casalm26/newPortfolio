# Deployment Guide

This guide covers deploying your Next.js portfolio application to your own server, with support for both static export and Node.js server deployments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Initial Server Setup](#initial-server-setup)
- [Deployment Methods](#deployment-methods)
- [Environment Configuration](#environment-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Local Machine
- Node.js 20+
- Git
- SSH access to your server
- rsync (for file synchronization)

### Server Requirements
- Ubuntu 22.04 LTS (or similar)
- Minimum 1GB RAM (2GB+ recommended for Node.js)
- 10GB+ disk space
- Root or sudo access
- Domain name pointed to server IP

## Deployment Options

### Option 1: Static Export (Recommended for Simple Sites)
✅ **Pros:**
- Maximum performance
- Minimal server resources
- Better security (no Node.js runtime)
- Easy CDN integration
- Simple rollback

❌ **Cons:**
- No server-side features (API routes, ISR)
- Requires rebuild for content updates
- No dynamic routes

### Option 2: Node.js Server (Full-Featured)
✅ **Pros:**
- All Next.js features available
- Incremental Static Regeneration (ISR)
- API routes support
- Real-time content updates
- Dynamic routing

❌ **Cons:**
- More server resources needed
- Complex deployment
- Requires process management (PM2)
- Higher security considerations

## Initial Server Setup

### 1. Run the Setup Script

SSH into your server and run:

```bash
# Download the setup script
curl -O https://raw.githubusercontent.com/yourusername/portfolio/main/deploy/setup-server.sh

# Make it executable
chmod +x setup-server.sh

# Run the setup (as root)
sudo ./setup-server.sh
```

The script will prompt you for:
- Your domain name
- Git repository URL
- Deployment type (static or Node.js)

### 2. What the Setup Script Does

- ✅ Installs Node.js, Nginx, Git
- ✅ Creates application user (`deploy`)
- ✅ Configures firewall (UFW)
- ✅ Sets up project directory
- ✅ Configures Nginx (static or reverse proxy)
- ✅ Sets up SSL with Let's Encrypt
- ✅ Creates deployment scripts
- ✅ Configures basic monitoring

## Deployment Methods

### Method 1: GitHub Actions (CI/CD)

1. **Add GitHub Secrets:**
   ```
   DEPLOY_HOST: your-server.com
   DEPLOY_USER: deploy
   DEPLOY_PORT: 22
   DEPLOY_DIR: /var/www/portfolio
   DEPLOY_SSH_KEY: (your private SSH key)
   DEPLOY_HOST_KEY: (server's public key)
   NEXT_PUBLIC_BASE_URL: https://your-domain.com
   ```

2. **Generate SSH Key Pair:**
   ```bash
   # On your local machine
   ssh-keygen -t ed25519 -f deploy_key -N ""

   # Add public key to server
   ssh-copy-id -i deploy_key.pub deploy@your-server.com

   # Get server's public key
   ssh-keyscan -H your-server.com
   ```

3. **Push to Main Branch:**
   ```bash
   git push origin main
   # GitHub Actions will automatically deploy
   ```

### Method 2: Direct Git Push

1. **Setup Bare Repository on Server:**
   ```bash
   # On server
   mkdir -p /home/deploy/portfolio.git
   cd /home/deploy/portfolio.git
   git init --bare

   # Copy post-receive hook
   cp /path/to/deploy/git-hooks/post-receive hooks/
   chmod +x hooks/post-receive
   ```

2. **Add Remote to Local Repository:**
   ```bash
   # On local machine
   git remote add production deploy@your-server.com:/home/deploy/portfolio.git
   ```

3. **Deploy with Git Push:**
   ```bash
   git push production main
   ```

### Method 3: Manual Deployment

1. **Use the Deploy Script:**
   ```bash
   # On local machine
   cd your-portfolio-directory
   ./deploy/deploy.sh

   # Select option 1 for standard deployment
   ```

2. **Or Deploy Manually:**
   ```bash
   # Build locally
   npm run build

   # For static deployment
   rsync -avz --delete ./out/ deploy@server:/var/www/portfolio/out/

   # For Node.js deployment
   ssh deploy@server "cd /var/www/portfolio && git pull && npm ci && npm run build && pm2 reload all"
   ```

## Environment Configuration

### 1. Production Environment Variables

Edit `/var/www/portfolio/.env.production`:

```bash
# Required
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Optional - Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Optional - Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_COMMENTS=false

# WordPress Integration (if using)
WORDPRESS_API_URL=https://cms.your-domain.com/wp-json
WORDPRESS_API_KEY=your-api-key
```

### 2. Nginx Configuration

Static deployment (`/etc/nginx/sites-available/your-domain`):
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    root /var/www/portfolio/out;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

Node.js deployment:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Maintenance

### 1. Check Application Status

```bash
# For Node.js deployment
pm2 status
pm2 logs
pm2 monit

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. Automated Monitoring

The setup script creates basic monitoring at `/usr/local/bin/monitor-portfolio.sh`:
- Runs every 5 minutes via cron
- Checks HTTP status
- Monitors disk usage
- Monitors memory usage

View monitoring logs:
```bash
tail -f /var/log/portfolio-monitor.log
```

### 3. Backup Strategy

```bash
# Create backup script
cat > /home/deploy/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/portfolio"
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app-$(date +%Y%m%d).tar.gz /var/www/portfolio

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

# Add to crontab (daily at 2 AM)
(crontab -l; echo "0 2 * * * /home/deploy/backup.sh") | crontab -
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Site Not Loading
```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check if Node.js app is running (if applicable)
pm2 status

# Check firewall
sudo ufw status

# Test locally
curl http://localhost
```

#### 2. 502 Bad Gateway (Node.js)
```bash
# Check if app is running
pm2 list

# Restart app
pm2 restart all

# Check logs
pm2 logs --lines 100
```

#### 3. SSL Certificate Issues
```bash
# Renew certificate manually
sudo certbot renew --force-renewal

# Test auto-renewal
sudo certbot renew --dry-run
```

#### 4. Permission Issues
```bash
# Fix ownership
sudo chown -R deploy:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
```

#### 5. Build Failures
```bash
# Check Node version
node --version  # Should be 20+

# Clear caches
rm -rf node_modules .next
npm ci
npm run build
```

### Rollback Procedure

If deployment fails:

```bash
# Method 1: Use deploy script
./deploy/deploy.sh
# Select option 4 (Rollback)

# Method 2: Manual rollback
cd /var/www
sudo mv portfolio portfolio.failed
sudo mv portfolio.backup.* portfolio
pm2 restart all  # For Node.js
sudo nginx -s reload
```

## Security Considerations

1. **Keep Server Updated:**
   ```bash
   sudo apt update && sudo apt upgrade
   ```

2. **Configure Fail2ban:**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

3. **Secure Environment Variables:**
   - Never commit `.env` files
   - Use restrictive permissions: `chmod 640 .env.production`

4. **Regular Backups:**
   - Automate daily backups
   - Test restore procedures

5. **Monitor Logs:**
   - Check for suspicious activity
   - Set up log rotation

## Next Steps

After successful deployment:

1. ✅ Test all pages and functionality
2. ✅ Configure analytics (Google Analytics, etc.)
3. ✅ Set up monitoring alerts
4. ✅ Configure CDN (optional)
5. ✅ Implement backup strategy
6. ✅ Document any custom configurations

## Support

For issues or questions:
- Check deployment logs: `/var/log/portfolio-deploy.log`
- Review Nginx logs: `/var/log/nginx/error.log`
- Check PM2 logs: `pm2 logs`
- Review this guide's [Troubleshooting](#troubleshooting) section