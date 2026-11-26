# Public demo of the API and admin panel. Build from the repository root:
#   docker build -f Server/Dockerfile -t pitchkit-server .
# It uses SQLite and reseeds on every start, so the demo resets itself.
FROM composer:2 AS vendor
WORKDIR /app
COPY Server/composer.json Server/composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs

FROM php:8.3-apache
RUN a2enmod rewrite \
 && echo 'ServerName localhost' > /etc/apache2/conf-available/servername.conf && a2enconf servername \
 && sed -ri 's!/var/www/html!/var/www/pitchkit/Server/public!g' /etc/apache2/sites-available/000-default.conf \
 && printf '<Directory /var/www/pitchkit/Server/public>\n    AllowOverride All\n    Require all granted\n</Directory>\n' > /etc/apache2/conf-available/pitchkit.conf \
 && a2enconf pitchkit \
 && cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
 && printf 'upload_max_filesize=5M\npost_max_size=20M\nexpose_php=Off\n' > "$PHP_INI_DIR/conf.d/pitchkit.ini"

WORKDIR /var/www/pitchkit
# The catalog seeder reads the storefront's demo catalog.
COPY Client/src/demo/catalog.json Client/src/demo/catalog.json
COPY Server Server
COPY --from=vendor /app/vendor Server/vendor
RUN cd Server \
 && php artisan package:discover --ansi \
 && chown -R www-data:www-data storage bootstrap/cache public/images database

COPY Server/docker/start.sh /usr/local/bin/pitchkit-start
RUN chmod +x /usr/local/bin/pitchkit-start

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/var/www/pitchkit/Server/database/demo.sqlite \
    SESSION_DRIVER=file \
    CACHE_STORE=file \
    TRUSTED_PROXIES=* \
    PORT=8080

EXPOSE 8080
CMD ["pitchkit-start"]
