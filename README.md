# Samples of components with interactive content

## Introduction

The Digital Editor allows users to create and add their own components with highly interactive content to a digital article.

This repository contains steps on how to create and configure these components as well as two samples that can be used inside a digital article.

### Important: This feature requires Content Station Aurora version 11.15 or higher

Check [here](tree/1.0) if you're using a Content Station Aurora version between 11.6 and 11.15 and want to use interactive components.

## Configuration and Usage

Configuring interactive components consists of two parts. The first is the **interactive content** itself which needs to be hosted on an accessible external web server. The second part is to create or extend a component set to include a **component** to make the interactive content available for use in the Digital Editor. This samples project is based on the [boilerplate project](https://github.com/WoodWing/csde-components-boilerplate) and extends it with two components.

### Upload sample interactive content

All files in the `samples` folder need to be copied to an accessible web server, preferably accessible through HTTPS. While copying, keep the folder structure the same, as all HTML files refer to the Javascript file through a relative link.

> One of the reasons HTTPS is preferred over HTTP is that HTTP data cannot be loaded in a HTTPS page. This means that if the Digital Editor is running on HTTPS, components with interactive content accessed through HTTP will not work.

#### Google Maps sample

One of the provided samples in this repository is the Google Maps component which requires additional configuration before copying.

> The Google Maps interactive content needs an API key from Google to function. Getting an API key is straightforward and instructions can be found on the [Google Maps JavaScript API
](https://developers.google.com/maps/documentation/javascript/get-api-key) web page.
Once you have the API key you will have to add it to both the `google-maps-view.html` and the `google-maps-edit.html` files. These files contain a placeholder `YOUR_KEY_HERE` which should be replaced with the API key. After replacing the key the files should work as expected.

### Building the component set

1. Install NodeJS 8 or higher
2. Go to the cloned directory
3. Initialize the project

		$> npm install

4. Change the `INSERT_YOUR_BASE_URL_HERE` part of the URL in the `viewLink` and `editLink` properties of the components in `componentDefinition.json` to point to the location where the uploaded interactive content is located. 
5. Build the component set. Afterwards the `dist` folder will contain a zip file with the created component set.

		$> npm run build

Check out the [boilerplate project](https://github.com/WoodWing/csde-components-boilerplate) for more information about creating component sets.

#### Additional options for the Google Maps component
It's possible to tweak the Google Maps controls by adjusting the `defaultConfig` property of the component in `componentDefinition.json`. By using this you could, for example, make the published map static or hide the Street View toggle. 

> The options are documented in: [MapOptions API](https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions) 

This is an example configuration for the `defaultConfig` property: 

```json
{ 
    "version": "1.0",
    "options": { 
        "clickableIcons":true, 
        "draggable": false, 
        "fullscreenControl": false, 
        "keyboardShortcuts": false, 
        "mapTypeControl": false, 
        "panControl": false, 
        "rotateControl": false, 
        "scaleControl": false, 
        "scrollwheel": false, 
        "streetViewControl": false, 
        "zoomControl": false 
    }
} 
```


### Upload the component set and configure Enterprise Server

To make the components available for use in the Digital Editor, the component set needs to be uploaded and bound to a digital article template. See the [article](--INSERT--) on Helpcenter for information about managing and using component sets. 

### Using the interactive components in the Digital Editor

Once the configuration steps are complete, create a new digital article from the digital article template bound to the component set with the new components.

After the article is created, open the component picker by hitting the + icon between components. This dialog has an extra tab called **Interactive**. Inside this tab the two added components are listed. You can now add the Google Maps component to the article.

## Communication API

Both the view and edit HTML files that are part of the interactive content can communicate with the Digital Editor via the postMessage API. The current version of the API supports 4 messages.

The `sdk.js` that is provided together with the interactive content initializes a global object called `IntCompSdk`. This global object offers several functions that ease the communication with the Digital Editor. See the [google-maps](samples/google-maps) files for examples.

### `readyForData` message

This message is sent by the interactive content to the Digital Editor to indicate that its initial booting is completed and it's ready to receive data related to the component.
The `sdk.js` offers the function `IntCompSdk.readyForData()` for this message.

```json
{
  "version": "1.0",
  "id": "readyForData"
}
```

### `useData` message
This message is sent by the Digital Editor to the interactive content. It contains the data associated with the instance of the component as it was previously stored in the article via the storeData message.

```json
{
  "version": "1.0",
  "id": "useData",
  "data": {

  }
}
```

### `storeData` message

This message is sent by the interactive content to the Digital Editor to store data associated with the instance of the component. In the Google Maps component this data can consist of marker and zoom information.

```json
{
  "version": "1.0",
  "id": "storeData",
  "data": {
    "version": "1.0"
  }
}
```

### `resize` message

This message is sent by the interactive content to the Digital Editor to initiate a resize. It will adjust the width and/or height of the container in which the interactive content is loaded to fit its dimensions. The container can be a component in the Digital Editor or an element in the edit pop-up. In case of the edit pop-up, it will adjust the dialog size in which the edit HTML is visible. 

The width and height should be in pixels or percentages and both are optional. 

	{ "width": "100%", "height": "50px" }
or

	{ "width": "400px" }

By default the width of the page is 100% of the container width. The width is limited by the article or edit dialog width. The container height is by default 1em and should, in most cases, be adjusted. This can be done by setting a fixed height as done in the Google Maps view sample. The `sdk.js` contains a function to automatically adjust the container height to the interactive content height. This can be done by calling `IntCompSdk.autoHeight()` once. See the [dev-example-view.html](samples/dev-example/dev-example-view.html) file for an example how to do this.

```json
{
  "version": "1.0",
  "id": "resize",
  "data": {
    "height": "",
    "width": ""
  }
}
```

## Incorporating changes from the boilerplate

Due to GitHub limitations this project has not been forked from the [boilerplate project](https://github.com/WoodWing/csde-components-boilerplate). Incorporating the latest changes from the boilerplate is therefore slightly more work.
	
1. Create and switch to a new branch.

		$> git checkout -b <yourbranch> 

2. Add the boilerplate as remote.

		$> git remote add upstream https://github.com/WoodWing/csde-components-boilerplate

3. Pull in the latest changes from the boilerplate.

		$> git pull upstream master

4. Resolve merge conflicts. In particular this `README.md` will result in conflicts. In most cases you want to ignore the changes to boilerplate's `README.md`.

5. Push your changes to the remote.

		$> git push origin <yourbranch>

6. Create a pull request.
