angular.module('betterLog', []);

const fs = require('fs');

const { ipcRenderer } = require('electron')

angular.module('betterLog').controller('AppController', function ($scope) {
    var vm = this;
    vm.filter = '';
    vm.messages = [];
    vm.clearLog = clearLog;
    vm.showForm = showForm;
    vm.shouldShow = false;
    vm.filters = ['Level', 'Tag', 'Message'];
    vm.form = {};
    vm.saveFilter = saveFilter;
    vm.removeFilter = removeFilter;
    vm.setFilter = setFilter;

    const readline = require('readline');
    const file = '/mnt/bbb/log/development.log';

    ipcRenderer.on('getAllFilters', (event, arg) => {
        vm.savedfilters = arg;
        $scope.$digest();
    });

    ipcRenderer.send('getAllFilters');

    fs.watchFile(file, (curr, prev) => {
        readNewData(file, curr.size, prev.size);
    });

    function setFilter(filter) {
        if (!filter) {
            vm.filter = '';
            return;
        }

        vm.filter = filter.message;
    }

    function saveFilter(options) {
        ipcRenderer.send('addFilter', options);
        ipcRenderer.send('getAllFilters');
    }

    function removeFilter(options) {
        ipcRenderer.send('removeFilter', options);
        ipcRenderer.send('getAllFilters');
    }

    function clearLog() {
        vm.messages = [];
    }

    function showForm(shouldShow) {
        vm.shouldShow = shouldShow;
    }

    function readNewData(file, curr, prev) {
        if (curr > prev) {
            var lineReader = readline.createInterface({
                input: fs.createReadStream(file, { start: prev, end: curr, flags: 'r', encoding: 'UTF-8' })
            });
            lineReader.on('line', function (line) {
                if (line && line !== '\n') {
                    try {
                        const parsedLine = JSON.parse(line);
                        parsedLine.logLevel = setLogLevel(parsedLine.level);
                        vm.messages.push(parsedLine);
                    } catch (err) {
                        console.error("Error parsing the following JSON: " , line);
                    }
                }
            });
            lineReader.on('close', () => {
                $scope.$digest();
            });
        }
    }

    function setLogLevel(level) {
        switch (level) {
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

angular.module('betterLog').directive('modalDialog', function () {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function (scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function () {
                scope.show = false;
            };
        },
        templateUrl: __dirname + '/js/view/modal.html' // See below
    };
});

