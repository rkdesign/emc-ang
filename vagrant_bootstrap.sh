##################################################################################
# VAGRANT PROVISIONING FILE
# NODE.JS GENERAL DEVELOPMENT
# UBUNTU TRUSTY TAHR
##################################################################################

# NOTE: everything in this file is run as root!

##################################################################################
# GENERAL SETUP
##################################################################################

#Add an authorized key for SSH
echo -e >> /home/vagrant/.ssh/authorized_keys "\nssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAQEAxMprtqa5xdarmrfqYKrmBT0vcJXiGbcwEmxdVYis5tUzU3L7aMVwJt6hfq7Vpt+T1PDeR8RJ2JwCe+ObYG+4GqJ8B2O9MLOusNoI2MoiVvhiUcUeD+n2fx7TWGXVrTtGVFbBTW9Z4qsRYY2R1mbyYsKZyM8+/i3C/f79HK+6je0GUoDEftcK2x9JvBWH+bDgmiriZrIbNBXgiy+0/6/Qa+CT8blfqrI+0cJ5Udf+7WNVeiVYhBFqcn0QZ1Ep0b1xnAThJZ+d1Iz8+6GM2g2OvuARxSIVUhrZJjh6y+EtYX1M2l/7+OyQNXm1tJuVLIXL6tUjLKVDVxCIISH4ojMhZQ== rsa-key-20150420\n"
chmod 700 /home/vagrant/.ssh
chmod 600 /home/vagrant/.ssh/authorized_keys

#update stuff
apt-get -y update

##################################################################################
# NODEJS SETUP
##################################################################################

#add repository for nodejs
add-apt-repository ppa:chris-lea/node.js 

#install packages
apt-get -y install build-essential ruby python nodejs npm git 

#Install SASS
gem install sass

#get node to latest stable version
npm install -g npm
npm install -g n
npm cache clean -f
n stable
npm cache clear
npm install -g gulp grunt bower express sails

##################################################################################
# SAMBA CONFIGURATION: SO WINDOWS HOSTS DON'T CHOKE ON NPM
##################################################################################

#install samba for windows shares
apt-get -y install samba samba-common

#create directory for anonymous samba share, belonging to nobody.nogroup
usermod -a -G nogroup vagrant
mkdir /samba
chown nobody:nogroup -R /samba
chmod -R 0777 /samba
#smb.conf
touch /etc/samba/smb.conf
cat <<EOT >> /etc/samba/smb.conf
#======================= Global Settings =======================
[global]
   workgroup = WORKGROUP
   server string = %h server (Samba, Ubuntu)
   dns proxy = no
   server role = standalone server
   map to guest = bad user
   usershare allow guests = yes
   

#======================= Share Definitions =======================
[samba]
   path = /samba
   comment = Samba
   browseable = yes
   writable = yes
   guest ok = yes
   create mask = 0777
   directory mask = 0777
EOT

service samba restart