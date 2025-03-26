gp ports await 5901 > /dev/null
gp ports await 6901 > /dev/null

echo ""
echo "*********************************************************************************"
echo "Connecting to the FarmData2 Development Environment"
echo "*********************************************************************************"
echo ""
echo "Connect using your Web Browser:"
echo ""
echo "Click the following link to connect to the Farmdata2 Development Environment"
echo "in your browser:"
echo ""
NOVNC_URL=$(gp url 6901)
# Use the CACHE_KEY so that the browser does not use a cached page
# when the dev environment is restarted. Otherwise reconnecting to
# noVNC will not work.
CACHE_KEY=$(date +%s)
echo "$NOVNC_URL?autoconnect=true&resize=remote&key=$CACHE_KEY"
echo ""
echo "*********************************************************************************"
echo ""
echo "Connect using a VNC Client:"
echo ""
SSH_URL=$(gp ssh | cut -f2 -d' ')
echo "Run the following command in a (unix/WSL) terminal on your local machine:"
echo ""
echo "ssh -L 5901:localhost:5901 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no $SSH_URL"
echo ""
echo "Then run your VNC client and connect to:"
echo ""
echo "localhost:5901"
echo ""
echo "*********************************************************************************"
echo ""
