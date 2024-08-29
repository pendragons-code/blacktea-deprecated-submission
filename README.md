# What is blacktea
Blacktea is a simple word association game that you can play with your friends!

# deployment
```
npm i
npm run deploy
```
# technical stack
Not anything really crazy:			

[nodejs](https://nodejs.org/en)			

[ejs](https://www.npmjs.com/package/ejs)			

[express](https://www.npmjs.com/package/express)			

You might realized that there is no databased used here at all and that is because there is no real need to actually have a database

# things to note
This project is not gonna be updated here, maybe a new one will be somewhere in the future. This repo was meant to be a submission for an event somewhere, it was made with limited time (1 day), so there was not a lot of time for me to test and more. I SOMEHOW, forgot to do sanitation for html stuff and xss. Tbh i kinda have been redoing this project for fun and making use of more socket.io stuff and more.

# flaws (data)
This is a prototype version, and there are a lot of areas to improve on. For example socket events and the way the data structures are built. Many of the changes are made on the fly and this is evident from the room and player management (the room a player is in). In general the architecture of socket interactions are pretty bad and there are many things to work on. (It primarily centers on the data structure.)

# flaws (codebase)
Certain files were too big and organisation of certain things were done horribly.

# flaws (frontEnd and backEnd)
Many of the frontEnd components could actually be simplified, but I made it complicated for no real reason. Escially with the create room component. (I need to use API routes instead of socket.io to do it. The moment I reload a page the socket id is invalidated, this is one of the late developed parts and this should be avoided.)

# new version
[Here](https://github.com/pendragons-code/blackteaV2) is a new version of it. I know it is not the best developed, not fast, not secure and more, but im just a hobbyist, if you have any suggestions for me please do put them down <3. This project is still in development in many many parts!