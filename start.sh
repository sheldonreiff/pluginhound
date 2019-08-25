#!/bin/sh
set -xe

php /var/www/artisan migrate

php-fpm