angular.module("betterLog", []);

angular.module("betterLog").controller("AppController", function ($scope) {
    var vm = this;
    vm.messages = [];

    var fs = require('fs'),
        path = require('path');

    const readline = require('readline');
    const file = '/mnt/bbb/log/development.log';

    fs.watchFile(file, (curr, prev) => {
        readNewData(file, curr.size, prev.size);
    });

    function readNewData(file, curr, prev) {
        if (curr > prev) {
            var lineReader = readline.createInterface({
                input: fs.createReadStream(file, { start: prev, end: curr, flags: "r", encoding: "UTF-8" })
            });
            lineReader.on('line', function (line) {
                if (line && line !== "\n") {
                    console.log("Line", line);
                    const parsedLine = JSON.parse(line);
                    parsedLine.logLevel = setLogLevel(parsedLine.level);
                    vm.messages.push(parsedLine);
                }
            });
            lineReader.on('close', () => {
                console.log("Finished");
                $scope.$digest();
            });
        }
    }

    function setLogLevel(level){
        switch(level){
            case 'info':
                return 'text-info';
            case 'warn':
                return 'text-warning';
            case 'error':
                return 'text-danger';
            default:
                return 'text-primary';
        }
    }
});



