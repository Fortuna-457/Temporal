
![Temporal Letters](https://github.com/Fortuna-457/Temporal/blob/60e86e29b9e5e5f1249827d3cad9215187d3f1e8/appTemporal/static/img/temporalLetters.png )


<h3>Table of contents</h3>

*   [Index](#Index)
    *   [Introduction](#Introduction)
    *   [Instalation](#Instalation)
    *   [Endpoints](#Endpoints)
    *   [Use-Cases](#Use-Cases)
    *   [Authors](#Authors)
    *   [Licencia](#licencia)


## Introduction
This is the documentation for the application part.
<h4>Technologies used</h4>

| **Backend** | **Frontend** | **Others** |
| ----------- | ----------- | ---------- |
| <img src="https://miro.medium.com/v2/resize:fit:1200/1*HVKOLLX7wprRbHTl2IPDcQ.png" height="50"> | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/1280px-Sass_Logo_Color.svg.png" height="50"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/640px-Bootstrap_logo.svg.png" height="50"> <img src="https://miro.medium.com/v2/resize:fit:860/0*eFomJUFua8tuqe8g.png" height="50"> | <img src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png" height="50"> <img src="https://avatars.githubusercontent.com/u/18133?s=280&v=4" height="50"> <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" height="50"> <img src="https://f-droid.org/repo/icons-640/org.microg.nlp.backend.nominatim.20042.png" height="50"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Leaflet_logo.svg/2560px-Leaflet_logo.svg.png" height="50"> | <img src="https://axolotagencia.com/wp-content/uploads/2021/12/openai.jpeg" height="50"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/1200px-Openstreetmap_logo.svg.png" height="50">|

## Instalation

<h4>Prerequisites</h4>

<h4>Steps to run the application</h4>
To clone and run this applicaion, you'll need to follow the next steps:
<br>
1.  ```git clone https://github.com/Fortuna-457/Temporal.git```
2.  ```cd '.\Temporal Game\'```
3.  ```cd .\Game\```
4.  ```docker build -t temporal-game .```
5.  ```docker run -p 8000:8000 temporal-game```
6.  ```Visit http://127.0.0.1:8000```

## Endpoints

<h4>Home</h4>

*   ```GET /```: Shows the main window

<h4>Login</h4>

*   ```GET /login```: Show the login window.
*    ```POST /login```: Logs in the user, and then we are redirected to the main window. But if the user/password is not correct, we are redirected to the login window with a message error. x-access-token header required.
*    ```POST /logout```: Logs out the user, and then we are redirected to the main window.

<h4>Register</h4>

*   ```GET /register```: Shows the register window.
*   ```POST /register```: Registers the user, and then we are redirected to the login window with a succes message. But if the data is not correct, we are redirected to the register window with a message error. x-access-token header required.

<h4>Forgot Password</h4>

*   ```GET /reset_password```: Shows the reset password window.
*   ```POST /reset_password```: Sends an email to the specified mail, which has to be in our database. x-access-token header required.
*   ```POST /reset_password```: Sends an email to the specified mail, which has to be in our database. If it is not, we will be redirected to the reset_password window. x-access-token header required.
*   ```GET /reset_password_sent```: Shows the reset password sent window.
*   ```GET /reset/Nw/set-password```: Shows the set-password window.
*   ```POST /reset/Nw/set-password```: Reset the password with the new one. x-access-token header required.
*   ```GET /reset_password_complete```: Shows the reset_password_complete window.

<h4>Contact Us</h4>

*   ```GET /contact```: Shows the contact window.
*   ```GET /talk-to-us```: Shows the form of talk to us.
*   ```POST /talk-to-us```: Sends an email to the enterprise account with the message specified from the email introduced in the form. Sends a message error if the operation was not successful. x-access-token header required.

<h4>Games</h4>

*   ```GET /games```: Shows the games window. Login required.
*   ```GET /maps```: Shows the maps window. Login required.
*   ```POST /get-info-place```: Sends the id of the selected place, expecting info return. x-access-token header required. Login required
*   ```GET /trivial```: Shows the trivial window. Login required.
*   ```POST /get-questions```: Gets the questions, depending on the difficulty. Login required. x-access-token header required.
*   ```POST /get-ranking```: Gets the five users with the highest scores. Login required. x-access-token header required.

<h4>Profile</h4>

*   ```GET /profile```: Shows the profile window. Login required.
*   ```POST /profile```: Sends the data of the form, for its validation. Login required. x-access-token header required.
*   ```GET /get-profile-picture```: Gets the profile picture of the specified user. Login required.
*   ```POST /set-profile-picture```: Sets the profile picture of the specified user, with the new user. Login required. x-access-token header required.

## Use Cases
<h4>Click on the thumbnails to go to YouTube</h4>

### Auth use  example
[![Watch the video](https://github.com/Fortuna-457/Temporal/raw/d4cc4e396cf970a299afe34067a9d6ad46b879fd/appTemporal/static/img/image_2024-06-08_192758544.png)](https://www.youtube.com/watch?v=0C1rLSAlkBE&t=1s)


### Reset password example
[![Watch the video](https://github.com/Fortuna-457/Temporal/raw/6d06941766c29ae429cafb980405df571e2a5626/appTemporal/static/img/image_2024-06-08_193955189.png)](https://youtu.be/qLxm46434cA)
<br>
### Map use example
[![Watch the video](https://github.com/Fortuna-457/Temporal/raw/39fb1ca9f346f433f1913b4d9acc791240f84c2f/appTemporal/static/img/image_2024-06-08_193535273.png)](https://www.youtube.com/watch?v=6E0RjJYCgqc)
<br>
## Trivial use example
[![Watch the video](https://github.com/Fortuna-457/Temporal/raw/ceba6834c3427409fe96eb56bff8ba36171eb969/appTemporal/static/img/image_2024-06-08_194316645.png)](https://youtu.be/J7Hb9gFKGoY)
<br>
### Contact use example
[![Watch the video](https://github.com/Fortuna-457/Temporal/raw/4f4b7c50712fc2f75da6ca3d2b2a2cd132118f5e/appTemporal/static/img/image_2024-06-08_193830736.png)](https://youtu.be/P3r5ZydZEcg)
<br>
### Edit profile
[![Watch the video](https://github.com/Fortuna-457/Temporal/raw/653f82ff775c291f9e0dd7f0a44ec4ef721a153d/appTemporal/static/img/image_2024-06-08_194817532.png)](https://youtu.be/K1AlEmj0C9E)



## Authors
Sofía Khudomyasova: https://github.com/saiihara <br>  <br>
Alejandro Castro Canalejo: https://github.com/Fortuna-457  <br>  <br>
Tristán Alonso Pérez: https://github.com/Tristan-Al  <br>  <br>


## Licencia
All rights reserved to Temporal ©
