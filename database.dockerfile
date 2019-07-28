FROM mysql:8.0.16

RUN apt-get update && apt-get install vim -y

EXPOSE 3306

CMD ["--default-authentication-plugin=mysql_native_password"]