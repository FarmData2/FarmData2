gp ports await 5901 > /dev/null
gp ports await 6901 > /dev/null

echo ""
echo "*********************************************************************************"
echo "*********************************************************************************"
echo ""
echo "Connect to the Farmdata2 Development Environment in your browser"
echo "by clicking the following link:"
echo ""
gp url 6901
echo ""
echo "*********************************************************************************"
echo "*********************************************************************************"
echo ""
echo "Alternatively you can connect to the FarmData2 Development Environment"
echo "using a VNC client on your machine:"
echo ""
SSH_URL=$(gp ssh | cut -f2 -d' ')
echo "  Run the following command in a (unix/WSL) terminal on your local machine:"
echo "    ssh -L 5901:localhost:5901 -o UserKnownHostsFile=/dev/null $SSH_URL"
echo ""
echo "  Then connect your VNC Client to:"
echo "    localhost:5901"
echo ""
echo "*********************************************************************************"
echo "*********************************************************************************"
echo ""
