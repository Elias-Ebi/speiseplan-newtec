# Speiseplan 2.0 - NewTec
## Setup
- Have Docker installed.
- In `frontend/src/app/environment.ts` you have to replace `localhost` in the apiUrl with the domain of your server.
- In `docker-compose.yml`, under *frontend:labels* and *backend:labels*, replace the 'XXXXXXX' with the Host-Domain.
- In `docker-compose.yml`, under *traefik:command* replace the example-mail with your own mail-address. This will be used for the certificate.
- In `docker-compose.yml`, replace the default login credentials for postgres and pgadmin.
- In `backend/src/environment.ts`, replace 'XXXXXXX' with a random string.
- Execute `docker-compose up` in the top directory of the project.
- Frontend will be available under the domain you specified in the setup, PgAdmin for Database configuration will be available under `yourDomain:8080`.

### PgAdmin-Configuration
- In the demo-build you can log in using the default credentials for pgadmin in the `docker-compose.yml`.
- Add a new server:
  - In the General-Tab, choose a name to your liking.
  - In the Connection Tab, you have to add the ip-address of the postgresql-docker container. To obtain it, open a terminal and enter `docker inspect database`. The last 'IPAddress' value in the response is the correct Host name/address.
  - As Username and Password, use the credentials for the database in the `docker-compose.yml`.
  - Save.

### Make user to admin
- User must be registered, this can be done by using the login-screen of the frontend.
- Log in to PgAdmin.
- Expand 'Databases', 'postgres', 'Schemas', 'public', 'Tables'.
- Right-click on 'profile', select 'View/Edit Data' -> 'All Rows'.  
- The boolean for Admin can be edited by double-clicking and clicking till a checkmark-symbol is visible.
- Data Changes need to be saved by pressing the corresponding button in the Webinterface or by pressing 'F6'.
