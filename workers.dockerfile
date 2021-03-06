FROM php:7.3.5-fpm-stretch

RUN docker-php-ext-install pdo pdo_mysql bcmath

RUN chown www-data /var/www

RUN apt-get update && \
    apt-get install -y supervisor

CMD ["/usr/bin/supervisord"]