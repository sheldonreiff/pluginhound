FROM php:7.3.5-fpm-stretch

RUN docker-php-ext-install pdo pdo_mysql bcmath

RUN chown www-data /var/www

RUN apt-get update \
    && apt-get install -y gnupg2 \
    && apt-get install -y curl \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get install -y yarn

RUN echo "cd /usr/local/apache2/htdocs" >> ~/.bashrc
