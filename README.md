# Serverless-auth-service

## Install

Install the node packages via:

`$ npm install`

## Test

Test the lambda via:

Change the "env" file content to "dev"

`$ npm run test`

## Deploy

Change the "env" file content to "prod"

For my local mac
`. ~/exportawsoscar`

`$ sls deploy`

`$ sls deploy function --function myFunction`