choco install k6
cd "../docker/grafana-influxdb"
cd "../.."
go install go.k6.io/xk6/cmd/xk6@latest
xk6 build --with github.com/grafana/xk6-output-influxdb
docker-compose up -d
pause