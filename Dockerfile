FROM node:10.16.0-slim
EXPOSE 3000
# set working directory
WORKDIR /home/pg-api

# install and cache app dependencies
COPY package.json /home/pg-api
RUN npm install

# copy files to container doc
COPY . /home/pg-api

# start app
CMD ["npm", "start"]