FROM php:7.3.5-fpm-stretch

RUN docker-php-ext-install pdo pdo_mysql bcmath

RUN chown www-data /var/www

COPY ./ /var/www/html

COPY ./supervisor-confs/laravel-worker.prod.conf /etc/supervisor/conf.d/

RUN chmod -fR 777 /var/www/html/storage

RUN apt-get update && \
    apt-get install -y supervisor

CMD ["/usr/bin/supervisord"]