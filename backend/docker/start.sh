#!/bin/bash
set -e

echo "==> Starting Taskora backend..."

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "ERROR: APP_KEY is not set. Add it as an environment variable on Render."
    exit 1
fi

# Set permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Cache config, routes, views for production performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations automatically on every deploy
echo "==> Running migrations..."
php artisan migrate --force --no-interaction

# Seed task types if the table is empty
echo "==> Seeding task types if needed..."
php artisan db:seed --class=TaskTypeSeeder --force --no-interaction 2>/dev/null || true

echo "==> Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
