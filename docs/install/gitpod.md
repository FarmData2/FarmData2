# Running the FarmData2 Development Environment in GitPod

When the FarmData2 Development Environment is run in GitPod you will use your browser to connect to the linux-based desktop using your browser.

## Creating the GitPod Workspace

Use the following steps to create a _GitPod workspace_ for the FarmData2 Development Environment:

1. Sign up for a free [GitPod account](https://gitpod.io/login/).
   - Use your GitHub credentials to log in.
     - The free account provides 50 hours/week of usage. Additional hours of usage [can be purchased at a reasonable rate](https://gitpod.io/pricing).
1. Visit the [GitPod Preferences](https://gitpod.io/user/preferences) page.
   1. Under "New Workspaces", set the "default editor" to be "Terminal".
   1. Under "Timeouts", set the "Default Workspace Timeout" to be 10m.
      - This will automatically shut down your workspace after 10 minutes of inactivity and will prevent you from accidentally wasting your free monthly hours.
1. Fork the [upstream FarmData2 repository](https://github.com/FarmData2/FarmData2) in GitHub.
1. Copy the URL of your fork. This URL should have your GitHub username in it.
1. Visit the [new GitPod workspace page](https://gitpod.io/new) and paste the URL of your FarmData2 fork into the "Select a repository" search box and click the search result.
1. Click "Continue".
1. After a few minutes a terminal window will open in your browser. This document will refer to this terminal as the _GitPod Terminal_.

   1. The GitPod Terminal will display information about starting the FarmData2 Development Environment, including about "Starting containers...".
   1. After another few minutes the containers will have started and the GitPod Terminal will display information about how to connect to the FarmData2 Development Environment.

      There are two ways that you can connect to the FarmData2 Development Environment:

      - Connect using your web browser by clicking the `https` link given in the output and then clicking the "Connect" button on the page that appears. See the [Connect Using Your Web Browser](connecting.md#connect-using-your-web-browser) section for additional information.
      - Connect using a VNC client by following the instructions in the output. See the [Connect Using a VNC Client](connecting.md#connect-using-a-vnc-client) section for additional information.

1. Follow the directions to [Setup the FarmData2 Development Environment](setup.md)
1. Visit [your GitPod workspaces](https://gitpod.io/workspaces/)
   - Your "farmdata2" workspace will appear here with a green dot to its left, indicating that it is running.
1. Click the _three vertical dots_ to the right of your farmdata2 workspace.
1. Select "Pin" - this will ensure that your workspace is not automatically deleted after a period of inactivity.
1. Click the _three vertical dots_ again.
1. Select "Stop" - this will shutdown your workspace and close the FarmData2 Development Environment as well.

## Restarting the FarmData2 Development Environment Workspace

After you have created a GitPod workspace for the FarmData2 Development Environment, it is much faster and easier to restart it.

1. Visit [your GitPod workspaces](https://gitpod.io/workspaces).
1. Click the _three vertical dots_ to the right of your "farmdata2" workspace".
1. Select "Open"
1. Follow the instructions to [connect to the FarmData2 Development Environment](connecting.md) in your browser or using a VNC client.
1. When you are done working:
   1. Push the branch you are working on to your GitHub as a backup.
   1. Stop the your farmdata2 workspace using one of the following methods:
      - Visit [your GitPod workspaces](https://gitpod.io/workspaces), click the _three vertical dots_ to the right of your farmdata2 workspace and choose "stop".
      - Type `gp stop` in the GitPod Terminal.
