#! /bin/bash

#Install for Website
echo "Installing dependencies..."

NGINXCONFIG="server {
listen 0.0.0.0:443 default ssl;
ssl_certificate nginx.crt;
ssl_certificate_key nginx.key;
access_log /var/log/nginx/EnviroHub.log;
root  /var/www/EnviroHub;
  location / {
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header Host \$http_host;
    proxy_set_header  X-NginX-Proxy true;
    proxy_pass http://127.0.0.1:3000/;
    proxy_redirect off;
  }
}"

echo `mkdir /var/www`
echo "created directory var/www"
echo "installing git..."
echo `apt-get install --yes git`
echo "installing curl"
echo `apt-get install --yes curl`
echo `curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -`
echo "installing node.js"
echo `apt-get install --yes nodejs`
echo `apt-get install --yes build-essential`
echo "installing postgresql"
echo `apt-get install --yes postgresql` 
echo "cloning EnviroHub into /var/www"
echo `git clone https://github.com/kwyoung11/WaterLog.git /var/www/EnviroHub`
echo "installing app dependencies"
echo `npm install --prefix /var/www/EnviroHub`
echo "installing nginx"
echo `apt-get install --yes nginx`
echo `touch /etc/nginx/sites-available/EnviroHub`
echo $NGINXCONFIG > /etc/nginx/sites-available/EnviroHub
echo `rm /etc/nginx/sites-enabled/EnviroHub`
echo `ln -s /etc/nginx/sites-available/EnviroHub /etc/nginx/sites-enabled`
echo `rm /etc/nginx/sites-available/default`
echo "Creating nginx security certificate and key..."
echo `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/nginx.key -out /etc/nginx/nginx.crt`
echo `service nginx restart`
echo `touch /var/www/EnviroHub/database.json`
echo "starting postgres server"
echo `su postgres -c '/usr/lib/postgresql/9.1/bin/pg_ctl -D /var/lib/postgresql/9.1/main/ -o "-c config_file=/etc/postgresql/9.1/main/postgresql.conf" start &'`
echo -e "Please provide the root user password so that we can create the necessary database tables: \c "
read password
echo `sudo -u postgres createuser root -s`
echo `su - postgres -c "psql -U postgres -d postgres -c \"alter user root with password '$password';\""`
STRING="{\"dev\": {\"host\": \"localhost\",\"user\": \"root\",\"database\": \"envirohub\",\"password\": \"$password\", \"driver\": \"pg\", \"port\": \"5432\"}, \"prod\": {\"host\": \"localhost\",\"user\": \"root\",\"database\": \"envirohub\",\"password\": \"$password\", \"driver\": \"pg\", \"port\": \"5432\"}}"
echo $STRING > /var/www/EnviroHub/database.json
echo "creating database"
echo `createdb envirohub`
echo "creating tables..."
cd /var/www/EnviroHub
echo `/var/www/EnviroHub/node_modules/db-migrate/bin/db-migrate --config /var/www/EnviroHub/database.json -m /var/www/EnviroHub/migrations up`
echo "starting server"
echo `/var/www/EnviroHub/node_modules/pm2/bin/pm2 start /var/www/EnviroHub/server.js`

#Tile Server Install
apt-get update
echo "Installing tile server"
adduser osm

echo "Installing dependencies for tile server"
apt-get install libboost-dev libboost-filesystem-dev libboost-program-options-dev libboost-python-dev libboost-regex-dev libboost-system-dev libboost-thread-dev subversion git-core tar unzip wget bzip2 build-essential autoconf libtool libxml2-dev libgeos-dev libgeos++-dev libpq-dev libbz2-dev proj-bin proj-data libproj-dev munin-node munin libprotobuf-c0-dev protobuf-c-compiler libfreetype6-dev libpng12-dev libtiff4-dev libicu-dev libgdal-dev libcairo-dev libcairomm-1.0-dev apache2 libagg-dev lua5.2 liblua5.2-dev ttf-unifont apache2-prefork-dev

echo "Installing Postgresql"
apt-get install postgresql-9.1-postgis postgresql-contrib postgresql-server-dev-9.1


su postgres -c 'createuser osm;'
su postgres -c 'createdb -E UTF8 -O osm gis;'

cd /home/osm/
su osm -c 'psql -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql -d gis;'

su osm -c 'psql -d gis -c "ALTER TABLE geometry_columns OWNER TO osm; ALTER TABLE spatial_ref_sys OWNER TO osm;";'

echo "Installing osm2psql"
su osm -c 'mkdir /home/osm/src;'
cd /home/osm/src
su osm -c 'git clone git://github.com/openstreetmap/osm2pgsql.git;'

apt-get install osm2pgsql
su osm -c 'psql -f /home/osm/src/osm2pgsql/900913.sql -d gis;'

echo "Installing Mapnik"
cd /home/osm/src
su osm -c 'git clone git://github.com/mapnik/mapnik;'
cd mapnik
su osm -c 'git branch 2.0 origin/2.0.x;'
su osm -c 'git checkout 2.0;'
su osm -c 'python scons/scons.py configure INPUT_PLUGINS=all OPTIMIZATION=3 SYSTEM_FONTS=/usr/share/fonts/truetype/;'
su osm -c 'python scons/scons.py;'
cd /home/osm/mapnik
python scons/scons.py install
#ldconfig


echo "Installing Mod Tile"
cd /home/osm/src
su osm -c 'git clone git://github.com/openstreetmap/mod_tile.git;'
cd mod_tile
su osm -c './autogen.sh;'
su osm -c './configure;'
su osm -c 'make;'
cd /home/osm/mod_tile
make install
make install-mod_tile
mkdir /var/run/renderd
chown osm /var/run/renderd
ldconfig

#mapnik
echo "Intalling Mapnik Styles"
#su osm
#cd ~/src
cd /home/osm/src
su osm -c 'svn co http://svn.openstreetmap.org/applications/rendering/mapnik mapnik-style;'
cd mapnik-style
./get-coastlines.sh /usr/local/share


#cd inc
cd inc
cp fontset-settings.xml.inc.template fontset-settings.xml.inc
cp datasource-settings.xml.inc.template datasource-settings.xml.inc
cp settings.xml.inc.template settings.xml.inc

echo "Editting configuration files"
cp /var/www/EnviroHub/Configurations/settings.xml.inc /home/osm/src/mapnik-style/inc/settings.xml.inc
cp /var/www/EnviroHub/Configurations/datasource-settings.xml.inc /home/osm/src/mapnik-style/inc/datasource-settings.xml.inc
cp /var/www/EnviroHub/Configurations/renderd.conf /usr/local/etc/renderd.conf
cp /var/www/EnviroHub/Configurations/mod_tile /etc/apache2/conf.d/mod_tile
cp /var/www/EnviroHub/Configurations/default /etc/apache2/sites-available/default
cp /var/www/EnviroHub/Configurations/TileServerLocation.js /var/wwww/EnviroHub/app/webroot/js/services/TileServerLocation.js

#add in configuration files
#settings.xml.inc
#datasource-settings.xml.inc
#fontset-settings.xml.inc
#/usr/local/etc/renderd.conf
#/etc/apache2/conf.d/mod_tile
#/etc/apache2/sites-available/default
#add in maps

su osm -c 'mkdir /home/osm/tiles;'
cd /home/osm/tiles

echo "Enter the state you want tiles of in lowercase (i.e. "maryland", "west_virginia")"

read state

su osm -c 'wget http://download.geofabrik.de/north-america/us/'$state'-latest.osm.pbf;'

echo "Importing maps into postgres database"
su osm -c 'osm2pgsql --slim -d gis -C 1000 --number-processes 3 ~/tiles/'$state'-latest.osm.pbf;'

mkdir /var/run/renderd
chmod 777 /var/run/renderd
mkdir /var/lib/mod_tile
chmod 777 /var/lib/mod_tile

/etc/init.d/apache2 restart

su osm -c 'renderd -f -c /usr/local/etc/renderd.conf;'


echo "To see if the tile server installed correctly, open a browser and go to localhost/mod_tile/0/0/0.png.  If there is a map of the world installation was successful."
