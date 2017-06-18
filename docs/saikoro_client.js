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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
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
    CharacterType[CharacterType["DrawCards"] = 2] = "DrawCards";
    CharacterType[CharacterType["SalaryFactor"] = 3] = "SalaryFactor";
})(CharacterType = exports.CharacterType || (exports.CharacterType = {}));
var CharacterData = (function () {
    function CharacterData(id, // Unique number.
        name, type, round, property) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.round = round;
        this.property = property;
    }
    return CharacterData;
}());
exports.CharacterData = CharacterData;
var CHARACTER_DATA_BASE = 1000;
var CHARACTER_DATA = [
    new CharacterData(1000, "大学生", CharacterType.DiceDelta, 1, { "delta": 3 }),
    new CharacterData(1001, "幼稚園児", CharacterType.DiceDelta, 2, { "delta": -2 }),
    new CharacterData(1002, "執事", CharacterType.DrawCards, 0, { "value": 2 }),
];
var FacilityType;
(function (FacilityType) {
    FacilityType[FacilityType["Gray"] = 0] = "Gray";
    FacilityType[FacilityType["Blue"] = 1] = "Blue";
    FacilityType[FacilityType["Green"] = 2] = "Green";
    FacilityType[FacilityType["Red"] = 3] = "Red";
    FacilityType[FacilityType["Purple"] = 4] = "Purple";
})(FacilityType = exports.FacilityType || (exports.FacilityType = {}));
var FacilityData = (function () {
    function FacilityData(id, // Unique number.
        size, area, // TODO should be range.
        name, cost, type, property) {
        this.id = id;
        this.size = size;
        this.area = area;
        this.name = name;
        this.cost = cost;
        this.type = type;
        this.property = property;
    }
    return FacilityData;
}());
exports.FacilityData = FacilityData;
var FACILITY_DATA = [
    new FacilityData(0, 1, [1], "🌾", 100, FacilityType.Blue, { "value": 300 }),
    new FacilityData(1, 1, [2], "🐮", 100, FacilityType.Blue, { "value": 250 }),
    new FacilityData(2, 2, [3], "👾", 200, FacilityType.Purple, { "value": 300 }),
    new FacilityData(3, 1, [4], "🐝", 200, FacilityType.Blue, { "value": 300 }),
    new FacilityData(4, 1, [5], "🍴", 200, FacilityType.Red, { "value": 400 }),
    new FacilityData(5, 1, [6], "💆", 150, FacilityType.Green, { "value": 450 }),
    new FacilityData(6, 1, [7], "👕", 200, FacilityType.Green, { "value": 400 }),
    new FacilityData(7, 1, [8], "🐔", 250, FacilityType.Red, { "value": 200, "all": true }),
    new FacilityData(8, 1, [8, 9], "🌻", 200, FacilityType.Blue, { "value": 400 }),
    new FacilityData(9, 1, [10], "🍣", 100, FacilityType.Red, { "value": 400 }),
    new FacilityData(10, 2, [10], "🗻", 300, FacilityType.Blue, { "value": 500 }),
    new FacilityData(11, 1, [12], "🍍", 150, FacilityType.Blue, { "value": 650 }),
    new FacilityData(12, 1, [1], "🍣", 200, FacilityType.Red, { "value": 600 }),
    new FacilityData(13, 1, [2], "🐟", 100, FacilityType.Green, { "value": 550 }),
    new FacilityData(14, 1, [3], "💈", 100, FacilityType.Green, { "value": 450 }),
    new FacilityData(15, 1, [4], "📖", 200, FacilityType.Green, { "value": 400 }),
    new FacilityData(16, 1, [5], "📰", 100, FacilityType.Purple, { "value": 300 }),
    new FacilityData(17, 1, [6], "🍱", 100, FacilityType.Red, { "value": 300 }),
    new FacilityData(18, 1, [7], "🍕", 100, FacilityType.Red, { "value": 300 }),
    new FacilityData(19, 1, [8], "🍅", 100, FacilityType.Blue, { "value": 250 }),
    new FacilityData(20, 1, [9], "🚗", 400, FacilityType.Green, { "value": 800 }),
    new FacilityData(21, 1, [10], "🍎", 100, FacilityType.Blue, { "value": 350 }),
    new FacilityData(22, 1, [11], "👓", 100, FacilityType.Green, { "value": 1000 }),
    new FacilityData(23, 1, [12], "🔨", 300, FacilityType.Purple, { "value": 2000 }),
    new FacilityData(24, 2, [8], "🍻", 300, FacilityType.Red, { "value": 100, "all": true }),
    new FacilityData(25, 2, [8], "🎥", 300, FacilityType.Purple, { "value": 200, "all": true }),
    new FacilityData(26, 2, [9], "🐬", 500, FacilityType.Purple, { "value": 300, "all": true }),
];
var LANDMARK_DATA_BASE = 10000;
var LANDMARK_DATA = [
    new FacilityData(10000, 2, [], "🏯", 2500, FacilityType.Gray, {}),
    new FacilityData(10001, 1, [], "🏰", 2500, FacilityType.Gray, {}),
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
        this.property = data.property;
    }
    Facility.prototype.toJSON = function () {
        return {
            class_name: "Facility",
            data_id: this.data_id,
        };
    };
    Facility.fromJSON = function (json) {
        return new Facility(json.data_id);
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
    Facility.prototype.getPropertyValue = function () {
        return this.property["value"] ? this.property["value"] : 0;
    };
    Facility.prototype.getDescription = function () {
        switch (this.type) {
            case FacilityType.Gray:
                return "ランドマーク";
            case FacilityType.Blue:
                return this.property["value"] + "\u30B3\u30A4\u30F3\u7A3C\u3050\n\u8AB0\u306E\u30BF\u30FC\u30F3\u3067\u3082";
            case FacilityType.Green:
                return this.property["value"] + "\u30B3\u30A4\u30F3\u7A3C\u3050\n\u81EA\u5206\u306E\u30BF\u30FC\u30F3\u306E\u307F";
            case FacilityType.Red:
                if (this.property["all"]) {
                    return this.property["value"] + "\u30B3\u30A4\u30F3\u3092\u5168\u54E1\u304B\u3089\u596A\u3046\n\u81EA\u5206\u4EE5\u5916\u306E\u30BF\u30FC\u30F3\u306E\u307F";
                }
                else {
                    return this.property["value"] + "\u30B3\u30A4\u30F3\u596A\u3046\n\u81EA\u5206\u4EE5\u5916\u306E\u30BF\u30FC\u30F3\u306E\u307F";
                }
            case FacilityType.Purple:
                if (this.property["all"]) {
                    return this.property["value"] + "\u30B3\u30A4\u30F3\u3092\u5168\u54E1\u304B\u3089\u596A\u3046\n\u81EA\u5206\u306E\u30BF\u30FC\u30F3\u306E\u307F";
                }
                else {
                    return this.property["value"] + "\u30B3\u30A4\u30F3\u596A\u3046\n\u81EA\u5206\u306E\u30BF\u30FC\u30F3\u306E\u307F";
                }
        }
        return "";
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
            case CharacterType.None:
                return "";
            case CharacterType.DiceDelta:
                var delta = this.property["delta"];
                var delta_str = ((delta > 0) ? "+" : "") + delta;
                return "\u30B5\u30A4\u30B3\u30ED\u306E\u76EE\u3092" + delta_str + "\u3059\u308B\n" + this.round + "\u30E9\u30A6\u30F3\u30C9";
            case CharacterType.DrawCards:
                var value = this.property["value"];
                return "\u5C71\u672D\u304B\u3089\u30AB\u30FC\u30C9\u3092" + value + "\u679A\u5F15\u304F";
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
var dice_1 = __webpack_require__(11);
var board_1 = __webpack_require__(4);
var facility_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(5);
var card_manager_1 = __webpack_require__(9);
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
    EventType[EventType["Quit"] = 11] = "Quit";
})(EventType = exports.EventType || (exports.EventType = {}));
var Event = (function () {
    function Event() {
        this.step = 0;
        this.type = EventType.None;
        this.player_id = -1;
        this.moneys = [0, 0, 0, 0];
        this.card_id = null;
        this.target_card_ids = [];
        this.dice = null;
        this.valid = false;
    }
    Event.prototype.toJSON = function () {
        return {
            class_name: "Event",
            step: this.step,
            type: this.type,
            player_id: this.player_id,
            moneys: this.moneys,
            card_id: this.card_id,
            target_card_ids: this.target_card_ids,
            dice: this.dice ? this.dice.toJSON() : null,
            valid: this.valid,
        };
    };
    Event.fromJSON = function (json) {
        var event = new Event();
        event.step = json.step;
        event.type = json.type;
        event.player_id = json.player_id;
        event.moneys = json.moneys;
        event.card_id = json.card_id;
        event.target_card_ids = json.target_card_ids;
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
        return session;
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
                if (num_landmarks > 0) {
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
        this.setLandmark();
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
    Session.prototype.diceRoll = function (player_id, dice_num, aim) {
        if (!this.isValid(player_id, Phase.DiceRoll)) {
            return false;
        }
        var delta = this.effect_manager.getDiceDelta();
        this.dice_result = dice_1.Dice.roll(dice_num, aim, delta);
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
    Session.prototype.interactFacilityAction = function (player_id, card_id, target_id) {
        if (!this.isValid(player_id, Phase.FacilityActionWithInteraction)) {
            return false;
        }
        if (this.target_facilities.length === 0) {
            return false;
        }
        if (this.target_facilities[0] !== card_id) {
            return false;
        }
        var event = this.doFacilityActionWithTargetPlayer(card_id, target_id);
        if (event.type === EventType.None) {
            return false;
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
            var event_2 = this.doFacilityAction(card_id);
            if (event_2.type !== EventType.None) {
                this.events.push(event_2);
            }
            if (event_2.type === EventType.Interaction) {
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
    Session.prototype.moveMoney = function (player_id_from, player_id_to, money) {
        if (player_id_from === player_id_to) {
            return 0;
        }
        if (money < 0) {
            return this.moveMoney(player_id_to, player_id_from, -money);
        }
        var actual = -(this.getPlayer(player_id_from).addMoney(-money));
        this.getPlayer(player_id_to).addMoney(actual);
        return actual;
    };
    Session.prototype.doFacilityActionWithTargetPlayer = function (card_id, target_id) {
        var event = new Event();
        var facility = this.getFacility(card_id);
        if (facility.getType() !== facility_1.FacilityType.Purple) {
            return event;
        }
        if (facility.property["all"] === true) {
            return event;
        }
        var player_id = this.getCurrentPlayerId();
        var owner_id = this.getOwnerId(card_id);
        if (player_id !== owner_id) {
            return event;
        }
        var owner = this.getOwner(card_id);
        event.step = this.step;
        event.card_id = card_id;
        event.player_id = player_id;
        event.type = EventType.Purple;
        var value = facility.getPropertyValue();
        var amount = this.moveMoney(target_id, owner_id, value);
        event.moneys[target_id] -= amount;
        event.moneys[owner_id] += amount;
        return event;
    };
    Session.prototype.doFacilityAction = function (card_id) {
        var facility = this.getFacility(card_id);
        var player_id = this.getCurrentPlayerId();
        var owner_id = this.getOwnerId(card_id);
        var owner = this.getOwner(card_id);
        var event = new Event();
        event.step = this.step;
        event.card_id = card_id;
        event.player_id = player_id;
        if (facility.getType() === facility_1.FacilityType.Blue) {
            var amount = owner.addMoney(facility.getPropertyValue());
            event.type = EventType.Blue;
            event.moneys[owner_id] += amount;
        }
        else if (facility.getType() === facility_1.FacilityType.Green) {
            if (player_id === owner_id) {
                var amount = owner.addMoney(facility.getPropertyValue());
                event.type = EventType.Green;
                event.moneys[owner_id] += amount;
            }
        }
        else if (facility.getType() === facility_1.FacilityType.Red) {
            if (player_id !== owner_id) {
                var value = facility.getPropertyValue();
                event.type = EventType.Red;
                if (facility.property["all"]) {
                    for (var pid = 0; pid < this.players.length; ++pid) {
                        if (pid === owner_id) {
                            continue;
                        }
                        var amount = this.moveMoney(pid, owner_id, value);
                        event.moneys[pid] -= amount;
                        event.moneys[owner_id] += amount;
                    }
                }
                else {
                    var amount = this.moveMoney(player_id, owner_id, value);
                    event.moneys[player_id] -= amount;
                    event.moneys[owner_id] += amount;
                }
            }
        }
        else if (facility.getType() === facility_1.FacilityType.Purple) {
            if (player_id === owner_id) {
                var value = facility.getPropertyValue();
                if (facility.property["all"] !== true) {
                    event.type = EventType.Interaction;
                }
                else {
                    event.type = EventType.Purple;
                    for (var pid = 0; pid < this.players.length; ++pid) {
                        if (pid === owner_id) {
                            continue;
                        }
                        var amount = this.moveMoney(pid, owner_id, value);
                        event.moneys[pid] -= amount;
                        event.moneys[owner_id] += amount;
                    }
                }
            }
        }
        return event;
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
    Session.prototype.setLandmark = function () {
        var landmark_data_id = 10000;
        var landmark = new facility_1.Facility(landmark_data_id);
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
    Session.prototype.useCharacter = function (player_id, card_id) {
        if (!this.isValid(player_id, Phase.CharacterCard)) {
            return false;
        }
        // Is character.
        if (!this.isCharacter(card_id)) {
            return false;
        }
        // Facility is in owner's hand?
        if (!this.card_manager.isInHand(player_id, card_id)) {
            return false;
        }
        // Add card to the effect manager.
        var character = this.card_manager.getCharacter(card_id);
        var event = new Event();
        event.type = EventType.Character;
        event.card_id = card_id;
        event.step = this.step;
        event.player_id = player_id;
        this.events.push(event);
        if (character.type === facility_1.CharacterType.DrawCards) {
            event.target_card_ids = this.drawCards(player_id, character.getPropertyValue());
            event.player_id = player_id;
        }
        else {
            this.effect_manager.addCard(character.data_id, this.round, this.turn);
        }
        // Move the card to discard.
        if (!this.card_manager.moveHandToDiscard(card_id)) {
            // Something is wrong.
            console.warn("moveHandToDiscard(" + card_id + ") failed.");
            return false;
        }
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
    Session.prototype.buildFacility = function (player_id, x, y, card_id) {
        // Facility is a landmark?
        if (this.card_manager.isLandmark(card_id)) {
            return this.buildLandmark(player_id, card_id);
        }
        var event = this.getEventBuildFacility(player_id, x, y, card_id);
        if (event == null || !event.valid) {
            return false;
        }
        this.events.push(event);
        // End turn, no build.
        if (event.card_id === -1) {
            this.done(Phase.BuildFacility);
            return true;
        }
        var facility = this.getFacility(card_id);
        // Update the data.
        this.board.removeCards(x, y, facility.size);
        for (var _i = 0, _a = event.target_card_ids; _i < _a.length; _i++) {
            var card_id_on_board = _a[_i];
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
    Session.prototype.getEventBuildFacility = function (player_id, x, y, card_id) {
        // Facility is a landmark?
        if (this.card_manager.isLandmark(card_id)) {
            return this.getEventBuildLandmark(player_id, card_id);
        }
        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return null;
        }
        var event = new Event();
        event.step = this.step;
        event.type = EventType.Build;
        event.player_id = player_id;
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
    Session.prototype.buildLandmark = function (player_id, card_id) {
        var event = this.getEventBuildLandmark(player_id, card_id);
        if (event == null || !event.valid) {
            return false;
        }
        this.events.push(event);
        // Update the data.
        this.getPlayer(player_id).addMoney(event.moneys[player_id]);
        this.card_manager.buildLandmark(player_id, card_id);
        this.done(Phase.BuildFacility);
        return true;
    };
    Session.prototype.getEventBuildLandmark = function (player_id, card_id) {
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
    Session.prototype.getTargetFacilities = function () {
        return this.target_facilities;
    };
    Session.prototype.isEnd = function () {
        return (this.phase === Phase.EndGame);
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
    GameMode[GameMode["OnLineSingle_2"] = 4] = "OnLineSingle_2";
    GameMode[GameMode["OnLineSingle_3"] = 5] = "OnLineSingle_3";
    GameMode[GameMode["OnLineSingle_4"] = 6] = "OnLineSingle_4";
    GameMode[GameMode["OnLine2Players"] = 7] = "OnLine2Players";
    GameMode[GameMode["OnLineWatch"] = 8] = "OnLineWatch";
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
var protocol_1 = __webpack_require__(2);
var Connection = (function () {
    function Connection() {
    }
    return Connection;
}());
exports.Connection = Connection;
var Client = (function () {
    function Client(connection) {
        this.session_id = -1;
        this.matching_id = -1;
        this.mode = protocol_1.GameMode.None;
        this.player_id = -1;
        // TODO: user_id should be unique. 0 - 9 is reserved for NPCs.
        this.user_id = String(Math.floor(Math.random() * 1000000) + 10);
        this.step = -1;
        this.live_sessions = [];
        this.connection = connection;
    }
    Client.prototype.reset = function () {
        this.session_id = -1;
        this.matching_id = -1;
        this.mode = protocol_1.GameMode.None;
        this.player_id = -1;
        this.step = -1;
        this.connection.stopCheckUpdate();
    };
    Client.prototype.matching = function (query) {
        query.command = "matching";
        query.user_id = this.user_id;
        this.mode = query["mode"];
        this.connection.matching(query, this.callbackMatching.bind(this));
    };
    Client.prototype.checkUpdate = function () {
        var query = {
            command: "board",
            session_id: this.session_id,
            player_id: this.player_id,
            step: this.step,
        };
        this.sendRequest(query);
    };
    Client.prototype.callbackMatching = function (response) {
        var response_json = JSON.parse(response);
        this.session_id = response_json.session_id;
        this.player_id = response_json.player_id;
        this.matching_id = response_json.matching_id;
        this.checkUpdate();
        this.connection.startCheckUpdate(this);
    };
    Client.prototype.getLiveSessions = function (callback) {
        this.connection.getLiveSessions(callback);
    };
    Client.prototype.watchGame = function (session_id) {
        this.reset();
        this.session_id = session_id;
        this.mode = protocol_1.GameMode.OnLineWatch;
        this.connection.startCheckUpdate(this);
    };
    Client.prototype.sendRequest = function (request) {
        request.session_id = this.session_id;
        request.player_id = this.player_id;
        this.connection.sendRequest(request, this.callback);
    };
    return Client;
}());
exports.Client = Client;
// Move this class to a Saikoro specific file.
var Request = (function () {
    function Request() {
    }
    Request.matching = function (name, mode, deck) {
        return {
            command: "matching",
            name: name,
            mode: mode,
            deck: deck,
        };
    };
    Request.buildFacility = function (x, y, card_id) {
        return {
            command: "build",
            x: x,
            y: y,
            card_id: card_id,
        };
    };
    Request.rollDice = function (dice_num, aim) {
        return {
            command: "dice",
            dice_num: dice_num,
            aim: aim,
        };
    };
    Request.characterCard = function (card_id) {
        return {
            command: "character",
            card_id: card_id,
        };
    };
    Request.interactFacilityAction = function (card_id, target_player_id) {
        return {
            command: "interact",
            card_id: card_id,
            target_player_id: target_player_id,
        };
    };
    Request.endTurn = function () {
        return {
            command: "build",
            x: -1,
            y: -1,
            card_id: -1,
        };
    };
    Request.quit = function () {
        return {
            command: "quit",
        };
    };
    return Request;
}());
exports.Request = Request;


/***/ }),
/* 4 */
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
/* 5 */
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
/* 6 */
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
var client_1 = __webpack_require__(3);
var session_1 = __webpack_require__(1);
var html_view_1 = __webpack_require__(12);
// TODO: can be merged with Client?
var WebClient = (function (_super) {
    __extends(WebClient, _super);
    function WebClient(connection) {
        var _this = _super.call(this, connection) || this;
        _this.no_update_count = 0;
        _this.callback = _this.callbackSession.bind(_this);
        _this.view = new html_view_1.HtmlView(_this);
        return _this;
    }
    WebClient.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.no_update_count = 0;
    };
    WebClient.prototype.initBoard = function () {
        this.view.initView();
    };
    // Do not directly call this method.
    // Use this.callback.bind(this) as a wrapper of this method.
    WebClient.prototype.callbackSession = function (response) {
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
        if (session.getPhase() === session_1.Phase.EndGame) {
            this.connection.stopCheckUpdate();
        }
        var step = session.getStep();
        console.log(step);
        if (step === this.step) {
            console.log("Already updated.");
            return;
        }
        this.step = step;
        this.view.updateView(session, this.player_id);
    };
    return WebClient;
}(client_1.Client));
exports.WebClient = WebClient;


/***/ }),
/* 7 */
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
var client_1 = __webpack_require__(3);
var session_handler_1 = __webpack_require__(15);
var protocol_1 = __webpack_require__(2);
var storage = new session_handler_1.LocalStorage();
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
        session_handler.handleMatching(query).then(function (matched) {
            setTimeout(function () {
                callback(JSON.stringify(matched));
            }, _this.delay);
        });
    };
    StandaloneConnection.prototype.sendRequest = function (query, callback) {
        var _this = this;
        session_handler.handleCommand(query).then(function (data) {
            setTimeout(function () {
                callback(data.value);
            }, _this.delay);
        });
    };
    StandaloneConnection.prototype.getLiveSessions = function (callback) {
        // Do nothing.
    };
    return StandaloneConnection;
}(client_1.Connection));
exports.StandaloneConnection = StandaloneConnection;
var HybridConnection = (function (_super) {
    __extends(HybridConnection, _super);
    function HybridConnection(online_connection) {
        if (online_connection === void 0) { online_connection = null; }
        var _this = _super.call(this) || this;
        _this.online_connection = null;
        _this.offline_connection = null;
        _this.connection = null;
        _this.online_connection = online_connection;
        _this.offline_connection = new StandaloneConnection();
        _this.connection = _this.offline_connection;
        return _this;
    }
    HybridConnection.prototype.setOnlineConnection = function (connection) {
        if (this.online_connection) {
            this.online_connection.stopCheckUpdate();
        }
        this.online_connection = connection;
    };
    HybridConnection.prototype.startCheckUpdate = function (client) {
        this.connection = this.getConnection(client.mode);
        this.connection.startCheckUpdate(client);
    };
    HybridConnection.prototype.stopCheckUpdate = function () {
        this.connection.stopCheckUpdate();
    };
    HybridConnection.prototype.matching = function (query, callback) {
        this.connection.stopCheckUpdate();
        this.connection = this.getConnection(query.mode);
        this.connection.matching(query, callback);
    };
    HybridConnection.prototype.getLiveSessions = function (callback) {
        // Online connection is used if available.
        if (this.online_connection) {
            this.online_connection.getLiveSessions(callback);
            return;
        }
        this.offline_connection.getLiveSessions(callback);
    };
    HybridConnection.prototype.getConnection = function (mode) {
        if (protocol_1.Protocol.isOnlineMode(mode) && (this.online_connection != null)) {
            return this.online_connection;
        }
        return this.offline_connection;
    };
    HybridConnection.prototype.sendRequest = function (query, callback) {
        this.connection.sendRequest(query, callback);
    };
    return HybridConnection;
}(client_1.Connection));
exports.HybridConnection = HybridConnection;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(5);
var AutoPlay = (function () {
    function AutoPlay() {
    }
    AutoPlay.play = function (session) {
        var player_id = session.getCurrentPlayerId();
        switch (session.getPhase()) {
            case session_1.Phase.CharacterCard:
            case session_1.Phase.DiceRoll:
                return session.diceRoll(player_id, 2, 0);
            case session_1.Phase.BuildFacility:
                return AutoPlay.playBuildFacility(session);
            case session_1.Phase.FacilityActionWithInteraction:
                return AutoPlay.playInteractFacilityAction(session);
        }
        return false;
    };
    AutoPlay.playInteractFacilityAction = function (session) {
        var player_id = session.getCurrentPlayerId();
        var target_facilities = session.getTargetFacilities();
        var target_id = (player_id === 0) ? 1 : 0; // TODO: Fixme :)
        if (target_facilities.length === 0) {
            return false;
        }
        return session.interactFacilityAction(player_id, target_facilities[0], target_id);
    };
    AutoPlay.playBuildFacility = function (session) {
        var landmarks = session.getLandmarks();
        var player_id = session.getCurrentPlayerId();
        var player = session.getPlayer(player_id);
        var money = player.getMoney();
        for (var _i = 0, landmarks_1 = landmarks; _i < landmarks_1.length; _i++) {
            var landmark = landmarks_1[_i];
            if (session.getOwnerId(landmark) !== -1) {
                continue;
            }
            if (money >= session.getFacility(landmark).getCost()) {
                return session.buildLandmark(player_id, landmark);
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
            return session.buildFacility(player_id, x, y, card_id);
        }
        return session.buildFacility(player_id, -1, -1, -1);
    };
    return AutoPlay;
}());
exports.AutoPlay = AutoPlay;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var facility_1 = __webpack_require__(0);
var PlayerCards = (function () {
    function PlayerCards(talon, hand, field, discard) {
        if (talon === void 0) { talon = []; }
        if (hand === void 0) { hand = []; }
        if (field === void 0) { field = []; }
        if (discard === void 0) { discard = []; }
        this.max_hand = 10;
        this.talon = talon;
        this.hand = hand;
        this.field = field;
        this.discard = discard;
    }
    PlayerCards.prototype.toJSON = function () {
        return {
            class_name: "PlayerCards",
            talon: this.talon,
            hand: this.hand,
            field: this.field,
            discard: this.discard,
        };
    };
    PlayerCards.fromJSON = function (json) {
        return new PlayerCards(json.talon, json.hand, json.field, json.discard);
    };
    PlayerCards.prototype.getSize = function () {
        return this.talon.length + this.hand.length + this.field.length + this.discard.length;
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
        this.talon.push(card_id);
        return true;
    };
    PlayerCards.prototype.getTalon = function () {
        return this.talon;
    };
    PlayerCards.prototype.getHand = function () {
        return this.hand;
    };
    // Move a random facility from Talon to Hand.
    PlayerCards.prototype.dealToHand = function () {
        if (this.talon.length === 0 || this.hand.length === this.max_hand) {
            return -1;
        }
        var random_index = Math.floor(Math.random() * this.talon.length);
        var card_id = this.talon[random_index];
        this.moveTalonToHand(card_id);
        return card_id;
    };
    PlayerCards.prototype.getTalonSize = function () {
        return this.talon.length;
    };
    PlayerCards.prototype.getHandSize = function () {
        return this.hand.length;
    };
    PlayerCards.prototype.moveTalonToHand = function (card_id) {
        if (this.hand.length === this.max_hand) {
            return false;
        }
        return this.moveCardId(card_id, this.talon, this.hand);
    };
    PlayerCards.prototype.isInHand = function (card_id) {
        var index = this.getIndex(card_id, this.hand);
        return (index >= 0);
    };
    // Used for initial build.
    PlayerCards.prototype.moveTalonToField = function (card_id) {
        return this.moveCardId(card_id, this.talon, this.field);
    };
    PlayerCards.prototype.moveHandToField = function (card_id) {
        return this.moveCardId(card_id, this.hand, this.field);
    };
    PlayerCards.prototype.moveHandToDiscard = function (card_id) {
        return this.moveCardId(card_id, this.hand, this.discard);
    };
    PlayerCards.prototype.moveFieldToDiscard = function (card_id) {
        return this.moveCardId(card_id, this.field, this.discard);
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
    return CardManager;
}());
exports.CardManager = CardManager;
var CardEffect = (function () {
    function CardEffect(data_id, round, turn) {
        this.data_id = data_id;
        this.character = new facility_1.Character(data_id);
        this.round = round;
        this.turn = turn;
    }
    CardEffect.prototype.toJSON = function () {
        return {
            class_name: "CardEffect",
            data_id: this.data_id,
            // Character is not encoded. data_id can reproduce Character.
            round: this.round,
            turn: this.turn,
        };
    };
    CardEffect.fromJSON = function (json) {
        return new CardEffect(json.data_id, json.round, json.turn);
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
    EffectManager.prototype.addCard = function (data_id, round, turn) {
        this.cards.push(new CardEffect(data_id, round, turn));
    };
    // Remove expired cards.
    EffectManager.prototype.expire = function (round, turn) {
        var new_cards = [];
        var round_factor = 10; // Any number >= 4.
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            if ((card.round + card.character.round) * round_factor + card.turn >
                round * round_factor + turn) {
                new_cards.push(card);
            }
        }
        this.cards = new_cards;
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
    return EffectManager;
}());
exports.EffectManager = EffectManager;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var facility_1 = __webpack_require__(0);
var board_1 = __webpack_require__(4);
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
    Dice.roll = function (dice_num, aim, delta) {
        if (aim === void 0) { aim = 0; }
        if (delta === void 0) { delta = 0; }
        var dice2_factor = (dice_num === 2) ? 1 : 0;
        var dice1 = Dice.roll1();
        var dice2 = Dice.roll1() * dice2_factor;
        if (dice1 + dice2 === aim) {
            // Lucky, but not miracle lucky.
            return new DiceResult(dice1, dice2, delta, false);
        }
        // Try again for miracle.
        var miracle_dice1 = Dice.roll1();
        var miracle_dice2 = Dice.roll1() * dice2_factor;
        if (miracle_dice1 + miracle_dice2 === aim) {
            return new DiceResult(dice1, dice2, delta, true, miracle_dice1, miracle_dice2);
        }
        return new DiceResult(dice1, dice2, delta, false);
    };
    Dice.roll1 = function () {
        return Math.floor(Math.random() * 6) + 1;
    };
    return Dice;
}());
exports.Dice = Dice;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var session_1 = __webpack_require__(1);
var facility_1 = __webpack_require__(0);
var client_1 = __webpack_require__(3);
var deck_maker_1 = __webpack_require__(10);
var protocol_1 = __webpack_require__(2);
var html_view_parts_1 = __webpack_require__(13);
var COLOR_FIELD = "#FFF8E1";
var COLOR_LANDMARK = "#B0BEC5";
var COLOR_CLICKABLE = "#FFCA28";
var COLOR_HIGHTLIGHT_CARD = "#FFE082";
var COLOR_CHARACTER = "#FFF9C4";
var COLOR_PLAYERS = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];
var COLOR_GRAY = "#B0BEC5";
var COLOR_BLUE = "#90CAF9";
var COLOR_GREEN = "#A5D6A7";
var COLOR_RED = "#EF9A9A";
var COLOR_PURPLE = "#B39DDB";
var Scene;
(function (Scene) {
    Scene[Scene["None"] = 0] = "None";
    Scene[Scene["Matching"] = 1] = "Matching";
    Scene[Scene["Deck"] = 2] = "Deck";
    Scene[Scene["Game"] = 3] = "Game";
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
        this.clicked_card_view = null;
        this.deck_maker = new deck_maker_1.DeckMaker();
        this.deck_char_view = null;
        this.clicked_field = [-1, -1];
        this.cards_views = [];
        this.back_button_view = null;
        this.reset_button_view = null;
        this.board_view = null;
        this.landmarks_view = null;
        this.field_card_view = null;
        this.card_widget_view = null;
        this.dice_widget_view = null;
        this.money_motion_view = null;
        this.message_view = null;
        this.buttons_view = null;
        this.scene = Scene.None;
        this.live_session_ids = [];
        this.dice_roll_view = null; // TODO: try not to use it.
        this.client = client;
        this.reset();
    }
    HtmlView.prototype.reset = function () {
        var _this = this;
        this.client.reset();
        this.prev_session = new session_1.Session();
        this.prev_step = -1;
        this.clicked_field = [-1, -1];
        if (this.dice_roll_view) {
            this.dice_roll_view.remove();
            this.dice_roll_view = null;
        }
        this.event_queue.reset();
        this.client.getLiveSessions(function (response) {
            _this.onLiveSessionsUpdated(response);
        });
    };
    HtmlView.prototype.initView = function (row, column) {
        var _this = this;
        if (row === void 0) { row = 5; }
        if (column === void 0) { column = 12; }
        document.getElementById("widgets").style.display = "none";
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
        this.client.getLiveSessions(function (response) {
            _this.onLiveSessionsUpdated(response);
        });
        // Widgets
        this.card_widget_view = new html_view_parts_1.HtmlCardView("card_widget");
        this.dice_widget_view = new html_view_parts_1.HtmlDiceView("dice_widget");
        // buttons.
        this.back_button_view = new html_view_parts_1.HtmlViewObject(document.getElementById("back"));
        this.back_button_view.addClickListener(function () { _this.switchScene(Scene.Matching); });
        this.reset_button_view = new html_view_parts_1.HtmlViewObject(document.getElementById("reset"));
        this.reset_button_view.addClickListener(function () { _this.onResetGame(); });
        this.buttons_view = new html_view_parts_1.HtmlButtonsView("buttons", this.dice_widget_view);
        this.buttons_view.dice1.addClickListener(function () { _this.onClickDice(1, 0); });
        this.buttons_view.dice2.addClickListener(function () { _this.onClickDice(2, 0); });
        this.buttons_view.char_card.addClickListener(function () { _this.onClickCharacter(); });
        this.buttons_view.end_turn.addClickListener(function () { _this.onClickEndTurn(); });
        // Message view.
        this.message_view = new html_view_parts_1.HtmlMessageView("message");
        // HtmlPlayersView
        this.players_view = new html_view_parts_1.HtmlPlayersView("players");
        this.players_view.callback = function (player_id) {
            _this.onClickPlayer(player_id);
        };
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
        // HtmlCardsView
        var card_size = 10;
        var _loop_1 = function (pid) {
            var cards_view = new html_view_parts_1.HtmlCardsView("card_" + pid, card_size);
            var _loop_2 = function (c) {
                cards_view.cards[c].addClickListener(function () { _this.onClickCard(pid, c); });
            };
            for (var c = 0; c < card_size; ++c) {
                _loop_2(c);
            }
            this_1.cards_views.push(cards_view);
        };
        var this_1 = this;
        for (var pid = 0; pid < 4; ++pid) {
            _loop_1(pid);
        }
        // Landmark cards
        var landmark_size = 5;
        this.landmarks_view = new html_view_parts_1.HtmlCardsView("landmark", landmark_size);
        var _loop_3 = function (i) {
            this_2.landmarks_view.cards[i].addClickListener(function () { _this.onClickLandmark(i); });
        };
        var this_2 = this;
        for (var i = 0; i < landmark_size; ++i) {
            _loop_3(i);
        }
        // Field card
        this.field_card_view = new html_view_parts_1.HtmlCardView("field_card");
        // Money motion
        this.money_motion_view = new html_view_parts_1.HtmlViewObject(document.getElementById("money_motion"));
        this.switchScene(Scene.Matching);
    };
    HtmlView.prototype.switchScene = function (scene) {
        if (this.scene === scene) {
            return;
        }
        this.scene = scene;
        // Hide all
        document.getElementById("matching").style.display = "none";
        this.back_button_view.none();
        this.players_view.none();
        this.message_view.none();
        this.board_view.none();
        this.deck_char_view.none();
        this.buttons_view.none();
        this.landmarks_view.none();
        this.reset_button_view.none();
        for (var _i = 0, _a = this.cards_views; _i < _a.length; _i++) {
            var cards_view = _a[_i];
            cards_view.none();
        }
        this.field_card_view.none();
        if (scene === Scene.Matching) {
            document.getElementById("matching").style.display = "";
            return;
        }
        if (scene === Scene.Deck) {
            this.back_button_view.show();
            this.cards_views[0].show();
            this.board_view.show();
            this.deck_char_view.show();
            this.drawDeckBoard();
            for (var _b = 0, _c = this.cards_views[0].cards; _b < _c.length; _b++) {
                var card_view = _c[_b];
                card_view.none();
            }
            return;
        }
        if (scene === Scene.Game) {
            // Show components for game.
            this.message_view.show();
            this.board_view.show();
            this.board_view.redraw();
            if (this.session != null) {
                this.drawSession(this.session);
            }
            this.landmarks_view.show();
            if (protocol_1.Protocol.getPlayerCount(this.client.mode) < 2) {
                this.reset_button_view.show();
            }
            return;
        }
    };
    HtmlView.prototype.onResetGame = function () {
        if (this.client.mode !== protocol_1.GameMode.OnLineWatch) {
            // TODO: Nice to notify the number of watchers.
            this.client.sendRequest(client_1.Request.quit());
        }
        this.reset();
        this.switchScene(Scene.Matching);
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
        this.client.sendRequest(client_1.Request.interactFacilityAction(card_id, target_player_id));
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
        var i = 0;
        if (y === -1) {
            this.deck_char_view.setHighlight(x, true);
            var data_ids = facility_1.CardData.getAvailableCharacters();
            for (; i < data_ids.length; ++i) {
                var character = new facility_1.Character(data_ids[i]);
                this.cards_views[0].cards[i].drawCharacterCard(character);
            }
        }
        else {
            this.board_view.setClickable(this.clicked_field, true);
            var data_ids = this.deck_maker.getAvailableFacilities(x);
            for (; i < data_ids.length; ++i) {
                var facility = new facility_1.Facility(data_ids[i]);
                this.cards_views[0].cards[i].drawFacilityCard(facility);
            }
        }
        for (; i < 10; ++i) {
            this.cards_views[0].cards[i].none();
        }
    };
    HtmlView.prototype.onClickField = function (x, y) {
        var _this = this;
        console.log("clicked: field_" + x + "_" + y);
        if (this.scene === Scene.Matching) {
            return;
        }
        if (this.scene === Scene.Deck) {
            this.onClickDeckField(x, y);
            return;
        }
        // Event on game (this.scene === Scene.Game).
        if (this.clicked_card_view == null) {
            this.drawFieldInfo(x, y);
            return;
        }
        var card_id = this.clicked_card_view.getCardId();
        var event = this.session.getEventBuildFacility(this.client.player_id, x, y, card_id);
        if (event == null || !event.valid) {
            return;
        }
        this.client.sendRequest(client_1.Request.buildFacility(x, y, card_id));
        this.event_queue.addEvent(function () {
            _this.buttons_view.hide(); // for the turn end button.
            _this.effectClonedObjectMove(_this.clicked_card_view, _this.clicked_card_view.element_id, "field_" + x + "_" + y);
            return true;
        }, 1000);
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
        this.client.sendRequest(client_1.Request.rollDice(dice_num, aim));
        this.event_queue.addEvent(function () {
            console.log("dice roll.");
            var dice_view = (dice_num === 1) ? _this.buttons_view.dice1 : _this.buttons_view.dice2;
            dice_view.hide();
            _this.buttons_view.hide();
            // TODO: Make prependDuration to check the response from the server.
            _this.effectDiceMove(dice_view, "board");
            return true;
        }, 1000);
    };
    HtmlView.prototype.onClickCharacter = function () {
        var _this = this;
        if (this.clicked_card_view == null) {
            return;
        }
        var card_id = this.clicked_card_view.getCardId();
        this.client.sendRequest(client_1.Request.characterCard(card_id));
        this.event_queue.addEvent(function () {
            _this.effectCharacter(_this.client.player_id, card_id);
            return true;
        }, 2000);
    };
    HtmlView.prototype.onClickEndTurn = function () {
        var _this = this;
        this.client.sendRequest(client_1.Request.endTurn());
        this.event_queue.addEvent(function () {
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
        this.client.matching(client_1.Request.matching(name, mode, deck));
        this.message_view.drawMessage("通信中です", this.getPlayerColor(this.client.player_id));
        this.switchScene(Scene.Game);
    };
    HtmlView.prototype.getGameModeName = function (session_id) {
        // See SessionHandler.handleMatching
        var mode = Math.floor(session_id / 100000);
        return protocol_1.Protocol.getGameModeName(mode);
    };
    HtmlView.prototype.onLiveSessionsUpdated = function (response) {
        this.live_session_ids = JSON.parse(response);
        for (var i = 0; i < 3; i++) {
            var element = document.getElementById("matching_button_watch_" + (i + 1));
            if (i < this.live_session_ids.length) {
                element.innerText = this.getGameModeName(this.live_session_ids[i]);
                element.classList.remove("inactive");
            }
            else {
                element.innerText = "準備中";
                element.classList.add("inactive");
            }
        }
    };
    HtmlView.prototype.onClickWatch = function (index) {
        if (index >= this.live_session_ids.length) {
            return;
        }
        this.switchScene(Scene.Game);
        this.message_view.drawMessage("通信中です", this.getPlayerColor(this.client.player_id));
        this.client.watchGame(this.live_session_ids[index]);
    };
    HtmlView.prototype.onClickCard = function (player, card) {
        // Event on matching.
        if (this.scene === Scene.Matching) {
            return;
        }
        if (this.scene === Scene.Deck) {
            var _a = this.clicked_field, x = _a[0], y = _a[1];
            if (x === -1) {
                // this.clicked_field was not used. Do nothing.
            }
            else if (y === -1) {
                // Char
                var data_id = facility_1.CardData.getAvailableCharacters()[card];
                this.deck_maker.setCharacter(x, data_id);
            }
            else {
                var data_id = this.deck_maker.getAvailableFacilities(x)[card];
                this.deck_maker.setFacility(x, y, data_id);
            }
            this.drawDeckBoard();
            return;
        }
        // Event on game (this.scene === Scene.Game).
        var clicked_card_id = this.cards_views[player].cards[card].getCardId();
        var phase = this.session.getPhase();
        var is_char = this.session.isCharacter(clicked_card_id);
        var is_valid = ((phase === session_1.Phase.CharacterCard) && is_char ||
            (phase === session_1.Phase.BuildFacility) && !is_char);
        if (!is_valid) {
            return;
        }
        console.log("clicked: card_" + player + "_" + card);
        if (this.clicked_card_view && clicked_card_id === this.clicked_card_view.getCardId()) {
            this.resetCards();
            this.drawBoard(this.session); // TODO: draw click fields only.
            return;
        }
        this.resetCards();
        this.clicked_card_view = this.cards_views[player].cards[card];
        this.clicked_card_view.setHighlight(true);
        this.drawBoard(this.session);
        if (phase === session_1.Phase.CharacterCard) {
            this.buttons_view.char_card.setClickable(true);
        }
        if (phase === session_1.Phase.BuildFacility) {
            for (var _i = 0, _b = this.session.getFacility(clicked_card_id).getArea(); _i < _b.length; _i++) {
                var area = _b[_i];
                var x = area - 1;
                for (var y = 0; y < 5; ++y) {
                    var event_1 = this.session.getEventBuildFacility(player, x, y, clicked_card_id);
                    if (event_1 && event_1.valid) {
                        this.board_view.setClickable([x, y], true);
                    }
                }
            }
        }
    };
    HtmlView.prototype.onClickLandmark = function (card) {
        if (this.session.getPhase() !== session_1.Phase.BuildFacility) {
            return;
        }
        console.log("clicked: landmark_" + card);
        var clicked_card_id = this.session.getLandmarks()[card];
        if (this.clicked_card_view && clicked_card_id === this.clicked_card_view.getCardId()) {
            this.resetCards();
            this.drawBoard(this.session); // TODO: draw click fields only.
            return;
        }
        if (this.session.getOwnerId(clicked_card_id) !== -1) {
            return;
        }
        this.resetCards();
        this.clicked_card_view = this.landmarks_view.cards[card];
        this.clicked_card_view.setHighlight(true);
        this.drawBoard(this.session);
        this.board_view.setClickable(this.session.getPosition(clicked_card_id), true);
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
    HtmlView.prototype.resetCards = function () {
        if (this.clicked_card_view) {
            this.clicked_card_view.setHighlight(false);
            this.clicked_card_view = null;
        }
    };
    HtmlView.prototype.updateView = function (session, player_id) {
        if (this.scene !== Scene.Game) {
            return;
        }
        this.session = session;
        // Show event animations.
        this.drawEvents();
    };
    HtmlView.prototype.drawCards = function (session) {
        var players = session.getPlayers();
        // Update cards.
        for (var i = 0; i < players.length; ++i) {
            if (this.client.player_id !== i) {
                this.cards_views[i].none();
                continue;
            }
            var card_ids = session.getSortedHand(i);
            this.cards_views[i].draw(session, card_ids);
            this.cards_views[i].show();
        }
        for (var i = players.length; i < 4; ++i) {
            this.cards_views[i].none();
        }
        // Update landmarks.
        var landmark_ids = session.getLandmarks();
        this.landmarks_view.draw(session, landmark_ids);
        this.landmarks_view.show();
        this.resetCards(); // Nice to check if built or not?
    };
    HtmlView.prototype.drawFieldInfo = function (x, y) {
        var card_id = this.session.getCardIdOnBoard(x, y);
        if (card_id === -1 || card_id === this.field_card_view.getCardId()) {
            this.field_card_view.none();
            this.field_card_view.setCardId(-1);
            return;
        }
        this.field_card_view.draw(this.session, card_id);
        this.field_card_view.showAt(this.getPosition((x < 6) ? "click_10_1" : "click_0_1"));
    };
    HtmlView.prototype.drawBoard = function (session) {
        var board = session.getBoard();
        for (var y = 0; y < board.row; ++y) {
            for (var x = 0; x < board.column; ++x) {
                var facility_id = board.getRawCardId(x, y);
                var owner_id = session.getOwnerId(facility_id);
                var facility = (facility_id < 0) ? null : session.getFacility(facility_id);
                this.drawField(x, y, facility_id, facility, owner_id);
            }
        }
        if (session.getCurrentPlayerId() === this.client.player_id &&
            session.getPhase() === session_1.Phase.FacilityActionWithInteraction &&
            session.getTargetFacilities().length > 0) {
            var facility_id = session.getTargetFacilities()[0];
            var _a = session.getPosition(facility_id), x = _a[0], y = _a[1];
            this.board_view.setHighlight([x, y], COLOR_CLICKABLE);
        }
    };
    HtmlView.prototype.drawDeckBoard = function () {
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
        this.board_view.setClickable([x, y], false);
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
        field.style.display = "";
        field.style.backgroundColor = owner_color;
        field.style.borderColor = this.getFacilityColor(facility);
        field.colSpan = facility.size;
    };
    // TODO: move this function to other place/class.
    HtmlView.prototype.hasCharacterCard = function (session, player_id) {
        var cards = session.getSortedHand(player_id);
        return session.isCharacter(cards[cards.length - 1]);
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
            var delta = this.getDiceDeltaMessage(session.getDiceDelta());
            message = name + " \u306E\u30AD\u30E3\u30E9\u30AB\u30FC\u30C9\u307E\u305F\u306F\u30B5\u30A4\u30B3\u30ED" + delta + "\u3067\u3059";
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === session_1.Phase.DiceRoll) {
            var delta = this.getDiceDeltaMessage(session.getDiceDelta());
            message = name + " \u306E\u30B5\u30A4\u30B3\u30ED" + delta + "\u3067\u3059";
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
                var event_2 = events_1[_i];
                if (event_2.type === session_1.EventType.Quit) {
                    message = players[event_2.player_id].name + " \u304C\u5207\u65AD\u3057\u307E\u3057\u305F";
                    this.message_view.drawMessage(message, this.getPlayerColor(event_2.player_id));
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
    HtmlView.prototype.drawSession = function (session) {
        this.drawStatusMessage(session);
        this.players_view.draw(session);
        this.drawBoard(session);
        this.drawCards(session);
        // Update buttons.
        this.buttons_view.draw(session, this.client.player_id);
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
            var event_3 = events[i];
            if (event_3.step !== step) {
                if (handled) {
                    break;
                }
                // The previous step does not have handled events. Go to the next step.
                step = event_3.step;
            }
            if (this.drawEvent(event_3)) {
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
            var current_player = this.session.getPlayer(event.player_id);
            var message = current_player.name + " \u306E\u30BF\u30FC\u30F3\u3067\u3059";
            var color = this.getPlayerColor(event.player_id);
            this.message_view.drawMessage(message, color);
            if (event.player_id === this.client.player_id) {
                this.effectCardDeals(event.player_id, event.target_card_ids);
            }
            return true;
        }
        // Dice
        if (event.type === session_1.EventType.Dice) {
            if (this.dice_roll_view) {
                var dices = this.dice_roll_view.element.getElementsByClassName("dice");
                var _loop_4 = function (i) {
                    var pip = (i === 0) ? event.dice.dice1 : event.dice.dice2;
                    var dice = dices[i];
                    dice.addEventListener("animationiteration", function () {
                        dice.style.animation = "roll_end" + pip + " " + (0.8 + i / 10) + "s ease-out forwards";
                    });
                };
                for (var i = 0; i < dices.length; ++i) {
                    _loop_4(i);
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
            if (this.session.getCharacter(event.card_id).type === facility_1.CharacterType.DrawCards) {
                this.effectCardDeals(event.player_id, event.target_card_ids);
                handled = true;
            }
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
        if (event.type === session_1.EventType.Build) {
            if (event.card_id === -1) {
                var name_2 = this.session.getPlayer(event.player_id).name;
                var message = name_2 + " \u306F\u4F55\u3082\u5EFA\u8A2D\u3057\u307E\u305B\u3093\u3067\u3057\u305F\u3002";
                var color = this.getPlayerColor(event.player_id);
                this.message_view.drawMessage(message, color);
                return true;
            }
            var _a = this.session.getPosition(event.card_id), x = _a[0], y = _a[1];
            var facility = this.session.getFacility(event.card_id);
            this.prev_session.getBoard().removeCards(x, y, facility.size);
            this.prev_session.getBoard().setCardId(x, y, event.card_id, facility.size);
            if (this.prev_session.isFacility(event.card_id)) {
                this.prev_session.getPlayerCards(event.player_id).moveHandToField(event.card_id);
            }
            // Draw the board after money motion.
            window.setTimeout(function () {
                _this.drawBoard(_this.prev_session);
                _this.drawCards(_this.prev_session);
            }, 1000);
        }
        var money_motion = [
            session_1.EventType.Blue,
            session_1.EventType.Green,
            session_1.EventType.Red,
            session_1.EventType.Purple,
            session_1.EventType.Build,
        ];
        if (money_motion.indexOf(event.type) !== -1) {
            // Money motion
            var _b = this.session.getPosition(event.card_id), x_3 = _b[0], y_2 = _b[1];
            var _loop_5 = function (pid) {
                var money = event.moneys[pid];
                if (money === 0) {
                    return "continue";
                }
                var delay = 0;
                if ([session_1.EventType.Red, session_1.EventType.Purple, session_1.EventType.Build].indexOf(event.type) !== -1 &&
                    money > 0) {
                    delay = 1000;
                }
                window.setTimeout(function () {
                    _this.drawMoneyMotion(money, pid, x_3, y_2);
                    _this.board_view.setHighlight([x_3, y_2], COLOR_CLICKABLE);
                    window.setTimeout(function () {
                        _this.board_view.setHighlight([x_3, y_2], "transparent");
                    }, 1000);
                }, delay);
            };
            for (var pid = 0; pid < event.moneys.length; pid++) {
                _loop_5(pid);
            }
        }
        if (event.type === session_1.EventType.Interaction) {
            var color = this.getPlayerColor(event.player_id);
            var position = this.session.getPosition(event.card_id);
            this.board_view.setHighlight(position, COLOR_CLICKABLE);
            if (event.player_id === this.client.player_id) {
                this.message_view.drawMessage("対象プレイヤーを選択してください", color);
                this.players_view.setClickableForPlayer(event.player_id);
            }
            else {
                this.message_view.drawMessage("対象プレイヤーを選択中です", color);
            }
        }
        return true;
    };
    HtmlView.prototype.drawMoneyMotion = function (money, player_id, x, y) {
        if (money > 0) {
            this.effectMoneyMotion("field_" + x + "_" + y, "player_" + player_id, money);
        }
        else if (money < 0) {
            this.effectMoneyMotion("player_" + player_id, "field_" + x + "_" + y, money);
        }
        this.players_view.players[player_id].addMoney(money);
    };
    HtmlView.prototype.getPosition = function (element_id) {
        var rect = document.getElementById(element_id).getBoundingClientRect();
        return [rect.left, rect.top];
    };
    HtmlView.prototype.effectCharacter = function (pid, card_id) {
        var effect_view = null;
        if (this.client.player_id === pid) {
            var card_view = this.cards_views[pid].getCardView(card_id);
            if (card_view == null) {
                return; // Something is wrong.
            }
            card_view.hide();
            this.effectClonedObjectMove(card_view, card_view.element_id, "board");
        }
        else {
            this.card_widget_view.draw(this.session, card_id);
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
    HtmlView.prototype.effectCardDeal = function (pid, card_id) {
        this.card_widget_view.draw(this.session, card_id);
        this.effectClonedObjectMove(this.card_widget_view, "player_" + pid, "card_" + pid + "_0");
    };
    HtmlView.prototype.effectCardDeals = function (player_id, card_ids) {
        var _this = this;
        if (this.client.player_id !== player_id) {
            return;
        }
        var timeout = 1000;
        var _loop_6 = function (card_id) {
            window.setTimeout(function () {
                _this.effectCardDeal(player_id, card_id);
            }, timeout);
            timeout += 500;
        };
        for (var _i = 0, card_ids_1 = card_ids; _i < card_ids_1.length; _i++) {
            var card_id = card_ids_1[_i];
            _loop_6(card_id);
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
/* 13 */
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
        document.body.removeChild(this.element);
    };
    HtmlViewObject.prototype.getPosition = function () {
        var rect = this.element.getBoundingClientRect();
        return [rect.left, rect.top];
    };
    HtmlViewObject.prototype.addClickListener = function (callback) {
        this.element.addEventListener("click", callback);
    };
    HtmlViewObject.prototype.showAt = function (_a) {
        var x = _a[0], y = _a[1];
        // The parent element should be relative.
        this.element.style.zIndex = "2";
        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.show();
    };
    HtmlViewObject.prototype.getPositionAligned = function (dst) {
        var src = this.element.getBoundingClientRect();
        var x = dst.left + (dst.width - src.width) / 2;
        var y = dst.top + (dst.height - src.height) / 2;
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
        var rect_from = this.element.getBoundingClientRect();
        var diff_x = x - rect_from.left;
        var diff_y = y - rect_from.top;
        this.element.style.visibility = "visible";
        this.element.style.zIndex = "2";
        this.element.style.position = "absolute";
        this.element.style.top = rect_from.top + "px";
        this.element.style.left = rect_from.left + "px";
        this.element.style.transitionDuration = duration / 1000 + "s";
        this.element.style.transitionTimingFunction = "ease";
        this.element.style.transform = "translate(" + diff_x + "px, " + diff_y + "px)";
    };
    return HtmlViewObject;
}());
exports.HtmlViewObject = HtmlViewObject;
var HtmlCardsView = (function (_super) {
    __extends(HtmlCardsView, _super);
    function HtmlCardsView(element_id, max_size) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
        _this.max_size = max_size;
        _this.cards = [];
        _this.card_ids = [];
        var base = document.getElementById("card_widget");
        for (var i = 0; i < _this.max_size; ++i) {
            var new_node = base.cloneNode(true);
            var new_element = _this.element.appendChild(new_node);
            new_element.id = element_id + "_" + i;
            var card_view = new HtmlCardView(new_element.id);
            _this.cards.push(card_view);
            card_view.none();
        }
        return _this;
    }
    HtmlCardsView.prototype.draw = function (session, card_ids) {
        for (var i = 0; i < this.max_size; ++i) {
            this.cards[i].draw(session, (i < card_ids.length) ? card_ids[i] : -1);
        }
    };
    HtmlCardsView.prototype.getCardView = function (card_id) {
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.getCardId() === card_id) {
                return card;
            }
        }
        return null;
    };
    // TODO: Not necessary?
    HtmlCardsView.prototype.setCardIds = function (card_ids) {
        this.card_ids = card_ids;
        var i = 0;
        for (; i < card_ids.length; ++i) {
            this.cards[i].setCardId(card_ids[i]);
        }
        for (; i < this.max_size; ++i) {
            this.cards[i].setCardId(-1);
        }
    };
    return HtmlCardsView;
}(HtmlViewObject));
exports.HtmlCardsView = HtmlCardsView;
var HtmlCardView = (function (_super) {
    __extends(HtmlCardView, _super);
    function HtmlCardView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
        _this.card_id = -1;
        _this.element_name = _this.element.getElementsByClassName("card_name")[0];
        _this.element_cost = _this.element.getElementsByClassName("card_cost")[0];
        _this.element_description = _this.element.getElementsByClassName("card_description")[0];
        return _this;
    }
    HtmlCardView.prototype.setCardId = function (card_id) {
        this.card_id = card_id;
    };
    HtmlCardView.prototype.getCardId = function () {
        return this.card_id;
    };
    HtmlCardView.prototype.draw = function (session, card_id) {
        this.card_id = card_id;
        // No card
        if (card_id === -1) {
            this.none();
            return;
        }
        // Character
        if (session.isCharacter(card_id)) {
            var character = session.getCharacter(card_id);
            this.drawCharacterCard(character);
            return;
        }
        // Landmark
        if (session.isLandmark(card_id)) {
            var landmark = session.getFacility(card_id);
            var owner_id = session.getOwnerId(card_id);
            this.drawLandmarkCard(landmark, owner_id);
            return;
        }
        // Facility
        var facility = session.getFacility(card_id);
        this.drawFacilityCard(facility);
    };
    HtmlCardView.prototype.drawFacilityCard = function (facility) {
        var area = this.getFacilityAreaString(facility);
        this.element_name.innerText = area + " " + facility.getName();
        this.element_cost.innerText = String(facility.getCost());
        this.element_description.innerText = facility.getDescription();
        this.element.style.backgroundColor = getFacilityColor(facility);
        this.show();
    };
    HtmlCardView.prototype.drawCharacterCard = function (character) {
        this.element_name.innerText = character.getName();
        this.element_cost.innerText = "";
        this.element_description.innerText = character.getDescription();
        this.element.style.backgroundColor = COLOR_CHARACTER;
        this.show();
    };
    HtmlCardView.prototype.drawLandmarkCard = function (landmark, owner_id) {
        this.element_name.innerText = landmark.getName();
        this.element_cost.innerText = String(landmark.getCost());
        this.element_description.innerText = landmark.getDescription();
        if (owner_id === -1) {
            this.element.style.backgroundColor = getFacilityColor(landmark);
        }
        else {
            this.element.style.backgroundColor = getPlayerColor(owner_id);
        }
        this.show();
    };
    HtmlCardView.prototype.setHighlight = function (is_highlight) {
        this.element.style.borderColor = is_highlight ? COLOR_HIGHTLIGHT_CARD : "#EEEEEE";
    };
    HtmlCardView.prototype.getFacilityAreaString = function (facility) {
        var area_name = ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", ""];
        var area = facility.getArea().map(function (i) {
            if (facility.size === 2) {
                return area_name[i] + "+" + area_name[i + 1];
            }
            return area_name[i];
        }).join(",");
        return area;
    };
    return HtmlCardView;
}(HtmlViewObject));
exports.HtmlCardView = HtmlCardView;
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
    HtmlPlayersView.prototype.setClickableForPlayer = function (player_id) {
        for (var i = 0; i < this.players_length; ++i) {
            this.players[i].setClickable(player_id !== i);
        }
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
        return _super.call(this, document.getElementById(element_id)) || this;
    }
    HtmlMessageView.prototype.drawMessage = function (message, color) {
        if (color === void 0) { color = COLOR_FIELD; }
        this.element.innerText = "\uD83C\uDFB2 " + message + " \uD83C\uDFB2";
        this.element.style.backgroundColor = color;
    };
    return HtmlMessageView;
}(HtmlViewObject));
exports.HtmlMessageView = HtmlMessageView;
var HtmlBoardView = (function (_super) {
    __extends(HtmlBoardView, _super);
    function HtmlBoardView(element_id, row, column) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.clickable_fields = new HtmlClickableFieldsView("click", row, column);
        var _loop_1 = function (y) {
            var _loop_2 = function (x) {
                this_1.clickable_fields.fields[x][y].addClickListener(function () { _this.onClick(x, y); });
            };
            for (var x = 0; x < column; ++x) {
                _loop_2(x);
            }
        };
        var this_1 = this;
        for (var y = 0; y < row; ++y) {
            _loop_1(y);
        }
        return _this;
    }
    HtmlBoardView.prototype.onClick = function (x, y) {
        this.callback(x, y);
    };
    HtmlBoardView.prototype.redraw = function () {
        this.clickable_fields.resetAll();
    };
    HtmlBoardView.prototype.setClickable = function (position, is_clickable) {
        this.clickable_fields.setClickable(position, is_clickable);
    };
    HtmlBoardView.prototype.setHighlight = function (position, color) {
        this.clickable_fields.setHighlight(position, color);
    };
    HtmlBoardView.prototype.animateDiceResult = function (result, color) {
        this.clickable_fields.animateDiceResult(result, color);
    };
    return HtmlBoardView;
}(HtmlViewObject));
exports.HtmlBoardView = HtmlBoardView;
var HtmlDeckCharView = (function (_super) {
    __extends(HtmlDeckCharView, _super);
    function HtmlDeckCharView(element_id) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.fields = [];
        _this.clickables = [];
        var _loop_3 = function (i) {
            var field = new HtmlViewObject(document.getElementById(element_id + "_" + i));
            this_2.fields.push(field);
            var clickable = new HtmlClickableFieldView("clickable_" + element_id + "_" + i);
            this_2.clickables.push(clickable);
            clickable.addClickListener(function () { _this.onClick(i); });
        };
        var this_2 = this;
        for (var i = 0; i < 5; ++i) {
            _loop_3(i);
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
var HtmlButtonsView = (function (_super) {
    __extends(HtmlButtonsView, _super);
    function HtmlButtonsView(element_id, dice_widget) {
        var _this = _super.call(this, document.getElementById(element_id)) || this;
        _this.element_id = element_id;
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
        _this.char_card = new HtmlButtonView(element_id + "_char_card");
        _this.end_turn = new HtmlButtonView(element_id + "_end_turn");
        return _this;
    }
    HtmlButtonsView.prototype.draw = function (session, player_id) {
        if (session.getCurrentPlayerId() !== player_id) {
            this.hide();
            return;
        }
        this.dice1.hide();
        this.dice2.hide();
        this.char_card.hide();
        this.end_turn.hide();
        var phase = session.getPhase();
        if (phase === session_1.Phase.CharacterCard || phase === session_1.Phase.DiceRoll) {
            this.dice1.show();
            this.dice2.show();
        }
        if (phase === session_1.Phase.CharacterCard) {
            this.char_card.show();
            this.char_card.setClickable(false);
        }
        if (phase === session_1.Phase.BuildFacility) {
            this.end_turn.show();
        }
        this.show();
    };
    return HtmlButtonsView;
}(HtmlViewObject));
exports.HtmlButtonsView = HtmlButtonsView;
var HtmlClickableFieldView = (function (_super) {
    __extends(HtmlClickableFieldView, _super);
    function HtmlClickableFieldView(element_id) {
        return _super.call(this, document.getElementById(element_id)) || this;
    }
    HtmlClickableFieldView.prototype.reset = function () {
        this.element.style.borderColor = "transparent";
    };
    HtmlClickableFieldView.prototype.setClickable = function (is_clickable) {
        // TODO: Use class of "clickable".
        this.element.style.borderColor = is_clickable ? COLOR_CLICKABLE : "transparent";
    };
    HtmlClickableFieldView.prototype.setColor = function (color) {
        this.element.style.borderColor = color;
    };
    return HtmlClickableFieldView;
}(HtmlViewObject));
exports.HtmlClickableFieldView = HtmlClickableFieldView;
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
    HtmlClickableFieldsView.prototype.resetAll = function () {
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
    HtmlClickableFieldsView.prototype.setHighlight = function (_a, color) {
        var x = _a[0], y = _a[1];
        this.fields[x][y].setColor(color);
    };
    HtmlClickableFieldsView.prototype.animateDiceResult = function (pip, color) {
        var _this = this;
        var x = pip - 1;
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


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var standalone_connection_1 = __webpack_require__(7);
var saikoro_1 = __webpack_require__(6);
var delay = 0; // msec
var connection = new standalone_connection_1.StandaloneConnection(delay);
var client = new saikoro_1.WebClient(connection);
document.addEventListener("DOMContentLoaded", function () { client.initBoard(); });


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
var session_1 = __webpack_require__(1);
var facility_1 = __webpack_require__(0);
var auto_play_1 = __webpack_require__(8);
var protocol_1 = __webpack_require__(2);
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
    LocalStorage.prototype.get = function (key, callback) {
        callback(null, this.storage[key]);
    };
    LocalStorage.prototype.getWithPromise = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = new KeyValue(key, _this.storage[key]);
            resolve(data);
        });
    };
    LocalStorage.prototype.delete = function (key) {
        delete this.storage[key];
    };
    LocalStorage.prototype.getKeys = function () {
        return Object.keys(this.storage);
    };
    LocalStorage.prototype.set = function (key, value, callback, expire) {
        this.storage[key] = value;
        callback(null);
    };
    LocalStorage.prototype.setWithPromise = function (key, value) {
        this.storage[key] = value;
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
                cont = auto_play_1.AutoPlay.play(session);
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
    SessionHandler.prototype.processCommand = function (session, query) {
        if (query.command === "board") {
            var step = Number(query.step);
            if (step >= session.getStep()) {
                // No update.
                return false;
            }
        }
        else if (query.command === "character") {
            var player_id = Number(query.player_id);
            var card_id = Number(query.card_id);
            if (session.useCharacter(player_id, card_id)) {
                // TODO: integrate buildFacility and doNext.
                this.doNext(session);
            }
        }
        else if (query.command === "dice") {
            var player_id = Number(query.player_id);
            var dice_num = Number(query.dice_num);
            var aim = Number(query.aim);
            if (session.diceRoll(player_id, dice_num, aim)) {
                // TODO: integrate diceRoll and doNext.
                this.doNext(session);
            }
        }
        else if (query.command === "build") {
            var player_id = Number(query.player_id);
            var x = Number(query.x);
            var y = Number(query.y);
            var card_id = Number(query.card_id);
            if (x != null && y != null && player_id != null && card_id != null) {
                if (session.buildFacility(player_id, x, y, card_id)) {
                    // TODO: integrate buildFacility and doNext.
                    this.doNext(session);
                }
            }
        }
        else if (query.command === "interact") {
            var player_id = Number(query.player_id);
            var card_id = Number(query.card_id);
            var target_player_id = Number(query.target_player_id);
            if (session.interactFacilityAction(player_id, card_id, target_player_id)) {
                // TODO: integrate interactFacilityAction and doNext.
                this.doNext(session);
            }
        }
        else if (query.command === "quit") {
            var player_id = Number(query.player_id);
            if (session.quit(player_id)) {
                this.doNext(session);
            }
        }
        return true;
    };
    SessionHandler.prototype.handleCommand = function (query) {
        var _this = this;
        if (query.session_id == undefined) {
            return;
        }
        var session_key = "session/session_" + query.session_id;
        var session;
        var updated = false;
        return this.storage.getWithPromise(session_key).then(function (data) {
            if (!data.value) {
                return new KeyValue(data.key, "{}");
            }
            session = session_1.Session.fromJSON(JSON.parse(data.value));
            var updated = _this.processCommand(session, query);
            if (session.isEnd()) {
                _this.closeSession(session);
            }
            if (!updated) {
                return new KeyValue(data.key, "{}");
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
        var num_players = protocol_1.Protocol.getPlayerCount(mode);
        var num_npc = protocol_1.Protocol.getNpcCount(mode);
        var matched_data = new MatchedData();
        // TODO: rename "memcache" and check the permission.
        var matching_key = "memcache/matching_" + mode;
        var session_id = -1;
        // TODO: Some operations can be performed in parallel.
        return this.storage.getWithPromise(matching_key).then(function (data) {
            var matching_id;
            if (data.value) {
                matching_id = Number(data.value);
            }
            else {
                matching_id = 10;
            }
            return _this.storage.setWithPromise(matching_key, matching_id + 1);
        }).then(function (data) {
            var matching_id = data.value - 1;
            // FIXIT: This is an obviously hacky way for two players. Fix it.
            // HtmlView.getGameModeName also uses this hack.
            session_id = mode * 100000 + Math.floor(matching_id / num_players);
            var session_key = "session/session_" + session_id;
            matched_data.matching_id = String(matching_id);
            matched_data.session_id = String(session_id);
            return _this.storage.getWithPromise(session_key);
        }).then(function (data) {
            var session_key = data.key;
            var session_value = data.value;
            var session;
            if (session_value) {
                session = session_1.Session.fromJSON(JSON.parse(session_value));
            }
            else {
                session = new session_1.Session(session_id);
            }
            var player_id = _this.addNewPlayer(session, user_id, name, deck, false);
            matched_data.player_id = player_id;
            if (player_id === num_players - 1) {
                // Add NPC.
                var NPC_NAMES = ["ごましお", "グラ", "ヂータ", "エル", "茜", "ベリー", "兼石"];
                for (var i = 0; i < num_npc; ++i) {
                    var npc_name = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
                    _this.addNewPlayer(session, "" + i, npc_name + " (NPC)", [], true);
                }
                session.startGame();
                _this.doNext(session);
                var names = session.getPlayers().map(function (player) { return player.name; });
                var info = {
                    session_id: session.session_id,
                    mode: Number(query.mode),
                    names: names,
                };
                _this.storage.setWithPromise("live/session_" + session.session_id, info);
            }
            var session_string = JSON.stringify(session.toJSON());
            return _this.storage.setWithPromise(session_key, session_string);
        }).then(function (data) {
            return matched_data;
        });
    };
    SessionHandler.prototype.addNewPlayer = function (session, user_id, name, deck, is_auto) {
        var player_id = session.addPlayer(user_id, name, 1200, 250, is_auto);
        var num_facilities = 0;
        var num_chars = 0;
        for (var _i = 0, deck_1 = deck; _i < deck_1.length; _i++) {
            var data_id = deck_1[_i];
            if (facility_1.CardData.isFacility(data_id)) {
                session.addFacility(player_id, data_id);
                num_facilities++;
                continue;
            }
            if (facility_1.CardData.isCharacter(data_id)) {
                if (num_chars <= 5) {
                    session.addCharacter(player_id, data_id);
                    num_chars++;
                }
                continue;
            }
        }
        for (var i = num_facilities; i < 10; ++i) {
            session.addFacility(player_id, facility_1.CardData.getRandomFacilityDataId());
        }
        for (var i = num_chars; i < 2; ++i) {
            session.addCharacter(player_id, facility_1.CardData.getRandomCharacterDataId());
        }
        return player_id;
    };
    return SessionHandler;
}());
exports.SessionHandler = SessionHandler;


/***/ })
/******/ ]);
//# sourceMappingURL=saikoro_client.js.map