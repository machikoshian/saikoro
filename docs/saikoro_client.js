/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CharacterType;
(function (CharacterType) {
    CharacterType[CharacterType["None"] = 0] = "None";
    CharacterType[CharacterType["DiceDelta"] = 1] = "DiceDelta";
    CharacterType[CharacterType["DiceOne"] = 2] = "DiceOne";
    CharacterType[CharacterType["DiceTwo"] = 3] = "DiceTwo";
    CharacterType[CharacterType["DiceEven"] = 4] = "DiceEven";
    CharacterType[CharacterType["DiceOdd"] = 5] = "DiceOdd";
    CharacterType[CharacterType["DrawCards"] = 6] = "DrawCards";
    CharacterType[CharacterType["MoveMoney"] = 7] = "MoveMoney";
    CharacterType[CharacterType["SalaryFactor"] = 8] = "SalaryFactor";
    CharacterType[CharacterType["Close"] = 9] = "Close";
    CharacterType[CharacterType["Open"] = 10] = "Open";
    CharacterType[CharacterType["Boost"] = 11] = "Boost";
})(CharacterType = exports.CharacterType || (exports.CharacterType = {}));
var CharacterData = (function () {
    function CharacterData(name, type, round, property) {
        this.name = name;
        this.type = type;
        this.round = round;
        this.property = property;
    }
    return CharacterData;
}());
exports.CharacterData = CharacterData;
var CardType;
(function (CardType) {
    CardType[CardType["None"] = 0] = "None";
    CardType[CardType["Facility"] = 1] = "Facility";
    CardType[CardType["Landmark"] = 2] = "Landmark";
    CardType[CardType["Character"] = 3] = "Character";
})(CardType = exports.CardType || (exports.CardType = {}));
var FacilityType;
(function (FacilityType) {
    FacilityType[FacilityType["Gray"] = 0] = "Gray";
    FacilityType[FacilityType["Blue"] = 1] = "Blue";
    FacilityType[FacilityType["Green"] = 2] = "Green";
    FacilityType[FacilityType["Red"] = 3] = "Red";
    FacilityType[FacilityType["Purple"] = 4] = "Purple";
})(FacilityType = exports.FacilityType || (exports.FacilityType = {}));
var SelectType;
(function (SelectType) {
    SelectType[SelectType["Facility"] = 0] = "Facility";
    SelectType[SelectType["Blue"] = 1] = "Blue";
    SelectType[SelectType["Green"] = 2] = "Green";
    SelectType[SelectType["Red"] = 3] = "Red";
    SelectType[SelectType["Purple"] = 4] = "Purple";
})(SelectType = exports.SelectType || (exports.SelectType = {}));
var CHARACTER_DATA_BASE = 1000;
var CHARACTER_DATA = [
    new CharacterData("幼稚園児", CharacterType.DiceDelta, 2, { "delta": -2 }),
    new CharacterData("小学生", CharacterType.DiceDelta, 2, { "delta": -1 }),
    new CharacterData("中学生", CharacterType.DiceDelta, 2, { "delta": 1 }),
    new CharacterData("高校生", CharacterType.DiceDelta, 2, { "delta": 2 }),
    new CharacterData("大学生", CharacterType.DiceDelta, 2, { "delta": 3 }),
    new CharacterData("執事", CharacterType.DrawCards, 0, { "value": 5 }),
    new CharacterData("市長秘書", CharacterType.DrawCards, 0, { "value": 3 }),
    new CharacterData("有能秘書", CharacterType.MoveMoney, 0, { "money": 500 }),
    new CharacterData("白奴", CharacterType.DiceEven, 0, {}),
    new CharacterData("黒奴", CharacterType.DiceOdd, 0, {}),
    new CharacterData("鉄道員", CharacterType.DiceOne, 3, {}),
    new CharacterData("CA", CharacterType.DiceTwo, 3, {}),
    new CharacterData("気象予報士", CharacterType.Close, 0, { "type": SelectType.Blue }),
    new CharacterData("消防士", CharacterType.Close, 0, { "type": SelectType.Green }),
    new CharacterData("保健所員", CharacterType.Close, 0, { "type": SelectType.Red }),
    new CharacterData("警察官", CharacterType.Close, 0, { "type": SelectType.Purple }),
    new CharacterData("踊り子", CharacterType.Close, 0, { "type": SelectType.Facility }),
    new CharacterData("医者", CharacterType.Open, 0, {}),
    new CharacterData("残念秘書", CharacterType.Boost, 2, { "type": SelectType.Facility, "boost": -1.5 }),
    new CharacterData("社長秘書", CharacterType.Boost, 2, { "type": SelectType.Facility, "boost": 1.5 }),
    new CharacterData("市長", CharacterType.Boost, 2, { "type": SelectType.Facility, "boost": 0.8 }),
    new CharacterData("農家", CharacterType.Boost, 1, { "type": SelectType.Blue, "boost": 2.0 }),
    new CharacterData("看板娘", CharacterType.Boost, 1, { "type": SelectType.Green, "boost": 2.0 }),
    new CharacterData("給仕", CharacterType.Boost, 1, { "type": SelectType.Red, "boost": 2.0 }),
    new CharacterData("レポーター", CharacterType.Boost, 1, { "type": SelectType.Purple, "boost": 2.0 }),
    new CharacterData("土木作業員", CharacterType.Boost, 1, { "type": SelectType.Blue, "boost": -2.0 }),
    new CharacterData("解体屋", CharacterType.Boost, 1, { "type": SelectType.Green, "boost": -2.0 }),
    new CharacterData("大食い王", CharacterType.Boost, 1, { "type": SelectType.Red, "boost": -2.0 }),
    new CharacterData("ロッカー", CharacterType.Boost, 1, { "type": SelectType.Purple, "boost": -2.0 }),
];
var FacilityData = (function () {
    function FacilityData(size, area, // TODO should be range.
        name, cost, type, value, property) {
        this.size = size;
        this.area = area;
        this.name = name;
        this.cost = cost;
        this.type = type;
        this.value = value;
        this.property = property;
    }
    return FacilityData;
}());
exports.FacilityData = FacilityData;
var FACILITY_DATA = [
    new FacilityData(1, [1], "🌾", 100, FacilityType.Blue, 370, {}),
    new FacilityData(1, [2], "🐮", 100, FacilityType.Blue, 330, {}),
    new FacilityData(1, [2], "🌽", 100, FacilityType.Blue, 520, { lmboost: 0.5 }),
    new FacilityData(1, [2], "🐑", 200, FacilityType.Blue, 680, {}),
    new FacilityData(1, [4], "🐝", 200, FacilityType.Blue, 300, { multi: 2 }),
    new FacilityData(1, [4, 5], "🍄", 100, FacilityType.Blue, 220, { multi: 2 }),
    new FacilityData(1, [5], "🌴", 300, FacilityType.Blue, 650, {}),
    new FacilityData(1, [8], "🍅", 100, FacilityType.Blue, 450, { lmboost: 2 }),
    new FacilityData(1, [8, 9], "🌻", 200, FacilityType.Blue, 350, { multi: 2 }),
    new FacilityData(1, [9], "🌰", 100, FacilityType.Blue, 650, { multi: 0.5 }),
    new FacilityData(1, [9], "🗻", 300, FacilityType.Blue, 750, {}),
    new FacilityData(1, [10], "🍎", 100, FacilityType.Blue, 420, {}),
    new FacilityData(1, [10], "🍓", 100, FacilityType.Blue, 720, { multi: 0.5 }),
    new FacilityData(2, [10], "🗻", 300, FacilityType.Blue, 1150, { close: true }),
    new FacilityData(1, [11], "🍉", 100, FacilityType.Blue, 720, { multi: 0.5 }),
    new FacilityData(1, [11], "🍑", 200, FacilityType.Blue, 750, { multi: 0.5 }),
    new FacilityData(2, [11], "🐐", 200, FacilityType.Blue, 710, {}),
    new FacilityData(1, [11, 12], "🎋", 300, FacilityType.Blue, 580, { multi: 2 }),
    new FacilityData(1, [12], "🍍", 150, FacilityType.Blue, 800, {}),
    new FacilityData(1, [2], "🍞", 100, FacilityType.Green, 470, {}),
    new FacilityData(1, [2], "🐟", 100, FacilityType.Green, 670, { multi: 0.5 }),
    new FacilityData(1, [2], "🍆", 100, FacilityType.Green, 670, { multi: 0.5 }),
    new FacilityData(1, [2], "🍖", 100, FacilityType.Green, 670, { multi: 0.5 }),
    new FacilityData(1, [2], "🍬", 100, FacilityType.Green, 420, { lmboost: 3 }),
    new FacilityData(1, [3], "💈", 100, FacilityType.Green, 570, {}),
    new FacilityData(1, [3], "👞", 100, FacilityType.Green, 570, { multi: 0.5 }),
    new FacilityData(1, [3], "💅", 100, FacilityType.Green, 600, { lmboost: 2 }),
    new FacilityData(1, [4], "📖", 200, FacilityType.Green, 520, {}),
    new FacilityData(1, [4], "🏪", 100, FacilityType.Green, 320, { multi: 2 }),
    new FacilityData(1, [6], "💆", 150, FacilityType.Green, 600, { lmboost: 2 }),
    new FacilityData(1, [7], "💻", 200, FacilityType.Green, 1050, { multi: 0.5 }),
    new FacilityData(1, [7], "👕", 200, FacilityType.Green, 550, { multi: 2 }),
    new FacilityData(2, [7], "🏬", 250, FacilityType.Green, 880, {}),
    new FacilityData(1, [7], "🚲", 200, FacilityType.Green, 950, { lmboost: 2 }),
    new FacilityData(1, [8], "🐻", 250, FacilityType.Green, 1180, { multi: 0.5 }),
    new FacilityData(1, [8], "📱", 200, FacilityType.Green, 1050, {}),
    new FacilityData(1, [9], "🔧", 200, FacilityType.Green, 850, { lmboost: 2 }),
    new FacilityData(1, [9], "🚗", 400, FacilityType.Green, 950, { lmboost: 2 }),
    new FacilityData(1, [10], "⚽", 200, FacilityType.Green, 950, { lmboost: 2 }),
    new FacilityData(1, [10], "🏄", 200, FacilityType.Green, 1120, { close: true, multi: 0.5 }),
    new FacilityData(1, [10], "🐞", 100, FacilityType.Green, 1150, { multi: 0.5 }),
    new FacilityData(1, [10], "🐠", 100, FacilityType.Green, 1120, { multi: 0.5 }),
    new FacilityData(1, [11], "👓", 100, FacilityType.Green, 1120, {}),
    new FacilityData(1, [1], "🍣", 200, FacilityType.Red, 750, {}),
    new FacilityData(1, [3], "🐙", 100, FacilityType.Red, 520, { multi: 0.5 }),
    new FacilityData(1, [5], "🍴", 200, FacilityType.Red, 580, { lmboost: 2 }),
    new FacilityData(1, [6], "🍱", 100, FacilityType.Red, 420, { lmboost: 2 }),
    new FacilityData(1, [7], "🍕", 100, FacilityType.Red, 370, { multi: 0.5 }),
    new FacilityData(1, [7], "🍜", 200, FacilityType.Red, 320, { multi: 2 }),
    new FacilityData(1, [8], "🐔", 250, FacilityType.Red, 400, { all: true }),
    new FacilityData(2, [8], "🍻", 300, FacilityType.Red, 400, { all: true }),
    new FacilityData(1, [9], "🍛", 100, FacilityType.Red, 470, { multi: 0.5 }),
    new FacilityData(1, [10], "🐡", 200, FacilityType.Red, 650, { lmboost: 2 }),
    new FacilityData(1, [10], "🍣", 100, FacilityType.Red, 1000, {}),
    new FacilityData(1, [12], "🍵", 200, FacilityType.Red, 720, { multi: 0.5 }),
    new FacilityData(1, [12], "🍸", 150, FacilityType.Red, 350, { all: true }),
    new FacilityData(1, [3], "🎳", 200, FacilityType.Purple, 220, {}),
    new FacilityData(2, [3], "👾", 200, FacilityType.Purple, 520, {}),
    new FacilityData(1, [5], "📰", 100, FacilityType.Purple, 420, {}),
    new FacilityData(2, [5], "🎨", 400, FacilityType.Purple, 650, {}),
    new FacilityData(2, [6], "🎸", 400, FacilityType.Purple, 750, {}),
    new FacilityData(2, [6], "⚽", 500, FacilityType.Purple, 480, { all: true }),
    new FacilityData(1, [7], "🎤", 200, FacilityType.Purple, 370, { all: true }),
    new FacilityData(2, [7], "⚾", 500, FacilityType.Purple, 480, { all: true }),
    new FacilityData(2, [8], "🗿", 400, FacilityType.Purple, 720, {}),
    new FacilityData(2, [8], "🎥", 400, FacilityType.Purple, 400, { all: true }),
    new FacilityData(2, [9], "🐬", 500, FacilityType.Purple, 400, { all: true }),
    new FacilityData(1, [9], "🎾", 100, FacilityType.Purple, 420, { all: true }),
    new FacilityData(1, [10], "⛳", 100, FacilityType.Purple, 770, {}),
    new FacilityData(1, [12], "🔨", 300, FacilityType.Purple, 2000, {}),
];
var LANDMARK_DATA_BASE = 10000;
var LANDMARK_DATA = [
    new FacilityData(2, [], "🏯", 2500, FacilityType.Gray, 0, {}),
    new FacilityData(2, [], "🏰", 2500, FacilityType.Gray, 0, {}),
    new FacilityData(1, [], "🚉", 2500, FacilityType.Gray, 0, {}),
    new FacilityData(2, [], "✈️", 2500, FacilityType.Gray, 0, {}),
    new FacilityData(1, [], "🗼", 2500, FacilityType.Gray, 0, {}),
    new FacilityData(1, [], "🗽", 2500, FacilityType.Gray, 0, {}),
    new FacilityData(1, [], "🚂", 2500, FacilityType.Gray, 0, {}),
    new FacilityData(2, [], "️🚅", 2500, FacilityType.Gray, 0, {}),
    new FacilityData(1, [], "🏫", 2500, FacilityType.Gray, 0, {}),
    new FacilityData(2, [], "🏣", 2500, FacilityType.Gray, 0, {}),
];
var CardData = (function () {
    function CardData() {
    }
    CardData.isFacility = function (data_id) {
        return (0 <= data_id) && (data_id < FACILITY_DATA.length);
    };
    CardData.getRandomFacilityDataId = function () {
        return Math.floor(Math.random() * FACILITY_DATA.length);
    };
    CardData.getAvailableFacilities = function (pip) {
        var facilities = [];
        for (var i = 0; i < FACILITY_DATA.length; ++i) {
            var facility = FACILITY_DATA[i];
            for (var s = 0; s < facility.size; ++s) {
                if (facility.area.indexOf(pip - s) !== -1) {
                    facilities.push(i);
                    break;
                }
            }
        }
        return facilities;
    };
    CardData.isLandmark = function (data_id) {
        return ((LANDMARK_DATA_BASE <= data_id) &&
            (data_id < LANDMARK_DATA_BASE + LANDMARK_DATA.length));
    };
    CardData.getAvailableLandmarks = function () {
        var data_ids = [];
        for (var i = 0; i < LANDMARK_DATA.length; ++i) {
            data_ids.push(LANDMARK_DATA_BASE + i);
        }
        return data_ids;
    };
    CardData.isCharacter = function (data_id) {
        return ((CHARACTER_DATA_BASE <= data_id) &&
            (data_id < CHARACTER_DATA_BASE + CHARACTER_DATA.length));
    };
    CardData.getRandomCharacterDataId = function () {
        return Math.floor(Math.random() * CHARACTER_DATA.length) + CHARACTER_DATA_BASE;
    };
    CardData.getAvailableCharacters = function () {
        var data_ids = [];
        for (var i = 0; i < CHARACTER_DATA.length; ++i) {
            data_ids.push(CHARACTER_DATA_BASE + i);
        }
        return data_ids;
    };
    return CardData;
}());
exports.CardData = CardData;
var Facility = (function () {
    function Facility(data_id) {
        this.is_open = true;
        var data;
        if (data_id >= LANDMARK_DATA_BASE) {
            data = LANDMARK_DATA[data_id - LANDMARK_DATA_BASE];
        }
        else {
            data = FACILITY_DATA[data_id];
        }
        this.data_id = data_id;
        this.name = data.name;
        this.size = data.size;
        this.area = data.area;
        this.cost = data.cost;
        this.type = data.type;
        this.value = data.value;
        this.property = data.property;
        this.is_open = true;
    }
    Facility.prototype.toJSON = function () {
        return {
            class_name: "Facility",
            data_id: this.data_id,
            is_open: this.is_open,
        };
    };
    Facility.fromJSON = function (json) {
        var facility = new Facility(json.data_id);
        facility.is_open = json.is_open;
        return facility;
    };
    Facility.prototype.reset = function () {
        this.is_open = true;
    };
    Facility.prototype.getName = function () {
        return this.name;
    };
    Facility.prototype.getSize = function () {
        return this.size;
    };
    Facility.prototype.getArea = function () {
        return this.area;
    };
    Facility.prototype.getCost = function () {
        return this.cost;
    };
    Facility.prototype.getType = function () {
        return this.type;
    };
    Facility.prototype.getValue = function () {
        return this.value;
    };
    Facility.prototype.getDescription = function () {
        var descriptions = [];
        switch (this.type) {
            case FacilityType.Gray:
                descriptions.push("ランドマーク");
                break;
            case FacilityType.Blue:
                descriptions.push(this.value + "\u30B3\u30A4\u30F3\u7A3C\u3050");
                descriptions.push("誰のターンでも");
                break;
            case FacilityType.Green:
                descriptions.push(this.value + "\u30B3\u30A4\u30F3\u7A3C\u3050");
                descriptions.push("自分ターンのみ");
                break;
            case FacilityType.Red:
                if (this.property.all) {
                    descriptions.push(this.value + "\u30B3\u30A4\u30F3\u3092\u5168\u54E1\u304B\u3089\u596A\u3046");
                }
                else {
                    descriptions.push(this.value + "\u30B3\u30A4\u30F3\u596A\u3046");
                }
                descriptions.push("相手ターンのみ");
                break;
            case FacilityType.Purple:
                if (this.property.all) {
                    descriptions.push(this.value + "\u30B3\u30A4\u30F3\u3092\u5168\u54E1\u304B\u3089\u596A\u3046");
                }
                else {
                    descriptions.push(this.value + "\u30B3\u30A4\u30F3\u596A\u3046");
                }
                descriptions.push("相手ターンのみ");
                break;
        }
        var multi = this.property.multi;
        if (multi != undefined) {
            if (multi === 0.5) {
                descriptions.push("同じ施設があると収入半減");
            }
            else {
                descriptions.push("\u540C\u3058\u65BD\u8A2D\u304C\u3042\u308B\u3068\u53CE\u5165" + multi + "\u500D");
            }
        }
        var lmboost = this.property.lmboost;
        if (lmboost != undefined) {
            if (lmboost === 0.5) {
                descriptions.push("ランドマーク2軒以上で収入半減");
            }
            else {
                descriptions.push("\u30E9\u30F3\u30C9\u30DE\u30FC\u30AF2\u8ED2\u4EE5\u4E0A\u3067\u53CE\u5165" + lmboost + "\u500D");
            }
        }
        if (this.property.close === true) {
            descriptions.push("発動後休業する");
        }
        return descriptions.join("\n");
    };
    return Facility;
}());
exports.Facility = Facility;
var Character = (function () {
    function Character(data_id) {
        var data = CHARACTER_DATA[data_id - CHARACTER_DATA_BASE];
        this.data_id = data_id;
        this.name = data.name;
        this.type = data.type;
        this.round = data.round;
        this.property = data.property;
    }
    Character.prototype.toJSON = function () {
        return {
            class_name: "Character",
            data_id: this.data_id,
        };
    };
    Character.fromJSON = function (json) {
        return new Character(json.data_id);
    };
    Character.prototype.getName = function () {
        return this.name;
    };
    Character.prototype.getType = function () {
        return this.type;
    };
    Character.prototype.getPropertyValue = function () {
        return this.property["value"] ? this.property["value"] : 0;
    };
    Character.prototype.getDescription = function () {
        switch (this.type) {
            case CharacterType.None: {
                return "";
            }
            case CharacterType.DiceDelta: {
                var delta = this.property["delta"];
                var delta_str = ((delta > 0) ? "+" : "") + delta;
                return "\u30B5\u30A4\u30B3\u30ED\u306E\u76EE\u3092" + delta_str + "\u3059\u308B\n" + this.round + "\u30E9\u30A6\u30F3\u30C9";
            }
            case CharacterType.DiceEven: {
                return "次のサイコロの合計値が偶数になる";
            }
            case CharacterType.DiceOdd: {
                return "次のサイコロの合計値が奇数になる";
            }
            case CharacterType.DiceOne: {
                return "\u30B5\u30A4\u30B3\u30ED\u30921\u500B\u632F\u308A\u9650\u5B9A\u306B\u3059\u308B\n" + this.round + "\u30E9\u30A6\u30F3\u30C9";
            }
            case CharacterType.DiceTwo: {
                return "\u30B5\u30A4\u30B3\u30ED\u30922\u500B\u632F\u308A\u9650\u5B9A\u306B\u3059\u308B\n" + this.round + "\u30E9\u30A6\u30F3\u30C9";
            }
            case CharacterType.DrawCards: {
                var value = this.property["value"];
                return "\u5C71\u672D\u304B\u3089\u30AB\u30FC\u30C9\u3092" + value + "\u679A\u5F15\u304F";
            }
            case CharacterType.MoveMoney: {
                var money = this.property["money"];
                return "\u9078\u3093\u3060\u30D7\u30EC\u30A4\u30E4\u30FC\u304B\u3089" + money + "\u30B3\u30A4\u30F3\u3092\u596A\u3046";
            }
            case CharacterType.Close: {
                switch (this.property["type"]) {
                    case SelectType.Facility:
                        return "選んだ施設を休業にする";
                    case SelectType.Blue:
                        return "青施設をすべて休業にする";
                    case SelectType.Green:
                        return "緑施設をすべて休業にする";
                    case SelectType.Red:
                        return "赤施設をすべて休業にする";
                    case SelectType.Purple:
                        return "紫施設をすべて休業にする";
                }
            }
            case CharacterType.Open: {
                return "全施設の休業を解除する";
            }
            case CharacterType.Boost: {
                var boost = this.property["boost"] * 100;
                var boost_str = ((boost > 0) ? "+" : "") + boost;
                var target = (boost > 0) ? "自分" : "選んだプレイヤー";
                switch (this.property["type"]) {
                    case SelectType.Facility:
                        return "\u9078\u3093\u3060\u65BD\u8A2D\u306E\u53CE\u5165\u3092" + boost_str + "%\u3059\u308B\n" + this.round + "\u30E9\u30A6\u30F3\u30C9";
                    case SelectType.Blue:
                        return target + "\u306E\u9752\u65BD\u8A2D\u306E\u53CE\u5165\u3092" + boost_str + "%\u3059\u308B\n" + this.round + "\u30E9\u30A6\u30F3\u30C9";
                    case SelectType.Green:
                        return target + "\u306E\u7DD1\u65BD\u8A2D\u306E\u53CE\u5165\u3092" + boost_str + "%\u3059\u308B\n" + this.round + "\u30E9\u30A6\u30F3\u30C9";
                    case SelectType.Red:
                        return target + "\u306E\u8D64\u65BD\u8A2D\u306E\u53CE\u5165\u3092" + boost_str + "%\u3059\u308B\n" + this.round + "\u30E9\u30A6\u30F3\u30C9";
                    case SelectType.Purple:
                        return target + "\u306E\u7D2B\u65BD\u8A2D\u306E\u53CE\u5165\u3092" + boost_str + "%\u3059\u308B\n" + this.round + "\u30E9\u30A6\u30F3\u30C9";
                }
            }
        }
        return "";
    };
    return Character;
}());
exports.Character = Character;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dice_1 = __webpack_require__(13);
var board_1 = __webpack_require__(6);
var facility_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(4);
var card_manager_1 = __webpack_require__(11);
var Phase;
(function (Phase) {
    Phase[Phase["StartGame"] = 0] = "StartGame";
    // Loop b/w StartTurn and EndTurn.
    Phase[Phase["StartTurn"] = 1] = "StartTurn";
    Phase[Phase["CharacterCard"] = 2] = "CharacterCard";
    Phase[Phase["DiceRoll"] = 3] = "DiceRoll";
    // DiceRollAgain,
    Phase[Phase["FacilityAction"] = 4] = "FacilityAction";
    Phase[Phase["FacilityActionRed"] = 5] = "FacilityActionRed";
    Phase[Phase["FacilityActionPurple"] = 6] = "FacilityActionPurple";
    Phase[Phase["FacilityActionWithInteraction"] = 7] = "FacilityActionWithInteraction";
    // FacilityAction2,
    // FacilityAction3,
    // FacilityAction4,
    // FacilityAction5,
    Phase[Phase["PaySalary"] = 8] = "PaySalary";
    Phase[Phase["BuildFacility"] = 9] = "BuildFacility";
    Phase[Phase["CardRemoval"] = 10] = "CardRemoval";
    Phase[Phase["EndTurn"] = 11] = "EndTurn";
    Phase[Phase["EndGame"] = 12] = "EndGame";
})(Phase = exports.Phase || (exports.Phase = {}));
var EventType;
(function (EventType) {
    EventType[EventType["None"] = 0] = "None";
    EventType[EventType["Draw"] = 1] = "Draw";
    EventType[EventType["Character"] = 2] = "Character";
    EventType[EventType["Dice"] = 3] = "Dice";
    EventType[EventType["Blue"] = 4] = "Blue";
    EventType[EventType["Green"] = 5] = "Green";
    EventType[EventType["Red"] = 6] = "Red";
    EventType[EventType["Purple"] = 7] = "Purple";
    EventType[EventType["Build"] = 8] = "Build";
    EventType[EventType["Salary"] = 9] = "Salary";
    EventType[EventType["Interaction"] = 10] = "Interaction";
    EventType[EventType["Open"] = 11] = "Open";
    EventType[EventType["Quit"] = 12] = "Quit";
})(EventType = exports.EventType || (exports.EventType = {}));
var Event = (function () {
    function Event() {
        this.step = 0;
        this.round = 0;
        this.turn = 0;
        this.type = EventType.None;
        this.player_id = -1;
        this.moneys = [0, 0, 0, 0];
        this.card_id = null;
        this.position = null;
        this.target_player_id = -1;
        this.target_card_ids = [];
        this.close = false;
        this.dice = null;
        this.valid = false;
    }
    Event.prototype.toJSON = function () {
        return {
            class_name: "Event",
            step: this.step,
            round: this.round,
            turn: this.turn,
            type: this.type,
            player_id: this.player_id,
            moneys: this.moneys,
            card_id: this.card_id,
            position: this.position,
            target_player_id: this.target_player_id,
            target_card_ids: this.target_card_ids,
            close: this.close,
            dice: this.dice ? this.dice.toJSON() : null,
            valid: this.valid,
        };
    };
    Event.fromJSON = function (json) {
        var event = new Event();
        event.step = json.step;
        event.round = json.round;
        event.turn = json.turn;
        event.type = json.type;
        event.player_id = json.player_id;
        event.moneys = json.moneys;
        event.card_id = json.card_id;
        event.position = json.position;
        event.target_player_id = json.target_player_id;
        event.target_card_ids = json.target_card_ids;
        event.close = json.close;
        event.dice = json.dice ? dice_1.DiceResult.fromJSON(json.dice) : null;
        event.valid = json.valid;
        return event;
    };
    return Event;
}());
exports.Event = Event;
var Session = (function () {
    function Session(session_id) {
        if (session_id === void 0) { session_id = -1; }
        this.session_id = session_id;
        this.watcher_user_ids = [];
        this.board = new board_1.Board();
        this.players = [];
        this.card_manager = new card_manager_1.CardManager();
        this.effect_manager = new card_manager_1.EffectManager();
        this.events = [];
        this.step = 1;
        this.phase = Phase.StartGame;
        this.round = 0;
        this.turn = 0;
        this.current_player_id = 0;
        this.winner = -1; // NO_PLAYER
        this.target_facilities = [];
        this.dice_result = null;
    }
    Session.prototype.toJSON = function () {
        return {
            class_name: "Session",
            session_id: this.session_id,
            board: this.board.toJSON(),
            players: this.players.map(function (player) { return player.toJSON(); }),
            card_manager: this.card_manager.toJSON(),
            effect_manager: this.effect_manager.toJSON(),
            events: this.events.map(function (event) { return event.toJSON(); }),
            step: this.step,
            phase: this.phase,
            round: this.round,
            turn: this.turn,
            current_player_id: this.current_player_id,
            winner: this.winner,
            target_facilities: this.target_facilities,
            dice_result: this.dice_result ? this.dice_result.toJSON() : null,
            watcher_user_ids: this.watcher_user_ids,
        };
    };
    Session.fromJSON = function (json) {
        var board = board_1.Board.fromJSON(json.board);
        var players = json.players.map(function (player) { return board_1.Player.fromJSON(player); });
        var session = new Session(json.session_id);
        session.board = board;
        session.players = players;
        session.card_manager = card_manager_1.CardManager.fromJSON(json.card_manager);
        session.effect_manager = card_manager_1.EffectManager.fromJSON(json.effect_manager);
        session.events = json.events.map(function (event) { return Event.fromJSON(event); });
        session.step = json.step,
            session.phase = json.phase,
            session.round = json.round;
        session.turn = json.turn;
        session.current_player_id = json.current_player_id;
        session.winner = json.winner;
        session.target_facilities = json.target_facilities;
        session.dice_result = json.dice_result ? dice_1.DiceResult.fromJSON(json.dice_result) : null;
        session.watcher_user_ids = json.watcher_user_ids;
        return session;
    };
    Session.prototype.newEvent = function () {
        var event = new Event();
        event.step = this.step;
        event.round = this.round;
        event.turn = this.turn;
        return event;
    };
    Session.prototype.isValidPhase = function (phase) {
        if (this.phase === phase) {
            return true;
        }
        // Character card can be skipped.
        if (this.phase === Phase.CharacterCard && phase === Phase.DiceRoll) {
            return true;
        }
        return false;
    };
    Session.prototype.done = function (phase) {
        if (!this.isValidPhase(phase) || this.phase === Phase.EndGame) {
            return;
        }
        this.step++;
        switch (phase) {
            case Phase.StartGame:
                this.phase = Phase.StartTurn;
                return;
            case Phase.StartTurn:
                this.phase = Phase.CharacterCard;
                return;
            case Phase.CharacterCard:
                this.phase = Phase.DiceRoll;
                return;
            case Phase.DiceRoll:
                this.phase = Phase.FacilityAction;
                return;
            case Phase.FacilityAction:
                this.phase = Phase.FacilityActionRed;
                return;
            case Phase.FacilityActionRed:
                this.phase = Phase.FacilityActionPurple;
                return;
            case Phase.FacilityActionPurple:
                if (this.target_facilities.length === 0) {
                    this.phase = Phase.PaySalary;
                    return;
                }
                this.phase = Phase.FacilityActionWithInteraction;
                return;
            case Phase.FacilityActionWithInteraction:
                if (this.target_facilities.length > 0) {
                    // If target_facilities remains, go back to the previous step.
                    this.phase = Phase.FacilityActionPurple;
                    return;
                }
                this.phase = Phase.PaySalary;
                return;
            case Phase.PaySalary:
                this.phase = Phase.BuildFacility;
                return;
            case Phase.BuildFacility:
                // Check EndGame
                var landmarks = this.card_manager.getLandmarks();
                var num_landmarks = 0;
                for (var _i = 0, landmarks_1 = landmarks; _i < landmarks_1.length; _i++) {
                    var landmark = landmarks_1[_i];
                    if (this.card_manager.getOwner(landmark) === this.current_player_id) {
                        num_landmarks++;
                    }
                }
                // TODO: support multiple landmarks.
                if (num_landmarks > (landmarks.length / this.players.length)) {
                    this.winner = this.current_player_id;
                    this.phase = Phase.EndGame;
                    return;
                }
                this.phase = Phase.EndTurn;
                return;
            case Phase.EndTurn:
                this.phase = Phase.StartTurn;
                return;
            case Phase.EndGame:
                // Do nothing.
                return;
        }
    };
    Session.prototype.doNext = function () {
        switch (this.phase) {
            case Phase.StartGame:
                return this.startGame();
            case Phase.StartTurn:
                return this.startTurn();
            case Phase.CharacterCard:
                return false; // Need interactions.
            case Phase.DiceRoll:
                return false; // Need interactions.
            case Phase.FacilityAction:
                return this.facilityAction(this.phase);
            case Phase.FacilityActionRed:
                return this.facilityAction(this.phase);
            case Phase.FacilityActionPurple:
                return this.facilityAction(this.phase);
            case Phase.FacilityActionWithInteraction:
                return false;
            case Phase.PaySalary:
                return this.paySalary();
            case Phase.BuildFacility:
                return false; // Need interactions.
            case Phase.EndTurn:
                return this.endTurn();
            case Phase.EndGame:
                return this.endGame();
        }
        return false;
    };
    Session.prototype.addPlayer = function (user_id, name, money, salary, is_auto) {
        var player_id = this.players.length;
        if (player_id > 4) {
            return -1;
        }
        // team === player_id (no 2vs2 so far).
        this.players.push(new board_1.Player(user_id, player_id, name, money, salary, player_id, is_auto));
        return player_id;
    };
    Session.prototype.addFacility = function (player_id, facility_data_id) {
        return this.card_manager.addFacility(player_id, facility_data_id);
    };
    Session.prototype.addCharacter = function (player_id, character_data_id) {
        return this.card_manager.addCharacter(player_id, character_data_id);
    };
    Session.prototype.isValid = function (player_id, phase) {
        return (this.current_player_id === player_id && this.isValidPhase(phase));
    };
    Session.prototype.startGame = function () {
        var landmark_ids = utils_1.shuffle(facility_1.CardData.getAvailableLandmarks());
        var num_landmarks = (this.players.length + 1);
        for (var i = 0; i < num_landmarks; i++) {
            this.setLandmark(landmark_ids[i]);
        }
        for (var r = 0; r < 2; r++) {
            for (var p = 0; p < this.players.length; p++) {
                this.buildInitialFacility(p);
            }
        }
        for (var r = 0; r < 5; r++) {
            for (var p = 0; p < this.players.length; p++) {
                this.getPlayerCards(p).dealToHand();
            }
        }
        this.done(Phase.StartGame);
        return true;
    };
    Session.prototype.startTurn = function () {
        this.effect_manager.expire(this.round, this.turn);
        var card_ids = this.drawCards(this.current_player_id, 1);
        // This is a hack to avoid drawing an event before game start.
        // TODO: Stop this hack.
        var is_first = (this.round === 0 && this.turn === 0);
        if (!is_first) {
            var event_1 = new Event();
            this.events.push(event_1);
            event_1.type = EventType.Draw;
            event_1.step = this.step;
            event_1.player_id = this.current_player_id;
            event_1.target_card_ids = card_ids;
        }
        this.done(Phase.StartTurn);
        return true;
    };
    Session.prototype.processDiceCommand = function (query) {
        var player_id = query.player_id;
        var aim = query.aim;
        if (!this.isValid(player_id, Phase.DiceRoll)) {
            return false;
        }
        var effects = this.effect_manager.getDiceEffects();
        this.dice_result = dice_1.Dice.roll(query.dice_num, aim, effects);
        // TODO: Move this to other place?
        this.target_facilities = this.getFacilitiesInArea(this.dice_result.result());
        var event = new Event();
        this.events.push(event);
        event.type = EventType.Dice;
        event.dice = this.dice_result;
        event.step = this.step;
        event.player_id = player_id;
        this.done(Phase.DiceRoll);
        return true;
    };
    Session.prototype.processInteractCommand = function (query) {
        var player_id = query.player_id;
        var card_id = query.card_id;
        if (!this.isValid(player_id, Phase.FacilityActionWithInteraction)) {
            return false;
        }
        if (this.target_facilities.length === 0) {
            return false;
        }
        if (this.target_facilities[0] !== card_id) {
            return false;
        }
        var event = this.getEventInteractCommand(query);
        return this.processEventInteractCommand(event);
    };
    Session.prototype.getEventInteractCommand = function (query) {
        var player_id = query.player_id;
        var card_id = query.card_id;
        var target_id = query.target_player_id;
        var event = new Event();
        var facility = this.getFacility(card_id);
        if (facility.getType() !== facility_1.FacilityType.Purple) {
            return event;
        }
        if (facility.property["all"] === true) {
            return event;
        }
        var owner_id = this.getOwnerId(card_id);
        if (player_id !== owner_id) {
            return event;
        }
        if (facility.property["close"] === true) {
            event.close = true;
        }
        event.step = this.step;
        event.card_id = card_id;
        event.player_id = player_id;
        event.type = EventType.Purple;
        var value = this.getFacilityValue(card_id);
        var amount = this.checkMoveMoney(target_id, owner_id, value);
        event.moneys[target_id] -= amount;
        event.moneys[owner_id] += amount;
        return event;
    };
    Session.prototype.processEventInteractCommand = function (event) {
        if (event == null || event.type === EventType.None) {
            return false;
        }
        for (var pid = 0; pid < event.moneys.length; ++pid) {
            if (event.moneys[pid] !== 0) {
                this.getPlayer(pid).addMoney(event.moneys[pid]);
            }
        }
        if (event.close === true) {
            var facility = this.getFacility(event.card_id);
            facility.is_open = false;
        }
        this.events.push(event);
        this.target_facilities.shift();
        this.done(Phase.FacilityActionWithInteraction);
        return true;
    };
    Session.prototype.facilityAction = function (phase) {
        var number = this.dice_result.result();
        var facility_types = [];
        switch (phase) {
            case Phase.FacilityAction:
                facility_types = [facility_1.FacilityType.Blue, facility_1.FacilityType.Green];
                break;
            case Phase.FacilityActionRed:
                facility_types = [facility_1.FacilityType.Red];
                break;
            case Phase.FacilityActionPurple:
            case Phase.FacilityActionWithInteraction:
                facility_types = [facility_1.FacilityType.Purple];
                break;
        }
        while (this.target_facilities.length > 0) {
            var card_id = this.target_facilities[0];
            var facility = this.getFacility(card_id);
            if (facility_types.indexOf(facility.getType()) === -1) {
                break;
            }
            if (!this.doFacilityAction(card_id)) {
                // The facility requires user's interaction.
                break;
            }
            this.target_facilities.shift();
        }
        this.done(phase);
        return true;
    };
    Session.prototype.getFacilitiesInArea = function (area) {
        var _this = this;
        var x = area - 1;
        var card_ids = [];
        if (x < 0 || 11 < x) {
            return card_ids;
        }
        var map_y = {};
        for (var y = 0; y < 5; y++) {
            var card_id = this.getCardIdOnBoard(x, y);
            if (this.card_manager.isFacility(card_id)) {
                card_ids.push(card_id);
                map_y[card_id] = y;
            }
        }
        return card_ids.sort(function (id1, id2) {
            var f1 = _this.getFacility(id1);
            var f2 = _this.getFacility(id2);
            // Blue < Green < Red < Purple
            if (f1.getType() !== f2.getType()) {
                return f1.getType() - f2.getType();
            }
            // TODO: change the order for Red.
            // y4 < y3 < y2 < y1 < y0;
            return map_y[id2] - map_y[id1];
        });
    };
    Session.prototype.checkMoveMoney = function (pid_from, pid_to, money) {
        if (pid_from === pid_to) {
            return 0;
        }
        if (money < 0) {
            return -Math.min(this.getPlayer(pid_to).getMoney(), -money);
        }
        return Math.min(this.getPlayer(pid_from).getMoney(), money);
    };
    Session.prototype.moveMoney = function (pid_from, pid_to, money) {
        var actual = this.checkMoveMoney(pid_from, pid_to, money);
        this.getPlayer(pid_from).addMoney(-actual);
        this.getPlayer(pid_to).addMoney(actual);
        return actual;
    };
    Session.prototype.getFacilityValue = function (card_id) {
        var facility = this.getFacility(card_id);
        var value = facility.getValue();
        var boost = Math.max(0, 1.0 + this.effect_manager.getBoost(card_id));
        var lmboost = 1.0;
        if (facility.property.lmboost != undefined &&
            this.card_manager.getBuiltLandmarks().length >= 2) {
            lmboost = facility.property.lmboost;
        }
        var multi = 1.0;
        if (facility.property.multi != undefined) {
            var card_query = {
                data_id: facility.data_id,
                state: card_manager_1.CardState.Field,
            };
            var card_ids = this.queryCards(card_query);
            if (card_ids.length > 1) {
                multi = facility.property.multi;
            }
        }
        return value * boost * lmboost * multi;
    };
    Session.prototype.getEventFacilityAction = function (player_id, card_id) {
        var facility = this.getFacility(card_id);
        var owner_id = this.getOwnerId(card_id);
        var owner = this.getOwner(card_id);
        var event = new Event();
        event.step = this.step;
        event.card_id = card_id;
        event.player_id = player_id;
        if (facility.getType() === facility_1.FacilityType.Blue) {
            if (!facility.is_open) {
                event.type = EventType.Open;
                return event;
            }
            if (facility.property["close"] === true) {
                event.close = true;
            }
            var amount = this.getFacilityValue(card_id);
            event.type = EventType.Blue;
            event.moneys[owner_id] += amount;
            return event;
        }
        if (facility.getType() === facility_1.FacilityType.Green) {
            if (player_id !== owner_id) {
                return event;
            }
            if (!facility.is_open) {
                event.type = EventType.Open;
                return event;
            }
            if (facility.property["close"] === true) {
                event.close = true;
            }
            var amount = this.getFacilityValue(card_id);
            event.type = EventType.Green;
            event.moneys[owner_id] += amount;
            return event;
        }
        if (facility.getType() === facility_1.FacilityType.Red) {
            if (player_id === owner_id) {
                return event;
            }
            if (!facility.is_open) {
                event.type = EventType.Open;
                return event;
            }
            if (facility.property["close"] === true) {
                event.close = true;
            }
            var value = this.getFacilityValue(card_id);
            event.type = EventType.Red;
            if (facility.property["all"]) {
                for (var pid = 0; pid < this.players.length; ++pid) {
                    if (pid === owner_id) {
                        continue;
                    }
                    var amount = this.checkMoveMoney(pid, owner_id, value);
                    event.moneys[pid] -= amount;
                    event.moneys[owner_id] += amount;
                }
            }
            else {
                var amount = this.checkMoveMoney(player_id, owner_id, value);
                event.moneys[player_id] -= amount;
                event.moneys[owner_id] += amount;
            }
            return event;
        }
        if (facility.getType() === facility_1.FacilityType.Purple) {
            if (player_id !== owner_id) {
                return event;
            }
            if (!facility.is_open) {
                event.type = EventType.Open;
                return event;
            }
            var value = this.getFacilityValue(card_id);
            if (facility.property["all"] !== true) {
                event.type = EventType.Interaction;
            }
            else {
                if (facility.property["close"] === true) {
                    event.close = true;
                }
                event.type = EventType.Purple;
                for (var pid = 0; pid < this.players.length; ++pid) {
                    if (pid === owner_id) {
                        continue;
                    }
                    var amount = this.checkMoveMoney(pid, owner_id, value);
                    event.moneys[pid] -= amount;
                    event.moneys[owner_id] += amount;
                }
            }
            return event;
        }
        return event;
    };
    Session.prototype.doFacilityAction = function (card_id) {
        var event = this.getEventFacilityAction(this.getCurrentPlayerId(), card_id);
        return this.processEventFacilityAction(event);
    };
    Session.prototype.processEventFacilityAction = function (event) {
        var facility = this.getFacility(event.card_id);
        if (event.type !== EventType.None) {
            this.events.push(event);
        }
        if (event.type === EventType.Interaction) {
            // The facility requires user's interaction.
            return false;
        }
        if (event.type === EventType.Open) {
            facility.is_open = true;
            return true;
        }
        for (var pid = 0; pid < event.moneys.length; ++pid) {
            if (event.moneys[pid] !== 0) {
                this.getPlayer(pid).addMoney(event.moneys[pid]);
            }
        }
        if (event.close === true) {
            facility.is_open = false;
        }
        return true;
    };
    Session.prototype.getOverwriteCosts = function (x, y, size) {
        var costs = [0, 0, 0, 0];
        for (var _i = 0, _a = this.getOverlappedFacilities(x, y, size); _i < _a.length; _i++) {
            var card_id = _a[_i];
            var owner_id = this.getOwnerId(card_id);
            if (owner_id === this.getCurrentPlayerId()) {
                continue;
            }
            costs[owner_id] += this.getFacility(card_id).getCost() * 2;
        }
        return costs;
    };
    Session.prototype.availablePosition = function (card_id) {
        var positions = [];
        var facility = this.card_manager.getFacility(card_id);
        // TODO: support multiple x. (e.g. 7-9)
        var area = facility.getArea();
        var columns;
        if (area.length === 0) {
            // area.length === 0 means anywhere.
            columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].splice(0, 13 - facility.size);
        }
        else {
            columns = area.map(function (x) { return x - 1; }); // area is 1-origin.
        }
        for (var y = 0; y < this.board.row; y++) {
            for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                var x = columns_1[_i];
                var available = true;
                for (var s = 0; s < facility.size; ++s) {
                    if (this.getCardIdOnBoard(x + s, y) !== -1) {
                        available = false;
                        break;
                    }
                }
                if (available) {
                    positions.push([x, y]);
                }
            }
        }
        return positions;
    };
    Session.prototype.queryCards = function (query) {
        var card_ids = this.card_manager.queryCards(query);
        var results = [];
        for (var _i = 0, card_ids_1 = card_ids; _i < card_ids_1.length; _i++) {
            var card_id = card_ids_1[_i];
            var facility = this.card_manager.getFacility(card_id);
            if (query.is_open && query.is_open !== facility.is_open) {
                continue;
            }
            results.push(card_id);
        }
        return results;
    };
    // Build a facility in the player's talon.
    // No overwrite an existing facility or no exceed the cost of the player's money.
    Session.prototype.buildInitialFacility = function (player_id) {
        // Player ID is valid?
        if (player_id >= this.players.length) {
            return false;
        }
        var player = this.getPlayer(player_id);
        var card_id_list = utils_1.shuffle(this.getPlayerCards(player_id).getTalon());
        for (var _i = 0, card_id_list_1 = card_id_list; _i < card_id_list_1.length; _i++) {
            var card_id = card_id_list_1[_i];
            if (this.isCharacter(card_id)) {
                continue;
            }
            var facility = this.card_manager.getFacility(card_id);
            var balance = player.getMoney() - facility.getCost();
            if (balance < 0) {
                continue;
            }
            var positions = utils_1.shuffle(this.availablePosition(card_id));
            if (positions.length === 0) {
                continue;
            }
            if (!this.card_manager.moveTalonToField(card_id)) {
                // Something is wrong.
                console.warn("moveTalonToField(" + card_id + ") failed.");
                return false;
            }
            var _a = positions[0], x = _a[0], y = _a[1];
            this.board.setCardId(x, y, card_id, facility.size);
            player.setMoney(balance);
            return true;
        }
        return true; // True is returned even if no facility was built.
    };
    Session.prototype.setLandmark = function (data_id) {
        var landmark = new facility_1.Facility(data_id);
        var landmark_id = this.card_manager.addLandmark(landmark);
        var positions = utils_1.shuffle(this.availablePosition(landmark_id));
        if (positions.length === 0) {
            console.error("Landmark cannot be built.");
            return false;
        }
        var _a = positions[0], x = _a[0], y = _a[1];
        this.board.setCardId(x, y, landmark_id, landmark.size);
        return true;
    };
    Session.prototype.drawCards = function (player_id, num_cards) {
        var card_ids = [];
        for (var i = 0; i < num_cards; ++i) {
            var drawn = this.getPlayerCards(player_id).dealToHand();
            if (drawn === -1) {
                break;
            }
            card_ids.push(drawn);
        }
        return card_ids;
    };
    // TODO: Support other additional arguments.
    Session.prototype.processCharacterCommand = function (query) {
        var event = this.getEventCharacterCommand(query);
        return this.processEventCharacterCommand(event);
    };
    Session.prototype.getEventCharacterCommand = function (query) {
        var player_id = query.player_id;
        var card_id = query.card_id;
        var target_player_id = query.target_player_id;
        if (!this.isValid(player_id, Phase.CharacterCard)) {
            return null;
        }
        // Is character.
        if (!this.isCharacter(card_id)) {
            return null;
        }
        // Facility is in owner's hand?
        if (!this.card_manager.isInHand(player_id, card_id)) {
            return null;
        }
        // Add card to the effect manager.
        var character = this.card_manager.getCharacter(card_id);
        var event = this.newEvent();
        event.type = EventType.Character;
        event.card_id = card_id;
        event.player_id = player_id;
        event.valid = true;
        switch (character.type) {
            case facility_1.CharacterType.DrawCards: {
                var size = character.getPropertyValue();
                event.target_card_ids = this.card_manager.getCardsFromTalon(player_id, size);
                event.player_id = player_id;
                return event;
            }
            case facility_1.CharacterType.MoveMoney: {
                var money = this.checkMoveMoney(target_player_id, player_id, character.property["money"]);
                event.target_player_id = target_player_id;
                event.moneys[player_id] += money;
                event.moneys[target_player_id] -= money;
                return event;
            }
            case facility_1.CharacterType.DiceDelta:
            case facility_1.CharacterType.DiceOne:
            case facility_1.CharacterType.DiceTwo:
            case facility_1.CharacterType.DiceEven:
            case facility_1.CharacterType.DiceOdd: {
                return event;
            }
            case facility_1.CharacterType.Boost: {
                if (character.property["type"] === facility_1.SelectType.Facility) {
                    event.target_card_ids.push(query.target_card_id);
                }
                else {
                    var owner_id = player_id;
                    if (character.property["boost"] < 0) {
                        owner_id = query.target_player_id;
                    }
                    var card_query = {
                        card_type: facility_1.CardType.Facility,
                        facility_type: character.property["type"],
                        state: card_manager_1.CardState.Field,
                        owner_id: owner_id,
                    };
                    event.target_card_ids = this.queryCards(card_query);
                }
                return event;
            }
            case facility_1.CharacterType.Close: {
                if (character.property["type"] === facility_1.SelectType.Facility) {
                    event.target_card_ids.push(query.target_card_id);
                }
                else {
                    var card_query = {
                        card_type: facility_1.CardType.Facility,
                        facility_type: character.property["type"],
                        state: card_manager_1.CardState.Field,
                        is_open: true,
                    };
                    event.target_card_ids = this.queryCards(card_query);
                }
                return event;
            }
            case facility_1.CharacterType.Open: {
                var query_1 = {
                    card_type: facility_1.CardType.Facility,
                    state: card_manager_1.CardState.Field,
                    is_open: false,
                };
                event.target_card_ids = this.queryCards(query_1);
                return event;
            }
        }
        return null;
    };
    Session.prototype.processEventCharacterCommand = function (event) {
        if (event == null) {
            return false;
        }
        var card_id = event.card_id;
        var character = this.card_manager.getCharacter(card_id);
        // Move the card to discard.
        if (!this.card_manager.moveHandToDiscard(card_id)) {
            // Something is wrong.
            console.warn("moveHandToDiscard(" + card_id + ") failed.");
            return false;
        }
        // Process event
        switch (character.type) {
            case facility_1.CharacterType.DrawCards: {
                for (var _i = 0, _a = event.target_card_ids; _i < _a.length; _i++) {
                    var drawn_card_id = _a[_i];
                    this.card_manager.moveTalonToHand(drawn_card_id);
                }
                break;
            }
            case facility_1.CharacterType.MoveMoney: {
                for (var i = 0; i < this.players.length; ++i) {
                    this.players[i].addMoney(event.moneys[i]);
                }
                break;
            }
            case facility_1.CharacterType.DiceDelta:
            case facility_1.CharacterType.DiceOne:
            case facility_1.CharacterType.DiceTwo:
            case facility_1.CharacterType.DiceEven:
            case facility_1.CharacterType.DiceOdd: {
                this.effect_manager.addCard(character.data_id, event.round, event.turn);
                break;
            }
            case facility_1.CharacterType.Boost: {
                this.effect_manager.addCard(character.data_id, event.round, event.turn, event.target_card_ids);
                break;
            }
            case facility_1.CharacterType.Close: {
                for (var _b = 0, _c = event.target_card_ids; _b < _c.length; _b++) {
                    var card_id_1 = _c[_b];
                    var facility = this.card_manager.getFacility(card_id_1);
                    facility.is_open = false;
                }
                break;
            }
            case facility_1.CharacterType.Open: {
                for (var _d = 0, _e = event.target_card_ids; _d < _e.length; _d++) {
                    var card_id_2 = _e[_d];
                    var facility = this.card_manager.getFacility(card_id_2);
                    facility.is_open = true;
                }
                break;
            }
        }
        this.events.push(event);
        this.done(Phase.CharacterCard);
        return true;
    };
    // TODO: move this function to Board?
    Session.prototype.getOverlappedFacilities = function (x, y, size) {
        var card_ids = [];
        var prev_id = -1;
        for (var i = 0; i < size; ++i) {
            var card_id = this.board.getCardId(x + i, y);
            if (card_id === prev_id || card_id === -1) {
                continue;
            }
            card_ids.push(card_id);
            prev_id = card_id;
        }
        return card_ids;
    };
    Session.prototype.processBuildCommand = function (query) {
        var event = this.getEventBuildCommand(query);
        return this.processEventBuild(event);
    };
    Session.prototype.getEventBuildCommand = function (query) {
        var player_id = query.player_id;
        var x = query.x;
        var y = query.y;
        var card_id = query.card_id;
        if (x == null || y == null && player_id == null && card_id == null) {
            return null;
        }
        // Facility is a landmark?
        if (this.card_manager.isLandmark(card_id)) {
            return this.getEventBuildLandmark(query);
        }
        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return null;
        }
        var event = new Event();
        event.step = this.step;
        event.type = EventType.Build;
        event.player_id = player_id;
        event.position = [x, y];
        // Is pass?  (valid action, but not build a facility).
        if (x === -1 && y === -1 && card_id === -1) {
            event.card_id = -1;
            event.valid = true;
            return event;
        }
        // Facility is valid?
        var facility = this.card_manager.getFacility(card_id);
        if (!facility) {
            return null;
        }
        // Facility is in owner's hand?
        if (!this.card_manager.isInHand(player_id, card_id)) {
            return null;
        }
        // Facility's owner is valid?
        var facility_owner = this.getOwnerId(card_id);
        if (facility_owner !== player_id) {
            return null;
        }
        // Facility's area is valid?
        var area = x + 1;
        if (!this.card_manager.isInArea(area, card_id)) {
            return null;
        }
        var overlapped = this.getOverlappedFacilities(x, y, facility.size);
        for (var _i = 0, overlapped_1 = overlapped; _i < overlapped_1.length; _i++) {
            var card_id_on_board = overlapped_1[_i];
            // Facility on the board is overwritable?
            if (!this.card_manager.canOverwrite(card_id_on_board)) {
                return null;
            }
        }
        // Money is valid?
        var overwrite_costs = this.getOverwriteCosts(x, y, facility.size);
        var total_cost = facility.cost;
        for (var i = 0; i < overwrite_costs.length; ++i) {
            total_cost += overwrite_costs[i];
        }
        if (total_cost <= this.getPlayer(player_id).getMoney()) {
            event.valid = true;
        }
        // Merge overwrite_costs and total_cost;
        overwrite_costs[player_id] -= total_cost;
        event.moneys = overwrite_costs;
        event.card_id = card_id;
        event.target_card_ids = overlapped;
        return event;
    };
    Session.prototype.getEventBuildLandmark = function (query) {
        var player_id = query.player_id;
        var card_id = query.card_id;
        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return null;
        }
        // Is a landmark?
        if (!this.card_manager.isLandmark(card_id)) {
            return null;
        }
        // Facility is valid?
        var facility = this.card_manager.getFacility(card_id);
        if (!facility) {
            return null;
        }
        // Isn't already built?
        var facility_owner = this.getOwnerId(card_id);
        if (facility_owner !== -1) {
            // Already built.
            return null;
        }
        var event = new Event();
        // Money is valid?
        var cost = facility.getCost();
        if (cost <= this.getPlayer(player_id).getMoney()) {
            event.valid = true;
        }
        event.player_id = player_id;
        event.step = this.step;
        event.type = EventType.Build;
        event.moneys[player_id] -= cost;
        event.card_id = card_id;
        return event;
    };
    Session.prototype.processEventBuild = function (event) {
        if (event == null || !event.valid) {
            return false;
        }
        this.events.push(event);
        var card_id = event.card_id;
        // End turn, no build.
        if (card_id === -1) {
            this.done(Phase.BuildFacility);
            return true;
        }
        // Landmark
        if (this.card_manager.isLandmark(card_id)) {
            this.getPlayer(event.player_id).addMoney(event.moneys[event.player_id]);
            this.card_manager.buildLandmark(event.player_id, card_id);
            this.done(Phase.BuildFacility);
            return true;
        }
        var facility = this.getFacility(card_id);
        var _a = event.position, x = _a[0], y = _a[1];
        // Update the data.
        this.board.removeCards(x, y, facility.size);
        for (var _i = 0, _b = event.target_card_ids; _i < _b.length; _i++) {
            var card_id_on_board = _b[_i];
            // Delete the existing facility.
            if (!this.card_manager.moveFieldToDiscard(card_id_on_board)) {
                // Something is wrong.
                console.warn("moveFieldToDiscard(" + card_id_on_board + ") failed.");
                return false;
            }
        }
        // Build the new facility.
        if (!this.card_manager.moveHandToField(card_id)) {
            // Something is wrong.
            console.warn("moveHandToField(" + card_id + ") failed.");
            return false;
        }
        this.board.setCardId(x, y, card_id, facility.size);
        for (var i = 0; i < this.players.length; ++i) {
            this.players[i].addMoney(event.moneys[i]);
        }
        this.done(Phase.BuildFacility);
        return true;
    };
    Session.prototype.paySalary = function () {
        var salary = this.getCurrentPlayer().paySalary();
        var event = new Event();
        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Salary;
        event.moneys[this.current_player_id] += salary;
        this.done(Phase.PaySalary);
        return true;
    };
    Session.prototype.endTurn = function () {
        if (this.current_player_id === this.players.length - 1) {
            this.current_player_id = 0;
            this.round += 1;
            this.turn = 0;
        }
        else {
            this.current_player_id += 1;
            this.turn += 1;
        }
        this.done(Phase.EndTurn);
        return true;
    };
    Session.prototype.endGame = function () {
        // Do nothing so far.
        this.done(Phase.EndGame);
        return true;
    };
    Session.prototype.quit = function (player_id) {
        var event = new Event();
        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Quit;
        event.player_id = player_id;
        // TODO: Do not end the game. Swith to AI.
        this.phase = Phase.EndGame;
        this.step++;
        return true;
    };
    Session.prototype.processQuitCommand = function (query) {
        var user_id = query.user_id;
        this.removeWatcher(user_id);
        var player_id = this.getPlayerId(user_id);
        if (player_id === -1) {
            return false;
        }
        return this.quit(player_id);
    };
    Session.prototype.getEvents = function () {
        return this.events;
    };
    Session.prototype.getStep = function () {
        return this.step;
    };
    Session.prototype.getPhase = function () {
        return this.phase;
    };
    Session.prototype.getBoard = function () {
        return this.board;
    };
    Session.prototype.getPlayers = function () {
        return this.players;
    };
    Session.prototype.getFacility = function (card_id) {
        return this.card_manager.getFacility(card_id);
    };
    Session.prototype.isFacility = function (card_id) {
        return this.card_manager.isFacility(card_id);
    };
    Session.prototype.getCardIdOnBoard = function (x, y) {
        return this.board.getCardId(x, y);
    };
    Session.prototype.getFacilityOnBoard = function (x, y) {
        return this.card_manager.getFacility(this.getCardIdOnBoard(x, y));
    };
    Session.prototype.getOwnerIdOnBoard = function (x, y) {
        return this.getOwnerId(this.getCardIdOnBoard(x, y));
    };
    Session.prototype.getCurrentPlayerId = function () {
        return this.current_player_id;
    };
    Session.prototype.getCurrentPlayer = function () {
        return this.getPlayer(this.current_player_id);
    };
    Session.prototype.getPlayerId = function (user_id) {
        for (var pid = 0; pid < this.players.length; ++pid) {
            if (this.players[pid].user_id === user_id) {
                return pid;
            }
        }
        return -1;
    };
    Session.prototype.getPlayer = function (player_id) {
        if (player_id == null || player_id < 0) {
            return null;
        }
        return this.players[player_id];
    };
    Session.prototype.getPlayerCards = function (player_id) {
        return this.card_manager.getPlayerCards(player_id);
    };
    Session.prototype.getSortedHand = function (player_id) {
        return this.card_manager.sortFacilitiesForHand(this.getPlayerCards(player_id).getHand());
    };
    Session.prototype.isLandmark = function (card_id) {
        return this.card_manager.isLandmark(card_id);
    };
    Session.prototype.getLandmarks = function () {
        return this.card_manager.getLandmarks();
    };
    Session.prototype.getOwnerId = function (card_id) {
        return this.card_manager.getOwner(card_id);
    };
    Session.prototype.getOwner = function (card_id) {
        return this.getPlayer(this.getOwnerId(card_id));
    };
    Session.prototype.getWinner = function () {
        return this.winner;
    };
    Session.prototype.getPosition = function (card_id) {
        return this.board.getPosition(card_id);
    };
    Session.prototype.getDiceResult = function () {
        return this.dice_result;
    };
    Session.prototype.isCharacter = function (card_id) {
        return this.card_manager.isCharacter(card_id);
    };
    Session.prototype.getCharacter = function (card_id) {
        return this.card_manager.getCharacter(card_id);
    };
    Session.prototype.getDiceDelta = function () {
        return this.effect_manager.getDiceDelta();
    };
    Session.prototype.getDiceEffects = function () {
        return this.effect_manager.getDiceEffects();
    };
    Session.prototype.getTargetFacilities = function () {
        return this.target_facilities;
    };
    Session.prototype.isEnd = function () {
        return (this.phase === Phase.EndGame);
    };
    Session.prototype.getWatchers = function () {
        return this.watcher_user_ids;
    };
    Session.prototype.processWatchCommand = function (query) {
        var user_id = query.user_id;
        if (this.watcher_user_ids.indexOf(user_id) === -1) {
            this.watcher_user_ids.push(user_id);
        }
        return true;
    };
    Session.prototype.removeWatcher = function (user_id) {
        var index = this.watcher_user_ids.indexOf(user_id);
        if (index !== -1) {
            this.watcher_user_ids.splice(index, 1);
        }
    };
    Session.prototype.getCardDataId = function (card_id) {
        return this.card_manager.getCardDataId(card_id);
    };
    return Session;
}());
exports.Session = Session;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GameMode;
(function (GameMode) {
    GameMode[GameMode["None"] = 0] = "None";
    GameMode[GameMode["OffLine_2"] = 1] = "OffLine_2";
    GameMode[GameMode["OffLine_3"] = 2] = "OffLine_3";
    GameMode[GameMode["OffLine_4"] = 3] = "OffLine_4";
    GameMode[GameMode["OffLine_2_Matching"] = 4] = "OffLine_2_Matching";
    GameMode[GameMode["OnLineSingle_2"] = 5] = "OnLineSingle_2";
    GameMode[GameMode["OnLineSingle_3"] = 6] = "OnLineSingle_3";
    GameMode[GameMode["OnLineSingle_4"] = 7] = "OnLineSingle_4";
    GameMode[GameMode["OnLine2Players"] = 8] = "OnLine2Players";
    GameMode[GameMode["OnLineWatch"] = 9] = "OnLineWatch";
})(GameMode = exports.GameMode || (exports.GameMode = {}));
;
var Protocol = (function () {
    function Protocol() {
    }
    Protocol.isOnlineMode = function (mode) {
        var onlines = [
            GameMode.OnLineSingle_2, GameMode.OnLineSingle_3, GameMode.OnLineSingle_4,
            GameMode.OnLine2Players, GameMode.OnLineWatch
        ];
        return (onlines.indexOf(mode) !== -1);
    };
    Protocol.getGameModeName = function (mode) {
        switch (mode) {
            case GameMode.OffLine_2:
                return "2人バトル 😺 👻";
            case GameMode.OffLine_3:
                return "3人バトル 😺 👻 👾";
            case GameMode.OffLine_4:
                return "4人バトル 😺 👻 👾 🗿";
            case GameMode.OffLine_2_Matching:
                return "2人バトル 😺 👻";
            case GameMode.OnLineSingle_2:
                return "2人バトル 😺 👻";
            case GameMode.OnLineSingle_3:
                return "3人バトル 😺 👻 👾";
            case GameMode.OnLineSingle_4:
                return "4人バトル 😺 👻 👾 🗿";
            case GameMode.OnLine2Players:
                return "2人バトル 😺 😺";
            case GameMode.OnLineWatch:
                return "観戦モード";
            case GameMode.None:
                return "";
            default:
                return "";
        }
    };
    Protocol.getNpcCount = function (mode) {
        switch (mode) {
            case GameMode.OffLine_2:
            case GameMode.OffLine_2_Matching:
            case GameMode.OnLineSingle_2:
                return 1;
            case GameMode.OffLine_3:
            case GameMode.OnLineSingle_3:
                return 2;
            case GameMode.OffLine_4:
            case GameMode.OnLineSingle_4:
                return 3;
            case GameMode.OnLine2Players:
            case GameMode.OnLineWatch:
                return 0;
            case GameMode.None:
            default:
                return -1;
        }
    };
    Protocol.getPlayerCount = function (mode) {
        switch (mode) {
            case GameMode.OffLine_2:
            case GameMode.OffLine_2_Matching:
            case GameMode.OnLineSingle_2:
            case GameMode.OffLine_3:
            case GameMode.OnLineSingle_3:
            case GameMode.OffLine_4:
            case GameMode.OnLineSingle_4:
                return 1;
            case GameMode.OnLine2Players:
                return 2;
            case GameMode.OnLineWatch:
                return 0;
            case GameMode.None:
            default:
                return -1;
        }
    };
    return Protocol;
}());
exports.Protocol = Protocol;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DiceEvenOdd;
(function (DiceEvenOdd) {
    DiceEvenOdd[DiceEvenOdd["Any"] = 0] = "Any";
    DiceEvenOdd[DiceEvenOdd["Even"] = 1] = "Even";
    DiceEvenOdd[DiceEvenOdd["Odd"] = 2] = "Odd";
})(DiceEvenOdd = exports.DiceEvenOdd || (exports.DiceEvenOdd = {}));
var DiceNum;
(function (DiceNum) {
    DiceNum[DiceNum["Any"] = 0] = "Any";
    DiceNum[DiceNum["One"] = 1] = "One";
    DiceNum[DiceNum["Two"] = 2] = "Two";
})(DiceNum = exports.DiceNum || (exports.DiceNum = {}));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function shuffle(array) {
    var shuffled_array = array.slice(0);
    for (var l = shuffled_array.length; l > 0; --l) {
        var i = Math.floor(Math.random() * l);
        _a = [shuffled_array[l - 1], shuffled_array[i]], shuffled_array[i] = _a[0], shuffled_array[l - 1] = _a[1];
    }
    return shuffled_array;
    var _a;
}
exports.shuffle = shuffle;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __webpack_require__(7);
var session_handler_1 = __webpack_require__(17);
var storage_1 = __webpack_require__(8);
var storage = new storage_1.LocalStorage();
var session_handler = new session_handler_1.SessionHandler(storage);
var StandaloneConnection = (function (_super) {
    __extends(StandaloneConnection, _super);
    function StandaloneConnection(delay) {
        if (delay === void 0) { delay = 0; }
        var _this = _super.call(this) || this;
        _this.delay = delay;
        return _this;
    }
    StandaloneConnection.prototype.startCheckUpdate = function (client) { };
    StandaloneConnection.prototype.stopCheckUpdate = function () { };
    StandaloneConnection.prototype.matching = function (query, callback) {
        var _this = this;
        session_handler.handleMatching(query).then(function (data) {
            var matching_info = data.value;
            setTimeout(function () {
                callback(JSON.stringify(matching_info));
            }, _this.delay);
        });
    };
    StandaloneConnection.prototype.stopCheckMatching = function () {
        // Do nothing.
    };
    StandaloneConnection.prototype.setQueryOnDisconnect = function (query) {
        // Do nothing.
    };
    StandaloneConnection.prototype.sendRequest = function (query, callback) {
        var _this = this;
        session_handler.handleCommand(query).then(function (data) {
            setTimeout(function () {
                callback(data.value);
            }, _this.delay);
        });
    };
    StandaloneConnection.prototype.startCheckLive = function (callback) {
        // Do nothing.
    };
    StandaloneConnection.prototype.stopCheckLive = function () {
        // Do nothing.
    };
    return StandaloneConnection;
}(client_1.Connection));
exports.StandaloneConnection = StandaloneConnection;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Player = (function () {
    function Player(user_id, id, name, money, salary, team, is_auto) {
        if (is_auto === void 0) { is_auto = false; }
        this.user_id = user_id;
        this.id = id;
        this.name = name;
        this.money = money;
        this.salary = salary;
        this.team = team;
        this.is_auto = is_auto;
    }
    Player.prototype.toJSON = function () {
        return {
            class_name: "Player",
            user_id: this.user_id,
            id: this.id,
            name: this.name,
            money: this.money,
            salary: this.salary,
            team: this.team,
            is_auto: this.is_auto,
        };
    };
    Player.fromJSON = function (json) {
        return new Player(json.user_id, json.id, json.name, json.money, json.salary, json.team, json.is_auto);
    };
    Player.prototype.getMoney = function () {
        return this.money;
    };
    Player.prototype.setMoney = function (money) {
        this.money = money;
    };
    Player.prototype.addMoney = function (money) {
        if (this.money + money < 0) {
            money = -this.money;
        }
        this.money += money;
        return money; // can be less than money.
    };
    Player.prototype.paySalary = function () {
        this.money += this.salary;
        return this.salary;
    };
    Player.prototype.isAuto = function () {
        return this.is_auto;
    };
    Player.prototype.setAuto = function (is_auto) {
        this.is_auto = is_auto;
    };
    return Player;
}());
exports.Player = Player;
exports.NO_FACILITY = -1;
exports.MULTIPLE = -2; // Used for facilities whose size is more than 1.
var Board = (function () {
    function Board(field, row, column) {
        if (field === void 0) { field = null; }
        if (row === void 0) { row = 5; }
        if (column === void 0) { column = 12; }
        this.row = row;
        this.column = column;
        if (field) {
            this.field = field;
        }
        else {
            this.field = [];
            for (var x = 0; x < this.column; ++x) {
                this.field[x] = [];
                for (var y = 0; y < this.row; ++y) {
                    this.field[x][y] = -1; // NO_FACILITY
                }
            }
        }
    }
    Board.prototype.toJSON = function () {
        return {
            class_name: "Board",
            field: this.field,
            row: this.row,
            column: this.column,
        };
    };
    Board.fromJSON = function (json) {
        return new Board(json.field, json.row, json.column);
    };
    Board.prototype.removeCards = function (x, y, size) {
        var removed = [];
        var xi = x;
        // Find the left most.
        if (this.field[x][y] === exports.MULTIPLE) {
            for (; xi >= 0; --xi) {
                if (this.field[xi][y] !== exports.MULTIPLE) {
                    break;
                }
            }
        }
        for (; xi < x + size; xi++) {
            // Delete the left most, which has the card id.
            var card_id = this.field[xi][y];
            this.field[xi][y] = exports.NO_FACILITY;
            if (card_id === exports.MULTIPLE || card_id === exports.NO_FACILITY) {
                continue;
            }
            removed.push(card_id);
        }
        // Delete the rest of multiple parts.
        for (; xi < this.column; ++xi) {
            if (this.field[xi][y] !== exports.MULTIPLE) {
                break;
            }
            this.field[xi][y] = exports.NO_FACILITY;
        }
        return removed;
    };
    Board.prototype.setCardId = function (x, y, card_id, size) {
        this.field[x][y] = card_id;
        for (var i = 1; i < size; ++i) {
            this.field[x + i][y] = exports.MULTIPLE;
        }
    };
    Board.prototype.getCardId = function (x, y) {
        var card_id = exports.NO_FACILITY;
        for (var i = x; i >= 0; --i) {
            card_id = this.field[i][y];
            if (card_id !== exports.MULTIPLE) {
                break;
            }
        }
        return card_id;
    };
    Board.prototype.getRawCardId = function (x, y) {
        return this.field[x][y];
    };
    Board.prototype.getPosition = function (card_id) {
        for (var y = 0; y < this.row; ++y) {
            for (var x = 0; x < this.column; ++x) {
                if (this.field[x][y] === card_id) {
                    return [x, y];
                }
            }
        }
        return [-1, -1];
    };
    Board.prototype.debugString = function () {
        var output = "";
        for (var y = 0; y < this.row; ++y) {
            for (var x = 0; x < this.column; ++x) {
                output += this.field[x][y] + ", ";
            }
            output += "\n";
        }
        return output;
    };
    return Board;
}());
exports.Board = Board;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var protocol_1 = __webpack_require__(2);
var Connection = (function () {
    function Connection() {
    }
    return Connection;
}());
exports.Connection = Connection;
var Client = (function () {
    function Client(connection) {
        // TODO: These variables should not be modified by others.
        this.session_id = -1;
        this.mode = protocol_1.GameMode.None;
        this.player_id = -1;
        // TODO: user_id should be unique. 0 - 9 is reserved for NPCs.
        this.user_id = String(Math.floor(Math.random() * 1000000) + 10);
        this.step = -1;
        this.live_sessions = [];
    }
    Client.prototype.createQuery = function () {
        return {
            command: "",
            user_id: this.user_id,
            session_id: this.session_id,
            player_id: this.player_id,
            mode: this.mode,
        };
    };
    Client.prototype.fillQuery = function (query) {
        query.user_id = this.user_id;
        query.session_id = this.session_id;
        query.player_id = this.player_id;
        query.mode = this.mode;
        return query;
    };
    Client.prototype.createMatchingQuery = function (name, mode, deck) {
        var query = this.createQuery();
        query.command = "matching";
        // mode is intentionally overwriten here, because this query decides the game mode.
        query.mode = mode;
        query.name = name;
        query.deck = deck;
        return query;
    };
    Client.prototype.createChatQuery = function (stamp_id) {
        var query = this.createQuery();
        query.command = "chat";
        query.stamp_id = stamp_id;
        query.step = this.step;
        query.timestamp = new Date().getTime();
        return query;
    };
    Client.prototype.createUpdateQuery = function (step) {
        var query = this.createQuery();
        query.command = "board"; // TODO: rename it to "update".
        query.step = step;
        return query;
    };
    Client.prototype.createBuildQuery = function (x, y, card_id) {
        var query = this.createQuery();
        query.command = "build";
        query.x = x;
        query.y = y;
        query.card_id = card_id;
        return query;
    };
    Client.prototype.createDiceQuery = function (dice_num, aim) {
        var query = this.createQuery();
        query.command = "dice";
        query.dice_num = dice_num;
        query.aim = aim;
        return query;
    };
    // TODO: Enable to accept other additional values.
    Client.prototype.createCharacterQuery = function (card_id, target_player_id) {
        if (target_player_id === void 0) { target_player_id = -1; }
        var query = this.createQuery();
        query.command = "character";
        query.card_id = card_id;
        query.target_player_id = target_player_id;
        return query;
    };
    Client.prototype.createCharacterWithCardIdQuery = function (card_id, target_card_id) {
        var query = this.createQuery();
        query.command = "character";
        query.card_id = card_id;
        query.target_card_id = target_card_id;
        return query;
    };
    Client.prototype.createInteractQuery = function (card_id, target_player_id) {
        var query = this.createQuery();
        query.command = "interact";
        query.card_id = card_id;
        query.target_player_id = target_player_id;
        return query;
    };
    // TODO: Use EndTurnQuery instead.
    Client.prototype.createEndTurnQuery = function () {
        var query = this.createQuery();
        query.command = "build";
        query.x = -1;
        query.y = -1;
        query.card_id = -1;
        return query;
    };
    Client.prototype.createQuitQuery = function () {
        var query = this.createQuery();
        query.command = "quit";
        return query;
    };
    Client.prototype.createWatchQuery = function () {
        var query = this.createQuery();
        query.command = "watch";
        return query;
    };
    return Client;
}());
exports.Client = Client;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var KeyValue = (function () {
    function KeyValue(key, value) {
        if (key === void 0) { key = ""; }
        if (value === void 0) { value = null; }
        this.key = key;
        this.value = value;
    }
    return KeyValue;
}());
exports.KeyValue = KeyValue;
var Storage = (function () {
    function Storage() {
    }
    Storage.prototype.getKeysForDebug = function () {
        return [];
    };
    return Storage;
}());
exports.Storage = Storage;
var LocalStorage = (function (_super) {
    __extends(LocalStorage, _super);
    function LocalStorage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.storage = {};
        return _this;
    }
    LocalStorage.prototype.parseKey = function (key_string) {
        var keys = [];
        for (var _i = 0, _a = key_string.split("/"); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key !== "") {
                keys.push(key);
            }
        }
        return keys;
    };
    LocalStorage.prototype.getValue = function (key) {
        var keys = this.parseKey(key);
        var storage = this.storage;
        for (var i = 0; i < keys.length; ++i) {
            storage = storage[keys[i]];
            if (storage == undefined) {
                return undefined;
            }
        }
        return storage;
    };
    LocalStorage.prototype.setValue = function (key, value) {
        var keys = this.parseKey(key);
        if (keys.length === 0) {
            this.storage = value; // Replace all.
            return;
        }
        var storage = this.storage;
        for (var i = 0; i < keys.length - 1; ++i) {
            var child = storage[keys[i]];
            if (child == undefined) {
                storage[keys[i]] = {};
                storage = storage[keys[i]];
            }
            else {
                storage = child;
            }
        }
        storage[keys[keys.length - 1]] = value;
    };
    LocalStorage.prototype.deleteValue = function (key) {
        var keys = this.parseKey(key);
        if (keys.length === 0) {
            this.storage = {}; // Delete all.
            return;
        }
        var storage = this.storage;
        for (var i = 0; i < keys.length - 1; ++i) {
            storage = storage[keys[i]];
            if (storage == undefined) {
                return; // Already deleted.
            }
        }
        delete storage[keys[keys.length - 1]];
        // TODO: delete parent nodes.
    };
    LocalStorage.prototype.get = function (key, callback) {
        var value = this.getValue(key);
        if (value != undefined) {
            callback(null, this.storage[key]);
        }
    };
    LocalStorage.prototype.getWithPromise = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = new KeyValue(key, _this.getValue(key));
            resolve(data);
        });
    };
    LocalStorage.prototype.delete = function (key) {
        this.deleteValue(key);
    };
    LocalStorage.prototype.deleteWithPromise = function (key) {
        this.deleteValue(key);
        return new Promise(function (resolve, reject) {
            var data = new KeyValue(key, null);
            resolve(data);
        });
    };
    LocalStorage.prototype.getKeys = function () {
        return Object.keys(this.storage);
    };
    LocalStorage.prototype.set = function (key, value, callback, expire) {
        this.setValue(key, value);
        callback(null);
    };
    LocalStorage.prototype.setWithPromise = function (key, value) {
        this.setValue(key, value);
        return new Promise(function (resolve, reject) {
            var data = new KeyValue(key, value);
            resolve(data);
        });
    };
    LocalStorage.prototype.getKeysForDebug = function () {
        return Object.keys(this.storage);
    };
    return LocalStorage;
}(Storage));
exports.LocalStorage = LocalStorage;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __webpack_require__(7);
var session_1 = __webpack_require__(1);
var html_view_1 = __webpack_require__(14);
var protocol_1 = __webpack_require__(2);
var standalone_connection_1 = __webpack_require__(5);
// TODO: can be merged with Client?
var WebClient = (function (_super) {
    __extends(WebClient, _super);
    function WebClient(connection) {
        var _this = _super.call(this, connection) || this;
        _this.no_update_count = 0;
        _this.chat_timestamps = {};
        _this.prev_mode = protocol_1.GameMode.None;
        var delay = 0; // msec.
        _this.offline_connection = new standalone_connection_1.StandaloneConnection(delay);
        _this.connection = connection ? connection : _this.offline_connection;
        _this.view = new html_view_1.HtmlView(_this);
        return _this;
    }
    WebClient.prototype.reset = function () {
        if (this.prev_mode !== protocol_1.GameMode.None) {
            this.mode = this.prev_mode;
            this.prev_mode = protocol_1.GameMode.None;
        }
        else {
            this.mode = protocol_1.GameMode.None;
        }
        this.session_id = -1;
        this.player_id = -1;
        this.step = -1;
        this.connection.stopCheckUpdate();
        this.connection.stopCheckLive();
        this.no_update_count = 0;
    };
    WebClient.prototype.initBoard = function () {
        this.view.initView();
    };
    WebClient.prototype.matching = function (query) {
        query.command = "matching";
        query.user_id = this.user_id;
        if (query.mode === protocol_1.GameMode.OffLine_2_Matching) {
            this.prev_mode = this.mode;
        }
        else {
            // If mode is OffLine_2_Matching, do not stop previous actual matching request.
            this.connection.stopCheckMatching();
        }
        this.mode = query.mode;
        if (protocol_1.Protocol.isOnlineMode(query.mode)) {
            this.connection.setQueryOnDisconnect(this.createQuitQuery());
            this.connection.matching(query, this.callbackMatching.bind(this));
        }
        else {
            this.offline_connection.matching(query, this.callbackMatching.bind(this));
        }
    };
    WebClient.prototype.quit = function () {
        if (this.mode !== protocol_1.GameMode.OffLine_2_Matching) {
            this.sendRequest(this.createQuitQuery());
        }
    };
    WebClient.prototype.callbackMatching = function (response) {
        var _this = this;
        var matching_info = JSON.parse(response);
        if (matching_info == null || !matching_info.is_matched) {
            return;
        }
        // Mode is already changed to online.
        if (protocol_1.Protocol.isOnlineMode(this.mode) &&
            matching_info.mode === protocol_1.GameMode.OffLine_2_Matching) {
            return;
        }
        if (protocol_1.Protocol.isOnlineMode(matching_info.mode)) {
            this.connection.stopCheckMatching();
            this.connection.stopCheckLive();
        }
        if (this.mode === protocol_1.GameMode.OffLine_2_Matching &&
            this.mode !== matching_info.mode) {
            this.view.announce("マッチングしました。");
            setTimeout(function () {
                _this.readyGame(matching_info);
            }, 3000);
            return;
        }
        this.readyGame(matching_info);
    };
    WebClient.prototype.readyGame = function (matching_info) {
        this.session_id = matching_info.session_id;
        this.mode = matching_info.mode;
        this.step = -1;
        this.no_update_count = 0;
        this.view.readyGame();
        this.checkUpdate();
        if (protocol_1.Protocol.isOnlineMode(matching_info.mode)) {
            this.connection.setQueryOnDisconnect(this.createQuitQuery());
            this.connection.startCheckUpdate(this);
        }
    };
    WebClient.prototype.callbackSession = function (response) {
        if (this.mode === protocol_1.GameMode.None) {
            return;
        }
        if (!response) {
            console.log("Stop polling.");
            this.connection.stopCheckUpdate();
        }
        // If the response is "{}", the server does not have any update.
        if (response === "{}") {
            console.log("Already updated.");
            // If no update continues 100 times, stop polling.
            this.no_update_count++;
            if (this.no_update_count > 100) {
                console.log("No update for a while.");
                this.connection.stopCheckUpdate();
            }
            return;
        }
        this.no_update_count = 0;
        var session = session_1.Session.fromJSON(JSON.parse(response));
        var step = session.getStep();
        console.log(step);
        if (step === this.step) {
            console.log("Already updated.");
            return;
        }
        this.player_id = session.getPlayerId(this.user_id);
        this.step = step;
        this.view.updateView(session, this.player_id);
    };
    WebClient.prototype.callbackChat = function (data) {
        if (data == null) {
            return;
        }
        var user_ids = Object.keys(data);
        for (var _i = 0, user_ids_1 = user_ids; _i < user_ids_1.length; _i++) {
            var user_id = user_ids_1[_i];
            var chat = data[user_id];
            var prev_timestamp = this.chat_timestamps[user_id];
            if (chat.timestamp == undefined || chat.timestamp === prev_timestamp) {
                continue;
            }
            if (chat.step < this.step) {
                continue;
            }
            this.view.updateChat(chat);
            this.chat_timestamps[user_id] = chat.timestamp;
        }
    };
    WebClient.prototype.checkUpdate = function () {
        this.sendRequest(this.createUpdateQuery(this.step));
    };
    WebClient.prototype.startCheckLive = function (callback) {
        this.connection.startCheckLive(callback);
    };
    WebClient.prototype.watchGame = function (session_id) {
        this.reset();
        this.session_id = session_id;
        this.mode = protocol_1.GameMode.OnLineWatch;
        this.sendRequest(this.createWatchQuery());
        this.connection.setQueryOnDisconnect(this.createQuitQuery());
        this.connection.startCheckUpdate(this);
        this.connection.stopCheckLive();
    };
    WebClient.prototype.sendRequest = function (request) {
        var _this = this;
        var connection = protocol_1.Protocol.isOnlineMode(this.mode) ? this.connection : this.offline_connection;
        connection.sendRequest(request, function (response) {
            _this.callbackSession(response);
        });
    };
    return WebClient;
}(client_1.Client));
exports.WebClient = WebClient;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(4);
var AutoPlay = (function () {
    function AutoPlay() {
    }
    AutoPlay.getQuery = function (session) {
        var player_id = session.getCurrentPlayerId();
        switch (session.getPhase()) {
            case session_1.Phase.CharacterCard:
            case session_1.Phase.DiceRoll:
                return AutoPlay.getDiceQuery(session);
            case session_1.Phase.BuildFacility:
                return AutoPlay.getBuildQuery(session);
            case session_1.Phase.FacilityActionWithInteraction:
                return AutoPlay.getInteractQuery(session);
        }
        return null;
    };
    AutoPlay.getDiceQuery = function (session) {
        var player_id = session.getCurrentPlayerId();
        var query = {
            command: "dice",
            user_id: session.getPlayer(player_id).user_id,
            session_id: session.session_id,
            player_id: player_id,
            mode: -1,
            dice_num: 2,
            aim: 0,
        };
        return query;
    };
    AutoPlay.getInteractQuery = function (session) {
        var player_id = session.getCurrentPlayerId();
        var target_facilities = session.getTargetFacilities();
        var target_id = (player_id === 0) ? 1 : 0; // TODO: Fixme :)
        if (target_facilities.length === 0) {
            return null;
        }
        var query = {
            command: "interact",
            user_id: session.getPlayer(player_id).user_id,
            session_id: session.session_id,
            player_id: player_id,
            mode: -1,
            card_id: target_facilities[0],
            target_player_id: target_id,
        };
        return query;
    };
    AutoPlay.getBuildQuery = function (session) {
        var landmarks = session.getLandmarks();
        var player_id = session.getCurrentPlayerId();
        var player = session.getPlayer(player_id);
        var money = player.getMoney();
        var query = {
            command: "build",
            user_id: session.getPlayer(player_id).user_id,
            session_id: session.session_id,
            player_id: player_id,
            mode: -1,
            x: -1,
            y: -1,
            card_id: -1,
        };
        for (var _i = 0, landmarks_1 = landmarks; _i < landmarks_1.length; _i++) {
            var landmark = landmarks_1[_i];
            if (session.getOwnerId(landmark) !== -1) {
                continue;
            }
            if (money >= session.getFacility(landmark).getCost()) {
                query.card_id = landmark;
                return query;
            }
        }
        var card_ids = session.getPlayerCards(player_id).getHand();
        for (var _a = 0, card_ids_1 = card_ids; _a < card_ids_1.length; _a++) {
            var card_id = card_ids_1[_a];
            if (session.isCharacter(card_id)) {
                continue;
            }
            var facility = session.getFacility(card_id);
            if (money < facility.getCost()) {
                continue;
            }
            // TODO: Enabled to overwrite existing facilities.
            // availablePosition does not return overwritable facilities.
            var positions = utils_1.shuffle(session.availablePosition(card_id));
            if (positions.length === 0) {
                continue;
            }
            var _b = positions[0], x = _b[0], y = _b[1];
            query.x = x;
            query.y = y;
            query.card_id = card_id;
            return query;
        }
        return query;
    };
    return AutoPlay;
}());
exports.AutoPlay = AutoPlay;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var facility_1 = __webpack_require__(0);
var types_1 = __webpack_require__(3);
var CardState;
(function (CardState) {
    CardState[CardState["None"] = 0] = "None";
    CardState[CardState["Talon"] = 1] = "Talon";
    CardState[CardState["Hand"] = 2] = "Hand";
    CardState[CardState["Field"] = 3] = "Field";
    CardState[CardState["Discard"] = 4] = "Discard";
})(CardState = exports.CardState || (exports.CardState = {}));
var PlayerCards = (function () {
    function PlayerCards(talon, hand, field, discard) {
        if (talon === void 0) { talon = []; }
        if (hand === void 0) { hand = []; }
        if (field === void 0) { field = []; }
        if (discard === void 0) { discard = []; }
        this.cards = {}; // CardState -> CardId[]
        this.max_hand = 10;
        this.cards[CardState.Talon] = talon;
        this.cards[CardState.Hand] = hand;
        this.cards[CardState.Field] = field;
        this.cards[CardState.Discard] = discard;
    }
    PlayerCards.prototype.toJSON = function () {
        return {
            class_name: "PlayerCards",
            talon: this.cards[CardState.Talon],
            hand: this.cards[CardState.Hand],
            field: this.cards[CardState.Field],
            discard: this.cards[CardState.Discard],
        };
    };
    PlayerCards.fromJSON = function (json) {
        return new PlayerCards(json.talon, json.hand, json.field, json.discard);
    };
    PlayerCards.prototype.getSize = function () {
        return (this.cards[CardState.Talon].length +
            this.cards[CardState.Hand].length +
            this.cards[CardState.Field].length +
            this.cards[CardState.Discard].length);
    };
    PlayerCards.prototype.getIndex = function (card_id, facility_array) {
        // indexOf is type sensitive (e.g. "1" is different value from 1).
        // card_id could be a string.
        if (typeof card_id !== "number") {
            console.warn("card_id(" + card_id + ") is not a number");
            card_id = Number(card_id);
        }
        return facility_array.indexOf(card_id);
    };
    PlayerCards.prototype.deleteCardId = function (card_id, facility_array) {
        var index = this.getIndex(card_id, facility_array);
        if (index < 0) {
            console.warn("deleteCardId - index < 0.");
            return false;
        }
        facility_array.splice(index, 1);
        return true;
    };
    PlayerCards.prototype.moveCardId = function (card_id, array_from, array_to) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        if (!this.deleteCardId(card_id, array_from)) {
            console.warn("deleteCardId failed.");
            return false;
        }
        array_to.push(card_id);
        return true;
    };
    PlayerCards.prototype.addTalon = function (card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        this.cards[CardState.Talon].push(card_id);
        return true;
    };
    PlayerCards.prototype.getTalon = function () {
        return this.cards[CardState.Talon];
    };
    PlayerCards.prototype.getHand = function () {
        return this.cards[CardState.Hand];
    };
    // Move a random facility from Talon to Hand.
    PlayerCards.prototype.dealToHand = function () {
        if (this.cards[CardState.Talon].length === 0 || this.cards[CardState.Hand].length === this.max_hand) {
            return -1;
        }
        var random_index = Math.floor(Math.random() * this.cards[CardState.Talon].length);
        var card_id = this.cards[CardState.Talon][random_index];
        this.moveTalonToHand(card_id);
        return card_id;
    };
    PlayerCards.prototype.getTalonSize = function () {
        return this.cards[CardState.Talon].length;
    };
    PlayerCards.prototype.getHandSize = function () {
        return this.cards[CardState.Hand].length;
    };
    PlayerCards.prototype.moveTalonToHand = function (card_id) {
        if (this.cards[CardState.Hand].length === this.max_hand) {
            return false;
        }
        return this.moveCardId(card_id, this.cards[CardState.Talon], this.cards[CardState.Hand]);
    };
    PlayerCards.prototype.isInHand = function (card_id) {
        return this.isInState(card_id, CardState.Hand);
    };
    PlayerCards.prototype.isInState = function (card_id, state) {
        var index = this.getIndex(card_id, this.cards[state]);
        return (index >= 0);
    };
    // Used for initial build.
    PlayerCards.prototype.moveTalonToField = function (card_id) {
        return this.moveCardId(card_id, this.cards[CardState.Talon], this.cards[CardState.Field]);
    };
    PlayerCards.prototype.moveHandToField = function (card_id) {
        return this.moveCardId(card_id, this.cards[CardState.Hand], this.cards[CardState.Field]);
    };
    PlayerCards.prototype.moveHandToDiscard = function (card_id) {
        return this.moveCardId(card_id, this.cards[CardState.Hand], this.cards[CardState.Discard]);
    };
    PlayerCards.prototype.moveFieldToDiscard = function (card_id) {
        return this.moveCardId(card_id, this.cards[CardState.Field], this.cards[CardState.Discard]);
    };
    PlayerCards.prototype.getCardsFromTalon = function (size) {
        return this.cards[CardState.Talon].slice(0, size);
    };
    return PlayerCards;
}());
exports.PlayerCards = PlayerCards;
var CardManager = (function () {
    function CardManager(facilities, characters, player_cards_list, landmarks) {
        if (facilities === void 0) { facilities = {}; }
        if (characters === void 0) { characters = {}; }
        if (player_cards_list === void 0) { player_cards_list = null; }
        if (landmarks === void 0) { landmarks = []; }
        this.max_card_size = 1000;
        this.landmark_id_base = 10000;
        this.facilities = facilities;
        this.characters = characters;
        if (player_cards_list) {
            this.player_cards_list = player_cards_list;
        }
        else {
            this.player_cards_list = [];
            for (var i = 0; i < 4; i++) {
                this.player_cards_list.push(new PlayerCards());
            }
        }
        this.landmarks = landmarks;
    }
    CardManager.prototype.toJSON = function () {
        var facility_json = {};
        for (var id in this.facilities) {
            facility_json[id] = this.facilities[id].toJSON();
        }
        var character_json = {};
        for (var id in this.characters) {
            character_json[id] = this.characters[id].toJSON();
        }
        return {
            class_name: "CardManager",
            facilities: facility_json,
            characters: character_json,
            player_cards_list: this.player_cards_list.map(function (cards) { return cards.toJSON(); }),
            landmarks: this.landmarks,
        };
    };
    CardManager.fromJSON = function (json) {
        var facilities = {};
        for (var id in json.facilities) {
            facilities[id] = facility_1.Facility.fromJSON(json.facilities[id]);
        }
        var characters = {};
        for (var id in json.characters) {
            characters[id] = facility_1.Character.fromJSON(json.characters[id]);
        }
        return new CardManager(facilities, characters, json.player_cards_list.map(function (cards) { return PlayerCards.fromJSON(cards); }), json.landmarks);
    };
    CardManager.prototype.queryCards = function (query) {
        var results = [];
        var card_ids = Object.keys(this.facilities).map(function (key) { return Number(key); });
        for (var _i = 0, card_ids_1 = card_ids; _i < card_ids_1.length; _i++) {
            var card_id = card_ids_1[_i];
            if (query.card_type != null &&
                query.card_type !== this.getCardType(card_id)) {
                continue;
            }
            if (query.facility_type != null &&
                query.facility_type !== this.facilities[card_id].type) {
                continue;
            }
            if (query.state != null &&
                this.isFacility(card_id) &&
                !this.getPlayerCardsFromCardId(card_id).isInState(card_id, query.state)) {
                continue;
            }
            if (query.owner_id != null &&
                query.owner_id !== this.getOwner(card_id)) {
                continue;
            }
            if (query.data_id != null &&
                query.data_id !== this.getCardDataId(card_id)) {
                continue;
            }
            results.push(card_id);
        }
        return results;
    };
    CardManager.prototype.getCardType = function (card_id) {
        if (this.isFacility(card_id)) {
            return facility_1.CardType.Facility;
        }
        if (this.isLandmark(card_id)) {
            return facility_1.CardType.Landmark;
        }
        if (this.isCharacter(card_id)) {
            return facility_1.CardType.Character;
        }
        return facility_1.CardType.None;
    };
    CardManager.prototype.addFacility = function (player_id, facility_data_id) {
        var player_cards = this.player_cards_list[player_id];
        if (player_cards == null) {
            return false;
        }
        var size = player_cards.getSize();
        if (size >= this.max_card_size) {
            return false;
        }
        // CardId is separated per player (i.e. player1 = 1000 - 1999).
        var card_id = player_id * this.max_card_size + size;
        this.facilities[card_id] = new facility_1.Facility(facility_data_id);
        player_cards.addTalon(card_id);
        return true;
    };
    CardManager.prototype.addCharacter = function (player_id, character_data_id) {
        var player_cards = this.player_cards_list[player_id];
        if (player_cards == null) {
            return false;
        }
        var size = player_cards.getSize();
        if (size >= this.max_card_size) {
            return false;
        }
        // Character card ID starts from 500.
        var char_base = 500;
        // CardId is separated per player (i.e. player1 = 1000 - 1999).
        var card_id = player_id * this.max_card_size + char_base + size;
        this.characters[card_id] = new facility_1.Character(character_data_id);
        player_cards.addTalon(card_id);
        return true;
    };
    CardManager.prototype.addLandmark = function (landmark) {
        var card_id = this.landmark_id_base + this.landmarks.length;
        this.facilities[card_id] = landmark;
        this.landmarks.push([card_id, -1]); // NO_PLAYER.
        return card_id;
    };
    CardManager.prototype.buildLandmark = function (player_id, landmark_id) {
        for (var _i = 0, _a = this.landmarks; _i < _a.length; _i++) {
            var landmark_info = _a[_i];
            if (landmark_info[0] === landmark_id) {
                landmark_info[1] = player_id;
                return true;
            }
        }
        return false;
    };
    CardManager.prototype.isCharacter = function (card_id) {
        return (this.characters[card_id] != undefined);
    };
    CardManager.prototype.getCharacter = function (card_id) {
        if (card_id < 0) {
            return null;
        }
        return this.characters[card_id];
    };
    CardManager.prototype.isLandmark = function (card_id) {
        for (var _i = 0, _a = this.landmarks; _i < _a.length; _i++) {
            var landmark_info = _a[_i];
            if (landmark_info[0] === card_id) {
                return true;
            }
        }
        return false;
    };
    CardManager.prototype.getLandmarks = function () {
        var landmarks = [];
        for (var _i = 0, _a = this.landmarks; _i < _a.length; _i++) {
            var landmark_info = _a[_i];
            landmarks.push(landmark_info[0]);
        }
        return landmarks;
    };
    CardManager.prototype.getBuiltLandmarks = function () {
        var landmarks = [];
        for (var _i = 0, _a = this.landmarks; _i < _a.length; _i++) {
            var landmark_info = _a[_i];
            if (landmark_info[1] !== -1) {
                landmarks.push(landmark_info[0]);
            }
        }
        return landmarks;
    };
    CardManager.prototype.getFacility = function (card_id) {
        if (card_id < 0) {
            return null;
        }
        return this.facilities[card_id];
    };
    CardManager.prototype.isFacility = function (card_id) {
        return ((this.facilities[card_id] != undefined) && !this.isLandmark(card_id));
    };
    CardManager.prototype.getOwner = function (card_id) {
        if (card_id < 0) {
            return -1;
        }
        if (this.isLandmark(card_id)) {
            for (var _i = 0, _a = this.landmarks; _i < _a.length; _i++) {
                var landmark_info = _a[_i];
                if (landmark_info[0] === card_id) {
                    return landmark_info[1];
                }
            }
            return -1;
        }
        // TODO: Check actual existance of card_id.
        // TODO: Owner can be changed while the game.
        return Math.floor(card_id / this.max_card_size);
    };
    CardManager.prototype.getPlayerCards = function (player_id) {
        if (player_id < 0 || this.player_cards_list.length <= player_id) {
            console.warn("player_id is invalid.");
            return null;
        }
        return this.player_cards_list[player_id];
    };
    CardManager.prototype.getPlayerCardsFromCardId = function (card_id) {
        if (card_id < 0 || card_id >= this.landmark_id_base) {
            return null;
        }
        return this.player_cards_list[this.getOwner(card_id)];
    };
    CardManager.prototype.isInHand = function (player_id, card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        if (player_id < 0 || this.player_cards_list.length <= player_id) {
            console.warn("player_id is invalid.");
            return false;
        }
        // Check is owner is correct.
        if (this.getOwner(card_id) !== player_id) {
            return false;
        }
        return this.player_cards_list[player_id].isInHand(card_id);
    };
    CardManager.prototype.isInArea = function (area, card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return (this.facilities[card_id].getArea().indexOf(area) !== -1);
    };
    CardManager.prototype.moveFieldToDiscard = function (card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        this.facilities[card_id].reset();
        return this.getPlayerCardsFromCardId(card_id).moveFieldToDiscard(card_id);
    };
    CardManager.prototype.moveHandToField = function (card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveHandToField(card_id);
    };
    CardManager.prototype.moveHandToDiscard = function (card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveHandToDiscard(card_id);
    };
    // Used for initial build.
    CardManager.prototype.moveTalonToField = function (card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveTalonToField(card_id);
    };
    CardManager.prototype.moveTalonToHand = function (card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveTalonToHand(card_id);
    };
    CardManager.prototype.getCardsFromTalon = function (player_id, size) {
        return this.player_cards_list[player_id].getCardsFromTalon(size);
    };
    CardManager.prototype.compareCharacters = function (id1, id2) {
        var char1 = this.characters[id1];
        var char2 = this.characters[id2];
        return char1.data_id - char2.data_id;
    };
    CardManager.prototype.compareAreas = function (area1, area2) {
        var len1 = area1.length;
        var len2 = area2.length;
        for (var i = 0; i < Math.min(len1, len2); ++i) {
            if (area1[i] === area2[i]) {
                continue;
            }
            return area1[i] - area2[i];
        }
        return len1 - len2;
    };
    CardManager.prototype.sortFacilitiesForHand = function (facilities) {
        var _this = this;
        return facilities.sort(function (id1, id2) {
            // Check cases of character cards.
            var c1 = _this.isCharacter(id1) ? 1 : 0;
            var c2 = _this.isCharacter(id2) ? 1 : 0;
            if (c1 + c2 === 2) {
                return _this.compareCharacters(id1, id2);
            }
            else if (c1 + c2 === 1) {
                return c1 - c2;
            }
            // Both IDs represents facilities.
            var f1 = _this.facilities[id1];
            var f2 = _this.facilities[id2];
            var comp_area = _this.compareAreas(f1.area, f2.area);
            if (comp_area !== 0) {
                return comp_area;
            }
            else if (f1.type !== f2.type) {
                return f1.type - f2.type;
            }
            else if (f1.cost !== f2.cost) {
                return f1.cost - f2.cost;
            }
            else if (f1.name !== f2.name) {
                return f1.name < f2.name ? -1 : 1;
            }
            return 0;
        });
    };
    // Check if the facility is overwritable regardless the cost.
    CardManager.prototype.canOverwrite = function (card_id) {
        if (this.isLandmark(card_id)) {
            return false;
        }
        return true;
    };
    CardManager.prototype.getCardDataId = function (card_id) {
        if (this.isCharacter(card_id)) {
            return this.characters[card_id].data_id;
        }
        var facility = this.facilities[card_id];
        if (facility == undefined) {
            return -1;
        }
        return facility.data_id;
    };
    return CardManager;
}());
exports.CardManager = CardManager;
var CardEffect = (function () {
    function CardEffect(data_id, round, turn, card_ids) {
        this.data_id = data_id;
        this.character = new facility_1.Character(data_id);
        this.round = round;
        this.turn = turn;
        this.card_ids = card_ids;
    }
    CardEffect.prototype.toJSON = function () {
        return {
            class_name: "CardEffect",
            data_id: this.data_id,
            // Character is not encoded. data_id can reproduce Character.
            round: this.round,
            turn: this.turn,
            card_ids: this.card_ids,
        };
    };
    CardEffect.fromJSON = function (json) {
        return new CardEffect(json.data_id, json.round, json.turn, json.card_ids);
    };
    return CardEffect;
}());
exports.CardEffect = CardEffect;
var EffectManager = (function () {
    function EffectManager(cards) {
        if (cards === void 0) { cards = []; }
        this.cards = cards;
    }
    EffectManager.prototype.toJSON = function () {
        var cards = this.cards.map(function (card) { return card.toJSON(); });
        return {
            class_name: "EffectManager",
            cards: cards,
        };
    };
    EffectManager.fromJSON = function (json) {
        var cards = json.cards.map(function (card) { return CardEffect.fromJSON(card); });
        return new EffectManager(cards);
    };
    EffectManager.prototype.addCard = function (data_id, round, turn, card_ids) {
        if (card_ids === void 0) { card_ids = []; }
        this.cards.push(new CardEffect(data_id, round, turn, card_ids));
    };
    // Remove expired cards.
    EffectManager.prototype.expire = function (round, turn) {
        var new_cards = [];
        var round_factor = 10; // Any number >= 4.
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            var expiration = (card.round + card.character.round) * round_factor + card.turn;
            var current = round * round_factor + turn;
            if (expiration > current) {
                new_cards.push(card);
            }
        }
        this.cards = new_cards;
    };
    EffectManager.prototype.getDiceEffects = function () {
        var delta = this.getDiceDelta();
        var types = this.getCharacterTypes();
        // Even or odd.
        var even_odd = types_1.DiceEvenOdd.Any;
        if (types.indexOf(facility_1.CharacterType.DiceEven) !== -1) {
            even_odd = types_1.DiceEvenOdd.Even;
        }
        else if (types.indexOf(facility_1.CharacterType.DiceOdd) !== -1) {
            even_odd = types_1.DiceEvenOdd.Odd;
        }
        // Num of dices.
        var dice_num = types_1.DiceNum.Any;
        var dice_one_index = types.indexOf(facility_1.CharacterType.DiceOne);
        var dice_two_index = types.indexOf(facility_1.CharacterType.DiceTwo);
        if (dice_one_index !== -1) {
            dice_num = (dice_two_index > dice_one_index) ? types_1.DiceNum.Two : types_1.DiceNum.One;
        }
        else if (dice_two_index !== -1) {
            dice_num = types_1.DiceNum.Two;
        }
        var effects = {
            delta: delta,
            even_odd: even_odd,
            num: dice_num
        };
        return effects;
    };
    EffectManager.prototype.getDiceDelta = function () {
        var delta = 0;
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.character.type === facility_1.CharacterType.DiceDelta) {
                delta += card.character.property["delta"];
            }
        }
        return delta;
    };
    EffectManager.prototype.getCharacterTypes = function () {
        return this.cards.map(function (card) { return card.character.type; });
    };
    EffectManager.prototype.getBoost = function (card_id) {
        var boost = 0;
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.character.type === facility_1.CharacterType.Boost &&
                card.card_ids.indexOf(card_id) !== -1) {
                boost += card.character.property["boost"];
            }
        }
        return boost;
    };
    return EffectManager;
}());
exports.EffectManager = EffectManager;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var facility_1 = __webpack_require__(0);
var board_1 = __webpack_require__(6);
var DeckMaker = (function () {
    function DeckMaker() {
        this.cards = {}; // key is CardId.
        this.board = new board_1.Board();
        this.chars = [-1, -1, -1, -1, -1];
        this.availables = [];
        for (var x = 0; x < this.board.column; ++x) {
            this.availables[x] = facility_1.CardData.getAvailableFacilities(x + 1);
        }
    }
    DeckMaker.prototype.getAvailableFacilities = function (x) {
        return this.availables[x];
    };
    DeckMaker.prototype.setFacility = function (x, y, data_id) {
        var _this = this;
        var facility = new facility_1.Facility(data_id); // TODO: Can refer FACILITY_DATA instead?
        // Check the facility's area.
        var valid = false;
        for (var s = 0; s < facility.size; ++s) {
            if (facility.area.indexOf(x + 1 - s) !== -1) {
                x = x - s;
                valid = true;
                break;
            }
        }
        if (!valid) {
            return false;
        }
        var size = facility.size;
        this.board.removeCards(x, y, size).map(function (removed) {
            delete _this.cards[removed];
        });
        var card_id = this.board.row * x + y;
        this.board.setCardId(x, y, card_id, size);
        this.cards[card_id] = data_id;
        return true;
    };
    DeckMaker.prototype.getFacility = function (card_id) {
        return new facility_1.Facility(this.cards[card_id]); // TODO: Create a Facility pool.
    };
    DeckMaker.prototype.removeFacility = function (x, y) {
        var _this = this;
        this.board.removeCards(x, y, 1).map(function (removed) {
            delete _this.cards[removed];
        });
    };
    DeckMaker.prototype.getDeck = function () {
        var deck = [];
        for (var _i = 0, _a = Object.keys(this.cards); _i < _a.length; _i++) {
            var key = _a[_i];
            deck.push(this.cards[key]);
        }
        for (var _b = 0, _c = this.chars; _b < _c.length; _b++) {
            var data_id = _c[_b];
            if (data_id !== -1) {
                deck.push(data_id);
            }
        }
        return deck;
    };
    DeckMaker.prototype.setCharacter = function (x, data_id) {
        this.chars[x] = data_id;
    };
    DeckMaker.prototype.getCharacter = function (x) {
        var data_id = this.chars[x];
        if (data_id === -1) {
            return null;
        }
        return new facility_1.Character(data_id);
    };
    DeckMaker.prototype.removeCharacter = function (x) {
        this.chars[x] = -1;
    };
    return DeckMaker;
}());
exports.DeckMaker = DeckMaker;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(3);
var DiceResult = (function () {
    function DiceResult(dice1, dice2, delta, is_miracle, miracle_dice1, miracle_dice2) {
        if (delta === void 0) { delta = 0; }
        if (is_miracle === void 0) { is_miracle = false; }
        if (miracle_dice1 === void 0) { miracle_dice1 = 0; }
        if (miracle_dice2 === void 0) { miracle_dice2 = 0; }
        this.dice1 = dice1;
        this.dice2 = dice2;
        this.delta = delta;
        this.is_miracle = is_miracle;
        this.miracle_dice1 = miracle_dice1;
        this.miracle_dice2 = miracle_dice2;
    }
    DiceResult.prototype.toJSON = function () {
        return {
            class_name: "DiceResult",
            dice1: this.dice1,
            dice2: this.dice2,
            delta: this.delta,
            is_miracle: this.is_miracle,
            miracle_dice1: this.miracle_dice1,
            miracle_dice2: this.miracle_dice2,
        };
    };
    DiceResult.fromJSON = function (json) {
        return new DiceResult(json.dice1, json.dice2, json.delta, json.is_miracle, json.miracle_dice1, json.miracle_dice2);
    };
    DiceResult.prototype.result = function () {
        if (this.is_miracle) {
            return this.miracle_dice1 + this.miracle_dice2 + this.delta;
        }
        return this.dice1 + this.dice2 + this.delta;
    };
    DiceResult.prototype.debugString = function () {
        return JSON.stringify(this);
    };
    return DiceResult;
}());
exports.DiceResult = DiceResult;
var Dice = (function () {
    function Dice() {
    }
    Dice.roll = function (dice_num, aim, effects) {
        if (aim === void 0) { aim = 0; }
        if (effects.num !== types_1.DiceNum.Any) {
            dice_num = effects.num;
        }
        var dice2_factor = (dice_num === 2) ? 1 : 0;
        var _a = Dice.rollDices(dice_num, effects), dice1 = _a[0], dice2 = _a[1];
        if (dice1 + dice2 === aim) {
            // Lucky, but not miracle lucky.
            return new DiceResult(dice1, dice2, effects.delta, false);
        }
        // Try again for miracle.
        var _b = Dice.rollDices(dice_num, effects), miracle_dice1 = _b[0], miracle_dice2 = _b[1];
        if (miracle_dice1 + miracle_dice2 === aim) {
            return new DiceResult(dice1, dice2, effects.delta, true, miracle_dice1, miracle_dice2);
        }
        return new DiceResult(dice1, dice2, effects.delta, false);
    };
    Dice.rollDices = function (dice_num, effects) {
        var dice2_factor = (dice_num === 2) ? 1 : 0;
        var dice1 = Dice.roll1();
        var dice2 = Dice.roll1() * dice2_factor;
        if (effects.even_odd === types_1.DiceEvenOdd.Even) {
            while ((dice1 + dice2) % 2 !== 0) {
                dice1 = Dice.roll1();
                dice2 = Dice.roll1() * dice2_factor;
            }
        }
        if (effects.even_odd === types_1.DiceEvenOdd.Odd) {
            while ((dice1 + dice2) % 2 !== 1) {
                dice1 = Dice.roll1();
                dice2 = Dice.roll1() * dice2_factor;
            }
        }
        return [dice1, dice2];
    };
    Dice.roll1 = function () {
        return Math.floor(Math.random() * 6) + 1;
    };
    return Dice;
}());
exports.Dice = Dice;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = __webpack_require__(1);
var facility_1 = __webpack_require__(0);
var deck_maker_1 = __webpack_require__(12);
var protocol_1 = __webpack_require__(2);
var html_view_parts_1 = __webpack_require__(15);
var types_1 = __webpack_require__(3);
var COLOR_FIELD = "#FFF8E1";
var COLOR_LANDMARK = "#B0BEC5";
var COLOR_CLICKABLE = "#FFCA28";
var COLOR_HIGHTLIGHT_CARD = "#FFE082";
var COLOR_PLAYERS = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];
var COLOR_GRAY = "#B0BEC5";
var COLOR_BLUE = "#90CAF9";
var COLOR_GREEN = "#A5D6A7";
var COLOR_RED = "#EF9A9A";
var COLOR_PURPLE = "#B39DDB";
var Scene;
(function (Scene) {
    Scene[Scene["None"] = 0] = "None";
    Scene[Scene["Home"] = 1] = "Home";
    Scene[Scene["Matching"] = 2] = "Matching";
    Scene[Scene["Deck"] = 3] = "Deck";
    Scene[Scene["Game"] = 4] = "Game";
})(Scene || (Scene = {}));
var EventQueue = (function () {
    function EventQueue() {
        this.is_running = false;
        this.event_queue = [];
    }
    EventQueue.prototype.reset = function () {
        this.is_running = false;
        this.event_queue = [];
        window.clearTimeout(this.timer);
        this.timer = null;
    };
    EventQueue.prototype.run = function () {
        if (this.event_queue.length === 0) {
            return;
        }
        if (this.is_running) {
            return;
        }
        this.is_running = true;
        this.processQueue();
    };
    EventQueue.prototype.addEvent = function (event_function, duration) {
        this.event_queue.push([event_function, duration]);
        if (!this.is_running) {
            this.run();
        }
    };
    EventQueue.prototype.processQueue = function () {
        var _this = this;
        var item = this.event_queue.shift();
        if (item == undefined) {
            this.is_running = false;
            return;
        }
        var event_function = item[0];
        var is_success = event_function();
        var duration = is_success ? item[1] : 0;
        this.timer = window.setTimeout(function () {
            _this.processQueue();
        }, duration);
    };
    return EventQueue;
}());
var HtmlView = (function () {
    function HtmlView(client) {
        this.event_queue = new EventQueue();
        this.session = null;
        this.prev_session = null;
        this.prev_step = -1;
        this.clicked_card_id = -1;
        this.deck_maker = new deck_maker_1.DeckMaker();
        this.deck_char_view = null;
        this.deck_cards_view = null;
        this.clicked_field = [-1, -1];
        this.cards_view = null;
        this.back_button_view = null;
        this.reset_button_view = null;
        this.board_view = null;
        this.landmarks_view = null;
        this.field_card_view = null;
        this.card_widget_view = null;
        this.dice_widget_view = null;
        this.money_motion_view = null;
        this.message_view = null;
        this.chat_button_view = null;
        this.buttons_view = null;
        this.watchers_view = null;
        this.scene = Scene.None;
        this.live_session_ids = [];
        this.dice_roll_view = null; // TODO: try not to use it.
        this.client = client;
        this.reset();
    }
    HtmlView.prototype.reset = function () {
        var _this = this;
        this.client.reset();
        this.resetGame();
        this.client.startCheckLive(function (response) {
            _this.onLiveSessionsUpdated(response);
        });
    };
    HtmlView.prototype.resetGame = function () {
        this.session = null;
        this.prev_session = null;
        this.prev_step = -1;
        this.clicked_field = [-1, -1];
        if (this.dice_roll_view) {
            this.dice_roll_view.remove();
            this.dice_roll_view = null;
        }
        this.event_queue.reset();
    };
    HtmlView.prototype.resetViews = function () {
        this.buttons_view.reset();
        this.cards_view.reset();
        this.landmarks_view.reset();
    };
    HtmlView.prototype.readyGame = function () {
        this.resetGame();
        this.switchScene(Scene.Matching);
    };
    HtmlView.prototype.initView = function (row, column) {
        var _this = this;
        if (row === void 0) { row = 5; }
        if (column === void 0) { column = 12; }
        document.getElementById("widgets").style.display = "none";
        var NAMES = ["コロまる", "ごましお", "グラ", "ヂータ", "エル", "茜", "ベリー", "兼石", "ハルカ"];
        var name_index = Math.floor(Math.random() * NAMES.length);
        document.getElementById("matching_name").value = NAMES[name_index];
        // Add click listeners.
        // Matching.
        document.getElementById("matching_button_deck").addEventListener("click", function () { _this.switchScene(Scene.Deck); });
        document.getElementById("matching_button_offline_2").addEventListener("click", function () { _this.onClickMatching(protocol_1.GameMode.OffLine_2); });
        document.getElementById("matching_button_offline_3").addEventListener("click", function () { _this.onClickMatching(protocol_1.GameMode.OffLine_3); });
        document.getElementById("matching_button_offline_4").addEventListener("click", function () { _this.onClickMatching(protocol_1.GameMode.OffLine_4); });
        document.getElementById("matching_button_online_2").addEventListener("click", function () { _this.onClickMatching(protocol_1.GameMode.OnLineSingle_2); });
        document.getElementById("matching_button_online_3").addEventListener("click", function () { _this.onClickMatching(protocol_1.GameMode.OnLineSingle_3); });
        document.getElementById("matching_button_online_4").addEventListener("click", function () { _this.onClickMatching(protocol_1.GameMode.OnLineSingle_4); });
        document.getElementById("matching_button_multi_2").addEventListener("click", function () { _this.onClickMatching(protocol_1.GameMode.OnLine2Players); });
        // 3 and 4 players are not supported yet.
        // document.getElementById("matching_button_multi_3").addEventListener(
        //     "click", () => { this.onClickMatching(GameMode.OnLine2Players); });
        // document.getElementById("matching_button_multi_4").addEventListener(
        //     "click", () => { this.onClickMatching(GameMode.OnLine2Players); });
        document.getElementById("matching_button_watch_1").addEventListener("click", function () { _this.onClickWatch(0); });
        document.getElementById("matching_button_watch_2").addEventListener("click", function () { _this.onClickWatch(1); });
        document.getElementById("matching_button_watch_3").addEventListener("click", function () { _this.onClickWatch(2); });
        document.getElementById("matching_button_offline_2_matching").addEventListener("click", function () { _this.onClickMatching(protocol_1.GameMode.OffLine_2_Matching); });
        this.client.startCheckLive(function (response) {
            _this.onLiveSessionsUpdated(response);
        });
        // Widgets
        this.card_widget_view = new html_view_parts_1.HtmlCardWidgetView("card_widget");
        this.dice_widget_view = new html_view_parts_1.HtmlDiceView("dice_widget");
        // Chat
        this.chat_button_view = new html_view_parts_1.HtmlChatButtonView("chat", "stamp_box");
        this.chat_button_view.callback = function (index) {
            _this.onClickStamp(index);
        };
        // watchers.
        this.watchers_view = new html_view_parts_1.HtmlViewObject(document.getElementById("watchers"));
        // buttons.
        this.back_button_view = new html_view_parts_1.HtmlViewObject(document.getElementById("back"));
        this.back_button_view.addClickListener(function () { _this.switchScene(Scene.Home); });
        this.reset_button_view = new html_view_parts_1.HtmlViewObject(document.getElementById("reset"));
        this.reset_button_view.addClickListener(function () { _this.onResetGame(); });
        this.buttons_view = new html_view_parts_1.HtmlButtonsView("buttons", this.dice_widget_view);
        this.buttons_view.dice1.addClickListener(function () { _this.onClickDice(1, 0); });
        this.buttons_view.dice2.addClickListener(function () { _this.onClickDice(2, 0); });
        this.buttons_view.char_card.callback = function (is_open) {
            _this.onClickCharCardButton(is_open);
        };
        this.buttons_view.end_turn.addClickListener(function () { _this.onClickEndTurn(); });
        // Message view.
        this.message_view = new html_view_parts_1.HtmlMessageView("message");
        // HtmlPlayersView
        this.players_view = new html_view_parts_1.HtmlPlayersView("players");
        // Board
        this.board_view = new html_view_parts_1.HtmlBoardView("board", row, column);
        this.board_view.callback = function (x, y) {
            _this.onClickField(x, y);
        };
        // HtmlDeckCharView
        this.deck_char_view = new html_view_parts_1.HtmlDeckCharView("deck_char");
        this.deck_char_view.callback = function (x) {
            _this.onClickDeckField(x, -1);
        };
        var deck_cards_size = 10;
        this.deck_cards_view = new html_view_parts_1.HtmlDeckCardsView("deck_cards");
        this.deck_cards_view.callback = function (data_id) { _this.onClickDeckCard(data_id); };
        // HtmlCardsView
        this.cards_view = new html_view_parts_1.HtmlCardsView("card_0");
        // Landmark cards
        this.landmarks_view = new html_view_parts_1.HtmlCardsView("landmark");
        // Field card
        this.field_card_view = new html_view_parts_1.HtmlCardWidgetView("field_card");
        // Money motion
        this.money_motion_view = new html_view_parts_1.HtmlViewObject(document.getElementById("money_motion"));
        this.switchScene(Scene.Home);
    };
    HtmlView.prototype.resetMatchingButtons = function () {
        // Reset states.
        for (var i = 1; i <= 3; i++) {
            var element = document.getElementById("matching_button_watch_" + i);
            element.innerText = "準備中";
            element.classList.add("inactive");
        }
        document.getElementById("matching_button_multi_2").classList.remove("promote");
        document.getElementById("matching_button_multi_3").classList.remove("promote");
        document.getElementById("matching_button_multi_3").classList.add("inactive");
        document.getElementById("matching_button_multi_4").classList.remove("promote");
        document.getElementById("matching_button_multi_4").classList.add("inactive");
        document.getElementById("matching_button_watch_1").classList.add("inactive");
    };
    HtmlView.prototype.switchScene = function (scene) {
        var _this = this;
        if (this.scene === scene) {
            return;
        }
        this.scene = scene;
        // Hide all
        document.getElementById("home").style.display = "none";
        document.getElementById("matching").style.display = "none";
        this.resetMatchingButtons();
        this.resetBoard();
        this.back_button_view.none();
        this.players_view.none();
        this.message_view.none();
        this.board_view.none();
        this.deck_char_view.none();
        this.deck_cards_view.none();
        this.chat_button_view.none();
        this.watchers_view.none();
        this.buttons_view.none();
        this.landmarks_view.none();
        this.reset_button_view.none();
        document.body.classList.remove("evening");
        this.cards_view.none();
        this.field_card_view.none();
        this.resetViews();
        if (scene === Scene.Home) {
            document.getElementById("home").style.display = "";
            this.client.startCheckLive(function (response) {
                _this.onLiveSessionsUpdated(response);
            });
            return;
        }
        if (scene === Scene.Deck) {
            this.back_button_view.show();
            this.board_view.show();
            this.deck_char_view.show();
            this.drawDeckBoard();
            this.deck_cards_view.show();
            return;
        }
        if (scene === Scene.Matching) {
            document.getElementById("matching").style.display = "";
            this.drawMatchingMessage(this.client.mode);
            this.message_view.show();
            this.reset_button_view.show();
        }
        if (scene === Scene.Game) {
            if (this.client.mode === protocol_1.GameMode.OffLine_2_Matching) {
                document.body.classList.add("evening");
            }
            // Show components for game.
            this.message_view.show();
            this.board_view.show();
            this.board_view.clearEffects();
            if (this.session != null) {
                this.drawSession(this.session);
            }
            this.landmarks_view.show();
            if (protocol_1.Protocol.getPlayerCount(this.client.mode) < 2) {
                this.reset_button_view.show();
            }
            this.chat_button_view.show();
            return;
        }
    };
    HtmlView.prototype.onResetGame = function () {
        var mode = this.client.mode;
        this.client.quit();
        this.reset();
        if (mode === protocol_1.GameMode.OffLine_2_Matching) {
            this.switchScene(Scene.Matching);
            return;
        }
        this.switchScene(Scene.Home);
    };
    HtmlView.prototype.onClickPlayer = function (target_player_id) {
        if (this.session.getPhase() !== session_1.Phase.FacilityActionWithInteraction) {
            return;
        }
        var target_facilities = this.session.getTargetFacilities();
        if (target_facilities.length === 0) {
            return;
        }
        var card_id = target_facilities[0];
        this.client.sendRequest(this.client.createInteractQuery(card_id, target_player_id));
    };
    HtmlView.prototype.onClickDeckField = function (x, y) {
        var _a = this.clicked_field, px = _a[0], py = _a[1];
        if (px === -1) {
            // this.clicked_filed was not used. Do nothing.
        }
        else if (py === -1) {
            this.deck_char_view.setHighlight(px, false);
        }
        else {
            this.board_view.setClickable(this.clicked_field, false);
        }
        this.clicked_field = [x, y];
        if (px === x && py === y) {
            if (py === -1) {
                this.deck_maker.removeCharacter(x);
            }
            else {
                this.deck_maker.removeFacility(x, y);
            }
            this.drawDeckBoard();
            return;
        }
        if (y === -1) {
            this.deck_char_view.setHighlight(x, true);
            var data_ids = facility_1.CardData.getAvailableCharacters();
            this.deck_cards_view.draw(data_ids);
        }
        else {
            this.board_view.setClickable(this.clicked_field, true);
            var data_ids = this.deck_maker.getAvailableFacilities(x);
            this.deck_cards_view.draw(data_ids);
        }
    };
    HtmlView.prototype.onClickField = function (x, y) {
        var _this = this;
        console.log("clicked: field_" + x + "_" + y);
        if (this.scene === Scene.Home || this.scene === Scene.Matching) {
            return;
        }
        if (this.scene === Scene.Deck) {
            this.onClickDeckField(x, y);
            return;
        }
        // Event on game (this.scene === Scene.Game).
        if (this.clicked_card_id === -1) {
            this.drawFieldInfo(x, y);
            return;
        }
        var query = this.client.createBuildQuery(x, y, this.clicked_card_id);
        var event = this.session.getEventBuildCommand(query);
        if (event == null || !event.valid) {
            return;
        }
        this.client.sendRequest(query);
        this.event_queue.addEvent(function () {
            _this.buttons_view.hide(); // for the turn end button.
            var field = "click_" + x + "_" + y;
            if (_this.session.isLandmark(_this.clicked_card_id)) {
                _this.landmarks_view.useCard(_this.clicked_card_id, field);
            }
            else {
                _this.cards_view.useCard(_this.clicked_card_id, field);
            }
            _this.resetCardsClickable();
            return true;
        }, 1000);
    };
    HtmlView.prototype.showStamp = function (stamp_id, player_id) {
        var element_id = "watchers";
        if (player_id !== -1) {
            element_id = this.players_view.players[player_id].element.id;
        }
        this.chat_button_view.showStampAt(stamp_id, element_id);
    };
    HtmlView.prototype.onClickStamp = function (index) {
        this.showStamp(index, this.client.player_id);
        this.client.sendRequest(this.client.createChatQuery(index));
    };
    HtmlView.prototype.updateChat = function (chat) {
        if (chat.user_id === this.client.user_id) {
            return;
        }
        var player_id = this.session.getPlayerId(chat.user_id);
        this.showStamp(chat.stamp_id, player_id);
    };
    HtmlView.prototype.isRequestReady = function () {
        // TODO: Create a function in Session.
        return (this.session.getStep() === this.prev_session.getStep() &&
            this.client.player_id === this.session.getCurrentPlayerId());
    };
    HtmlView.prototype.onClickDice = function (dice_num, aim) {
        var _this = this;
        if (!this.isRequestReady()) {
            return;
        }
        // Reset character cards.
        this.cards_view.resetClickable();
        this.client.sendRequest(this.client.createDiceQuery(dice_num, aim));
        this.event_queue.addEvent(function () {
            var dice_view = (dice_num === 1) ? _this.buttons_view.dice1 : _this.buttons_view.dice2;
            dice_view.hide();
            _this.buttons_view.hide();
            // TODO: Make prependDuration to check the response from the server.
            _this.effectDiceMove(dice_view, "board");
            return true;
        }, 1000);
    };
    HtmlView.prototype.onClickCharCardButton = function (is_open) {
        var _this = this;
        if (is_open) {
            this.buttons_view.hideDices();
        }
        else {
            this.buttons_view.showDices();
        }
        this.dialogSelectCharCard(is_open, function (card_id) {
            _this.processCharCard(card_id);
        });
    };
    HtmlView.prototype.processFacilityCard = function (card_id) {
        this.clicked_card_id = card_id;
        var facility = this.session.getFacility(card_id);
        if (facility.type === facility_1.FacilityType.Gray) {
            this.processLandmark(card_id);
            return;
        }
        this.drawBoard(this.session);
        if (this.session.getPhase() === session_1.Phase.BuildFacility) {
            for (var _i = 0, _a = facility.getArea(); _i < _a.length; _i++) {
                var area = _a[_i];
                var x = area - 1;
                for (var y = 0; y < 5; ++y) {
                    var query = this.client.createBuildQuery(x, y, card_id);
                    var event_1 = this.session.getEventBuildCommand(query);
                    if (event_1 && event_1.valid) {
                        this.board_view.setClickable([x, y], true);
                        this.board_view.showCost([x, y], event_1.moneys[this.client.player_id]);
                    }
                }
            }
        }
    };
    HtmlView.prototype.processLandmark = function (card_id) {
        if (this.session.getPhase() !== session_1.Phase.BuildFacility) {
            return;
        }
        if (this.session.getOwnerId(card_id) !== -1) {
            return;
        }
        this.drawBoard(this.session);
        this.board_view.setClickable(this.session.getPosition(card_id), true);
    };
    HtmlView.prototype.processCharCard = function (card_id) {
        var _this = this;
        var character = this.session.getCharacter(card_id);
        if (character.type === facility_1.CharacterType.MoveMoney) {
            this.event_queue.addEvent(function () {
                // TODO: Hide the card after its event.
                _this.effectCharacter(_this.client.player_id, card_id);
                return true;
            }, 2000);
            this.dialogSelectPlayer(function (selected_pid) {
                _this.client.sendRequest(_this.client.createCharacterQuery(card_id, selected_pid));
            });
        }
        else if (character.type === facility_1.CharacterType.Close &&
            character.property["type"] === facility_1.SelectType.Facility) {
            this.event_queue.addEvent(function () {
                _this.effectCharacter(_this.client.player_id, card_id);
                return true;
            }, 2000);
            this.dialogSelectFacilityPosition(function (_a) {
                var x = _a[0], y = _a[1];
                var target_card_id = _this.session.getCardIdOnBoard(x, y);
                _this.client.sendRequest(_this.client.createCharacterWithCardIdQuery(card_id, target_card_id));
            });
        }
        else if (character.type === facility_1.CharacterType.Boost &&
            character.property["type"] === facility_1.SelectType.Facility) {
            this.event_queue.addEvent(function () {
                _this.effectCharacter(_this.client.player_id, card_id);
                return true;
            }, 2000);
            this.dialogSelectFacilityPosition(function (_a) {
                var x = _a[0], y = _a[1];
                var target_card_id = _this.session.getCardIdOnBoard(x, y);
                _this.client.sendRequest(_this.client.createCharacterWithCardIdQuery(card_id, target_card_id));
            });
        }
        else if (character.type === facility_1.CharacterType.Boost &&
            character.property["boost"] < 0) {
            this.event_queue.addEvent(function () {
                _this.effectCharacter(_this.client.player_id, card_id);
                return true;
            }, 2000);
            this.dialogSelectPlayer(function (player_id) {
                _this.client.sendRequest(_this.client.createCharacterQuery(card_id, player_id));
            });
        }
        else {
            this.client.sendRequest(this.client.createCharacterQuery(card_id));
            this.event_queue.addEvent(function () {
                _this.effectCharacter(_this.client.player_id, card_id);
                return true;
            }, 2000);
        }
    };
    HtmlView.prototype.onClickEndTurn = function () {
        var _this = this;
        this.client.sendRequest(this.client.createEndTurnQuery());
        this.event_queue.addEvent(function () {
            _this.drawBoard(_this.session);
            _this.resetCardsClickable();
            _this.buttons_view.hide();
            return true;
        }, 500);
    };
    HtmlView.prototype.onClickMatching = function (mode) {
        var name = document.getElementById("matching_name").value;
        if (name.length === 0) {
            return;
        }
        var deck = document.getElementById("deck").value;
        this.client.matching(this.client.createMatchingQuery(name, mode, deck));
        this.switchScene(Scene.Matching);
    };
    HtmlView.prototype.onLiveSessionsUpdated = function (response) {
        this.resetMatchingButtons();
        // Reset states.
        for (var i = 1; i <= 3; i++) {
            var element = document.getElementById("matching_button_watch_" + i);
            element.innerText = "準備中";
            element.classList.add("inactive");
        }
        document.getElementById("matching_button_multi_2").classList.remove("promote");
        if (response == null) {
            return;
        }
        // TODO: session_info should be a class instance.
        var live_dict = JSON.parse(response);
        var keys = Object.keys(live_dict);
        // Update states.
        var index = 1;
        this.live_session_ids = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var matching_info = live_dict[key];
            if (matching_info.is_matched) {
                if (index > 3) {
                    continue;
                }
                this.live_session_ids.push(matching_info.session_id);
                var element = document.getElementById("matching_button_watch_" + index);
                element.innerText = protocol_1.Protocol.getGameModeName(matching_info.mode);
                element.classList.remove("inactive");
                index++;
            }
            else if (matching_info.mode === protocol_1.GameMode.OnLine2Players) {
                document.getElementById("matching_button_multi_2").classList.add("promote");
            }
        }
    };
    HtmlView.prototype.onClickWatch = function (index) {
        if (index >= this.live_session_ids.length) {
            return;
        }
        this.switchScene(Scene.Matching);
        this.message_view.drawMessage("通信中です", this.getPlayerColor(this.client.player_id));
        this.client.watchGame(this.live_session_ids[index]);
    };
    HtmlView.prototype.onClickDeckCard = function (data_id) {
        // Event on matching.
        if (this.scene !== Scene.Deck) {
            return;
        }
        var _a = this.clicked_field, x = _a[0], y = _a[1];
        if (x === -1) {
            // this.clicked_field was not used. Do nothing.
        }
        else if (y === -1) {
            // Char
            this.deck_maker.setCharacter(x, data_id);
        }
        else {
            this.deck_maker.setFacility(x, y, data_id);
        }
        this.drawDeckBoard();
    };
    HtmlView.prototype.getPlayerColor = function (player_id) {
        if (player_id === -1 || player_id > COLOR_PLAYERS.length) {
            return COLOR_FIELD;
        }
        return COLOR_PLAYERS[player_id];
    };
    HtmlView.prototype.getFacilityColor = function (facility) {
        if (!facility) {
            return COLOR_FIELD;
        }
        var type = facility.type;
        switch (type) {
            case facility_1.FacilityType.Gray:
                return COLOR_GRAY;
            case facility_1.FacilityType.Blue:
                return COLOR_BLUE;
            case facility_1.FacilityType.Green:
                return COLOR_GREEN;
            case facility_1.FacilityType.Red:
                return COLOR_RED;
            case facility_1.FacilityType.Purple:
                return COLOR_PURPLE;
        }
    };
    HtmlView.prototype.getDiceEffectsMessage = function (effects) {
        var messages = [];
        if (effects.num !== types_1.DiceNum.Any) {
            messages.push(effects.num + "\u500B\u9650\u5B9A");
        }
        if (effects.delta !== 0) {
            var unit = (effects.delta > 0) ? "+" : "";
            messages.push("" + unit + effects.delta);
        }
        if (effects.even_odd !== types_1.DiceEvenOdd.Any) {
            messages.push((effects.even_odd === types_1.DiceEvenOdd.Even) ? "偶数のみ" : "奇数のみ");
        }
        if (messages.length === 0) {
            return "";
        }
        return "(" + messages.join(" ") + ")";
    };
    HtmlView.prototype.getDiceDeltaMessage = function (delta) {
        if (delta === 0) {
            return "";
        }
        var unit = (delta > 0) ? "+" : "";
        return "(" + unit + delta + ")";
    };
    HtmlView.prototype.getDiceResultMessage = function (dice, pid) {
        var faces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        var d1 = dice.dice1;
        var d2 = dice.dice2;
        var delta = this.getDiceDeltaMessage(dice.delta);
        var name = this.session.getPlayer(pid).name;
        return name + " \u306E\u30B5\u30A4\u30B3\u30ED\u306F " + faces[d1] + " " + faces[d2] + " " + delta + ": " + dice.result() + " \u3067\u3057\u305F\u3002";
    };
    HtmlView.prototype.resetCardsClickable = function () {
        this.clicked_card_id = -1;
        this.cards_view.resetClickable();
        this.landmarks_view.resetClickable();
    };
    HtmlView.prototype.updateView = function (session, player_id) {
        if (this.scene === Scene.Matching) {
            this.session = session;
            this.prev_step = session.getStep() - 1;
            this.prev_session = session;
            this.switchScene(Scene.Game);
            return;
        }
        if (this.scene !== Scene.Game) {
            return;
        }
        this.session = session;
        // Show event animations.
        this.drawEvents();
    };
    HtmlView.prototype.announce = function (announce) {
        this.message_view.drawMessage(announce);
    };
    HtmlView.prototype.drawMatchingMessage = function (mode) {
        var message;
        if (protocol_1.Protocol.isOnlineMode(mode)) {
            if (protocol_1.Protocol.getPlayerCount(mode) > 1) {
                message = "対戦相手を待っています";
            }
            else {
                message = "通信中です";
            }
        }
        else {
            message = "準備中です";
        }
        this.message_view.drawMessage(message, this.getPlayerColor(this.client.player_id));
    };
    HtmlView.prototype.drawCards = function (session) {
        var players = session.getPlayers();
        var landmark_ids = session.getLandmarks();
        // Promote landmark cards if landmark is affordable.
        var money = session.getCurrentPlayer().getMoney();
        var landmark_cost = session.getFacility(landmark_ids[0]).getCost();
        if (session.getPhase() === session_1.Phase.BuildFacility &&
            session.getCurrentPlayerId() === this.client.player_id &&
            money >= landmark_cost) {
            this.cards_view.y_offset = 150;
            this.landmarks_view.y_offset = -150;
        }
        else {
            this.cards_view.y_offset = 0;
            this.landmarks_view.y_offset = 0;
        }
        // Update cards.
        if (this.client.player_id !== -1) {
            var card_ids = session.getSortedHand(this.client.player_id);
            this.cards_view.draw(session, card_ids);
        }
        // Update landmarks.
        this.landmarks_view.show();
        this.landmarks_view.draw(session, landmark_ids);
        this.resetCardsClickable(); // Nice to check if built or not?
    };
    HtmlView.prototype.drawFieldInfo = function (x, y) {
        var card_id = this.session.getCardIdOnBoard(x, y);
        if (card_id === -1) {
            this.field_card_view.setDataId(-1);
            this.field_card_view.none();
            return;
        }
        var data_id = this.session.getCardDataId(card_id);
        if (data_id === -1 || data_id === this.field_card_view.getDataId()) {
            this.field_card_view.setDataId(-1);
            this.field_card_view.none();
            return;
        }
        this.field_card_view.setDataId(data_id);
        this.field_card_view.showAt(this.getPosition((x < 6) ? "click_10_1" : "click_0_1"));
    };
    HtmlView.prototype.resetBoard = function () {
        // TODO: Do more efficient way.
        this.drawBoard(new session_1.Session(-1));
    };
    HtmlView.prototype.drawBoard = function (session) {
        this.board_view.clearEffects();
        var board = session.getBoard();
        for (var y = 0; y < board.row; ++y) {
            for (var x = 0; x < board.column; ++x) {
                var facility_id = board.getRawCardId(x, y);
                var owner_id = session.getOwnerId(facility_id);
                var facility = (facility_id < 0) ? null : session.getFacility(facility_id);
                this.drawField(x, y, facility_id, facility, owner_id);
            }
        }
        this.drawFacilityValues(session, this.client.player_id);
        if (session.getCurrentPlayerId() === this.client.player_id &&
            session.getPhase() === session_1.Phase.FacilityActionWithInteraction &&
            session.getTargetFacilities().length > 0) {
            var facility_id = session.getTargetFacilities()[0];
            var _a = session.getPosition(facility_id), x = _a[0], y = _a[1];
            this.board_view.setHighlight([x, y], COLOR_CLICKABLE);
        }
    };
    HtmlView.prototype.drawFacilityValues = function (session, player_id) {
        if (player_id === -1) {
            player_id = session.getCurrentPlayerId();
        }
        this.board_view.clearEffects();
        var board = session.getBoard();
        for (var y = 0; y < board.row; ++y) {
            for (var x = 0; x < board.column; ++x) {
                var card_id = board.getRawCardId(x, y);
                if (card_id < 0) {
                    continue;
                }
                var event_2 = session.getEventFacilityAction(player_id, card_id);
                if (event_2.type === session_1.EventType.Interaction) {
                    // TODO: Should be able to select other players.
                    var target_id = (player_id === 0) ? 1 : 0;
                    event_2 = session.getEventInteractCommand(this.client.createInteractQuery(event_2.card_id, target_id));
                }
                var money = event_2.moneys[player_id];
                if (money !== 0) {
                    this.board_view.showCost([x, y], money);
                }
            }
        }
    };
    HtmlView.prototype.drawDeckBoard = function () {
        this.board_view.clearEffects();
        var board = this.deck_maker.board;
        for (var y_1 = 0; y_1 < board.row; ++y_1) {
            for (var x_1 = 0; x_1 < board.column; ++x_1) {
                var facility_id = board.getRawCardId(x_1, y_1);
                var owner_id = 0;
                var facility = (facility_id < 0) ? null : this.deck_maker.getFacility(facility_id);
                this.drawField(x_1, y_1, facility_id, facility, owner_id);
            }
        }
        for (var x_2 = 0; x_2 < 5; ++x_2) {
            this.deck_char_view.drawCharacter(x_2, this.deck_maker.getCharacter(x_2));
        }
        var _a = this.clicked_field, x = _a[0], y = _a[1];
        if (y !== -1) {
            this.board_view.setClickable(this.clicked_field, true);
        }
        document.getElementById("deck").innerText =
            JSON.stringify(this.deck_maker.getDeck());
    };
    HtmlView.prototype.drawField = function (x, y, facility_id, facility, owner_id) {
        var field = document.getElementById("field_" + x + "_" + y);
        field.colSpan = 1;
        field.style.display = "";
        if (facility_id === -1) {
            field.innerText = "";
            field.style.backgroundColor = COLOR_FIELD;
            field.style.borderColor = COLOR_FIELD;
            return;
        }
        if (facility_id === -2) {
            field.style.display = "none";
            return;
        }
        // (ownder_id === -1) means a prebuild landmark.
        var owner_color = (owner_id === -1) ? COLOR_LANDMARK : this.getPlayerColor(owner_id);
        field.innerText = facility.getName();
        if (!facility.is_open) {
            field.innerText += "💤";
        }
        field.style.display = "";
        field.style.backgroundColor = owner_color;
        field.style.borderColor = this.getFacilityColor(facility);
        field.colSpan = facility.size;
    };
    HtmlView.prototype.drawStatusMessage = function (session) {
        var players = session.getPlayers();
        var player_id = session.getCurrentPlayerId();
        // Update message.
        var current_player = players[player_id];
        var name = current_player.name;
        var phase = session.getPhase();
        var message = "";
        var color = this.getPlayerColor(player_id);
        if (phase === session_1.Phase.StartGame) {
            message = "マッチング中です";
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === session_1.Phase.CharacterCard) {
            var effects = this.getDiceEffectsMessage(session.getDiceEffects());
            message = name + " \u306E\u30AD\u30E3\u30E9\u30AB\u30FC\u30C9\u307E\u305F\u306F\u30B5\u30A4\u30B3\u30ED" + effects + "\u3067\u3059";
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === session_1.Phase.DiceRoll) {
            var effects = this.getDiceEffectsMessage(session.getDiceEffects());
            message = name + " \u306E\u30B5\u30A4\u30B3\u30ED" + effects + "\u3067\u3059";
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === session_1.Phase.BuildFacility) {
            message = name + " \u306E\u5EFA\u8A2D\u3067\u3059";
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === session_1.Phase.EndGame) {
            var events = session.getEvents();
            for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
                var event_3 = events_1[_i];
                if (event_3.type === session_1.EventType.Quit) {
                    message = players[event_3.player_id].name + " \u304C\u5207\u65AD\u3057\u307E\u3057\u305F";
                    this.message_view.drawMessage(message, this.getPlayerColor(event_3.player_id));
                    return true;
                }
            }
            var winner = session.getPlayer(session.getWinner()).name;
            message = name + " \u306E\u52DD\u3061\u3067\u3059";
            this.message_view.drawMessage(message, this.getPlayerColor(session.getWinner()));
            this.reset_button_view.show();
            return true;
        }
        return false;
    };
    HtmlView.prototype.drawWatchers = function (session) {
        var watchers_length = session.getWatchers().length;
        if (watchers_length === 0) {
            this.watchers_view.hide();
            return;
        }
        this.watchers_view.element.innerText = watchers_length + "\u4EBA\u89B3\u6226\u4E2D";
        this.watchers_view.show();
    };
    HtmlView.prototype.drawSession = function (session) {
        var _this = this;
        this.drawStatusMessage(session);
        this.players_view.draw(session);
        this.drawBoard(session);
        this.drawWatchers(session);
        // Update buttons.
        this.buttons_view.draw(session, this.client.player_id);
        this.drawCards(session);
        if (session.getPhase() === session_1.Phase.BuildFacility &&
            session.getCurrentPlayerId() === this.client.player_id) {
            this.dialogSelectFacilityCard(function (card_id) {
                _this.processFacilityCard(card_id);
            });
        }
        this.prev_session = session;
    };
    HtmlView.prototype.drawEvents = function () {
        var _this = this;
        this.event_queue.addEvent(function () {
            if (!_this.drawEventsByStep()) {
                _this.drawSession(_this.session);
                return false;
            }
            _this.drawEvents();
            return true;
        }, 2000);
    };
    HtmlView.prototype.drawEventsByStep = function () {
        var events = this.session.getEvents();
        var step = -1;
        var i = 0;
        for (; i < events.length; ++i) {
            // Skip passed events.
            if (events[i].step > this.prev_step) {
                step = events[i].step;
                break;
            }
        }
        if (step === -1) {
            return false;
        }
        var handled = false;
        for (; i < events.length; ++i) {
            var event_4 = events[i];
            if (event_4.step !== step) {
                if (handled) {
                    break;
                }
                // The previous step does not have handled events. Go to the next step.
                step = event_4.step;
            }
            if (this.drawEvent(event_4)) {
                handled = true;
            }
        }
        this.prev_step = step;
        if (handled) {
            return true;
        }
        return false;
    };
    HtmlView.prototype.drawEvent = function (event) {
        var _this = this;
        // Draw cards
        if (event.type === session_1.EventType.Draw) {
            var current_player = this.prev_session.getPlayer(event.player_id);
            var message = current_player.name + " \u306E\u30BF\u30FC\u30F3\u3067\u3059";
            var color = this.getPlayerColor(event.player_id);
            this.message_view.drawMessage(message, color);
            this.drawFacilityValues(this.prev_session, event.player_id);
            this.effectCardDeals(event.player_id, event.target_card_ids);
            return true;
        }
        // Dice
        if (event.type === session_1.EventType.Dice) {
            if (this.dice_roll_view) {
                var dices = this.dice_roll_view.element.getElementsByClassName("dice");
                var _loop_1 = function (i) {
                    var pip = (i === 0) ? event.dice.dice1 : event.dice.dice2;
                    var dice = dices[i];
                    dice.addEventListener("animationiteration", function () {
                        dice.style.animation = "roll_end" + pip + " " + (0.8 + i / 10) + "s ease-out forwards";
                    });
                };
                for (var i = 0; i < dices.length; ++i) {
                    _loop_1(i);
                }
                window.setTimeout(function () {
                    _this.dice_roll_view.remove();
                    _this.dice_roll_view = null;
                }, 2000);
            }
            var message_1 = this.getDiceResultMessage(event.dice, event.player_id);
            var color_1 = this.getPlayerColor(event.player_id);
            window.setTimeout(function () {
                _this.board_view.animateDiceResult(event.dice.result(), color_1);
                _this.message_view.drawMessage(message_1, color_1);
            }, 1500);
            return true;
        }
        // Character card
        if (event.type === session_1.EventType.Character) {
            var handled = false;
            // Own card's effect was already done.
            if (event.player_id !== this.client.player_id) {
                this.effectCharacter(event.player_id, event.card_id);
                handled = true;
            }
            var type = this.session.getCharacter(event.card_id).type;
            if (type === facility_1.CharacterType.DrawCards) {
                var message = "\u5C71\u672D\u304B\u3089" + event.target_card_ids.length + "\u679A\u30AB\u30FC\u30C9\u3092\u5F15\u304D\u307E\u3057\u305F\u3002";
                var color = this.getPlayerColor(event.player_id);
                this.message_view.drawMessage(message, color);
                this.effectCardDeals(event.player_id, event.target_card_ids);
                handled = true;
            }
            if (type === facility_1.CharacterType.DiceEven) {
                var color = this.getPlayerColor(event.player_id);
                this.message_view.drawMessage("次のサイコロの合計値が偶数になります", color);
                handled = true;
            }
            if (type === facility_1.CharacterType.DiceOdd) {
                var color = this.getPlayerColor(event.player_id);
                this.message_view.drawMessage("次のサイコロの合計値が奇数になります", color);
                handled = true;
            }
            if (type === facility_1.CharacterType.MoveMoney) {
                var _loop_2 = function (pid) {
                    var money = event.moneys[pid];
                    if (money === 0) {
                        return "continue";
                    }
                    var delay = (money > 0) ? 1500 : 500;
                    window.setTimeout(function () {
                        _this.drawMoneyMotion(money, pid, "message");
                    }, delay);
                };
                for (var pid = 0; pid < event.moneys.length; pid++) {
                    _loop_2(pid);
                }
                handled = true;
            }
            this.prev_session.processEventCharacterCommand(event);
            this.drawBoard(this.prev_session); // for open and close
            return handled;
        }
        if (event.type === session_1.EventType.Salary) {
            for (var pid = 0; pid < event.moneys.length; pid++) {
                var money = event.moneys[pid];
                if (money === 0) {
                    continue;
                }
                this.players_view.players[pid].addMoney(money);
                var name_1 = this.session.getPlayer(pid).name;
                var message = name_1 + " \u306B\u7D66\u6599 " + money + " \u304C\u5165\u308A\u307E\u3057\u305F";
                var color = this.getPlayerColor(pid);
                this.message_view.drawMessage(message, color);
            }
            return true;
        }
        if (event.type === session_1.EventType.Open) {
            var _a = this.prev_session.getPosition(event.card_id), x = _a[0], y = _a[1];
            var facility = this.prev_session.getFacility(event.card_id);
            facility.is_open = true;
            var owner_id = this.prev_session.getOwnerId(event.card_id);
            this.drawField(x, y, event.card_id, facility, owner_id);
        }
        if (event.type === session_1.EventType.Build) {
            if (event.card_id === -1) {
                var name_2 = this.prev_session.getPlayer(event.player_id).name;
                var message = name_2 + " \u306F\u4F55\u3082\u5EFA\u8A2D\u3057\u307E\u305B\u3093\u3067\u3057\u305F\u3002";
                var color = this.getPlayerColor(event.player_id);
                this.message_view.drawMessage(message, color);
                this.drawCards(this.prev_session);
                return true;
            }
            // Money motion
            this.drawEventOfMoneyMotion(this.prev_session, event);
            this.prev_session.processEventBuild(event);
            // Draw the board after money motion.
            window.setTimeout(function () {
                _this.drawCards(_this.prev_session);
                _this.drawBoard(_this.prev_session);
            }, 1000);
        }
        var money_motion = [
            session_1.EventType.Blue,
            session_1.EventType.Green,
            session_1.EventType.Red,
            session_1.EventType.Purple,
        ];
        if (money_motion.indexOf(event.type) !== -1) {
            // Money motion
            this.drawEventOfMoneyMotion(this.prev_session, event);
            this.prev_session.processEventFacilityAction(event);
            // For open and close.
            if (event.close) {
                var facility_2 = this.prev_session.getFacility(event.card_id);
                var _b = this.prev_session.getPosition(event.card_id), x_3 = _b[0], y_2 = _b[1];
                var owner_id_1 = this.prev_session.getOwnerId(event.card_id);
                var delay = 1000;
                if ([session_1.EventType.Red, session_1.EventType.Purple].indexOf(event.type) !== -1) {
                    delay += 1000;
                }
                window.setTimeout(function () {
                    _this.drawField(x_3, y_2, event.card_id, facility_2, owner_id_1);
                }, delay);
            }
        }
        if (event.type === session_1.EventType.Interaction) {
            var position = this.session.getPosition(event.card_id);
            this.board_view.setHighlight(position, COLOR_CLICKABLE);
            if (event.player_id === this.client.player_id) {
                this.dialogSelectPlayer(function (selected_pid) {
                    _this.client.sendRequest(_this.client.createInteractQuery(event.card_id, selected_pid));
                });
            }
            else {
                var color = this.getPlayerColor(event.player_id);
                this.message_view.drawMessage("対象プレイヤーを選択中です", color);
            }
        }
        return true;
    };
    HtmlView.prototype.drawEventOfMoneyMotion = function (session, event) {
        var _this = this;
        var _a = (event.position != null) ? event.position : session.getPosition(event.card_id), x = _a[0], y = _a[1];
        var element_id = (event.type === session_1.EventType.Build) ? "click_" + x + "_" + y : "field_" + x + "_" + y;
        // If event.moneys has both positive and negative values,
        // motions for positive values are delayed.
        var delay_value = 0;
        for (var pid = 0; pid < event.moneys.length; pid++) {
            if (event.moneys[pid] < 0) {
                delay_value = 1000;
                break;
            }
        }
        var _loop_3 = function (pid) {
            var money = event.moneys[pid];
            if (money === 0) {
                return "continue";
            }
            var delay = (money > 0) ? 1000 : 0;
            window.setTimeout(function () {
                _this.drawMoneyMotion(money, pid, element_id);
                _this.board_view.setHighlight([x, y], COLOR_CLICKABLE);
                window.setTimeout(function () {
                    _this.board_view.setHighlight([x, y], "transparent");
                }, 1000);
            }, delay);
        };
        for (var pid = 0; pid < event.moneys.length; pid++) {
            _loop_3(pid);
        }
    };
    HtmlView.prototype.dialogSelectFacilityPosition = function (callback) {
        var color = this.getPlayerColor(this.client.player_id);
        this.message_view.drawMessage("対象施設を選択してください", color);
        this.board_view.setFacilitiesClickable(this.session, callback);
    };
    HtmlView.prototype.dialogSelectPlayer = function (callback) {
        var color = this.getPlayerColor(this.client.player_id);
        this.message_view.drawMessage("対象プレイヤーを選択してください", color);
        this.players_view.setClickableForPlayer(this.client.player_id, callback);
    };
    HtmlView.prototype.dialogSelectCharCard = function (is_open, callback) {
        var _this = this;
        if (is_open) {
            var color = this.getPlayerColor(this.client.player_id);
            this.message_view.drawMessage("キャラカードを選択してください", color);
            this.cards_view.setCharCardsClickable(function (card_id) {
                _this.cards_view.useCard(card_id, "board");
                callback(card_id);
                _this.cards_view.resetClickable();
            });
        }
        else {
            this.message_view.revertMessage();
            this.cards_view.resetClickable();
        }
    };
    HtmlView.prototype.dialogSelectFacilityCard = function (callback) {
        this.cards_view.setFacilityCardsClickable(callback);
        this.landmarks_view.setFacilityCardsClickable(callback);
    };
    HtmlView.prototype.drawMoneyMotion = function (money, player_id, element_id) {
        if (money > 0) {
            this.effectMoneyMotion(element_id, "player_" + player_id, money);
        }
        else if (money < 0) {
            this.effectMoneyMotion("player_" + player_id, element_id, -money);
        }
        this.players_view.players[player_id].addMoney(money);
    };
    HtmlView.prototype.getPosition = function (element_id) {
        var rect = document.getElementById(element_id).getBoundingClientRect();
        return [rect.left, rect.top];
    };
    HtmlView.prototype.effectCharacter = function (pid, card_id) {
        var effect_view = null;
        if (this.client.player_id !== pid) {
            this.card_widget_view.setDataId(this.session.getCardDataId(card_id));
            this.effectClonedObjectMove(this.card_widget_view, "player_" + pid, "board");
        }
    };
    HtmlView.prototype.effectDiceMove = function (node, dest_id) {
        var dice_view = node.clone();
        dice_view.element.style.background = "transparent";
        dice_view.showAt(dice_view.getPositionAlignedWithElementId(node.element.id));
        var dices = dice_view.element.getElementsByClassName("dice");
        for (var i = 0; i < dices.length; ++i) {
            dices[i].style.animation = "roll " + (0.8 + i / 10) + "s linear infinite";
        }
        dice_view.animateMoveToElementId(dest_id, 1000);
        this.dice_roll_view = dice_view;
    };
    HtmlView.prototype.effectClonedObjectMove = function (node, id1, id2) {
        var new_view = node.clone();
        new_view.showAt(new_view.getPositionAlignedWithElementId(id1));
        new_view.animateMoveToElementId(id2);
        window.setTimeout(function () { new_view.remove(); }, 1500);
    };
    HtmlView.prototype.effectCardDeals = function (player_id, card_ids) {
        var _this = this;
        if (this.client.player_id !== player_id) {
            return;
        }
        var timeout = 0;
        var _loop_4 = function (card_id) {
            window.setTimeout(function () {
                var data_id = _this.session.getCardDataId(card_id);
                _this.cards_view.addCard(data_id, card_id, "player_" + player_id);
            }, timeout);
            timeout += 500;
        };
        for (var _i = 0, card_ids_1 = card_ids; _i < card_ids_1.length; _i++) {
            var card_id = card_ids_1[_i];
            _loop_4(card_id);
        }
    };
    HtmlView.prototype.effectMoneyMotion = function (element_from, element_to, money) {
        this.money_motion_view.element.innerHTML = "\uD83D\uDCB8 " + money;
        this.effectClonedObjectMove(this.money_motion_view, element_from, element_to);
    };
    return HtmlView;
}());
exports.HtmlView = HtmlView;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var facility_1 = __webpack_require__(0);
var session_1 = __webpack_require__(1);
var types_1 = __webpack_require__(3);
// TODO: Move it to a new file for util.
var COLOR_FIELD = "#FFE082";
var COLOR_LANDMARK = "#B0BEC5";
var COLOR_CLICKABLE = "#FFCA28";
var COLOR_INACTIVE = "#EEEEEE";
var COLOR_HIGHTLIGHT_CARD = "#FFE082";
var COLOR_CHARACTER = "#FFF9C4";
var COLOR_PLAYERS = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];
var COLOR_GRAY = "#B0BEC5";
var COLOR_BLUE = "#90CAF9";
var COLOR_GREEN = "#A5D6A7";
var COLOR_RED = "#EF9A9A";
var COLOR_PURPLE = "#B39DDB";
function getFacilityColor(facility) {
    if (!facility) {
        return COLOR_FIELD;
    }
    var type = facility.type;
    switch (type) {
        case facility_1.FacilityType.Gray:
            return COLOR_GRAY;
        case facility_1.FacilityType.Blue:
            return COLOR_BLUE;
        case facility_1.FacilityType.Green:
            return COLOR_GREEN;
        case facility_1.FacilityType.Red:
            return COLOR_RED;
        case facility_1.FacilityType.Purple:
            return COLOR_PURPLE;
    }
}
function getPlayerColor(player_id) {
    if (player_id === -1 || player_id > COLOR_PLAYERS.length) {
        return COLOR_FIELD;
    }
    return COLOR_PLAYERS[player_id];
}
var Visibility;
(function (Visibility) {
    Visibility[Visibility["Visible"] = 0] = "Visible";
    Visibility[Visibility["Invisible"] = 1] = "Invisible";
    Visibility[Visibility["None"] = 2] = "None";
})(Visibility = exports.Visibility || (exports.Visibility = {}));
var HtmlViewObject = (function () {
    function HtmlViewObject(element) {
        this.element = element;
    }
    HtmlViewObject.prototype.setVisibility = function (visibility) {
        if (visibility === Visibility.Visible) {
            this.element.style.visibility = "inherit";
            this.element.style.display = "";
            return;
        }
        if (visibility === Visibility.Invisible) {
            this.element.style.visibility = "hidden";
            this.element.style.display = "";
            return;
        }
        if (visibility === Visibility.None) {
            this.element.style.display = "none";
            return;
        }
    };
    HtmlViewObject.prototype.isVisible = function () {
        if (this.element.offsetParent == null) {
            return false;
        }
        return true;
    };
    HtmlViewObject.prototype.reset = function () { };
    HtmlViewObject.prototype.show = function () {
        this.setVisibility(Visibility.Visible);
    };
    HtmlViewObject.prototype.hide = function () {
        this.setVisibility(Visibility.Invisible);
    };
    HtmlViewObject.prototype.none = function () {
        this.setVisibility(Visibility.None);
    };
    HtmlViewObject.prototype.clone = function () {
        var new_node = this.element.cloneNode(true);
        var new_element = document.body.appendChild(new_node);
        return new HtmlViewObject(new_element);
    };
    HtmlViewObject.prototype.remove = function () {
        this.element.parentElement.removeChild(this.element);
    };
    HtmlViewObject.prototype.width = function () {
        return this.element.getBoundingClientRect().width;
    };
    HtmlViewObject.prototype.getPosition = function () {
        var rect = this.element.getBoundingClientRect();
        return [rect.left + window.pageXOffset, rect.top + window.pageYOffset];
    };
    HtmlViewObject.prototype.getZIndex = function () {
        return Number(this.element.style.zIndex);
    };
    HtmlViewObject.prototype.setZIndex = function (z) {
        this.element.style.zIndex = String(z);
    };
    HtmlViewObject.prototype.addClickListener = function (callback) {
        this.element.addEventListener("click", callback);
    };
    HtmlViewObject.prototype.showAt = function (_a) {
        var x = _a[0], y = _a[1];
        // The parent element should be relative.
        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.element.style.transitionDuration = "0s";
        this.element.style.transitionTimingFunction = "none";
        this.element.style.transform = "none";
        this.show();
    };
    HtmlViewObject.prototype.showAtElementId = function (element_id) {
        this.show();
        this.showAt(this.getPositionAlignedWithElementId(element_id));
    };
    HtmlViewObject.prototype.moveTo = function (_a) {
        var x = _a[0], y = _a[1];
        if (!this.isVisible()) {
            this.showAt([x, y]);
            return;
        }
        var _b = this.getPosition(), src_x = _b[0], src_y = _b[1];
        if (src_x === 0 && src_y === 0) {
            this.showAt([x, y]);
            return;
        }
        // The parent element should be relative.
        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.element.style.transitionDuration = "1s";
        this.element.style.transitionTimingFunction = "ease";
        this.element.style.transform = "none";
        this.show();
    };
    HtmlViewObject.prototype.moveToElementId = function (element_id) {
        this.moveTo(this.getPositionAlignedWithElementId(element_id));
    };
    HtmlViewObject.prototype.getPositionAligned = function (dst) {
        var src = this.element.getBoundingClientRect();
        var x = dst.left + window.pageXOffset + (dst.width - src.width) / 2;
        var y = dst.top + window.pageYOffset + (dst.height - src.height) / 2;
        return [x, y];
    };
    HtmlViewObject.prototype.getPositionAlignedWithElementId = function (element_id) {
        var rect = document.getElementById(element_id).getBoundingClientRect();
        return this.getPositionAligned(rect);
    };
    HtmlViewObject.prototype.animateMoveToElementId = function (element_id, duration) {
        if (duration === void 0) { duration = 1000; }
        this.animateMoveTo(this.getPositionAlignedWithElementId(element_id), duration);
    };
    HtmlViewObject.prototype.animateMoveTo = function (_a, duration) {
        var x = _a[0], y = _a[1];
        if (duration === void 0) { duration = 1000; }
        var _b = this.getPosition(), from_x = _b[0], from_y = _b[1];
        var diff_x = x - from_x;
        var diff_y = y - from_y;
        this.element.style.visibility = "visible";
        this.element.style.zIndex = "200";
        this.element.style.position = "absolute";
        this.element.style.left = from_x + "px";
        this.element.style.top = from_y + "px";
        this.element.style.transitionDuration = duration / 1000 + "s";
        this.element.style.transitionTimingFunction = "ease";
        this.element.style.transform = "translate(" + diff_x + "px, " + diff_y + "px)";
    };
    return HtmlViewObject;
}());
exports.HtmlViewObject = HtmlViewObject;
var HtmlCardsView = (function (_super) {
    __extends(HtmlCardsView, _super);
    function HtmlCardsView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
        _this.card_id_map = {}; // CardId -> CardDataId
        _this.card_ids = [];
        _this.cards_pool = {};
        _this.y_offset = 0;
        _this.callback = null;
        _this.base_z_index = 10;
        _this.setZIndex(_this.base_z_index);
        return _this;
    }
    HtmlCardsView.prototype.reset = function () {
        this.resetClickable();
        this.card_id_map = {};
        this.card_ids = [];
        var keys = Object.keys(this.cards_pool);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            this.cards_pool[Number(key)].remove();
        }
        this.cards_pool = {};
        this.y_offset = 0;
        _super.prototype.reset.call(this);
    };
    HtmlCardsView.prototype.onClick = function (card_id, data_id) {
        for (var i = 0; i < this.card_ids.length; ++i) {
            this.getCardView(this.card_ids[i]).setZIndex(this.base_z_index + i);
        }
        var card_view = this.getCardView(card_id);
        card_view.setZIndex(this.base_z_index + this.card_ids.length + 1);
        if (this.callback == null) {
            return;
        }
        this.resetPosition();
        this.callback(card_view.card_id);
    };
    HtmlCardsView.prototype.draw = function (session, card_ids) {
        this.show();
        var _a = this.getPosition(), base_x = _a[0], base_y = _a[1];
        // Update card_id_map.
        // TODO: move this to other.
        for (var _i = 0, card_ids_1 = card_ids; _i < card_ids_1.length; _i++) {
            var card_id = card_ids_1[_i];
            this.card_id_map[card_id] = session.getCardDataId(card_id);
            if (session.isLandmark(card_id)) {
                this.getCardView(card_id).setOwnerId(session.getOwnerId(card_id));
            }
        }
        // Removed cards
        for (var _b = 0, _c = this.card_ids; _b < _c.length; _b++) {
            var card_id = _c[_b];
            if (card_ids.indexOf(card_id) === -1) {
                this.getCardView(card_id).none();
            }
        }
        // Added cards
        for (var _d = 0, card_ids_2 = card_ids; _d < card_ids_2.length; _d++) {
            var card_id = card_ids_2[_d];
            if (this.card_ids.indexOf(card_id) === -1) {
                this.getCardView(card_id).showAt([-200, base_y]);
            }
        }
        this.card_ids = card_ids.slice(); // Shallow copy.
        this.resetPosition();
    };
    HtmlCardsView.prototype.resetPosition = function () {
        var num_cards = this.card_ids.length;
        if (num_cards === 0) {
            return;
        }
        var _a = this.getPosition(), base_x = _a[0], base_y = _a[1];
        var base_width = this.width();
        var card_width = this.getCardView(this.card_ids[0]).width();
        var x_delta = (base_width - card_width) / (num_cards - 1);
        x_delta = Math.min(x_delta, card_width);
        for (var i = 0; i < num_cards; ++i) {
            var card_view = this.getCardView(this.card_ids[i]);
            card_view.setZIndex(this.base_z_index + i);
            card_view.moveTo([base_x + x_delta * i, base_y + this.y_offset]);
        }
    };
    HtmlCardsView.prototype.getCardView = function (card_id) {
        var _this = this;
        var card_view = this.cards_pool[card_id];
        if (card_view != undefined) {
            return card_view;
        }
        var base = document.getElementById("card_widget");
        var new_node = base.cloneNode(true);
        var new_element = this.element.appendChild(new_node);
        new_element.id = "card_id_" + card_id;
        var data_id = this.card_id_map[card_id];
        card_view = new HtmlCardView(new_element.id, data_id, card_id);
        card_view.addClickListener(function () { _this.onClick(card_id, data_id); });
        card_view.none();
        card_view.setZIndex(this.base_z_index);
        this.cards_pool[card_id] = card_view;
        return card_view;
    };
    HtmlCardsView.prototype.addCard = function (data_id, card_id, element_id) {
        this.card_id_map[card_id] = data_id;
        this.card_ids.unshift(card_id);
        this.getCardView(card_id).showAtElementId(element_id);
        this.resetPosition();
    };
    HtmlCardsView.prototype.useCard = function (card_id, element_id) {
        var _this = this;
        var index = this.card_ids.indexOf(card_id);
        if (index === -1) {
            return;
        }
        if (!facility_1.CardData.isLandmark(this.card_id_map[card_id])) {
            this.card_ids.splice(index, 1);
        }
        var card_view = this.getCardView(card_id);
        card_view.moveToElementId(element_id);
        window.setTimeout(function () {
            if (!facility_1.CardData.isLandmark(_this.card_id_map[card_id])) {
                card_view.none();
            }
            _this.resetPosition();
        }, 1000);
    };
    HtmlCardsView.prototype.resetClickable = function () {
        for (var i = 0; i < this.card_ids.length; ++i) {
            this.getCardView(this.card_ids[i]).setHighlight(false);
        }
        this.resetPosition();
        this.callback = null;
    };
    HtmlCardsView.prototype.setCharCardsClickable = function (callback) {
        var delay = 0;
        var _loop_1 = function (i) {
            var card = this_1.getCardView(this_1.card_ids[i]);
            if (!facility_1.CardData.isCharacter(card.getDataId())) {
                return "continue";
            }
            var _a = card.getPosition(), x = _a[0], y = _a[1];
            var delta_y = -250;
            window.setTimeout(function () {
                card.moveTo([x, y + delta_y]);
            }, delay);
            delay += 200;
            card.setHighlight(true);
        };
        var this_1 = this;
        for (var i = 0; i < this.card_ids.length; ++i) {
            _loop_1(i);
        }
        this.callback = callback;
    };
    HtmlCardsView.prototype.setFacilityCardsClickable = function (callback) {
        var delay = 0;
        for (var i = 0; i < this.card_ids.length; ++i) {
            var card = this.getCardView(this.card_ids[i]);
            if (facility_1.CardData.isCharacter(card.getDataId())) {
                continue;
            }
            card.setHighlight(true);
        }
        this.callback = callback;
    };
    return HtmlCardsView;
}(HtmlViewObject));
exports.HtmlCardsView = HtmlCardsView;
var HtmlDeckCardsView = (function (_super) {
    __extends(HtmlDeckCardsView, _super);
    function HtmlDeckCardsView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
        _this.cards_pool = {};
        _this.data_ids = [];
        _this.callback = null;
        _this.base_z_index = 10;
        _this.setZIndex(_this.base_z_index);
        return _this;
    }
    HtmlDeckCardsView.prototype.onClick = function (data_id) {
        for (var i = 0; i < this.data_ids.length; ++i) {
            this.getCardView(this.data_ids[i]).setZIndex(this.base_z_index + i);
        }
        var card_view = this.getCardView(data_id);
        card_view.setZIndex(this.base_z_index + this.data_ids.length + 1);
        if (this.callback == null) {
            return;
        }
        this.resetPosition();
        this.callback(data_id);
    };
    HtmlDeckCardsView.prototype.getCardView = function (data_id) {
        var _this = this;
        var card_view = this.cards_pool[data_id];
        if (card_view != undefined) {
            return card_view;
        }
        var base = document.getElementById("card_widget");
        var new_node = base.cloneNode(true);
        var new_element = this.element.appendChild(new_node);
        new_element.id = "card_data_id_" + data_id;
        card_view = new HtmlCardDataView(new_element.id, data_id);
        card_view.addClickListener(function () { _this.onClick(data_id); });
        card_view.none();
        card_view.setZIndex(this.base_z_index);
        this.cards_pool[data_id] = card_view;
        return card_view;
    };
    HtmlDeckCardsView.prototype.draw = function (data_ids) {
        for (var _i = 0, _a = this.data_ids; _i < _a.length; _i++) {
            var data_id = _a[_i];
            if (data_ids.indexOf(data_id) === -1) {
                this.getCardView(data_id).moveTo([-200, 0]);
            }
        }
        for (var _b = 0, data_ids_1 = data_ids; _b < data_ids_1.length; _b++) {
            var data_id = data_ids_1[_b];
            if (this.data_ids.indexOf(data_id) === -1) {
                this.getCardView(data_id).showAt([-200, 0]);
            }
        }
        this.data_ids = data_ids;
        this.resetPosition();
    };
    HtmlDeckCardsView.prototype.resetPosition = function () {
        var cols = 6;
        var num_cards = this.data_ids.length;
        if (num_cards === 0) {
            return;
        }
        var _a = this.getPosition(), base_x = _a[0], base_y = _a[1];
        var base_width = this.width();
        var card_width = this.getCardView(this.data_ids[0]).width();
        var x_delta = (base_width - card_width) / (Math.min(num_cards, cols) - 1);
        x_delta = Math.min(x_delta, card_width);
        for (var i = 0; i < num_cards; ++i) {
            var card_view = this.getCardView(this.data_ids[i]);
            card_view.moveTo([base_x + x_delta * (i % cols), 145 * Math.floor(i / cols)]);
        }
    };
    return HtmlDeckCardsView;
}(HtmlViewObject));
exports.HtmlDeckCardsView = HtmlDeckCardsView;
var HtmlCardBaseView = (function (_super) {
    __extends(HtmlCardBaseView, _super);
    function HtmlCardBaseView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
        _this.data_id = -1;
        _this.owner_id = -1;
        _this.is_highlight = false;
        _this.element_name = _this.element.getElementsByClassName("card_name")[0];
        _this.element_cost = _this.element.getElementsByClassName("card_cost")[0];
        _this.element_description = _this.element.getElementsByClassName("card_description")[0];
        return _this;
    }
    HtmlCardBaseView.prototype.getDataId = function () {
        return this.data_id;
    };
    HtmlCardBaseView.prototype.setDataId = function (data_id) {
        this.data_id = data_id;
        // No card
        if (data_id === -1) {
            this.none();
            return;
        }
        // Character
        if (facility_1.CardData.isCharacter(data_id)) {
            var character = new facility_1.Character(data_id);
            this.setCharacterCard(character);
            return;
        }
        // Landmark
        if (facility_1.CardData.isLandmark(data_id)) {
            var landmark = new facility_1.Facility(data_id);
            var owner_id = -1;
            this.setLandmarkCard(landmark, owner_id);
            return;
        }
        // Facility
        var facility = new facility_1.Facility(data_id);
        this.setFacilityCard(facility);
    };
    HtmlCardBaseView.prototype.setOwnerId = function (owner_id) {
        this.owner_id = owner_id;
        if (owner_id !== -1 && facility_1.CardData.isLandmark(this.data_id)) {
            this.element.style.backgroundColor = getPlayerColor(owner_id);
        }
    };
    HtmlCardBaseView.prototype.setFacilityCard = function (facility) {
        var area = this.getFacilityAreaString(facility);
        this.element_name.innerText = area + " " + facility.getName();
        this.element_cost.innerText = String(facility.getCost());
        this.element_description.innerText = facility.getDescription();
        this.element.style.backgroundColor = getFacilityColor(facility);
    };
    HtmlCardBaseView.prototype.setCharacterCard = function (character) {
        this.element_name.innerText = character.getName();
        this.element_cost.innerText = "";
        this.element_description.innerText = character.getDescription();
        this.element.style.backgroundColor = COLOR_CHARACTER;
    };
    HtmlCardBaseView.prototype.setLandmarkCard = function (landmark, owner_id) {
        this.element_name.innerText = landmark.getName();
        this.element_cost.innerText = String(landmark.getCost());
        this.element_description.innerText = landmark.getDescription();
        if (owner_id === -1) {
            this.element.style.backgroundColor = getFacilityColor(landmark);
        }
        else {
            this.element.style.backgroundColor = getPlayerColor(owner_id);
        }
    };
    HtmlCardBaseView.prototype.setHighlight = function (is_highlight) {
        this.is_highlight = is_highlight;
        this.element.style.borderColor = is_highlight ? COLOR_HIGHTLIGHT_CARD : "#EEEEEE";
    };
    HtmlCardBaseView.prototype.getFacilityAreaString = function (facility) {
        var area_name = ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", ""];
        var area = facility.getArea().map(function (i) {
            if (facility.size === 2) {
                return area_name[i] + "+" + area_name[i + 1];
            }
            return area_name[i];
        }).join(",");
        return area;
    };
    return HtmlCardBaseView;
}(HtmlViewObject));
exports.HtmlCardBaseView = HtmlCardBaseView;
var HtmlCardView = (function (_super) {
    __extends(HtmlCardView, _super);
    function HtmlCardView(element_id, data_id, card_id) {
        var _this = _super.call(this, element_id) || this;
        _this.element_id = element_id;
        _this.card_id = card_id;
        _this.setDataId(data_id);
        return _this;
    }
    return HtmlCardView;
}(HtmlCardBaseView));
exports.HtmlCardView = HtmlCardView;
var HtmlCardWidgetView = (function (_super) {
    __extends(HtmlCardWidgetView, _super);
    function HtmlCardWidgetView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HtmlCardWidgetView;
}(HtmlCardBaseView));
exports.HtmlCardWidgetView = HtmlCardWidgetView;
var HtmlCardDataView = (function (_super) {
    __extends(HtmlCardDataView, _super);
    function HtmlCardDataView(element_id, data_id) {
        var _this = _super.call(this, element_id) || this;
        _this.element_id = element_id;
        _this.setDataId(data_id);
        return _this;
    }
    return HtmlCardDataView;
}(HtmlCardBaseView));
exports.HtmlCardDataView = HtmlCardDataView;
var HtmlPlayersView = (function (_super) {
    __extends(HtmlPlayersView, _super);
    function HtmlPlayersView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
        _this.players = [];
        _this.players_length = 0;
        for (var pid = 0; pid < 4; ++pid) {
            var player_view = new HtmlPlayerView(pid);
            player_view.callback = function (player_id) {
                _this.onClick(player_id);
            };
            _this.players.push(player_view);
        }
        return _this;
    }
    HtmlPlayersView.prototype.onClick = function (player_id) {
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            player.setClickable(false);
        }
        this.callback(player_id);
    };
    HtmlPlayersView.prototype.draw = function (session) {
        var players = session.getPlayers();
        this.players_length = players.length;
        for (var i = 0; i < this.players_length; ++i) {
            this.players[i].draw(session);
        }
        for (var i = this.players_length; i < 4; ++i) {
            this.players[i].hide();
        }
        this.show();
    };
    HtmlPlayersView.prototype.setClickableForPlayer = function (player_id, callback) {
        for (var i = 0; i < this.players_length; ++i) {
            this.players[i].setClickable(player_id !== i);
        }
        this.callback = callback;
    };
    return HtmlPlayersView;
}(HtmlViewObject));
exports.HtmlPlayersView = HtmlPlayersView;
var HtmlPlayerView = (function (_super) {
    __extends(HtmlPlayerView, _super);
    function HtmlPlayerView(player_id) {
        var _this = _super.call(this, document.getElementById("player_" + player_id)) || this;
        _this.money_animation_timer = null;
        _this.money = 0;
        _this.is_clickable = false;
        _this.player_id = player_id;
        _this.element_avatar = _this.element.getElementsByClassName("player_avatar")[0];
        _this.element_name = _this.element.getElementsByClassName("player_name")[0];
        _this.element_money = _this.element.getElementsByClassName("player_money")[0];
        _this.element_salary = _this.element.getElementsByClassName("player_salary")[0];
        _this.element_hand = _this.element.getElementsByClassName("player_hand")[0];
        _this.element_talon = _this.element.getElementsByClassName("player_talon")[0];
        _this.addClickListener(function () { _this.onClick(); });
        return _this;
    }
    HtmlPlayerView.prototype.onClick = function () {
        if (this.is_clickable) {
            this.callback(this.player_id);
        }
    };
    HtmlPlayerView.prototype.draw = function (session) {
        this.show();
        var player = session.getPlayer(this.player_id);
        // Avatar
        var npc_avatars = ["⛄", "👻", "👾", "🗿"];
        var avatar = "😺";
        if (player.isAuto()) {
            avatar = npc_avatars[this.player_id];
        }
        this.element_avatar.innerText = avatar;
        this.element_name.innerText = player.name;
        this.element_salary.innerHTML = String(player.salary);
        var cards = session.getPlayerCards(this.player_id);
        this.element_hand.innerHTML = String(cards.getHandSize());
        this.element_talon.innerHTML = String(cards.getTalonSize());
        this.setMoney(player.getMoney());
    };
    HtmlPlayerView.prototype.setClickable = function (is_clickable) {
        this.is_clickable = is_clickable;
        if (is_clickable) {
            this.element.style.backgroundColor = COLOR_CLICKABLE;
        }
        else {
            this.element.style.backgroundColor = getPlayerColor(this.player_id);
        }
    };
    HtmlPlayerView.prototype.setMoney = function (money) {
        this.money = money;
        this.animateMoney(money);
    };
    HtmlPlayerView.prototype.addMoney = function (delta) {
        this.money += delta;
        this.animateMoney(this.money);
    };
    // TODO: move this logic to HtmlViewObject ?
    HtmlPlayerView.prototype.animateMoney = function (money) {
        var _this = this;
        if (this.money_animation_timer) {
            clearInterval(this.money_animation_timer);
        }
        this.money_animation_timer = setInterval(function () {
            var current_money = Number(_this.element_money.innerText);
            if (current_money === money) {
                clearInterval(_this.money_animation_timer);
                _this.money_animation_timer = null;
                return;
            }
            if (current_money > money) {
                current_money -= Math.min(10, current_money - money);
            }
            else {
                current_money += Math.min(10, money - current_money);
            }
            _this.element_money.innerText = String(current_money);
        }, 5);
    };
    return HtmlPlayerView;
}(HtmlViewObject));
exports.HtmlPlayerView = HtmlPlayerView;
var HtmlMessageView = (function (_super) {
    __extends(HtmlMessageView, _super);
    function HtmlMessageView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.messages = [];
        return _this;
    }
    HtmlMessageView.prototype.drawMessage = function (message, color) {
        if (color === void 0) { color = COLOR_FIELD; }
        this.messages.push([message, color]);
        this.element.innerText = "\uD83C\uDFB2 " + message + " \uD83C\uDFB2";
        this.element.style.backgroundColor = color;
    };
    HtmlMessageView.prototype.revertMessage = function () {
        if (this.messages.length < 2) {
            this.messages = [];
            this.drawMessage("");
            return;
        }
        this.messages.pop();
        var _a = this.messages.pop(), message = _a[0], color = _a[1];
        this.drawMessage(message, color);
    };
    return HtmlMessageView;
}(HtmlViewObject));
exports.HtmlMessageView = HtmlMessageView;
var HtmlBoardView = (function (_super) {
    __extends(HtmlBoardView, _super);
    function HtmlBoardView(element_id, row, column) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.dialogCallback = null;
        _this.clickable_fields = new HtmlClickableFieldsView("click", row, column);
        var _loop_2 = function (y) {
            var _loop_3 = function (x) {
                this_2.clickable_fields.fields[x][y].addClickListener(function () { _this.onClick(x, y); });
            };
            for (var x = 0; x < column; ++x) {
                _loop_3(x);
            }
        };
        var this_2 = this;
        for (var y = 0; y < row; ++y) {
            _loop_2(y);
        }
        return _this;
    }
    HtmlBoardView.prototype.onClick = function (x, y) {
        if (this.dialogCallback != null) {
            if (this.isClickable([x, y])) {
                this.dialogCallback([x, y]);
                this.dialogCallback = null;
            }
        }
        else {
            this.callback(x, y);
        }
    };
    HtmlBoardView.prototype.clearEffects = function () {
        this.clickable_fields.reset();
    };
    HtmlBoardView.prototype.setClickable = function (position, is_clickable) {
        this.clickable_fields.setClickable(position, is_clickable);
    };
    HtmlBoardView.prototype.isClickable = function (position) {
        return this.clickable_fields.isClickable(position);
    };
    HtmlBoardView.prototype.setHighlight = function (position, color) {
        this.clickable_fields.setHighlight(position, color);
    };
    HtmlBoardView.prototype.showCost = function (position, cost) {
        this.clickable_fields.showCost(position, cost);
    };
    HtmlBoardView.prototype.setFacilitiesClickable = function (session, callback) {
        this.clearEffects();
        var board = session.getBoard();
        for (var y = 0; y < board.row; ++y) {
            for (var x = 0; x < board.column; ++x) {
                var facility_id = board.getRawCardId(x, y);
                if (session.isFacility(facility_id)) {
                    this.setClickable([x, y], true);
                }
            }
        }
        this.dialogCallback = callback;
    };
    HtmlBoardView.prototype.animateDiceResult = function (result, color) {
        this.clickable_fields.animateDiceResult(result, color);
    };
    return HtmlBoardView;
}(HtmlViewObject));
exports.HtmlBoardView = HtmlBoardView;
var HtmlClickableFieldsView = (function (_super) {
    __extends(HtmlClickableFieldsView, _super);
    function HtmlClickableFieldsView(element_id, row, column) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.fields = [];
        _this.row = row;
        _this.column = column;
        for (var x = 0; x < column; ++x) {
            _this.fields.push([]);
            for (var y = 0; y < row; ++y) {
                _this.fields[x].push(new HtmlClickableFieldView(element_id + "_" + x + "_" + y));
            }
        }
        return _this;
    }
    HtmlClickableFieldsView.prototype.reset = function () {
        for (var x = 0; x < this.column; ++x) {
            for (var y = 0; y < this.row; ++y) {
                this.fields[x][y].reset();
            }
        }
    };
    HtmlClickableFieldsView.prototype.setClickableAreas = function (areas) {
        for (var _i = 0, areas_1 = areas; _i < areas_1.length; _i++) {
            var area = areas_1[_i];
            var x = area - 1;
            for (var y = 0; y < this.row; ++y) {
                this.fields[x][y].setClickable(true);
            }
        }
    };
    HtmlClickableFieldsView.prototype.setClickable = function (_a, is_clickable) {
        var x = _a[0], y = _a[1];
        this.fields[x][y].setClickable(is_clickable);
    };
    HtmlClickableFieldsView.prototype.isClickable = function (_a) {
        var x = _a[0], y = _a[1];
        return this.fields[x][y].isClickable();
    };
    HtmlClickableFieldsView.prototype.setHighlight = function (_a, color) {
        var x = _a[0], y = _a[1];
        this.fields[x][y].setColor(color);
    };
    HtmlClickableFieldsView.prototype.showCost = function (_a, cost) {
        var x = _a[0], y = _a[1];
        this.fields[x][y].showCost(cost);
    };
    HtmlClickableFieldsView.prototype.animateDiceResult = function (pip, color) {
        var _this = this;
        var x = pip - 1;
        if (x < 0 || 11 < x) {
            return;
        }
        var delay = 0;
        var _loop_4 = function (i) {
            var y = this_3.row - 1 - i;
            window.setTimeout(function () {
                _this.fields[x][y].setColor(color);
                window.setTimeout(function () {
                    _this.fields[x][y].setColor("transparent");
                }, 1500);
            }, delay);
            delay = delay + 10 * i; // 0, 10, 30, 60, 100, ...
        };
        var this_3 = this;
        for (var i = 0; i < this.row; ++i) {
            _loop_4(i);
        }
    };
    return HtmlClickableFieldsView;
}(HtmlViewObject));
exports.HtmlClickableFieldsView = HtmlClickableFieldsView;
var HtmlClickableFieldView = (function (_super) {
    __extends(HtmlClickableFieldView, _super);
    function HtmlClickableFieldView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.is_clickable = false;
        return _this;
    }
    HtmlClickableFieldView.prototype.reset = function () {
        this.element.style.borderColor = "transparent";
        this.element.innerText = "";
        this.is_clickable = false;
    };
    HtmlClickableFieldView.prototype.isClickable = function () {
        return this.is_clickable;
    };
    HtmlClickableFieldView.prototype.setClickable = function (is_clickable) {
        this.is_clickable = is_clickable;
        // TODO: Use class of "clickable".
        this.element.style.borderColor = is_clickable ? COLOR_CLICKABLE : "transparent";
    };
    HtmlClickableFieldView.prototype.setColor = function (color) {
        this.element.style.borderColor = color;
    };
    HtmlClickableFieldView.prototype.showCost = function (cost) {
        this.element.innerText = String(cost);
    };
    return HtmlClickableFieldView;
}(HtmlViewObject));
exports.HtmlClickableFieldView = HtmlClickableFieldView;
var HtmlDeckCharView = (function (_super) {
    __extends(HtmlDeckCharView, _super);
    function HtmlDeckCharView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.fields = [];
        _this.clickables = [];
        var _loop_5 = function (i) {
            var field = new HtmlViewObject(document.getElementById(element_id + "_" + i));
            this_4.fields.push(field);
            var clickable = new HtmlClickableFieldView("clickable_" + element_id + "_" + i);
            this_4.clickables.push(clickable);
            clickable.addClickListener(function () { _this.onClick(i); });
        };
        var this_4 = this;
        for (var i = 0; i < 5; ++i) {
            _loop_5(i);
        }
        return _this;
    }
    HtmlDeckCharView.prototype.onClick = function (i) {
        this.callback(i);
    };
    HtmlDeckCharView.prototype.setHighlight = function (i, highlight) {
        this.clickables[i].setClickable(highlight);
    };
    HtmlDeckCharView.prototype.drawCharacter = function (i, character) {
        var value = "";
        if (character != null) {
            value = character.name;
        }
        this.fields[i].element.innerText = value;
    };
    return HtmlDeckCharView;
}(HtmlViewObject));
exports.HtmlDeckCharView = HtmlDeckCharView;
var HtmlButtonView = (function (_super) {
    __extends(HtmlButtonView, _super);
    function HtmlButtonView(element_id) {
        return _super.call(this, document.getElementById(element_id)) || this;
    }
    HtmlButtonView.prototype.setClickable = function (is_clickable) {
        // TODO: Use class of "clickable".
        this.element.style.backgroundColor = is_clickable ? COLOR_CLICKABLE : COLOR_FIELD;
    };
    return HtmlButtonView;
}(HtmlViewObject));
exports.HtmlButtonView = HtmlButtonView;
var HtmlCharCardButtonView = (function (_super) {
    __extends(HtmlCharCardButtonView, _super);
    function HtmlCharCardButtonView(element_id) {
        var _this = _super.call(this, element_id) || this;
        _this.is_open = false;
        _this.callback = null;
        // TODO: Move this to HtmlButtonView.
        _this.addClickListener(function () { _this.onClick(); });
        return _this;
    }
    HtmlCharCardButtonView.prototype.reset = function () {
        this.is_open = false;
    };
    HtmlCharCardButtonView.prototype.onClick = function () {
        if (this.callback == null) {
            return;
        }
        this.is_open = !this.is_open;
        this.callback(this.is_open);
    };
    // TODO: move this function to other place/class.
    HtmlCharCardButtonView.prototype.hasCharacterCard = function (session, player_id) {
        var cards = session.getSortedHand(player_id);
        return session.isCharacter(cards[cards.length - 1]);
    };
    HtmlCharCardButtonView.prototype.draw = function (session, player_id) {
        if (this.hasCharacterCard(session, player_id)) {
            this.show();
            this.element.classList.remove("inactive");
        }
        else {
            // TODO: show it but keep inactive.
            this.element.classList.add("inactive");
        }
    };
    return HtmlCharCardButtonView;
}(HtmlButtonView));
exports.HtmlCharCardButtonView = HtmlCharCardButtonView;
var HtmlButtonsView = (function (_super) {
    __extends(HtmlButtonsView, _super);
    function HtmlButtonsView(element_id, dice_widget) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
        _this.dice_num = types_1.DiceNum.Any;
        _this.dice1 = new HtmlButtonView(element_id + "_dice1");
        var dice1_1 = dice_widget.clone();
        dice1_1.element.id = "buttons_dice1_1";
        var dice2_1 = dice_widget.clone();
        dice2_1.element.id = "buttons_dice2_1";
        var dice2_2 = dice_widget.clone();
        dice2_2.element.id = "buttons_dice2_2";
        _this.dice2 = new HtmlButtonView(element_id + "_dice2");
        _this.dice1.element.appendChild(dice1_1.element);
        _this.dice2.element.appendChild(dice2_1.element);
        _this.dice2.element.appendChild(dice2_2.element);
        _this.char_card = new HtmlCharCardButtonView(element_id + "_char_card");
        _this.end_turn = new HtmlButtonView(element_id + "_end_turn");
        return _this;
    }
    HtmlButtonsView.prototype.reset = function () {
        this.dice1.reset();
        this.dice2.reset();
        this.char_card.reset();
        this.end_turn.reset();
        _super.prototype.reset.call(this);
    };
    HtmlButtonsView.prototype.hide = function () {
        _super.prototype.hide.call(this);
        this.char_card.reset(); // is_open -> false.
    };
    HtmlButtonsView.prototype.hideDices = function () {
        this.dice1.hide();
        this.dice2.hide();
    };
    HtmlButtonsView.prototype.showDices = function () {
        if (this.dice_num !== types_1.DiceNum.Two) {
            this.dice1.show();
        }
        if (this.dice_num !== types_1.DiceNum.One) {
            this.dice2.show();
        }
    };
    HtmlButtonsView.prototype.draw = function (session, player_id) {
        if (session.getCurrentPlayerId() !== player_id) {
            this.hide();
            return;
        }
        this.dice_num = session.getDiceEffects().num;
        this.hideDices();
        this.char_card.hide();
        this.end_turn.hide();
        var phase = session.getPhase();
        if (phase === session_1.Phase.CharacterCard || phase === session_1.Phase.DiceRoll) {
            this.showDices();
        }
        if (phase === session_1.Phase.CharacterCard) {
            this.char_card.draw(session, player_id);
        }
        if (phase === session_1.Phase.BuildFacility) {
            this.end_turn.show();
        }
        this.show();
    };
    return HtmlButtonsView;
}(HtmlViewObject));
exports.HtmlButtonsView = HtmlButtonsView;
var HtmlDiceView = (function (_super) {
    __extends(HtmlDiceView, _super);
    function HtmlDiceView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
        return _this;
    }
    return HtmlDiceView;
}(HtmlViewObject));
exports.HtmlDiceView = HtmlDiceView;
var HtmlChatButtonView = (function (_super) {
    __extends(HtmlChatButtonView, _super);
    function HtmlChatButtonView(element_id, stamp_box_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
        _this.stamp_box_id = stamp_box_id;
        _this.stamps = [];
        _this.prev_stamps = {};
        _this.is_visible = false;
        _this.callback = null;
        _this.stamp_box = new HtmlViewObject(document.getElementById(stamp_box_id));
        _this.stamp_box.none();
        _this.addClickListener(function () { _this.toggleStampBox(); });
        var stamp_elements = _this.stamp_box.element.getElementsByClassName("stamp");
        var _loop_6 = function (i) {
            var stamp = new HtmlViewObject(stamp_elements[i]);
            stamp.addClickListener(function () {
                if (_this.callback) {
                    _this.callback(i);
                }
                _this.showStampBox(false);
            });
            this_5.stamps.push(stamp);
        };
        var this_5 = this;
        for (var i = 0; i < stamp_elements.length; ++i) {
            _loop_6(i);
        }
        return _this;
    }
    HtmlChatButtonView.prototype.showStampAt = function (index, element_id) {
        var _this = this;
        var stamp = this.stamps[index].clone();
        stamp.show();
        stamp.showAt(stamp.getPositionAlignedWithElementId(element_id));
        window.setTimeout(function () {
            if (_this.prev_stamps[element_id] === stamp) {
                delete _this.prev_stamps[element_id];
            }
            stamp.remove();
        }, 3000);
        var prev_stamp = this.prev_stamps[element_id];
        if (prev_stamp) {
            prev_stamp.none();
        }
        this.prev_stamps[element_id] = stamp;
    };
    HtmlChatButtonView.prototype.toggleStampBox = function () {
        this.showStampBox(!this.is_visible);
    };
    HtmlChatButtonView.prototype.showStampBox = function (is_visible) {
        if (is_visible) {
            this.is_visible = true;
            this.stamp_box.show();
            this.stamp_box.showAt(this.stamp_box.getPositionAlignedWithElementId("board"));
        }
        else {
            this.is_visible = false;
            this.stamp_box.none();
        }
    };
    return HtmlChatButtonView;
}(HtmlViewObject));
exports.HtmlChatButtonView = HtmlChatButtonView;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var standalone_connection_1 = __webpack_require__(5);
var saikoro_1 = __webpack_require__(9);
var delay = 0; // msec
var connection = new standalone_connection_1.StandaloneConnection(delay);
var client = new saikoro_1.WebClient(connection);
document.addEventListener("DOMContentLoaded", function () { client.initBoard(); });


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = __webpack_require__(1);
var facility_1 = __webpack_require__(0);
var auto_play_1 = __webpack_require__(10);
var protocol_1 = __webpack_require__(2);
var storage_1 = __webpack_require__(8);
var Utils = __webpack_require__(4);
var MatchedData = (function () {
    function MatchedData(matching_id, session_id, player_id) {
        if (matching_id === void 0) { matching_id = ""; }
        if (session_id === void 0) { session_id = ""; }
        if (player_id === void 0) { player_id = -1; }
        this.matching_id = matching_id;
        this.session_id = session_id;
        this.player_id = player_id;
    }
    return MatchedData;
}());
exports.MatchedData = MatchedData;
var SessionHandler = (function () {
    function SessionHandler(storage) {
        this.storage = storage;
    }
    SessionHandler.prototype.doNext = function (session) {
        var prev_step = session.getStep();
        for (var i = 0; i < 100; ++i) {
            var cont = session.doNext();
            var new_step = session.getStep();
            if (cont) {
                prev_step = new_step;
                continue;
            }
            if (session.getCurrentPlayer().isAuto()) {
                var query = auto_play_1.AutoPlay.getQuery(session);
                if (query == null) {
                    return false;
                }
                cont = this.processCommand(session, query);
                new_step = session.getStep();
            }
            if (cont) {
                prev_step = new_step;
                continue;
            }
            if (prev_step === new_step) {
                break;
            }
            return true;
        }
        return false;
    };
    SessionHandler.prototype.processUpdateCommand = function (session, query) {
        if (query.step >= session.getStep()) {
            // No update.
            return false;
        }
        return true;
    };
    SessionHandler.prototype.processCommand = function (session, query) {
        if (query.command === "board") {
            return this.processUpdateCommand(session, query);
        }
        else if (query.command === "character") {
            if (session.processCharacterCommand(query)) {
                this.doNext(session);
            }
        }
        else if (query.command === "dice") {
            if (session.processDiceCommand(query)) {
                // TODO: integrate diceRoll and doNext.
                this.doNext(session);
            }
        }
        else if (query.command === "build") {
            if (session.processBuildCommand(query)) {
                // TODO: integrate buildFacility and doNext.
                this.doNext(session);
            }
        }
        else if (query.command === "interact") {
            if (session.processInteractCommand(query)) {
                // TODO: integrate interactFacilityAction and doNext.
                this.doNext(session);
            }
        }
        else if (query.command === "quit") {
            if (session.processQuitCommand(query)) {
                this.doNext(session);
            }
        }
        else if (query.command === "watch") {
            session.processWatchCommand(query);
        }
        return true;
    };
    SessionHandler.prototype.getSessionKey = function (session_id) {
        return "session/session_" + session_id;
    };
    SessionHandler.prototype.getMacthingKey = function (mode) {
        // TODO: rename "memcache" and check the permission.
        return "memcache/matching_" + mode;
    };
    SessionHandler.prototype.handleCommand = function (query) {
        var _this = this;
        var session_id = (query.session_id != undefined) ? Number(query.session_id) : -1;
        var mode = Number(query.mode);
        if (session_id === -1) {
            // Quit from matching.
            if (query.command === "quit") {
                // TODO: rename "memcache" and check the permission.
                var matching_key = this.getMacthingKey(mode);
                return this.storage.deleteWithPromise(matching_key + "/" + query.user_id).then(function (data) {
                    return _this.updateMatching(mode);
                }).then(function (data) {
                    return new storage_1.KeyValue(data.key, "{}");
                });
            }
        }
        var session_key = this.getSessionKey(session_id);
        var session;
        var updated = false;
        return this.storage.getWithPromise(session_key).then(function (data) {
            if (!data.value) {
                return new storage_1.KeyValue(data.key, "{}");
            }
            session = session_1.Session.fromJSON(JSON.parse(data.value));
            var updated = _this.processCommand(session, query);
            if (session.isEnd()) {
                _this.closeSession(session);
            }
            if (!updated) {
                return new storage_1.KeyValue(data.key, "{}");
            }
            var session_json = JSON.stringify(session.toJSON());
            return _this.storage.setWithPromise(session_key, session_json);
        });
    };
    SessionHandler.prototype.closeSession = function (session) {
        for (var _i = 0, _a = session.getPlayers(); _i < _a.length; _i++) {
            var player = _a[_i];
            this.storage.delete("matched/" + player.user_id);
        }
        this.storage.delete("live/session_" + session.session_id);
        // TODO: Possible to delete "session/session_id" after 10mins?
    };
    SessionHandler.prototype.createSession = function (session_id, mode, player_infos) {
        var session = new session_1.Session(session_id);
        for (var _i = 0, player_infos_1 = player_infos; _i < player_infos_1.length; _i++) {
            var info = player_infos_1[_i];
            this.addNewPlayer(session, info.user_id, info.name, info.deck, false);
        }
        // Add NPC.
        var NPC_NAMES = ["ごましお", "グラ", "ヂータ", "エル", "茜", "ベリー", "兼石", "ハルカ"];
        var num_npc = protocol_1.Protocol.getNpcCount(mode);
        for (var i = 0; i < num_npc; ++i) {
            var npc_name = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
            this.addNewPlayer(session, "" + i, npc_name + " (NPC)", [], true);
        }
        session.startGame();
        this.doNext(session);
        return session;
    };
    // TODO: This is a quite hacky way for testing w/o considering any race conditions.
    SessionHandler.prototype.handleMatching = function (query) {
        var _this = this;
        var name = query.name;
        var mode = Number(query.mode);
        var user_id = query.user_id;
        var deck = [];
        try {
            var user_deck = JSON.parse(query.deck);
            deck = user_deck;
        }
        catch (e) {
            // Invalid deck format. Ignore it.
        }
        var matching_key = this.getMacthingKey(mode);
        var player_info = {
            user_id: user_id,
            mode: mode,
            name: name,
            deck: deck,
        };
        return this.storage.setWithPromise(matching_key + "/" + user_id, player_info).then(function (data) {
            return _this.updateMatching(mode);
        });
    };
    SessionHandler.prototype.updateMatching = function (mode) {
        var _this = this;
        var matching_key = this.getMacthingKey(mode);
        return this.storage.getWithPromise(matching_key).then(function (data) {
            var matching_player_infos;
            matching_player_infos = data.value ? data.value : {};
            return _this.processMatching(mode, matching_player_infos);
        });
    };
    // TODO: This is a quite hacky way for testing w/o considering any race conditions.
    SessionHandler.prototype.processMatching = function (mode, matching_player_infos) {
        var user_ids = Object.keys(matching_player_infos);
        var names = [];
        // The number of players is not enough.
        var num_players = protocol_1.Protocol.getPlayerCount(mode);
        if (user_ids.length === 0) {
            return this.storage.deleteWithPromise("live/matching_" + mode);
        }
        if (user_ids.length < num_players) {
            for (var _i = 0, user_ids_1 = user_ids; _i < user_ids_1.length; _i++) {
                var user_id = user_ids_1[_i];
                names.push(matching_player_infos[user_id].name);
            }
            var matching_info_1 = {
                mode: mode,
                session_id: -1,
                player_names: names,
                is_matched: false,
            };
            return this.storage.setWithPromise("live/matching_" + mode, matching_info_1);
        }
        var promises = [];
        promises.push(this.storage.deleteWithPromise("live/matching_" + mode));
        // Create session.
        // Update player info.
        var matching_key = this.getMacthingKey(mode);
        var player_infos = [];
        for (var i = 0; i < num_players; ++i) {
            var user_id = user_ids[i];
            names.push(matching_player_infos[user_id].name);
            player_infos.push(matching_player_infos[user_id]);
            promises.push(this.storage.deleteWithPromise(matching_key + "/" + user_id));
        }
        // TODO: session_id should be exactly unique.
        var session_id = new Date().getTime(); // Msec.
        var session = this.createSession(session_id, mode, player_infos);
        var session_key = this.getSessionKey(session_id);
        var session_string = JSON.stringify(session.toJSON());
        promises.push(this.storage.setWithPromise(session_key, session_string));
        var matching_info = {
            mode: mode,
            session_id: session_id,
            player_names: names,
            is_matched: true,
        };
        // Set matched/ data.
        for (var _a = 0, _b = session.getPlayers(); _a < _b.length; _a++) {
            var player = _b[_a];
            if (player.isAuto()) {
                continue;
            }
            promises.push(this.storage.setWithPromise("matched/" + player.user_id, matching_info));
        }
        // Set live/ data.
        promises.push(this.storage.setWithPromise("live/session_" + session_id, matching_info));
        return Promise.all(promises).then(function (data) {
            // Return the last item (key: live/session_${session_id}).
            return data[data.length - 1];
        });
    };
    SessionHandler.prototype.addNewPlayer = function (session, user_id, name, deck, is_auto) {
        var player_id = session.addPlayer(user_id, name, 1200, 250, is_auto);
        // # of facility cards should be >= 10.
        // # of character cards should be <= 5.
        var num_facilities = 10;
        var num_chars = 5;
        var random_deck = (deck == null || deck.length === 0);
        if (random_deck) {
            num_facilities = 12;
            deck = [];
        }
        var added_chars = [];
        for (var _i = 0, deck_1 = deck; _i < deck_1.length; _i++) {
            var data_id = deck_1[_i];
            if (facility_1.CardData.isFacility(data_id)) {
                session.addFacility(player_id, data_id);
                num_facilities--;
                continue;
            }
            if (facility_1.CardData.isCharacter(data_id)) {
                if (added_chars.indexOf(data_id) !== -1) {
                    continue;
                }
                if (num_chars > 0) {
                    session.addCharacter(player_id, data_id);
                    added_chars.push(data_id);
                    num_chars--;
                }
                continue;
            }
        }
        for (var i = 0; i < num_facilities; ++i) {
            session.addFacility(player_id, facility_1.CardData.getRandomFacilityDataId());
        }
        if (random_deck && num_chars > 0) {
            var all_chars = Utils.shuffle(facility_1.CardData.getAvailableCharacters());
            for (var _a = 0, all_chars_1 = all_chars; _a < all_chars_1.length; _a++) {
                var data_id = all_chars_1[_a];
                if (added_chars.indexOf(data_id) !== -1) {
                    continue;
                }
                session.addCharacter(player_id, data_id);
                added_chars.push(data_id);
                num_chars--;
                if (num_chars === 0) {
                    break;
                }
            }
        }
        return player_id;
    };
    return SessionHandler;
}());
exports.SessionHandler = SessionHandler;


/***/ })
/******/ ]);
//# sourceMappingURL=saikoro_client.js.map