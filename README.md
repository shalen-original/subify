# subify #

## Index

* [About](#markdown-header-about)
* [Setup](#markdown-header-setup)
    * [Download and Dependencies Installation](#markdown-header-download-and-dependencies-installation)
    * [Build the Application](#markdown-header-build-the-application)
    * [Test](#markdown-header-test)
* [Run](#run)
    * [Production Server](#markdown-header-production-server)
    * [Development Server](#markdown-header-development-server)

## About

### The Project

Subify is a modern subtitle editor developed with state of the art web technologies which allows you to load a subtitle file, edit it, preview it in real time and then download the modified subtitles.

Read more about the project on [app.rscolati.xyz/about](https://app.rscolati.xyz/about#section-top).

## Setup

To build and run the project, you need [`Node.js`](https://nodejs.org) and [`npm`](https://www.npmjs.com/), installed on your system.

### Download and Dependencies Installation

In order to start working on this project, clone the repository:

```text
git clone https://bitbucket.org/teama8/subify.git
```

or download the source code [here](https://bitbucket.org/teama8/subify/downloads/).
Then install all the dependencies with

```text
npm install
```

### Build the Application

Now you are ready to roll. In order to build the application, run:

```text
npm run build
```

The output of the build will be in the `dist` folder. If you want to build everything for development (that is, without minifing the files and generating sourcemaps), then pass in the `--dev` flag.

### Test

To run the tests, run:

```python
npm run test   # try 'npm run test-win' if on Windows
```

## Run

The application will be accessible at [localhost:8080](localhost:8080) or, alternatively, if run with the `dev` command, at [localhost:8000](localhost:8000) through [`BrowserSync`](https://browsersync.io/).

### Production Server

To run the server, run:

```text
npm run serve
```

### Development Server

In order to run a local development server run:

```text
npm run dev
```

This will clean the `dist` folder, rebuild the entire website and start `div/server.js` with Nodemon, which means that after every change or crash the Node server will restart itself automagically. Moreover, this task sets up a BrowserSync proxy in front of the Node server: this means that every change you made to one of the files of the application will cause the recompilation of that file and the auto-refresh of the page on the browser. Also here, in order to generate sourcemaps etc pass the `--dev` flag.

After running this task, the console will show the address at which the BrowserSync proxy is reachable.

In order for BrowserSync to actually perform the refresh, every page should include this snippet somewhere in the body:

```html
<span id="browser-sync-binding"></span>
```
