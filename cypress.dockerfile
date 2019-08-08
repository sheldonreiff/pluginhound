FROM cypress/base:8

RUN mkdir /home/app

RUN yarn global add cypress