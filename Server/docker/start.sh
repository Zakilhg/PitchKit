#!/bin/sh
# Start the demo server: fresh database and demo data on every boot.
set -e
cd /var/www/pitchkit/Server

# Hosts like Render pass the port to listen on in $PORT.
sed -ri "s/^Listen .*/Listen ${PORT:-8080}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT:-8080}>/" /etc/apache2/sites-available/000-default.conf

# A key is required; without one from the host, make one for this run.
if [ -z "$APP_KEY" ]; then
    export APP_KEY="base64:$(head -c 32 /dev/urandom | base64)"
fi

rm -f "$DB_DATABASE"
touch "$DB_DATABASE"
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction
php artisan config:cache
php artisan route:cache
php artisan view:cache
chown -R www-data:www-data database storage bootstrap/cache public/images

exec apache2-foreground
