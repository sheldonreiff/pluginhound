FROM mysql:5.7.26

RUN apt-get update && apt-get install vim -y

EXPOSE 3306