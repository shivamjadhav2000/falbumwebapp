#!/bin/bash
# Set the GCP VM IP address and username
VM_IP_ADDRESS="34.131.234.25"
VM_USERNAME="shivamjadhav348"

echo "starting deploying the build folder"

git branch 

echo "building app ..."

# npm run build

echo "deploying to server $VM_IP_ADDRESS"
 
# Set the path to your build folder
BUILD_PATH="./build/*"

# SSH into the GCP VM and copy the build folder to /var/www/falbumApp

scp -i 'C:/Users/jadha/.ssh/gcp_vm_key' -r $BUILD_PATH $VM_USERNAME@$VM_IP_ADDRESS:/var/www/falbumapp
echo "Restarting the nginx server"
# Restart the web server to apply the changes
ssh  -i 'C:/Users/jadha/.ssh/gcp_vm_key' $VM_USERNAME@$VM_IP_ADDRESS "sudo systemctl restart nginx"
