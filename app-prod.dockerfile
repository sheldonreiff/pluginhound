FROM php:7.3.5-fpm-stretch

RUN docker-php-ext-install pdo pdo_mysql bcmath

RUN chown www-data /var/www

COPY ./ /var/www

RUN chmod -fR 777 /var/www/storage

RUN ["chmod", "+x", "./start.sh"]

CMD ["./start.sh"]