# Interactive Components Samples

## Introduction

The Digital Editor allows users to create and add their own highly customizable components to a digital article.

This repository contains steps on how to create and configure these components as well as example components that can be used inside an article.

### Info: This feature requires Content Station Aurora version 11.6 or higher

## Configuration

Any interactive component first needs to be configured in the Content Station Management Console before it is shown in the Digital Editor.

### Content Station Management Console

The Content Station Management Console has a separate page called Interactive Components in the sidebar.
On this page new interactive components can be added globally or per Brand.

For new components a number of options have to be configured:

- `Name`: This name is shown in the add dialog of the Digital Editor.
- `Icon URL`: This icon will be shown in the add dialog of the Digital Editor as well.
- `View URL`: The view HTML of the interactive component. This is the HTML that is shown inside an article as well as the HTML that is shown when the article is published.
- `Edit URL`: The HTML used in the edit popover. This will load a component in which the user can modify the data.
- `Show in Digital Editor`: An option to show or hide the component inside the add dialog of the Digital Editor.
- `Description`: The description of the interactive component.
- `Default JSON`: When provided this JSON is passed along to the popover the first time it is opened.

#### Component Setup

As an example we can use the Google Maps component from this repository.

> The Google Maps component needs an API key from Google to function. Getting an API key is pretty straightforward and can be found here: https://developers.google.com/maps/documentation/javascript/get-api-key.
Once you have the API key you will have to add it to both the google-maps-view.html and the google-maps-edit.html. Inside these files there is a `YOUR_KEY_HERE` part. This has to be replaced with the API key. After that the files should work as expected.

Both the google-maps-view.html and the google-maps-edit.html as well as the int-comp-sdk-v1.js have to be located on an accessible web server, preferable on https. The sdk.js has to be in the same location as the HTML files.

> One of the reason HTTPS is prefered is because you cannot load HTTP data in a HTTPS page. Meaning if the Digital Editor is running in HTTPS, interactive components running on HTTP will not work.

Once the steps above have been complete you can fill in the `View URL` and the `Edit URL` with the locations of the html files. Make sure it has a valid `Name` as well.
After this the interactive component should be saved succesfully in the Management Console.

#### Additional options for the Google Maps component
It's possible to tweak the google maps controls by adjusting the `default JSON` of the component.
By using this you could, for example, make the published map static or only hide the street-view toggle. 

> These options are documented in: https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions 

You can only add them in the `default JSON` of the interactive component inside the Management Console.
An example default JSON could be: 
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

#### Deleting components

If an interactive component is deleted in the Management Console, this component will no longer be visible inside an article. In stead of the component, an error screen will be shown.

To prevent this behavior, it's better to disable the component first. This can be done by turning off the option `Show in Digital Editor`. 

When it's clear the component is not used anymore it can be safely deleted.

### Digital Editor

Once the Management Console steps are complete, create a new digital article in the Brand that has the interactive component configured. (Or any Brand if the component was added to the Global list).

After the article is created open the add component dialog by hitting the + icon between components. This dialog has a new tab called **Interactive**. Inside this tab all the components that are configured for this article will be listed. You can now add the Google Maps component to the article.

## Communication API

Both the view and edit HTML files can communicate with the Digital Editor via a postMessage API.
The current version of the API supports 4 messages.

The sdk.js that is provided together with the interactive components initializes a global object called `IntCompSdk`. This global object offers several functions that ease the communication with the Digital Editor. See the google-maps files for examples.

### readyForData

This message is sent by the interactive component to the Digital Editor to indicate that its initial booting is completed and it's ready to receive data related to the component.
The sdk.js offers the function `IntCompSdk.readyForData()` for this message.

```json
{
  "version": "1.0",
  "id": "readyForData"
}
```

### useData
This message is sent by the Digital Editor to the interactive component. It contains the data associated with the instance of the component as it was previously stored in the article via the storeData message.

```json
{
  "version": "1.0",
  "id": "useData",
  "data": {

  }
}
```

### storeData

This message is sent by the interactive component to the Digital Editor to store data associated with the instance of the interactive component. In our Google Maps component this data can consist of marker and zoom information.

```json
{
  "version": "1.0",
  "id": "storeData",
  "data": {
    "version": "1.0" // required
    ...
  }
}
```

### resize

This message is sent by the interactive component to the Digital Editor to initiate a resize. It will adjust the width and/or height of the container in which the interactive component is loaded to fit this page. The container can be an interactive component in the Digital Editor or in the edit popup. In case of the edit popup, it will adjust the dialog size in which the edit HTML is visible. 

The width and height should be in pixels or percentages and both are optional. 
> I.e. { "width": "100%", "height": "50px" } or { "width": "400px" }

By default the width of the page is 100% of the component width. The width is limited by the article or edit dialog width.
The component height is by default 1em and should, in most cases, be adjusted. This can be done by setting a fixed height as done in the Google Maps view sample.
The sdk.js contains a function to automatically adjust the component height to the page body height. This can be done by calling `IntCompSdk.autoHeight()` once. See the dev-example-view.html page.

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


