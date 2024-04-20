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
gp url 6901
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
