echo "Starting FarmData2 dev environment container"

mkdir ~/.fd2
mkdir ~/.fd2/gids
id -u > ~/.fd2/gids/docker.gid
id -g > ~/.fd2/gids/fd2grp.gid

cd docker
docker compose --profile dev --detach up 

gp ports await 5901 > /dev/null
gp ports await 6901 > /dev/null

echo "Started."
echo ""
echo "*********************************************************************************"
echo "*********************************************************************************"
echo ""
echo "Connect to the Farmdata2 dev environment with your browser at:"
gp url 6901
echo ""
echo "*********************************************************************************"
echo "*********************************************************************************"
echo ""
echo "Alternatively you can connect via a VNC client on your machine using the following commands:"
SSH_URL=$(gp ssh | cut -f2 -d' ')
echo "  Run the following command in a terminal:"
echo "    ssh -L 5901:localhost:5901 $SSH_URL"
echo "  Connect your VNC Client to:"
echo "    localhost:5901"
echo ""
echo "*********************************************************************************"
echo "*********************************************************************************"
echo ""
