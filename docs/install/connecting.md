# Connecting to the FarmData2 Development Environment

You can connect to the Linux-based FarmData2 Development Environment in two ways. You can connect [by using your web browser](#connect-by-using-your-web-browser) or you can connect [by using a VNC Client](#connect-by-using-a-vnc-client).

## Connect by Using Your Web Browser

Connecting by using your web browser is the easiest way to connect to a FarmData2 Development Environment. When connecting with your browser, there no dependencies to install on your machine and the Linux desktop will appear inside your browser window.

When connecting to a FarmData2 Development Environment in your browser there are some things to know.

- The "noVNC Menu," at the left edge of the window provides useful configuration options:

  - Click the _gear_ icon and set the "Scaling Mode" to "Remote Resizing" to have the desktop automatically fill the browser window.
  - Click the _full screen_ icon to change the desktop into full screen mode to hide the browser decorations and provide more space for the Linux desktop.
  - By using the _clipboard_ icon you can copy and paste information between the FarmData2 Development Environment and your local machine. If copying between your local machine and the FarmData2 Development Environment is something you do frequently you might want to consider connecting by [using a VNC Client](#connect-by-using-a-vnc-client), which does not have this limitation.

- See the [Keyboard Shortcuts](#keyboard-shortcuts) for a list of key combinations that can be used within the FarmData2 Development Environment.

## Connect by using a VNC Client

You can also connect to a FarmData2 Development Environment with a VNC Client. To do so, you will need to install a VNC client such as the [Tiger VNC Viewer](https://sourceforge.net/projects/tigervnc/files/stable/1.13.0/) on your local machine.

The main advantage of a VNC client as opposed to connecting in your browser, is that copy and paste between your host machine and the FarmData2 Development Environment will work naturally.

- See the [Keyboard Shortcuts](#keyboard-shortcuts) for a list of key combinations that can be used within the FarmData2 Development Environment.

## Keyboard Shortcuts

- Copy and paste _within_ the FarmData2 Development Environment uses the following key combinations:
  - Within a terminal window:
    - Copy: `CTRL+SHIFT+C`
    - Paste: `CTRL+SHIFT+V`
  - Within any other application:
    - Copy: `CTRL+C`
    - Paste: `CTRL+V`
