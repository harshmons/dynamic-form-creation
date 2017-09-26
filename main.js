angular.module('my-app', [])
    .controller('cntrl', ['$scope', '$http','$parse', function($scope, $http,$parse) {


        // GETTING FILE CONTENT
        function getFileContent(url) {
            return $http.get(url).then(function(response) {
                return new X2JS().xml2js('<data>' + response.data + '</data>').data;
            })
        }

        function parseJsonToArray(object, hirerachy, tempArray) {
            // FUNCTION USED TO CONVERT ALL THE KEYS OF AN OBJECT TO ARRAY WHICH WILL HOLE THE COMPLETE PATH OF THAT KEY USING [] NOTATION

            /* INPUT -
             Object - SHOULD HOLDS THE OBJECT AFTER ROOT TAG
             hirerachy - OPTIONAL.USED TO PREPEND WITH [] IN KEY
             tempArray - OPTIONAL.USED TO APPEND ALL THE KEY IN THIS ARRAY AND RETURN
             */

            /* OUTPUT -
             ARRAY WITH VALUES AS [] SEPARATED NOTATION FOR ALL THE KEYS
             */

            if (!tempArray) {
                var tempArray = [];
            }

            angular.forEach(object, function(value, key) {
                // var tempKey = isNaN(key) ? key : ('[' + key + ']');
                // var tempHirerachy = (hirerachy) ? ((hirerachy + ((key === tempKey) ? ('.' + key) : tempKey))) : key;
                var tempKey = '["' + key + '"]';
                var tempHirerachy = hirerachy ? (hirerachy + tempKey) : tempKey;

                if ((typeof value).toLowerCase() === 'object')
                    parseJsonToArray(value, hirerachy ? tempHirerachy : ('["' + key + '"]'), tempArray);

                else if ((typeof value).toLowerCase() !== 'function')
                    tempArray.push(hirerachy ? tempHirerachy : tempKey);
            })
            return tempArray;
        }

        $scope.fileData = {};
        getFileContent('http://localhost:3000/file.xml').then(function(response) {
            $scope.fileData = response;
            $scope.listOfFormFields = parseJsonToArray($scope.fileData);
        })

        $scope.propertify = function(string) {
            // alert(string);
            var p = $parse(string);
            var s = p.assign;
            return function(newVal) {
                if (newVal) {
                    s($scope, newVal);
                }
                return p($scope);
            };
        };

    }])
    .filter('separate', function() {
        // FILTER TO REPLACE THE . AND _ WITH SPACES
        return function(string) {
            var tempArray = [];

            var regExp = /\["([^"\]]*)"\]/g;
            // var str = 'I expect five hundred dollars ["$500"] ["$100"] ["$211"].';
            var m;
            while (m = regExp.exec(string)) {
                tempArray.push(m[1]);
            }

            return tempArray.join(" ");
        }
    })
