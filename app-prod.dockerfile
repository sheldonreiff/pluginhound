FROM php:7.3.5-fpm-stretch

RUN docker-php-ext-install pdo pdo_mysql bcmath

RUN chown www-data /var/www

COPY ./ /usr/local/apache2/htdocs/

RUN chmod -fR 777 /usr/local/apache2/htdocs/storage
