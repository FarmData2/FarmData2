# Connecting to the FarmData2 Development Environment

There are two ways to connect to the linux-based FarmData2 Development Environment.

## Connect Using Your Web Browser

Connecting with your web browser is the easiest way to connect to the FarmData2 Development Environment. There are no additional dependencies to install and the linux desktop will appear inside your browser window.

There are a few things to know about connecting to the FarmData2 Development Environment in your browser.

- There is a "noVNC Menu" that can be opened at the left edge of the desktop.

  - Use the _gear_ icon and set the "Scaling Mode" to "Remote Resizing" to have the desktop automatically fill the browser window.
  - Use the _full screen_ icon to change the desktop into full screen mode to hide the browser decorations and provide more space for the linux desktop.
  - Use the _clipboard_ icon to copy and paste information between the FarmData2 Development Environment and your local machine. If copying between your local machine and the FarmData2 Development Environment is something you do frequently you may want to consider [using a VNC Client](#connect-using-a-vnc-client), which does not have this limitation.

- See the [Keyboard Shortcuts](#keyboard-shortcuts) below for a list of key combinations that can be used within the FarmData2 Development Environment.

## Connect Using a VNC Client

You can also connect to the FarmData2 Development Environment using a VNC Client. To do so, you will need to install a VNC client such as the [Tiger VNC Viewer](https://sourceforge.net/projects/tigervnc/files/stable/1.13.0/) on your local machine.

The main advantage of using a VNC client as opposed to connecting in your browser, is that you will be able to copy and paste between your host machine and the FarmData2 Development Environment more easily.

- See the [Keyboard Shortcuts](#keyboard-shortcuts) below for a list of key combinations that can be used within the FarmData2 Development Environment.

## Keyboard Shortcuts

- Copy and paste _within_ the FarmData2 Development Environment uses the following key combinations:
  - Within a terminal window:
    - Copy: `CTRL+SHIFT+C`
    - Paste: `CTRL+SHIFT+V`
  - Within any other application:
    - Copy: `CTRL+C`
    - Paste: `CTRL+V`
