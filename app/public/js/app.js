angular.module("betterLog", []);

angular.module("betterLog").controller("AppController", function ($scope) {
    var vm = this;
    vm.messages = [{ "tag": "asd", "level": "info", data: { asd: 10 }, timestamp: new Date() }];

    var fs = require('fs'),
        path = require('path');

    const readline = require('readline');
    const file = '/home/dev/Projects/bbbetterLog/blabla.txt';

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
                    vm.messages.push(JSON.parse(line));
                }
            });
            lineReader.on('close', () => {
                console.log("Finished");
                $scope.$digest();
            });
        }
    }
});



