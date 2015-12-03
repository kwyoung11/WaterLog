#! /bin/bash
echo "Installing dependencies..."

NGINXCONFIG="server {
listen 0.0.0.0:80 default_server;
listen 0.0.0.0:443 ssl;
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
echo `su - postgres -c "psql -U postgres -d postgres -c \"alter user root with password '$password';\""`
STRING="{\"dev\": {\"host\": \"localhost\",\"user\": \"root\",\"database\": \"envirohub\",\"password\": \"$password\", \"driver\": \"pg\", \"port\": \"5432\"}, \"prod\": {\"host\": \"localhost\",\"user\": \"root\",\"database\": \"envirohub\",\"password\": \"$password\", \"driver\": \"pg\", \"port\": \"5432\"}}"
echo $STRING > /var/www/EnviroHub/database.json
echo "creating database"
echo `sudo -u postgres createuser root -s`
echo `createdb envirohub`
echo "creating tables..."
echo `/var/www/EnviroHub/node_modules/db-migrate/bin/db-migrate --config /var/www/EnviroHub/database.json -m /var/www/EnviroHub/migrations up`
echo "starting server"
echo `/var/www/EnviroHub/node_modules/pm2/bin/pm2 start /var/www/EnviroHub/server.js`
