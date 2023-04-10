# Speiseplan 2.0 - NewTec

## Setup
***This is not a final release! Be aware that some components might use default passwords!***
- In `frontend/src/app/environment.ts` you have to replace *localhost* in the apiUrl with the ip of your server.
- In `docker-compose.yml`, under *frontend:labels*, replace the 'XXXXXXX' with the Host-IP and the example-mail-address with a valid one.
- In `traefik.toml`, replace the example-mail-address with a valid one 

### On Windows
- Install Docker Desktop with WSL enabled
- Execute `docker-compose up` in the top directory of the project
- Frontend will be available under `http://localhost:4200/`, PgAdmin for Database configuration `http://localhost:5050`.

### On Linux
- Follow the instructions from [docker-desktop](https://docs.docker.com/engine/install/ubuntu/) to install Docker Desktop (installation via apt-package is not recommended)
- Execute `docker-compose up` in the top directory of the project
- Frontend will be available under `http://localhost:4200/`, PgAdmin for Database configuration `http://localhost:5050`.

### PgAdmin-Configuration
*These steps might have to be repeated when stopping and starting containers. This is a dev-setup and will be solved differently in the final release!*
- In the demo-build you can log in using the default credentials for pgadmin in the docker-compose.yml
- Add a new server:
  - In the General-Tab, choose a name to your liking
  - In the Connection Tab, you have to add the ip-address of the postgresql-docker container. To obtain it, open a terminal and enter `docker inspect database`. The last 'IPAddress' value in the response is the correct Host name/address.
  - As Username and Password, use the default credentials for the database in the docker-compose.yml
  - Save.

### Make user to admin
- User must be registered, this can be done by using the frontend [login/register-dialog](http://localhost:4200/auth/register).
- Open [PgAdmin](http://localhost:5050).
- Expand 'Databases', 'postgres', 'Schemas', 'public', 'Tables'.
- Right-click on 'profile', select 'View/Edit Data' -> 'All Rows'.  
- The boolean for Admin can be edited by double-clicking and clicking till a checkmark-symbol is visible.
- Data Changes need to be saved by pressing the corresponding button in the Webinterface or pressing 'F6'