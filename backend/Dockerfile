# ─────────────────────────────────────────────────────────────────────────────
# Taskora Backend — Dockerfile for Render.com (PHP 8.2, Laravel 12)
# ─────────────────────────────────────────────────────────────────────────────

FROM php:8.2-fpm-alpine AS base

# ── System deps ──────────────────────────────────────────────────────────────
RUN apk add --no-cache \
    nginx \
    supervisor \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    mysql-client \
    postgresql-client \
    bash

# ── PHP extensions ───────────────────────────────────────────────────────────
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        opcache

# ── Composer ─────────────────────────────────────────────────────────────────
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# ── Copy composer files first (layer cache) ──────────────────────────────────
COPY composer.json composer.lock ./

# Install deps — no dev, optimise autoloader
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

# ── Copy application code ────────────────────────────────────────────────────
COPY . .

# ── Storage & cache dirs (writable) ──────────────────────────────────────────
RUN mkdir -p storage/app/public \
             storage/framework/cache \
             storage/framework/sessions \
             storage/framework/testing \
             storage/framework/views \
             storage/logs \
             bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

# ── Run post-install scripts now that code is present ────────────────────────
RUN composer run-script post-autoload-dump --no-interaction 2>/dev/null || true

# ── nginx config ─────────────────────────────────────────────────────────────
RUN mkdir -p /run/nginx
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# ── PHP-FPM config ───────────────────────────────────────────────────────────
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# ── OPcache settings ─────────────────────────────────────────────────────────
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.revalidate_freq=0" >> /usr/local/etc/php/conf.d/opcache.ini \
 && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini

# ── Supervisord config (manages nginx + php-fpm) ─────────────────────────────
COPY docker/supervisord.conf /etc/supervisord.conf

# ── Startup script ───────────────────────────────────────────────────────────
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
