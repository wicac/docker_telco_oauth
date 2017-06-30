# docker_telco_oauth
Docker version of Telco Oauth2 by Rayhan

## Notes:
* This image will use default docker assigned IP (192.168.99.100)
  If you want to change the address you can make change in these files:
    * app.js
* Dockercommand file includes all docker command that you will need to build and run this image properly. Feel free to change as needed.

## How to start:
1. Start Mongo Image
   ```docker run --name mongo -p 27017:27017 -d mongo:latest```
2. Insert credential in mongo db with this format
3. Create .env file which contains these lines:
   TWILIO_ACCOUNT_SID=xxxxx
   TWILIO_AUTH_TOKEN=xxxx
   TWILIO_PHONE_NUMBER=xxxx
4. Build docker-telco-oauth image:
   ```docker build -t [your image name]```
5. Run image 
   ```docker run -d -p 3001:3000 --name oauth-server -t [your image name]```
