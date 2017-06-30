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
2. Insert credential in mongo db for new apps with this format:
   ```{
    "name" : "[Your app name]",
    "client_id" : "[your app client id]",
    "redirect_url" : "[your app callback url"
    }```
    e.g. if you are using oauth-client from my repo:
    ```{
    "name" : "#1 app",
    "client_id" : "helloapp",
    "redirect_url" : "http://192.168.99.100:4000/callback"
   }```
3. Create .env file which contains these lines:
   TWILIO_ACCOUNT_SID=xxxxx
   TWILIO_AUTH_TOKEN=xxxx
   TWILIO_PHONE_NUMBER=xxxx
4. Build docker-telco-oauth image:
   ```docker build -t [your image name]```
5. Run image 
   ```docker run -d -p 3001:3000 --name oauth-server -t [your image name]```
