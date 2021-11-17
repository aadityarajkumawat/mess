#!/bin/bash

command=$1

if [ $command = "start" ]; then
    cd artistry
    # start backend
    cd ./backend
    yarn start &
    # go back to root
    cd ..
    # start frontend
    cd frontend
    yarn start
elif [ $command = "stop" ]; then
    echo "this is not available for windows at the moment"
elif [ $command = "setup" ]; then
    mkdir artistry
    cd artistry
    # setup frontend
    git clone https://github.com/shreya250101/artistry_front-end.git frontend
    cd frontend
    yarn

    # go back to root
    cd ..

    # setup backend
    git clone https://github.com/shreya250101/artistry-backend backend
    cd backend

    # install dependencies
    yarn
    # create environment file
    touch .env

    # add environment variables
    echo "PORT=4001" >> .env
    echo "COOKIE_SECRET=dhbfkjdvfasdfveuwfvwjdfhvdsjfvha" >> .env
    echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/artistry_dev?schema=public" >> .env

    # setup prisma
    npx prisma generate
    npx prisma migrate dev --name setup

    # build
    yarn build
    cp -r ./src/graphql ./dist/
else
    echo "please enter a valid command"
fi