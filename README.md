# Sortable Drag & Drop Media &middot; ![version](https://img.shields.io/badge/version-1.0.1-green.svg) [![our umbraco](https://img.shields.io/badge/our-umbraco-orange.svg)](https://our.umbraco.org/projects/backoffice-extensions/sortable-drag-drop-media/)

Sortable Drag & Drop Media is a custom Umbraco media grid list view that permits sorting of media items by dragging and dropping the media items inside the grid view. This provides editors with a quicker way to sort or reorganize their media items.

## Installation & Set Up

Install the selected release through the Umbraco package installer or [download and install locally from Our](https://our.umbraco.org/projects/backoffice-extensions/sortable-drag-drop-media/).

You can get instructions on setting up the Sortable Drag & Drop Media grid view [here](https://github.com/Offroadcode/Sortable-Drag-and-Drop-Media/wiki/Installation-Guide).

## How To Use

Use mostly like you would with the default Umbraco media grid list view, dragging media items onto the draggable media folder or clicking on "or click here to choose files" to add via the directory tool.

When you have more than one media item visible, you can drag media items over another media item to have the two swap their order in the list!

---

## Install Dependencies

If you wish to edit or build this code base, you can follow the following instructions.

*Requires Node.js to be installed and in your system path. Go [here](https://docs.npmjs.com/getting-started/installing-node) for instructions to install node if needed.*

    npm install -g grunt-cli && npm install -g grunt
    npm install

## Build

### Umbraco Package

If you want to build the package file (into the `/pkg/` folder) into a package zip to load with Umbraco's package installer, use:

    grunt umbraco

or

    npm run package

### Distribution

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
