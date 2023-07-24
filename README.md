<div align="center">
  
  <h1><a href="https://bulbmin.calathea.dev"><img alt="Bulbmin Logo" width="320" src="https://cdn.discordapp.com/attachments/1016181298399826002/1133108141106675712/Bulbmin_Logo.png"></a></h1>
  <p>Bulbmin makes all single-player (PC) games multiplayer! <a href="https://bulbmin.calathea.dev/">Visit the web client.</a></p>
  <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/Mastriel/Bulbmin-Puffmin/total">
  <img alt="License" src="https://img.shields.io/github/license/Mastriel/Bulbmin-Puffmin">
</div>


## Features
- Allow for (practically) infinite simultaneous connections.
- Killswitch global hotkeys to stop or pause all keyboard inputs.
- A free-to-use server, so you don't have to port-forward and share your own IP address.
- Performant, should not cause issues with network speed or traffic, nor RAM or CPU.
- Low latency, less than 70ms.
- Only the host needs to download an application. Others can use the web client to connect.
- Web client works on mobile!

## What this is not
- Bulbmin does not provide a way to stream your desktop. You must use another platform like Discord to share your screen with participants.

## Why is it named Bulbmin and Puffmin?
- In Pikmin 2, a hidden type of Pikmin is buried in the caves of the game, named Bulbmin. These are revealed to be parasitic Pikmin that have taken
control of a Bulborb as their host. Much like the web clients are 'parasites' on the host computer.
- Puffmin is named for a very similar reason.  

## Puffmin
Puffmin is the server that acts as a mediator between the web client and the Bulbmin desktop client. As a user, you don't have to worry about this.
However, you can self-host a Puffmin server that the web client and desktop client are able to connect to. (WIP, only Bulbmin Control Panel can connect 
to custom servers without edits to BulbminWeb)

# Building and running locally
This project uses a few different technologies, such as NPM, Tauri, Rust, Svelte, and Typescript.

You will need:
* a modern release of [Rust, specifically rustc and cargo](https://www.rust-lang.org/tools/install).
* a modern release of [nodejs with npm](https://nodejs.org/en/download) (I use v18.17.0)
* I recommend a code editor, but you can go old fashioned and use a small magnet and directly manipulate the bits on your disk if you choose.

Firstly, clone this project into your working directory.

Then, run `npm install`. This will install all of the dependencies for all of the different workspaces in the project.

```sh
# Running Bulbmin Control Panel.
# Note: This may take a while on the first run, since Cargo needs to compile many dependencies.
# This *should* compile and work on Linux, however there is no MacOS support.
npm run tauri dev -w Bulbmin

# Running Bulbmin Website
npm run dev -w BulbminWeb

# Running A Puffmin Server
# Note: Using Puffmin.Dockerfile will build the Puffmin workspace into a Docker image.
npm run dev -w Puffmin

# Building all projects
npm run tauri build -w Bulbmin
npm run build -w BulbminWeb
npm run build -w Puffmin

```
