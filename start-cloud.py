#!/usr/bin/python

import re
import os
import json
import sys

print("To start test set: filepath, output (if needed) and test params. \n\nExample: folderMy/file.js --out xk6-influxdb --email=test@onlyofffice.com --password=11111111 --k6_influxdb_organization=your-organization  --k6_influxdb_bucket=your-bucket  --k6_influxdb_token=your-token --k6_influxdb_addr=your-url-addr  \n\nTo see types of output and arguments write: -h or --help")


def myFunction():
    while True:
        consoleInput = input()
        if consoleInput == "--help" or consoleInput == "-h":
            help()
        else:
            testPath = r'(\w+\\.\w+.js|\w+\/.\w+.js)'
            testPathMatch = re.search(testPath, consoleInput)
            output = r'((--out|-o)\s+(\S+))'
            outputMatch = re.search(output, consoleInput)
            arg = r'(--(?!out|o)(\w+|\w+[.]\w+)(=|\s+)\S+)'
            argMatch = re.finditer(arg, consoleInput)
            if argMatch:
                initArg(argMatch)
            if testPathMatch:
                startTests(outputMatch, testPathMatch)
            else:
                print("Wrong path to file or file extension")
            

def startTests(output, path):
    file = open('config/init/config.json', "r")
    data = json.load(file)
    is_windows = sys.platform.startswith('win')
    if output:
        if output.group(3) == "output-elasticsearch":
            k6_command = f'$env:K6_ELASTICSEARCH_CLOUD_ID={data["k6_elasticsearch_cloud_id"]}; $env:K6_ELASTICSEARCH_USER={data["k6_elasticsearch_user"]}; $env:K6_ELASTICSEARCH_PASSWORD={data["k6_elasticsearch_password"]}; ./k6 run {path.group()} {output.group()}'
            if is_windows:
                os.system(f'powershell.exe {k6_command}')
            else:
                os.system(f'pwsh {k6_command}')
        elif output.group(3) == "xk6-influxdb":
            k6_command_win = f'$env:K6_INFLUXDB_ORGANIZATION=\\"{data["k6_influxdb_organization"]}\\"; $env:K6_INFLUXDB_PUSH_INTERVAL=\\"2s\\"; $env:K6_INFLUXDB_BUCKET=\\"{data["k6_influxdb_bucket"]}\\"; $env:K6_INFLUXDB_TOKEN=\\"{data["k6_influxdb_token"]}\\"; $env:K6_INFLUXDB_ADDR=\\"{data["k6_influxdb_addr"]}\\"; ./k6 run {path.group()} {output.group()}'
            k6_command_ubuntu = f'$env:K6_INFLUXDB_ORGANIZATION="{data["k6_influxdb_organization"]}"; $env:K6_INFLUXDB_PUSH_INTERVAL="2s"; $env:K6_INFLUXDB_BUCKET="{data["k6_influxdb_bucket"]}"; $env:K6_INFLUXDB_TOKEN="{data["k6_influxdb_token"]}"; $env:K6_INFLUXDB_ADDR="{data["k6_influxdb_addr"]}"; ./k6 run {path.group()} {output.group()}'
            if is_windows:
                os.system(f'powershell.exe {k6_command_win}')
            else:
                os.system(f'pwsh -Command \'{k6_command_ubuntu}\'')
        elif output.group(3) == "experimental-prometheus-rw":
            k6_command = f'$env:K6_PROMETHEUS_RW_SERVER_URL={data["k6_prometheus_rw_server_url"]}; $env:K6_PROMETHEUS_RW_USERNAME={data["k6_prometheus_rw_username"]}; $env:K6_PROMETHEUS_RW_PASSWORD={data["k6_prometheus_rw_password"]}; ./k6 run {path.group()} {output.group()}'
            if is_windows:
                os.system(f'powershell.exe {k6_command}')
            else:
                os.system(f'pwsh {k6_command}')
    else:
        print("Not cloud output")

def initArg(argMatch):
    args = ''
    for m in argMatch:
        args = f'{args} {m.group()}'
    abs_path = os.getcwd()
    os.system(f'node {abs_path}/config/init/index.js {args}')

def help():
    print("--k6_influxdb_organization         Set up influxdb organization")
    print("--k6_influxdb_bucket               Set up indluxdb bucket")
    print("--k6_influxdb_token                Set up influxdb token")
    print("--k6_influxdb_addr                 Set up influxdb url")
    print("--k6_elasticsearch_cloud_id        set up elasticseardddch cloud id")
    print("--k6_elasticsearch_user            Set up elastricsearch user")
    print("--k6_elasticsearch_password        Set up elasticsearch password")
    print("--k6_prometheus_rw_server_url      set up prometheus server url")
    print("--k6_prometheus_rw_username        Set up prometheus username")
    print("--k6_prometheus_rw_password        Set up prometheus password")
    print("--email                            Set up user email (e.g: --email=test@onlyuoffice.com)")
    print("--password                         Set up user password (e.g: --password=1111qw11)")
    print("--filesMy                          Set up files count in folder My (e.g: --filesMy=10)")
    print("--foldersMy                        Set up folders count on folder My (e.g: --foldersMy=50)")
    print("--sharedIter.enable                Set up sharedIter scenario enable or not (e.g: --sharedIter.enable=true)")
    print("--sharedIter.iterations            Set up sharedIter iterations (e.g: --sharedIter.iterations=10)")
    print("--sharedIter.vus                   Set up sharedIter vus (e.g: --sharedIter.vus=10)")
    print("--sharedIter.maxDuration           Set up sharedIter max duration (e.g: --sharedIter.maxDuration=null)")
    print("--sharedIter.startTime             Set up sharedIter start time (e.g: --sharedIter.startTime=10s)")
    print("--sharedIter.gracefulStop          Set up sharedIter graceful stop (e.g: --sharedIter.gracefulStop=null)")
    print("--pervuIter.enable                 Set up pervuIter scenario enable or not (e.g: --pervuIter.enable=true)")
    print("--pervuIter.iterations             Set up pervuIter iterations (e.g: --pervuIter.iterations=20)")
    print("--pervuIter.vus                    Set up pervuIter vus (e.g: --pervuIter.vus=100)")
    print("--pervuIter.maxDuration            Set up pervuIter max duration (e.g: --pervuIter.maxDuration=5m)")
    print("--pervuIter.startTime              Set up pervuIter start time (e.g: --pervuIter.startTime=30s)")
    print("--pervuIter.gracefulStop           Set up pervuIter graceful stop (e.g: --pervuIter.gracefulStop=null)")
    print("--constVu.enable                   Set up constVu scenario enable or not (e.g: --constVu.enable=true)")
    print("--constVu.duration                 Set up constVu duration (e.g: --constVu.duration=10s)")
    print("--constVu.vus                      Set up constVu vus (e.g: --constVu.vus=10)")
    print("--constVu.startTime                Set up constVu start time (e.g: --constVu.startTime=null)")
    print("--constVu.gracefulStop             Set up graceful stop (e.g: --constVu.gracefulStop=null)")
    print("--constArrival.enable              Set up constArrival scenario enable or not (e.g: --constArrival.enable=false)")
    print("--constArrival.duration            Set up constArrival duration (e.g: --constArrival.duration=30s)")
    print("--constArrival.preAllocatedVUs     Set up constArrival pre allocated vus (e.g: --constArrival.preAllocatedVUs=30)")
    print("--constArrival.rate                Set up constArrival rate (e.g: --constArrival.rate=30)")
    print("--constArrival.maxVus              Set up constArrival max vus (e.g: --constArrival.maxVus=null)")
    print("--constArrival.timeUnit            Set up constArrival time unit (e.g: --constArrival.timeUnit=1s)")
    print("--constArrival.startTime           Set up constArrival start time (e.g: --constArrival.startTime=null)")
    print("--constArrival.gracefulStop        Set up constArrival graceful stop (e.g: --constArrival.gracefulStop=null)")
    print("--rampArrival.enable               Set up rampArrival scenario enable or not (e.g: --rampArrival.enable=false)")
    print("--rampArrival.preAllocatedVUs      Set up rampArrival pre allocated vus (e.g: --rampArrival.preAllocatedVUs=50)")
    print("--rampArrival.maxVus               Set up max vus (e.g: --rampArrival.maxVus=null)")
    print("--rampArrival.startRate            Set up start rate (e.g: --rampArrival.startRate=300)")
    print("--rampArrival.timeUnit             Set up time unit (e.g: --rampArrival.timeUnit=1m)")
    print("--rampArrival.startTime            Set up start time (e.g: --rampArrival.startTime=null)")
    print("--rampArrival.gracefulStop         Set up graceful stop (e.g: --rampArrival.gracefulStop=null)")
    print("--extControl.enable                Set up extControl scenario enable or not (e.g: --extControl.enable=false)")
    print("--extControl.duration              Set up extControl duration (e.g: --extControl.duration=3m)")
    print("--extControl.maxVus                Set up extControl max vus (e.g: --extControl.maxVus=50)")
    print("--extControl.vus                   Set up vus (e.g: --extControl.vus=10)")
    print("--extControl.startTime             Set up start time (e.g: --extControl.startTime=null)")
    print("--parallel                         Set up multiple url (e.g.: --parallel=true)")
    print("--scenarios.constVu                Set up only one scenario to true for multiple url another set to false (e.g.: scenarios.constVu, scenarios.pervuIter, scenarios.sharedIter, scenarios.constArrival, scenarios.rampArrival, scenarios.extControl)")
    print("\nTypes of output: \n-o output-elasticsearch \n--out output-elasticsearch \n\n-o xk6-influxdb \n--out xk6-influxdb \n\n-o experimental-prometheus-rw \n--out experimental-prometheus-rw")
    
myFunction()