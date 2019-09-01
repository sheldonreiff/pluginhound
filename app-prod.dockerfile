FROM php:7.3.5-fpm-stretch

WORKDIR /var/www

RUN docker-php-ext-install pdo pdo_mysql bcmath

RUN chown www-data /var/www

COPY ./ /var/www

RUN chmod -fR 777 /var/www/storage

RUN ["chmod", "+x", "/var/www/start-php.sh"]

CMD ["/var/www/start-php.sh"]