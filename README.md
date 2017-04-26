# Sort in Place &middot; ![version](https://img.shields.io/badge/version-1.0.0-green.svg)

Sort in Place is an Umbraco package with a custom media grid list view that permits sorting of media items by dragging and dropping the media items inside the grid view. This provides editors with a quicker way to sort or reorganize their media items.

## How To Set Up

1. Download the [package zip file](https://github.com/Offroadcode/Sort-in-Place/blob/master/src/pkg/SortInPlace_1.0.0.zip).
2. In your Umbraco back office, navigate to Developer > Packages.
3. Click the "Install Local" icon in the upper right of the page.
4. Click on the "or click here to choose files" link.
5. In the opened file selection window, select the zip file you downloaded.
6. Accept the terms of use and hit "Install Package".
7. After Umbraco completes the installation, hit the "Finish" button.
8. After it reloads, navigate to Settings > Media Types.
9. Click on the "..." to the right of "Media Types" and select a "Media Type" and hit "Create".
10. Set up your media type with the name of your choice.
11. Add a new tab, such as "Content".
12. In that tab, click "Add property".
13. Name the property as you wish and click "Add editor". Select "List View - Media". Hit "Submit".
14. Select the gear icon next to "List View - Media".
15. Click "Add Layouts" under Layouts, add a name of your choice, and insert "/App_Plugins/SortInPlace/views/sortInPlaceView.html" in the Layout Path.
16. Remove the other list views if you don't wish to use them (We recommend at least removing "Grid").
17. Click "Submit", and then click "Submit" again on Property Settings dialog.
18. Click on "Permissions" icon in the upper right of the page.
19. Click "Yes - allow content of this type in the root."
20. Under "Allowed Child Node Types" click "Add Child" and select the node types you wish to permit under it.
21. Hit "Save".
22. In your Media tab, add a new folder of the type you've created.

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
