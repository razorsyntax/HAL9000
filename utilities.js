var utilities = {
        "nextLetter": function(letter) {
            var number = utilities.toNumbers(letter);
            var nextLetter = number + 1;
            return utilities.toLetters(nextLetter);
        },
        "lastLetter": function(letter) {
            var number = utilities.toNumbers(letter);
            var nextLetter = number - 1;
            var lastNumber = utilities.toLetters(nextLetter);

            return lastNumber;
        },
        "toLetters": function(num) {
            "use strict";
            var mod = num % 26;
            var pow = num / 26 | 0;
            var out = mod ? String.fromCharCode(64 + mod) : (pow--, "Z");
            return pow ? utilities.toLetters(pow) + out : out;
        },
        "toNumbers": function(str) {
            "use strict";
            var len;
            var out = 0;
            try {
                len = str.length;
            } catch (err) {
                len = 0;
            }

            var pos = len;
            while ((pos -= 1) > -1) {
                out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos);
            }
            return out;
        },
        "getNextLayer": function(){},
        "getPreviousLayer": function(currentLayer){
            //if it has "Output"
            //grab 
        },
        "doubleLoop": function(first, second, expression){

            //construct a custom double loop with expression

            var arr1 = [];
            var arr2 = [];
            for(let i=0;i<first.length;i++){
                for(let j=0;j<second.length;i++){
                    //expression
                }
                arr2.push(arr1);
            }
            
            return arr2;
        }
};