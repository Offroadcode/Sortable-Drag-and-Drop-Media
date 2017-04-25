# Sort-in-Place

## Install Dependencies

*Requires Node.js to be installed and in your system path. Go [here](https://docs.npmjs.com/getting-started/installing-node) for instructions to install node if needed.*

    npm install -g grunt-cli && npm install -g grunt
    npm install

## Build

### Umbraco Package

If you want to build the package file (into the `/pkg/` folder) into a package zip to load with Umbraco's package installer, use:

    grunt umbraco

or

    npm run package

### Distrubition

You can build this project into a releasable distribution in the `/src/dist/` folder with either of the following commands:

    grunt

or

    npm run build

These files can be dropped into an Umbraco 7 site, or you can build directly to a site using:

    grunt --target="D:\inetpub\mysite"

You can also watch for changes using:

    grunt watch

or:

    grunt watch --target="D:\inetpub\mysite"
