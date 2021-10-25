# Coda Farm Tech Take-Home Interview

## Overview

This repo contains a small, stripped down app based on the actual Farm HQ app, with all features removed. Currently, it does just a few things:

- Loads the google maps API
- Renders a map centered on a farm
- Fetches field data from a [mocked backend](./src/api/fields.json)
- Renders a polygon for each field, which can be clicked by the user to open an
an info window
- Fetches device event data from a [mocked backend](./src/api/events.json)

Your goal is to present the device event data loaded from the mocked api in one
of the following formats.

- An interactive in-map visualization of the device event data that can show users at a glance where there devices are and their current status
- An interactive device event inspector page that allows users to filter the event data by device or number of events and view details related to a specific event

## Goal

This project is intended for you to showcase your design skills and creativity as well as your attention to detail in a more realistic context than is possible during a timed in-person technical interview. As such, it is intentionally open-ended (we want to see your creativity in addition to your technical coding skills), but must meet certain requirements.

## Requirements

### Your Feature

- [ ] Should be interactive, meaning it should visually respond to user
interaction in some way.
- [ ] Usage should be easy to understand, meaning it shouldn't
take more than brief, one-sentence instructions and should use UI patterns
that smart-phone/computer users are familiar with.
- [ ] Should be aesthetically 'clean'.

### Frameworks/Tools

- [ ] Use the redux store to manage state where appropriate.
- [ ] Feel free to install and use third-party utilities/components from npm,
with the only caveat being that you should be prepared to answer questions about why you did so and what you feel was gained. The exception to this is UI libraries (Bootstrap etc.). Please use Material UI augmented with your own CSS or inline styles as needed for styling (more on this later).

### Code Quality

- [ ] No type errors.
- [ ] No linter errors/warnings (see available scripts below).
- [ ] Components should be under 75 lines and be reasonably D.R.Y.
- [ ] Components/functions/variables are given descriptive names that other
developers will understand, for example:

  ```typescript
  
  // not very clear:
  /**
   * Get data before arg
   */
  function getData(arg:string): Array<any> {
    
  }
  // more clear
  /**
   * List all device events that occurred before the provided 
   * utc date string 
   * 
   * @param dt - user input collected by date picker component
   */
  function getDeviceEventsBeforeDate(dt:string): Array<DeviceEvent>{

  }
  ```

### Styling

The project comes with [React Material UI](https://mui.com/getting-started/usage/) installed. You are not expected to create your own basic styled components
(buttons, links, cards, containers etc.); the material components should be fine for whatever you design. If you are new to using Material UI, there are many, many
components so we recommend sticking to the basics:

- Container
- Typography
- Card, CardHeader, CardBody, CardActions,
- List, ListItem, ListItemText
- Button/IconButton

If you want to use icons those are also installed, and you can search the
material icon library ([more info here](https://mui.com/components/icons/#main-content)).

### Other Considerations

- You can modify any files unless they explicitly marked otherwise, or they end with .json.

### Context/Assumptions

You should assume the following about your users:

- They are farmers located in the U.S. that use mobile (a.k.a. traveling) irrigation to grow
[high value row crops](https://en.wikipedia.org/wiki/Row_crop). These types
of irrigation are error prone; they break down or get stuck frequently causing
sections of the field to flood, which destroys their crops and wastes water. Currently, the only viable 'solution' they have to ameliorate this problem is to send crews of workers out to drive from field to field and manually check the reels (and pumps they are attached to) at all hours, which is also wasteful and difficult for the workers, and still leaves many errors unchecked.
- They are comfortable with common technological products (iPhones etc.). They want a simple solution to their problem that gives them a reliable, intuitive way to open up their laptop or phone and understand the current status of their equipment. For this activity, this means the state and pressure of the pumps as well as the state and speed of their reels.
- A device can be installed on an irrigation reel or pump, not both. It emits blobs of json data ("device events"), which report readings from each sensor,
for example:

```jsonc
{
  // ...data
  "reel": { //report from the reel sensor
    "state_current": "RR", // reel is retracting,
    "speed_mmpm": 765 // reel is moving at 765 mm per minute
  }
}

```

- A 'device' can have a 'Reel Sensor', which monitors the movement of the reel. It can also have a pressure sensor, which monitors water pressure. You can assume the users will understand what the words and numbers mean, but they will not want to just read raw data.
(or if it does for some reason the value of the reel sensor reading the just be null).
- A reel can have a Reel Sensor and optionally a pressure sensor. A pump always has a pressure sensor, and never has a reel sensor. All devices have a gps sensor, regardless of the equipment they are installed on.

  ```jsonc
  {
    "device_alias": "whale-hemlock",
    "event_timestamp": "2021-06-05T22:01:51.421000+00:00",
    "gps": {
      "altitude": 0, // in mm
      "location": { // location in geojson format
        "coordinates": [
          -122.3374966,
          48.3736265
        ],
        "type": "Point"
      },
      "n_sats": 18 // satellites in view; proxy for signal strength
    },
    "pressure": {
      "reading_kpa": 6, // pressure 
      // PLO = low pressure
      // PHI = high pressure (good)
      // POV = above threshold (bad)
      "state_current": "PLO" 
    },
    "reel": {
      "run_speed_mmpm": 57367,
      // RR = retracting (sprinkler moving toward reel)
      // RE = extending (farmer is towing sprinkler away from reel before it retracts)
      // RS = stopped and idle
      "state_current": "RE"
    }
  }
  ```

- Generally speaking, users want to know whether their pumps are pumping water and how strongly, and if their reels are moving and how fast at the minimum.

## Project Setup

1. You do not have access to make modifications to the repository. Instead,
create your own repository by using this one as a template. To do this, visit
[visit the repo in github](https://github.com/Coda-Farm-Tech/swe-take-home-react-typescript)
and click "Use this template".[Copy the repo](./copy-the-repo.png), making sure
to **change the owner to your own account.**. Once you have created your copy of the repo,
you can download it to your local computer and proceed with the following instructions.

2. If not already installed, [download and install node.js](https://nodejs.org/en/). To check
whether you have node installed, open a terminal and type ```which node```. If it lists a file path
you shouldn't need to do anything.

3. Use the node CLI to install project dependencies from the root of the project (listed in package.json).

    ```bash
    npm install
    ```

4. If you don't already have one, [create a google maps api key](https://developers.google.com/maps/documentation/javascript/get-api-key).
5. Create a file called '.env.development' at the root of the project, and add
your api key:

    ```dotenv
    # .env.development
    REACT_APP_GOOGLE_MAPS_API_KEY=# paste your api key here without quotes
    ```

    NOTE: This api key is yours and should be kept private. .env.development
    is already in the .gitignore file in the root of the project, as it is best
    to keep it out of version control.
6. With your dependencies installed and api key in place, you can start
developing with the scripts listed below.

This project was adapted from facebook's
[create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) typescript template, which is a good resource for any setup issues

## Available Scripts

NOTE: yarn will also work in place of npm for all scripts.

In a terminal in the project directory, you can run:

### `npm run start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser
The page will reload if you make edits

You will also see any lint/type errors in the console.

### `npm run show-type-errors`

Run the typescript compiler to detect type errors in your code.

If no errors are found, you will see something like this:

```md
✨  Done in 1.15s.
```

### `npm run lint`

Runs eslint from terminal. This will notify you of potential code quality problems. If no errors/problems are reported, you will see something like this:

```md
✨  Done in 1.15s.
```

### `npm run test`

Launches Cypress test runner.

NOTE: Cypress cannot run unless you also have your local developer running
at the same time from a separate terminal (see yarn start above)

The project starts with 3 passing tests. They should all be passing when you are finished. If you think your feature would benefit from testing, feel free to add new integration tests to [App.spec.js](./cypress/integration/App.spec.js)

## Recommended Resources

- [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- [Typescript/React cheat sheets](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example)
- [Redux with Typescript](https://redux.js.org/usage/usage-with-typescript)
- [Cypress Testing](https://cypress.io)
- [Material Design Guides and Specifications](https://material.io/design)

## Recommended Tools

- Editor: Visual Studio Code
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

## Getting Help

If you encounter any problems with project setup that aren't addressed here,
or need clarification on project requirements, email [dan@codafarmtech.com(dan@codafarmtech.com).

## Debrief Interview

After completing the project, double-check the project requirements,  email us a link to your new repo us your work so that we can review it and debrief with you.

We'll ask you questions about various subjects including, but not limited to:

- How and why you made various design choices.
- Which resources you found most helpful.
- What was most challenging.
- What you would do differently if you were to do the project over.
