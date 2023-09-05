# Generative Suite
---
This is a suite of generative tools that I have created.
The tools are currently in beta, and are not guaranteed to work. If you have any questions, comments concerns, please email me at [razvanbeldeanu789@gmail.com](mailto:razvanbeldeanu789@gmail.com)


## Demo Video
[![Showcase Video](https://img.youtube.com/vi/mlmlO8Zr1OM/0.jpg)](https://www.youtube.com/watch?v=mlmlO8Zr1OM)

# Getting Started

The program uses Python 3+ and node.js please make sure you get them from their respetive installers or have these already installed on your machine and added to the PATH.

Before the app can be used fully you will need an OpenAI API key which you can find more information about [here](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key)

Once you have an OpenAI key, put it into an environment variable (or .env file in the backend directory) the variable name  "OPENAPI_KEY". Once that is done you are ready to move on to spinning up the backend

In addition to OpenAI this project leverages your GPU to generate images with stable diffusion. It has only been tested on an NVIDIA RTX 4070, and will not work unless there is a GPU present.

## Start Backend

To start the backend open up a terminal window to the root directory of this project and execute the following commands (this may take a couple minutes the first time)

Windows Powershell with pip
* cd .\Backend\
* .\\.venv\Scripts\activate
* pip install -r requirements.txt
* pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118 
* flask --app backend run

To check the server is running, visit localhost:5000 and if there is 

## Start Frontend

Once the backend is up and running in a terminal, keep that terminal open and in a new window from the project root directory run the following commands

Windows Powershell
* cd cd .\Frontend\
* npm i
* npm start

Once that is started navigate to localhost:3000 to start using the app!