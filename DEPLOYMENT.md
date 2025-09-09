# Deployment Guide

This guide explains how to deploy the Movie Catalog API to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
1. A MySQL database set up and accessible
2. Environment variables configured
3. Application tested locally

## Environment Variables

Create a `.env` file based on `.env.example` with these variables:

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=movies_db
DB_PORT=3306
PORT=3000
NODE_ENV=production
```

## Database Setup

1. Create a MySQL database named `movies_db`
2. Run the SQL script from `database/schema.sql` to create tables and insert sample data:

```sql
mysql -h your_host -u your_user -p movies_db < database/schema.sql
```

## Deployment Options

### 1. Render (Recommended)

Render provides easy deployment with automatic SSL and free tier options.

**Steps:**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Create a MySQL database on Render
5. Configure environment variables in the Render dashboard
6. Deploy!

**Auto-deploy with render.yaml:**
- The included `render.yaml` file enables Infrastructure as Code deployment
- Simply connect your repo and Render will automatically configure everything

### 2. Heroku

**Steps:**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add MySQL addon: `heroku addons:create jawsdb:kitefin`
5. Configure environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set DB_HOST=your_mysql_host
   heroku config:set DB_USER=your_mysql_user
   heroku config:set DB_PASSWORD=your_mysql_password
   heroku config:set DB_NAME=movies_db
   ```
6. Deploy: `git push heroku main`

### 3. Railway

**Steps:**
1. Connect your GitHub repository to Railway
2. Add a MySQL database service
3. Configure environment variables
4. Deploy automatically on git push

### 4. Vercel (API Routes only)

For Vercel deployment, you'd need to restructure the app to use API routes instead of Express.js.

## Post-Deployment

1. **Test the API endpoints:**
   - GET /api/movies
   - POST /api/movies
   - PUT /api/movies/:id
   - DELETE /api/movies/:id

2. **Verify the frontend:**
   - Visit your deployed URL
   - Test adding, editing, and deleting movies
   - Check search and filter functionality

3. **Monitor logs:**
   - Check platform-specific logs for any errors
   - Monitor database connection status

## SSL and Domain

Most platforms (Render, Heroku, Railway) provide automatic SSL certificates. For custom domains:

1. Add your domain in the platform dashboard
2. Configure DNS records as instructed
3. SSL will be automatically provisioned

## Scaling and Performance

- **Database**: Use connection pooling (already implemented)
- **Caching**: Consider adding Redis for frequently accessed data
- **CDN**: Use a CDN for static assets
- **Load Balancing**: Available on higher-tier plans

## Troubleshooting

**Common Issues:**

1. **Database Connection Error:**
   - Verify environment variables
   - Check database server status
   - Ensure network connectivity

2. **Build Failures:**
   - Check Node.js version compatibility
   - Verify package.json dependencies
   - Review build logs

3. **API Errors:**
   - Check server logs
   - Verify database schema
   - Test endpoints locally first

**Logs Access:**
- **Render**: Dashboard → Logs
- **Heroku**: `heroku logs --tail`
- **Railway**: Dashboard → Deployment logs

## Security Considerations

1. Use environment variables for all secrets
2. Enable CORS only for trusted domains in production
3. Implement rate limiting
4. Use HTTPS only
5. Regularly update dependencies

## Monitoring

Set up monitoring for:
- Application uptime
- Database performance
- API response times
- Error rates

Popular monitoring services:
- New Relic
- DataDog
- Sentry (for error tracking)
