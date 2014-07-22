(function () {
    'use strict';

    angular.module('enter', ['ui.bootstrap.position', 'timer'])
        .run(['$rootScope', function ($rootScope) {
            $rootScope.items = [
                {
                    "User": "Иван Сергеев",
                    "Ticket": {
                        "Id": "9c0b4fb8-a44f-4120-9bce-c4ceab4db752",
                        "TicketId": "4fb8f071-dfec-4be4-84d7-01bc67ee00fd",
                        "ProductId": "aacf2c02-7dbf-4bdc-9774-5ba72d0e3abe",
                        "Number": [
                            "П",
                            350
                        ],
                        "IsMulti": false,
                        "IsPending": false,
                        "State": 5,
                        "StartSeconds": 42077,
                        "Seconds": 42793
                    },
                    "Future": [
                        {
                            "Id": "08897e66-380c-4062-9ca5-5eafd489fb30",
                            "TicketId": "b8af7e3f-c359-4362-8842-c2520d98b951",
                            "ProductId": "86c93615-7fca-4ebf-b3cb-8963dab93384",
                            "Number": [
                                "П",
                                361
                            ],
                            "IsMulti": false,
                            "IsPending": false,
                            "State": 3,
                            "StartSeconds": 42423,
                            "Seconds": 43993
                        },
                        {
                            "Id": "eff226be-c44d-4635-b199-72b468430cdf",
                            "TicketId": "d1dbf757-d927-4981-9ffe-077f022f4dac",
                            "ProductId": "500988d3-b027-4217-a99b-c9585b53df48",
                            "Number": [
                                "П",
                                370
                            ],
                            "IsMulti": false,
                            "IsPending": false,
                            "State": 3,
                            "StartSeconds": 42722,
                            "Seconds": 44893
                        }
                    ],
                    "QueueEndSeconds": 46093,
                    "Id": "19d23aca-958a-459e-8fb6-0bc57b6700c8",
                    "Name": "Окно 4",
                    "CompletedCount": 26,
                    "AverageOperating": 519
                }
            ];
        }]);


})();