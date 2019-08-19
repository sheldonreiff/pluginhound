#!/bin/sh
set -xe

php /var/www/html/artisan migrate

php-fpm