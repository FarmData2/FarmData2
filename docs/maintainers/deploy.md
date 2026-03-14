# Deploying a FarmData2 Test Instance to a Cloud Server

A running instance of FarmData2 can be deployed to a cloud server for testing purposes. Instances of FarmData2 deployed using these instructions should not be used in production.

## Deploying to Digital Ocean

The instructions in this document have been used on [DigitalOcean](https://www.digitalocean.com) with a Debian Droplet. It should be straightforward to port them to any other hosting platform that provides `ssh` access to a Linux server.

### Creating a Droplet

1. [Create a new Droplet in Digital Ocean](https://docs.digitalocean.com/products/droplets/how-to/create/) with the following specifications:
   - Choose a region and data center close to you.
   - Image: Debian 12
   - Size: Shared CPU (Basic)
   - CPU Options: Regular, 1~GB RAM, 25~GB SSD Disk, 1000-GB transfer.
   - Authentication Method: Password
   - Create root password: Give a secure root password for your droplet.
   - Click "Create Droplet" at the bottom of the form.
2. If the droplet needs to be used across start/stop cycles:
   - Click the link to "Add a Reserved IP" address.
   - Note the "Reserved IP" that is assigned.

### Connect to the Droplet

1. Click the `...` to the right of the Droplet name and IP address in the browser.
2. Choose "Access Console"
3. Click "Launch Droplet Console"

### Configuring the Droplet

Within the Droplet Console:

1. `curl -s https://raw.githubusercontent.com/FarmData2/FarmData2/refs/heads/development/bin/deploy/config.bash -o config.bash`
   - If modifying `config.bash` commit changes to a branch and adapt the URL to use the branch.
2. `chmod 755 config.bash`
3. `./config.bash`

### Deploying the FarmData2 Instance

Within the Droplet Console:

1. `su - fd2dev`
2. `gh auth login`
   - Login using a personal access token with at least 'repo', 'read:org', 'workflow' permissions.
3. `git clone https://github.com/FarmData2/FarmData2.git`
4. `git switch [branch]`
   - Optional: Use to deploy from a branch other than `development`.
5. `cd ~/FarmData2/bin/deploy`
6. Run the `deploy.bash` script.
   - If a reserved IP address is being used, provide the IP address as a command line argument.
     - `./deploy.bash 123.123.123.123`
   - Otherwise run without a command line argument and the script will determine the IP to use.
     - `./deploy.bash`
7. `./setPasswords.bash`
   - Change the passwords for each of the different types of FarmData2 users.

### Connect to the Live FarmData2 Instance

1. Enter `https://123.123.123.123.sslip.io` (replacing 123.123.123.123 with the IP address of your Droplet.)
2. Log in to FarmData2 using the password you set for one of the following users:
   - `admin`
   - `manager`, `manager2`
   - `worker1`, `worker2`, …, `worker5`
   - `guest`

## Updating the Deployed Instance

If the deployed branch is updated, or you want to deploy a different branch fetching any changes to the branch and rebuild the `farm_fd2` module.

Within the Droplet console:

1. `su - fd2dev`
2. `cd FarmData2`
3. `git switch <branch>`
4. `git pull origin <branch>`
5. `npm run build:fd2`
