# Server Setup Instructions for Portfolio Website (Shared Server)

**⚠️ IMPORTANT**: These instructions are for servers that already have other websites or applications running. They avoid conflicts with existing services.

## Prerequisites

- You have sudo access to an Ubuntu server
- You have a domain/subdomain pointed to your server's IP address
- You have the GitHub repository URL for your portfolio project
- Nginx is already installed and running other sites (common scenario)

## Step 1: Check Existing Services

First, let's see what's already running on your server:

```bash
# Check if Nginx is already installed
nginx -v

# Check if Node.js is already installed
node --version

# Check if PM2 is already installed (for Node.js apps)
pm2 --version

# Check what ports are in use
sudo netstat -tlnp | grep -E ':(80|443|3000|3001|8080)'

# Check existing Nginx sites
ls -la /etc/nginx/sites-enabled/
```

**Write down what you find** - we'll need this information.

## Step 2: Create Isolated Project Directory

We'll use a separate directory to avoid conflicts:

```bash
# Create a dedicated directory for your portfolio
sudo mkdir -p /var/www/portfolio-yourname
sudo chown $USER:www-data /var/www/portfolio-yourname
cd /var/www/portfolio-yourname
```

## Step 3: Install Node.js (if not already installed)

```bash
# Check if Node.js is installed
node --version

# If not installed or version is below 18, install Node.js 20:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 4: Clone Your Repository

```bash
# Clone your portfolio repository
cd /var/www/portfolio-yourname
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git .

# Install dependencies
npm install
```

## Step 5: Set Up Environment Variables

```bash
# Create production environment file
nano .env.production
```

Add these minimum settings:

```
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

## Step 6: Build the Application

You have two options depending on your needs:

### Option A: Static Export (Recommended for Shared Servers)

```bash
# Build as static files (no Node.js process needed)
npm run build

# The built files will be in the 'out' directory
ls -la out/
```

### Option B: Node.js Server (Requires Available Port)

```bash
# First, find an available port (not 3000 if something else uses it)
# Common alternatives: 3001, 3002, 4000, 5000, 8080

# Build for production
npm run build

# We'll run this on a custom port later (see Step 8B)
```

## Step 7: Configure Nginx (Without Breaking Existing Sites)

### For Static Deployment (Option A):

```bash
# Create a new Nginx configuration for your site
sudo nano /etc/nginx/sites-available/portfolio-yourname
```

Add this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Path to your static files
    root /var/www/portfolio-yourname/out;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Static file handling
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Next.js static files
    location /_next/static {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    error_page 404 /404.html;
}
```

### For Node.js Deployment (Option B):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    location / {
        # Use a different port if 3000 is taken
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/portfolio-yourname /etc/nginx/sites-enabled/

# Test Nginx configuration (IMPORTANT - won't break existing sites)
sudo nginx -t

# If test passes, reload Nginx
sudo nginx -s reload
```

## Step 8: Start the Application

### Step 8A: For Static Deployment

Nothing to do! Your site is already being served by Nginx.

### Step 8B: For Node.js Deployment

First, install PM2 if not already installed:

```bash
sudo npm install -g pm2
```

Create a PM2 configuration:

```bash
nano ecosystem.config.js
```

Add this content (adjust port if needed):

```javascript
module.exports = {
  apps: [
    {
      name: "portfolio-yourname",
      script: "npm",
      args: "start",
      cwd: "/var/www/portfolio-yourname",
      env: {
        NODE_ENV: "production",
        PORT: 3001, // Change this if port is taken
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
```

Start the application:

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot (only do once per server)
pm2 startup
# Follow the command it outputs
```

## Step 9: Set Up SSL Certificate (HTTPS)

```bash
# Install Certbot if not already installed
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate for your domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)
```

## Step 10: Verify Everything Works

```bash
# Check if your site loads
curl -I https://your-domain.com

# Check Nginx status
sudo systemctl status nginx

# For Node.js deployment, check PM2
pm2 status

# Check for any errors
sudo tail -f /var/log/nginx/error.log
```

Visit your domain in a web browser to confirm it's working!

## Setting Up Updates (Deployment)

### Simple Manual Update Process:

```bash
cd /var/www/portfolio-yourname
git pull origin main
npm install
npm run build

# For Node.js deployment only:
pm2 restart portfolio-yourname
```

### Automated Update Script:

Create an update script:

```bash
nano ~/update-portfolio.sh
```

Add:

```bash
#!/bin/bash
cd /var/www/portfolio-yourname
git pull origin main
npm ci
npm run build

# For Node.js deployment, uncomment next line:
# pm2 restart portfolio-yourname

echo "Portfolio updated successfully!"
```

Make it executable:

```bash
chmod +x ~/update-portfolio.sh

# Run updates with:
~/update-portfolio.sh
```

## Troubleshooting

### Port Conflicts (Node.js deployment)

If you get "address already in use" error:

```bash
# Find what's using the port
sudo lsof -i :3001

# Use a different port in ecosystem.config.js
# Also update the Nginx proxy_pass port
```

### Nginx Configuration Conflicts

```bash
# Check all enabled sites
ls -la /etc/nginx/sites-enabled/

# Temporarily disable your site if needed
sudo rm /etc/nginx/sites-enabled/portfolio-yourname
sudo nginx -s reload

# Re-enable when fixed
sudo ln -s /etc/nginx/sites-available/portfolio-yourname /etc/nginx/sites-enabled/
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R $USER:www-data /var/www/portfolio-yourname
sudo chmod -R 755 /var/www/portfolio-yourname
```

### SSL Certificate Issues

```bash
# List all certificates
sudo certbot certificates

# Renew specific certificate
sudo certbot renew --cert-name your-domain.com
```

## Important Differences for Shared Servers

1. **Use unique names** for everything (directories, PM2 apps, Nginx configs)
2. **Check ports** before using them (3000 might be taken)
3. **Test Nginx carefully** with `nginx -t` before reloading
4. **Don't run system-wide updates** without checking with other site owners
5. **Use separate PM2 apps** for each Node.js application
6. **Keep logs separate** to avoid confusion

## Monitoring Your Site (Without Affecting Others)

```bash
# Check just your site's status
pm2 status portfolio-yourname

# View just your site's logs
pm2 logs portfolio-yourname --lines 50

# Check your specific Nginx access
grep "your-domain.com" /var/log/nginx/access.log | tail -20
```

## Quick Reference for Your Site Only

```bash
# Update your site
cd /var/www/portfolio-yourname && git pull && npm run build

# Restart your Node.js app (if using Node.js)
pm2 restart portfolio-yourname

# View your logs
pm2 logs portfolio-yourname

# Check your site's SSL
sudo certbot certificates | grep -A 5 "your-domain.com"
```

## Notes for Shared Server Safety

- ✅ These instructions create isolated configurations
- ✅ Your site runs in its own directory
- ✅ Nginx config is separate from other sites
- ✅ PM2 apps are named uniquely
- ✅ No system-wide changes that affect other sites
- ⚠️ Always use `nginx -t` before reloading Nginx
- ⚠️ Never force SSL renewal for all certificates
- ⚠️ Don't change global Node.js or npm versions without coordination

---

**Remember**: On a shared server, always be careful not to affect other people's sites. Test everything carefully, use unique names, and keep your configurations separate.
