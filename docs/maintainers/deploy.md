# Deploying a FarmData2 Test Instance to a Cloud Server

A running instance of FarmData2 can be deployed to a cloud server for testing purposes. Instances of FarmData2 deployed using these instructions should not be used in production.

## Deploying to Digital Ocean

The instructions in this document have been used on [DigitalOcean](https://www.digitalocean.com) with a Debian Droplet. It should be straightforward to port them to any other hosting platform that provides `ssh` access to a Linux server.

### Creating a Droplet

1. [Create a new Droplet in Digital Ocean](https://docs.digitalocean.com/products/droplets/how-to/create/) with the following specifications:
   - Choose a region and data center close to you.
   - Image: Debian 12 or newer
   - Size: Shared CPU (Basic)
   - CPU Options: Regular, 2~GB RAM, 50~GB SSD Disk, 2~TB transfer.
   - Authentication Method: Password
   - Create root password: Give a secure root password for your droplet.
   - Click "Create Droplet" at the bottom of the form.
2. Note the IP Address of the Droplet.
3. Assign a Reserved IP Address if necessary.
   - Reserving and IP ensures that the site has the same IP address across Droplet restarts.
   - This can be useful if you give the IP to external testers.

### Connect to the Droplet

1. Click the `...` to the right of the Droplet name and IP address in the browser.
2. Choose "Access Console"
3. Click "Launch Droplet Console"

### Configuring the Droplet

Within the Droplet Console:

1. `curl -s https://raw.githubusercontent.com/FarmData2/FarmData2/refs/heads/development/bin/deploy/config.bash -o config.bash`
2. `chmod 755 config.bash`
3. `./config.bash`

### Deploying the FarmData2 Instance

Within the Droplet Console:

1. `su - fd2dev`
2. `git clone https://github.com/FarmData2/FarmData2.git`
3. `cd FarmData2/bin`
4. `./fd2-up.bash`
5. `docker exec -it fd2_dev /bin/bash`
   - At the bash shell prompt in the `fd2_dev` container:
     1. `gh auth login`
        - Log in to GitHub using a Personal Access Token (PAT) with `repo`, `read:org` and `workflow` permission.
     2. `cd FarmData2/bin/deploy`
     3. `./deploy.bash [branch]`
        - Replace `[branch]` with the branch to be deployed.
        - Defaults to `development` if no `branch` is specified.
     4. `./setPasswords.bash`
        - Change the passwords for each of the different types of FarmData2 users.
     5. `docker stop fd2_dev`

### Connect to the Live FarmData2 Instance

1. Enter `http://123.123.123.123` (replacing 123.123.123.123 with the IP address of your Droplet.)
   - Note that this is `http` and not `https`.
2. Log in to FarmData2 using the password you set for one of the following users:
   - `admin`
   - `manager`, `manager2`
   - `worker1`, `worker2`, …, `worker5`
   - `guest`

## Updating the Deployed Instance

If the deployed branch is updated, or you want to deploy a different branch fetching any changes to the branch and rebuild the `farm_fd2` module.

Within the Droplet console:

- `docker exec -it fd2_dev /bin/bash`
  - At the bash shell prompt in the `fd2_dev` container:
    1. `cd FarmData2`
    2. `git switch <branch>`
    3. `git pull origin <branch>`
    4. `npm run build:fd2`
