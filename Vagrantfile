# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|

	config.vm.box = "ubuntu/trusty64"

	# config.vm.network "forwarded_port", guest: 3000, host: 3000
	config.vm.network "private_network", ip: "10.10.10.11"
	# config.vm.network "public_network"

	config.vm.provider "virtualbox" do |vb|
		vb.gui = false
		vb.memory = "2048"

		# Enable VirtualBox SymLinks
		vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]
	end
	
	# NOTE: YOU MUST HAVE CYGWIN INSTALLED WITH RSYNC AND SSH; YOU MUST HAVE CYGWIN IN YOUR PATH
	#if Vagrant::Util::Platform.windows?
	#	ENV["VAGRANT_DETECTED_OS"] = ENV["VAGRANT_DETECTED_OS"].to_s + " cygwin"
	#	
	#end

	config.vm.provision :shell, path: "vagrant_bootstrap.sh"
end
