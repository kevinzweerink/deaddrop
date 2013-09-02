Dead Drop.js
========

## Overview
Dead Drop is a simple, lightweight javascript library for passing variables between discrete pages of a website without server-side code or polluting URLs. It has two main actions right now: dropping and stashing.

### Dropping
Drops are a quick-n-dirty way to pass data from one page to another. Drops are stored in local storage temporarily during page load, but once they have been retrieved on the destination URL they will be removed from local storage automatically. Currently dropped data does not persist on page refresh, which is a problem that I need to fix. You can drop data two ways: through the data API or programatically.

#### Data API
Drops can be sent between pages by adding a `data-drop` attribute to any `<a>` tag. The value of the `data-drop` attribute will be saved in local storage with a key corresponding to the href of the `<a>` tag when the link is clicked.

#### Programmatic Drops
To drop data programmatically, simply call `window.DD.drop(el, pkg)`, where `el` is the `<a>` tag that links to the page you want the data to appear for, and `pkg` is the package you want to send to the page.

### Stashing
Stashing is a way to cache permanent data for your site. The stash is available on every page. Currently stashing is only possible programmatically, but I plan to add data-API support soon.

#### Programmatic Stashing
To stash a variable, call `window.DD.appendStash(obj)` where obj is a javascript object containing all of the properties you want to be added to the stash.

### Accessing Data
Any page that includes deaddrop.js will automatically load in two variables, the stash and the package. All stashed data is available by default in 	`window.DD.stash	`. Any data that was sent to this page via a drop will be available by default in `window.DD.package`.

### Purging Data
To clear all data created by Dead Drop, call `window.DD.purge()`.

