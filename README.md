![WSU CSC](http://wsucscmean.herokuapp.com/modules/core/img/WSU_CSC_Logo_Color_Web.png)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/WSUCSClub)  


## What is this?
This is version 2 of the web app for WSU Computer Science Club.
It aims to organize the club member list and send custom email to a list of members.
This app is built using the [Mean stack] (https:/meanjs.org/)
Mean is a full stack web app using MongoDb (NoSQL database) / NodeJs and Express for server side / Angular for client side

![preview](https://dl.dropboxusercontent.com/u/2061836/preview.png)


This is a step by step for beginners to get the project working on their station

## How to view this project on your machine?

### STEP1: Install all prerequisites:

If you are using MAC or linux, just open terminal

If you are using Windows, open command line and use Powershell
```
c:\> powershell
```

You can use all these installs for future projects which are supporting Nodejs, Bower, grunt, Yo.. We will install them globally on your system:

[Download MongoDb](http://www.mongodb.org/downloads), Mongodb is the database that our app will be using. 
> We will use MongoLab for this project, so installing a Mongodb is optional

[Download Node](http://www.nodejs.org/download), node is basically what will allow you to use Javascript on the server, it is really powerful and getting so much popular

---
From this point we can use node package manager to install all other tools
 [Bower](http://bower.io/): it is the tool for managing all your front-end packages
```
$ npm install -g bower
```
[Grunt](http://gruntjs.com/): grunt is a task runner, it automates your development process
```
$ npm install -g grunt-cli
```
[Yo](http://yeoman.io/): you will need it to start any new app, it is a scaffolding tool to generate the most useful parts of your project
```
$ npm install -g yo
```
and of course you will need to [download git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if you did not, Git is a version control tool will let you send your project back and


> You might need to use sudo before each npm if you get some errors

### STEP2: Cloning The GitHub Repository
Navigate to your working folder using 
```
cd [foldername]
```
Create a new folder 
```
mkdir [foldername]
```
list all items in folder 
```
ls
```
You can use Git to directly clone the repository (good practice for collaboration):
```
$ git clone https://github.com/WSUCSClub/WSUCSCMean.git
```
Or just download the Zip file


## STEP3: Install the app
Once you've downloaded the boilerplate and installed all the prerequisites, you're just a few steps away from starting to develop the MEAN application.

The first thing you should do is install the Node.js dependencies. The boilerplate comes pre-bundled with a package.json file that contains the list of modules you need to start the application, to learn more about the modules installed visit the NPM & Package.json section.

To install Node.js dependencies you're going to use npm again, in the application folder run this in the command-line:

```
$ npm install
```

You will need to install the front end dependencies too: 
```
$ bower install
```

## STEP4: Running our Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)
                            
That's it! your application should be running by now.

## How to collaborate on this project: 

### Getting new pushes:
If you used git clone in your setup, you will just need to do
```
$ git pull
```
### Pushing changes:
A better instruction sheet will be updated soon.
Meanwhile, you can help yourself with these [tutorials](https://www.atlassian.com/git/tutorials/syncing)
