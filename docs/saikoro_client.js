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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return CharacterType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FacilityType; });
var CharacterType;
(function (CharacterType) {
    CharacterType[CharacterType["None"] = 0] = "None";
    CharacterType[CharacterType["DiceDelta"] = 1] = "DiceDelta";
    CharacterType[CharacterType["DrawCards"] = 2] = "DrawCards";
    CharacterType[CharacterType["SalaryFactor"] = 3] = "SalaryFactor";
})(CharacterType || (CharacterType = {}));
class CharacterData {
    constructor(id, // Unique number.
        name, type, round, property) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.round = round;
        this.property = property;
    }
}
/* unused harmony export CharacterData */

const CHARACTER_DATA_BASE = 1000;
const CHARACTER_DATA = [
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
})(FacilityType || (FacilityType = {}));
class FacilityData {
    constructor(id, // Unique number.
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
}
/* unused harmony export FacilityData */

const FACILITY_DATA = [
    new FacilityData(0, 1, [1], "🌾", 100, FacilityType.Blue, { "value": 300 }),
    new FacilityData(1, 1, [2], "🐮", 100, FacilityType.Blue, { "value": 250 }),
    new FacilityData(2, 2, [3], "👾", 200, FacilityType.Purple, { "value": 300 }),
    new FacilityData(3, 1, [4], "🐝", 200, FacilityType.Blue, { "value": 300 }),
    new FacilityData(4, 1, [5], "🍴", 200, FacilityType.Red, { "value": 400 }),
    new FacilityData(5, 1, [6], "💆", 150, FacilityType.Green, { "value": 450 }),
    new FacilityData(6, 1, [7], "👕", 200, FacilityType.Green, { "value": 400 }),
    new FacilityData(7, 1, [8], "🐔", 250, FacilityType.Red, { "value": 250 }),
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
];
const LANDMARK_DATA_BASE = 10000;
const LANDMARK_DATA = [
    new FacilityData(10000, 2, [], "🏯", 2500, FacilityType.Gray, {}),
    new FacilityData(10001, 1, [], "🏰", 2500, FacilityType.Gray, {}),
];
class CardData {
    static isFacility(data_id) {
        return (0 <= data_id) && (data_id < FACILITY_DATA.length);
    }
    static getRandomFacilityDataId() {
        return Math.floor(Math.random() * FACILITY_DATA.length);
    }
    static getAvailableFacilities(pip) {
        let facilities = [];
        for (let i = 0; i < FACILITY_DATA.length; ++i) {
            let facility = FACILITY_DATA[i];
            for (let s = 0; s < facility.size; ++s) {
                if (facility.area.indexOf(pip - s) !== -1) {
                    facilities.push(i);
                    break;
                }
            }
        }
        return facilities;
    }
    static isCharacter(data_id) {
        return ((CHARACTER_DATA_BASE <= data_id) &&
            (data_id < CHARACTER_DATA_BASE + CHARACTER_DATA.length));
    }
    static getRandomCharacterDataId() {
        return Math.floor(Math.random() * CHARACTER_DATA.length) + CHARACTER_DATA_BASE;
    }
}
/* harmony export (immutable) */ __webpack_exports__["e"] = CardData;

class Facility {
    constructor(data_id) {
        let data;
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
    toJSON() {
        return {
            class_name: "Facility",
            data_id: this.data_id,
        };
    }
    static fromJSON(json) {
        return new Facility(json.data_id);
    }
    getName() {
        return this.name;
    }
    getSize() {
        return this.size;
    }
    getArea() {
        return this.area;
    }
    getCost() {
        return this.cost;
    }
    getType() {
        return this.type;
    }
    getPropertyValue() {
        return this.property["value"] ? this.property["value"] : 0;
    }
    getDescription() {
        switch (this.type) {
            case FacilityType.Gray:
                return "ランドマーク";
            case FacilityType.Blue:
                return `${this.property["value"]}コイン稼ぐ。\n誰のターンでも。`;
            case FacilityType.Green:
                return `${this.property["value"]}コイン稼ぐ。\n自分のターンのみ。`;
            case FacilityType.Red:
                return `${this.property["value"]}コイン奪う。\n自分以外のターンのみ。`;
            case FacilityType.Purple:
                return `${this.property["value"]}コイン奪う。\n自分のターンのみ。`;
        }
        return "";
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Facility;

class Character {
    constructor(data_id) {
        let data = CHARACTER_DATA[data_id - CHARACTER_DATA_BASE];
        this.data_id = data_id;
        this.name = data.name;
        this.type = data.type;
        this.round = data.round;
        this.property = data.property;
    }
    toJSON() {
        return {
            class_name: "Character",
            data_id: this.data_id,
        };
    }
    static fromJSON(json) {
        return new Character(json.data_id);
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    getPropertyValue() {
        return this.property["value"] ? this.property["value"] : 0;
    }
    getDescription() {
        switch (this.type) {
            case CharacterType.None:
                return "";
            case CharacterType.DiceDelta:
                let delta = this.property["delta"];
                let delta_str = ((delta > 0) ? "+" : "") + delta;
                return `サイコロの目を${delta_str}する。\n${this.round}ラウンド`;
            case CharacterType.DrawCards:
                let value = this.property["value"];
                return `山札からカードを${value}枚引く`;
        }
        return "";
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = Character;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Phase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return EventType; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dice__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__board__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__facility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__card_manager__ = __webpack_require__(9);





var Phase;
(function (Phase) {
    Phase[Phase["StartGame"] = 0] = "StartGame";
    // Loop b/w StartTurn and EndTurn.
    Phase[Phase["StartTurn"] = 1] = "StartTurn";
    Phase[Phase["CharacterCard"] = 2] = "CharacterCard";
    Phase[Phase["DiceRoll"] = 3] = "DiceRoll";
    // DiceRollAgain,
    Phase[Phase["FacilityAction"] = 4] = "FacilityAction";
    // FacilityAction2,
    // FacilityAction3,
    // FacilityAction4,
    // FacilityAction5,
    Phase[Phase["PaySalary"] = 5] = "PaySalary";
    Phase[Phase["BuildFacility"] = 6] = "BuildFacility";
    Phase[Phase["CardRemoval"] = 7] = "CardRemoval";
    Phase[Phase["EndTurn"] = 8] = "EndTurn";
    Phase[Phase["EndGame"] = 9] = "EndGame";
})(Phase || (Phase = {}));
var EventType;
(function (EventType) {
    EventType[EventType["None"] = 0] = "None";
    EventType[EventType["Blue"] = 1] = "Blue";
    EventType[EventType["Green"] = 2] = "Green";
    EventType[EventType["Red"] = 3] = "Red";
    EventType[EventType["Purple"] = 4] = "Purple";
    EventType[EventType["Build"] = 5] = "Build";
    EventType[EventType["Character"] = 6] = "Character";
    EventType[EventType["Dice"] = 7] = "Dice";
    EventType[EventType["Salary"] = 8] = "Salary";
    EventType[EventType["Draw"] = 9] = "Draw";
    EventType[EventType["Quit"] = 10] = "Quit";
})(EventType || (EventType = {}));
class Event {
    constructor() {
        this.step = 0;
        this.type = EventType.None;
        this.player_id = -1;
        this.moneys = [0, 0, 0, 0];
        this.card_id = null;
        this.target_card_ids = [];
        this.dice = null;
    }
    toJSON() {
        return {
            class_name: "Event",
            step: this.step,
            type: this.type,
            player_id: this.player_id,
            moneys: this.moneys,
            card_id: this.card_id,
            target_card_ids: this.target_card_ids,
            dice: this.dice ? this.dice.toJSON() : null,
        };
    }
    static fromJSON(json) {
        let event = new Event();
        event.step = json.step;
        event.type = json.type;
        event.player_id = json.player_id;
        event.moneys = json.moneys;
        event.card_id = json.card_id;
        event.target_card_ids = json.target_card_ids;
        event.dice = json.dice ? __WEBPACK_IMPORTED_MODULE_0__dice__["a" /* DiceResult */].fromJSON(json.dice) : null;
        return event;
    }
}
/* unused harmony export Event */

class Session {
    constructor() {
        this.board = new __WEBPACK_IMPORTED_MODULE_1__board__["a" /* Board */]();
        this.players = [];
        this.card_manager = new __WEBPACK_IMPORTED_MODULE_4__card_manager__["a" /* CardManager */]();
        this.effect_manager = new __WEBPACK_IMPORTED_MODULE_4__card_manager__["b" /* EffectManager */]();
        this.events = [];
        this.step = 1;
        this.phase = Phase.StartGame;
        this.round = 0;
        this.turn = 0;
        this.current_player_id = 0;
        this.winner = -1; // NO_PLAYER
        this.dice_result = null;
    }
    toJSON() {
        return {
            class_name: "Session",
            board: this.board.toJSON(),
            players: this.players.map(player => { return player.toJSON(); }),
            card_manager: this.card_manager.toJSON(),
            effect_manager: this.effect_manager.toJSON(),
            events: this.events.map(event => { return event.toJSON(); }),
            step: this.step,
            phase: this.phase,
            round: this.round,
            turn: this.turn,
            current_player_id: this.current_player_id,
            winner: this.winner,
            dice_result: this.dice_result ? this.dice_result.toJSON() : null,
        };
    }
    static fromJSON(json) {
        let board = __WEBPACK_IMPORTED_MODULE_1__board__["a" /* Board */].fromJSON(json.board);
        let players = json.players.map(player => { return __WEBPACK_IMPORTED_MODULE_1__board__["b" /* Player */].fromJSON(player); });
        let session = new Session();
        session.board = board;
        session.players = players;
        session.card_manager = __WEBPACK_IMPORTED_MODULE_4__card_manager__["a" /* CardManager */].fromJSON(json.card_manager);
        session.effect_manager = __WEBPACK_IMPORTED_MODULE_4__card_manager__["b" /* EffectManager */].fromJSON(json.effect_manager);
        session.events = json.events.map(event => { return Event.fromJSON(event); });
        session.step = json.step,
            session.phase = json.phase,
            session.round = json.round;
        session.turn = json.turn;
        session.current_player_id = json.current_player_id;
        session.winner = json.winner;
        session.dice_result = json.dice_result ? __WEBPACK_IMPORTED_MODULE_0__dice__["a" /* DiceResult */].fromJSON(json.dice_result) : null;
        return session;
    }
    isValidPhase(phase) {
        if (this.phase === phase) {
            return true;
        }
        // Character card can be skipped.
        if (this.phase === Phase.CharacterCard && phase === Phase.DiceRoll) {
            return true;
        }
        return false;
    }
    done(phase) {
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
                this.phase = Phase.PaySalary;
                return;
            case Phase.PaySalary:
                this.phase = Phase.BuildFacility;
                return;
            case Phase.BuildFacility:
                // Check EndGame
                let landmarks = this.card_manager.getLandmarks();
                let num_landmarks = 0;
                for (let landmark of landmarks) {
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
    }
    doNext() {
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
                return this.facilityAction();
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
    }
    addPlayer(user_id, name, money, salary, is_auto) {
        let player_id = this.players.length;
        if (player_id > 4) {
            return -1;
        }
        // team === player_id (no 2vs2 so far).
        this.players.push(new __WEBPACK_IMPORTED_MODULE_1__board__["b" /* Player */](user_id, player_id, name, money, salary, player_id, is_auto));
        return player_id;
    }
    addFacility(player_id, facility_data_id) {
        return this.card_manager.addFacility(player_id, facility_data_id);
    }
    addCharacter(player_id, character_data_id) {
        return this.card_manager.addCharacter(player_id, character_data_id);
    }
    isValid(player_id, phase) {
        return (this.current_player_id === player_id && this.isValidPhase(phase));
    }
    startGame() {
        this.setLandmark();
        for (let r = 0; r < 2; r++) {
            for (let p = 0; p < this.players.length; p++) {
                this.buildInitialFacility(p);
            }
        }
        for (let r = 0; r < 5; r++) {
            for (let p = 0; p < this.players.length; p++) {
                this.getPlayerCards(p).dealToHand();
            }
        }
        this.done(Phase.StartGame);
        return true;
    }
    startTurn() {
        this.effect_manager.expire(this.round, this.turn);
        let card_ids = this.drawCards(this.current_player_id, 1);
        // This is a hack to avoid drawing an event before game start.
        // TODO: Stop this hack.
        let is_first = (this.round === 0 && this.turn === 0);
        if (!is_first) {
            let event = new Event();
            this.events.push(event);
            event.type = EventType.Draw;
            event.step = this.step;
            event.player_id = this.current_player_id;
            event.target_card_ids = card_ids;
        }
        this.done(Phase.StartTurn);
        return true;
    }
    diceRoll(player_id, dice_num, aim) {
        if (!this.isValid(player_id, Phase.DiceRoll)) {
            return false;
        }
        let delta = this.effect_manager.getDiceDelta();
        this.dice_result = __WEBPACK_IMPORTED_MODULE_0__dice__["b" /* Dice */].roll(dice_num, aim, delta);
        let event = new Event();
        this.events.push(event);
        event.type = EventType.Dice;
        event.dice = this.dice_result;
        event.step = this.step;
        event.player_id = player_id;
        this.done(Phase.DiceRoll);
        return true;
    }
    facilityAction() {
        let number = this.dice_result.result();
        if (number < 1 || 12 < number) {
            this.done(Phase.FacilityAction);
            return true;
        }
        let facilities = [];
        for (let y = 0; y < 5; y++) {
            let card_id = this.getCardIdOnBoard(number - 1, 4 - y);
            if (card_id !== -1) {
                facilities.push(card_id);
            }
        }
        let type_order = [__WEBPACK_IMPORTED_MODULE_2__facility__["a" /* FacilityType */].Blue, __WEBPACK_IMPORTED_MODULE_2__facility__["a" /* FacilityType */].Green, __WEBPACK_IMPORTED_MODULE_2__facility__["a" /* FacilityType */].Red, __WEBPACK_IMPORTED_MODULE_2__facility__["a" /* FacilityType */].Purple];
        for (let type of type_order) {
            for (let card_id of facilities) {
                let facility = this.getFacility(card_id);
                if (facility.getType() !== type) {
                    continue;
                }
                this.doFacilityAction(card_id);
            }
        }
        this.done(Phase.FacilityAction);
        return true;
    }
    moveMoney(player_id_from, player_id_to, money) {
        if (player_id_from === player_id_to) {
            return 0;
        }
        if (money < 0) {
            return this.moveMoney(player_id_to, player_id_from, -money);
        }
        let actual = -(this.getPlayer(player_id_from).addMoney(-money));
        this.getPlayer(player_id_to).addMoney(actual);
        return actual;
    }
    doFacilityAction(card_id) {
        let facility = this.getFacility(card_id);
        let player_id = this.getCurrentPlayerId();
        let owner_id = this.getOwnerId(card_id);
        let owner = this.getOwner(card_id);
        let event = new Event();
        event.step = this.step;
        event.card_id = card_id;
        // TODO: Add event log.
        if (facility.getType() === __WEBPACK_IMPORTED_MODULE_2__facility__["a" /* FacilityType */].Blue) {
            let amount = owner.addMoney(facility.getPropertyValue());
            event.type = EventType.Blue;
            event.moneys[owner_id] += amount;
        }
        else if (facility.getType() === __WEBPACK_IMPORTED_MODULE_2__facility__["a" /* FacilityType */].Green) {
            if (player_id === owner_id) {
                let amount = owner.addMoney(facility.getPropertyValue());
                event.type = EventType.Green;
                event.moneys[owner_id] += amount;
            }
        }
        else if (facility.getType() === __WEBPACK_IMPORTED_MODULE_2__facility__["a" /* FacilityType */].Red) {
            if (player_id !== owner_id) {
                let value = facility.getPropertyValue();
                let amount = this.moveMoney(player_id, owner_id, value);
                event.type = EventType.Red;
                event.moneys[player_id] -= amount;
                event.moneys[owner_id] += amount;
            }
        }
        else if (facility.getType() === __WEBPACK_IMPORTED_MODULE_2__facility__["a" /* FacilityType */].Purple) {
            if (player_id === owner_id) {
                let value = facility.getPropertyValue();
                event.type = EventType.Purple;
                for (let pid = 0; pid < this.players.length; ++pid) {
                    if (pid === owner_id) {
                        continue;
                    }
                    let amount = this.moveMoney(pid, owner_id, value);
                    event.moneys[pid] -= amount;
                    event.moneys[owner_id] += amount;
                }
            }
        }
        if (event.type !== EventType.None) {
            this.events.push(event);
        }
    }
    getOverwriteCosts(x, y, size) {
        let costs = [0, 0, 0, 0];
        for (let card_id of this.getOverlappedFacilities(x, y, size)) {
            let owner_id = this.getOwnerId(card_id);
            if (owner_id === this.getCurrentPlayerId()) {
                continue;
            }
            costs[owner_id] += this.getFacility(card_id).getCost() * 2;
        }
        return costs;
    }
    availablePosition(card_id) {
        let positions = [];
        let facility = this.card_manager.getFacility(card_id);
        // TODO: support multiple x. (e.g. 7-9)
        let area = facility.getArea();
        let columns;
        if (area.length === 0) {
            // area.length === 0 means anywhere.
            columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].splice(0, 13 - facility.size);
        }
        else {
            columns = area.map((x) => { return x - 1; }); // area is 1-origin.
        }
        for (let y = 0; y < this.board.row; y++) {
            for (let x of columns) {
                let available = true;
                for (let s = 0; s < facility.size; ++s) {
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
    }
    // Build a facility in the player's talon.
    // No overwrite an existing facility or no exceed the cost of the player's money.
    buildInitialFacility(player_id) {
        // Player ID is valid?
        if (player_id >= this.players.length) {
            return false;
        }
        let player = this.getPlayer(player_id);
        let card_id_list = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* shuffle */])(this.getPlayerCards(player_id).getTalon());
        for (let card_id of card_id_list) {
            if (this.isCharacter(card_id)) {
                continue;
            }
            let facility = this.card_manager.getFacility(card_id);
            let balance = player.getMoney() - facility.getCost();
            if (balance < 0) {
                continue;
            }
            let positions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* shuffle */])(this.availablePosition(card_id));
            if (positions.length === 0) {
                continue;
            }
            if (!this.card_manager.moveTalonToField(card_id)) {
                // Something is wrong.
                console.warn(`moveTalonToField(${card_id}) failed.`);
                return false;
            }
            let [x, y] = positions[0];
            this.board.setCardId(x, y, card_id, facility.size);
            player.setMoney(balance);
            return true;
        }
        return true; // True is returned even if no facility was built.
    }
    setLandmark() {
        const landmark_data_id = 10000;
        let landmark = new __WEBPACK_IMPORTED_MODULE_2__facility__["b" /* Facility */](landmark_data_id);
        let landmark_id = this.card_manager.addLandmark(landmark);
        let positions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* shuffle */])(this.availablePosition(landmark_id));
        if (positions.length === 0) {
            console.error("Landmark cannot be built.");
            return false;
        }
        let [x, y] = positions[0];
        this.board.setCardId(x, y, landmark_id, landmark.size);
        return true;
    }
    drawCards(player_id, num_cards) {
        let card_ids = [];
        for (let i = 0; i < num_cards; ++i) {
            let drawn = this.getPlayerCards(player_id).dealToHand();
            if (drawn === -1) {
                break;
            }
            card_ids.push(drawn);
        }
        return card_ids;
    }
    useCharacter(player_id, card_id) {
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
        let character = this.card_manager.getCharacter(card_id);
        let event = new Event();
        event.type = EventType.Character;
        event.card_id = card_id;
        event.step = this.step;
        event.player_id = player_id;
        this.events.push(event);
        if (character.type === __WEBPACK_IMPORTED_MODULE_2__facility__["c" /* CharacterType */].DrawCards) {
            event.target_card_ids = this.drawCards(player_id, character.getPropertyValue());
            event.player_id = player_id;
        }
        else {
            this.effect_manager.addCard(character.data_id, this.round, this.turn);
        }
        // Move the card to discard.
        if (!this.card_manager.moveHandToDiscard(card_id)) {
            // Something is wrong.
            console.warn(`moveHandToDiscard(${card_id}) failed.`);
            return false;
        }
        this.done(Phase.CharacterCard);
        return true;
    }
    // TODO: move this function to Board?
    getOverlappedFacilities(x, y, size) {
        let card_ids = [];
        let prev_id = -1;
        for (let i = 0; i < size; ++i) {
            let card_id = this.board.getCardId(x + i, y);
            if (card_id === prev_id || card_id === -1) {
                continue;
            }
            card_ids.push(card_id);
            prev_id = card_id;
        }
        return card_ids;
    }
    buildFacility(player_id, x, y, card_id) {
        // Facility is a landmark?
        if (this.card_manager.isLandmark(card_id)) {
            return this.buildLandmark(player_id, card_id);
        }
        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return false;
        }
        // Is pass?  (valid action, but not build a facility).
        if (x === -1 && y === -1 && card_id === -1) {
            this.done(Phase.BuildFacility);
            return true;
        }
        // Facility is valid?
        let facility = this.card_manager.getFacility(card_id);
        if (!facility) {
            return false;
        }
        // Facility is in owner's hand?
        if (!this.card_manager.isInHand(player_id, card_id)) {
            return false;
        }
        // Facility's owner is valid?
        let facility_owner = this.getOwnerId(card_id);
        if (facility_owner !== player_id) {
            return false;
        }
        // Facility's area is valid?
        let area = x + 1;
        if (!this.card_manager.isInArea(area, card_id)) {
            return false;
        }
        let event = new Event();
        let overlapped = this.getOverlappedFacilities(x, y, facility.size);
        for (let card_id_on_board of overlapped) {
            // Facility on the board is overwritable?
            if (!this.card_manager.canOverwrite(card_id_on_board)) {
                return false;
            }
        }
        // Money is valid?
        let overwrite_costs = this.getOverwriteCosts(x, y, facility.size);
        let total_cost = facility.cost;
        for (let i = 0; i < overwrite_costs.length; ++i) {
            total_cost += overwrite_costs[i];
        }
        let player = this.players[player_id];
        if (total_cost > player.getMoney()) {
            return false;
        }
        // Update the data.
        this.board.removeCards(x, y, facility.size);
        for (let card_id_on_board of overlapped) {
            // Delete the existing facility.
            if (!this.card_manager.moveFieldToDiscard(card_id_on_board)) {
                // Something is wrong.
                console.warn(`moveFieldToDiscard(${card_id_on_board}) failed.`);
                return false;
            }
        }
        // Build the new facility.
        if (!this.card_manager.moveHandToField(card_id)) {
            // Something is wrong.
            console.warn(`moveHandToField(${card_id}) failed.`);
            return false;
        }
        // Merge overwrite_costs and total_cost;
        overwrite_costs[player_id] -= total_cost;
        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Build;
        event.moneys = overwrite_costs;
        event.card_id = card_id;
        event.player_id = player_id;
        this.board.setCardId(x, y, card_id, facility.size);
        for (let i = 0; i < this.players.length; ++i) {
            this.players[i].addMoney(overwrite_costs[i]);
        }
        this.done(Phase.BuildFacility);
        return true;
    }
    buildLandmark(player_id, card_id) {
        // State is valid?
        if (!this.isValid(player_id, Phase.BuildFacility)) {
            return false;
        }
        // Is a landmark?
        if (!this.card_manager.isLandmark(card_id)) {
            return false;
        }
        // Facility is valid?
        let facility = this.card_manager.getFacility(card_id);
        if (!facility) {
            return false;
        }
        // Isn't already built?
        let facility_owner = this.getOwnerId(card_id);
        if (facility_owner !== -1) {
            // Already built.
            return false;
        }
        // Money is valid?
        let player = this.players[player_id];
        let cost = facility.getCost();
        let balance = player.getMoney() - cost;
        if (balance < 0) {
            return false;
        }
        // Update the data.
        player.setMoney(balance);
        this.card_manager.buildLandmark(player_id, card_id);
        let event = new Event();
        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Build;
        event.moneys[player_id] -= cost;
        event.card_id = card_id;
        this.done(Phase.BuildFacility);
        return true;
    }
    paySalary() {
        let salary = this.getCurrentPlayer().paySalary();
        let event = new Event();
        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Salary;
        event.moneys[this.current_player_id] += salary;
        this.done(Phase.PaySalary);
        return true;
    }
    endTurn() {
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
    }
    endGame() {
        // Do nothing so far.
        this.done(Phase.EndGame);
        return true;
    }
    quit(player_id) {
        let event = new Event();
        this.events.push(event);
        event.step = this.step;
        event.type = EventType.Quit;
        event.player_id = player_id;
        // TODO: Do not end the game. Swith to AI.
        this.phase = Phase.EndGame;
        this.step++;
        return true;
    }
    getEvents() {
        return this.events;
    }
    getStep() {
        return this.step;
    }
    getPhase() {
        return this.phase;
    }
    getBoard() {
        return this.board;
    }
    getPlayers() {
        return this.players;
    }
    getFacility(card_id) {
        return this.card_manager.getFacility(card_id);
    }
    isFacility(card_id) {
        return this.card_manager.isFacility(card_id);
    }
    getCardIdOnBoard(x, y) {
        return this.board.getCardId(x, y);
    }
    getFacilityOnBoard(x, y) {
        return this.card_manager.getFacility(this.getCardIdOnBoard(x, y));
    }
    getOwnerIdOnBoard(x, y) {
        return this.getOwnerId(this.getCardIdOnBoard(x, y));
    }
    getCurrentPlayerId() {
        return this.current_player_id;
    }
    getCurrentPlayer() {
        return this.getPlayer(this.current_player_id);
    }
    getPlayer(player_id) {
        if (player_id == null || player_id < 0) {
            return null;
        }
        return this.players[player_id];
    }
    getPlayerCards(player_id) {
        return this.card_manager.getPlayerCards(player_id);
    }
    getSortedHand(player_id) {
        return this.card_manager.sortFacilitiesForHand(this.getPlayerCards(player_id).getHand());
    }
    isLandmark(card_id) {
        return this.card_manager.isLandmark(card_id);
    }
    getLandmarks() {
        return this.card_manager.getLandmarks();
    }
    getOwnerId(card_id) {
        return this.card_manager.getOwner(card_id);
    }
    getOwner(card_id) {
        return this.getPlayer(this.getOwnerId(card_id));
    }
    getWinner() {
        return this.winner;
    }
    getPosition(card_id) {
        return this.board.getPosition(card_id);
    }
    getDiceResult() {
        return this.dice_result;
    }
    isCharacter(card_id) {
        return this.card_manager.isCharacter(card_id);
    }
    getCharacter(card_id) {
        return this.card_manager.getCharacter(card_id);
    }
    getDiceDelta() {
        return this.effect_manager.getDiceDelta();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Session;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Connection {
}
/* harmony export (immutable) */ __webpack_exports__["c"] = Connection;

class Client {
    constructor(connection) {
        this.session_id = 0;
        this.matching_id = 0;
        this.mode = 0;
        this.player_id = 0;
        // TODO: user_id should be unique. 0 - 9 is reserved for NPCs.
        this.user_id = String(Math.floor(Math.random() * 1000000) + 10);
        this.step = 0;
        this.connection = connection;
    }
    matching(query) {
        query.command = "matching";
        query.user_id = this.user_id;
        this.connection.matching(query, this.callbackMatching.bind(this));
    }
    callbackMatching(response) {
        const response_json = JSON.parse(response);
        this.session_id = response_json.session_id;
        this.player_id = response_json.player_id;
        this.matching_id = response_json.matching_id;
        this.connection.checkUpdate(this);
        this.connection.startCheckUpdate(this);
    }
    sendRequest(request) {
        request.session_id = this.session_id;
        request.player_id = this.player_id;
        this.connection.sendRequest(request, this.callback);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Client;

// Move this class to a Saikoro specific file.
class Request {
    static matching(name, mode, deck) {
        return {
            command: "matching",
            name: name,
            mode: mode,
            deck: deck,
        };
    }
    static buildFacility(x, y, card_id) {
        return {
            command: "build",
            x: x,
            y: y,
            card_id: card_id,
        };
    }
    static rollDice(dice_num, aim) {
        return {
            command: "dice",
            dice_num: dice_num,
            aim: aim,
        };
    }
    static characterCard(card_id) {
        return {
            command: "character",
            card_id: card_id,
        };
    }
    static endTurn() {
        return {
            command: "build",
            x: -1,
            y: -1,
            card_id: -1,
        };
    }
    static quit() {
        return {
            command: "quit",
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Request;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GameMode; });
var GameMode;
(function (GameMode) {
    GameMode[GameMode["OffLine"] = 0] = "OffLine";
    GameMode[GameMode["OnLineSingle"] = 1] = "OnLineSingle";
    GameMode[GameMode["OnLine2Players"] = 2] = "OnLine2Players";
})(GameMode || (GameMode = {}));
;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Player {
    constructor(user_id, id, name, money, salary, team, is_auto = false) {
        this.user_id = user_id;
        this.id = id;
        this.name = name;
        this.money = money;
        this.salary = salary;
        this.team = team;
        this.is_auto = is_auto;
    }
    toJSON() {
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
    }
    static fromJSON(json) {
        return new Player(json.user_id, json.id, json.name, json.money, json.salary, json.team, json.is_auto);
    }
    getMoney() {
        return this.money;
    }
    setMoney(money) {
        this.money = money;
    }
    addMoney(money) {
        if (this.money + money < 0) {
            money = -this.money;
        }
        this.money += money;
        return money; // can be less than money.
    }
    paySalary() {
        this.money += this.salary;
        return this.salary;
    }
    isAuto() {
        return this.is_auto;
    }
    setAuto(is_auto) {
        this.is_auto = is_auto;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Player;

const NO_FACILITY = -1;
/* unused harmony export NO_FACILITY */

const MULTIPLE = -2;
/* unused harmony export MULTIPLE */
 // Used for facilities whose size is more than 1.
// Used for facilities whose size is more than 1.
class Board {
    constructor(field = null, row = 5, column = 12) {
        this.row = row;
        this.column = column;
        if (field) {
            this.field = field;
        }
        else {
            this.field = [];
            for (let x = 0; x < this.column; ++x) {
                this.field[x] = [];
                for (let y = 0; y < this.row; ++y) {
                    this.field[x][y] = -1; // NO_FACILITY
                }
            }
        }
    }
    toJSON() {
        return {
            class_name: "Board",
            field: this.field,
            row: this.row,
            column: this.column,
        };
    }
    static fromJSON(json) {
        return new Board(json.field, json.row, json.column);
    }
    removeCards(x, y, size) {
        let removed = [];
        let xi = x;
        // Find the left most.
        if (this.field[x][y] === MULTIPLE) {
            for (; xi >= 0; --xi) {
                if (this.field[xi][y] !== MULTIPLE) {
                    break;
                }
            }
        }
        for (; xi < x + size; xi++) {
            // Delete the left most, which has the card id.
            let card_id = this.field[xi][y];
            this.field[xi][y] = NO_FACILITY;
            if (card_id === MULTIPLE || card_id === NO_FACILITY) {
                continue;
            }
            removed.push(card_id);
        }
        // Delete the rest of multiple parts.
        for (; xi < this.column; ++xi) {
            if (this.field[xi][y] !== MULTIPLE) {
                break;
            }
            this.field[xi][y] = NO_FACILITY;
        }
        return removed;
    }
    setCardId(x, y, card_id, size) {
        this.field[x][y] = card_id;
        for (let i = 1; i < size; ++i) {
            this.field[x + i][y] = MULTIPLE;
        }
    }
    getCardId(x, y) {
        let card_id = NO_FACILITY;
        for (let i = x; i >= 0; --i) {
            card_id = this.field[i][y];
            if (card_id !== MULTIPLE) {
                break;
            }
        }
        return card_id;
    }
    getRawCardId(x, y) {
        return this.field[x][y];
    }
    getPosition(card_id) {
        for (let y = 0; y < this.row; ++y) {
            for (let x = 0; x < this.column; ++x) {
                if (this.field[x][y] === card_id) {
                    return [x, y];
                }
            }
        }
        return [-1, -1];
    }
    debugString() {
        let output = "";
        for (let y = 0; y < this.row; ++y) {
            for (let x = 0; x < this.column; ++x) {
                output += this.field[x][y] + ", ";
            }
            output += "\n";
        }
        return output;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Board;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = shuffle;
function shuffle(array) {
    let shuffled_array = array.slice(0);
    for (let l = shuffled_array.length; l > 0; --l) {
        let i = Math.floor(Math.random() * l);
        [shuffled_array[i], shuffled_array[l - 1]] = [shuffled_array[l - 1], shuffled_array[i]];
    }
    return shuffled_array;
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__client__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__session__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__html_view__ = __webpack_require__(12);



// TODO: can be merged with Client?
class WebClient extends __WEBPACK_IMPORTED_MODULE_0__client__["a" /* Client */] {
    constructor(connection) {
        super(connection);
        this.no_update_count = 0;
        this.callback = this.callbackSession.bind(this);
        this.view = new __WEBPACK_IMPORTED_MODULE_2__html_view__["a" /* HtmlView */](this);
    }
    initBoard() {
        this.view.initView();
    }
    // Do not directly call this method.
    // Use this.callback.bind(this) as a wrapper of this method.
    callbackSession(response) {
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
        let session = __WEBPACK_IMPORTED_MODULE_1__session__["a" /* Session */].fromJSON(JSON.parse(response));
        if (session.getPhase() === __WEBPACK_IMPORTED_MODULE_1__session__["b" /* Phase */].EndGame) {
            this.connection.stopCheckUpdate();
        }
        let step = session.getStep();
        console.log(step);
        if (step === this.step) {
            console.log("Already updated.");
            return;
        }
        this.step = step;
        this.view.updateView(session, this.player_id);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WebClient;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__client__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__session_handler__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__protocol__ = __webpack_require__(3);



const mc = new __WEBPACK_IMPORTED_MODULE_1__session_handler__["a" /* MemcacheMock */]();
let session_handler = new __WEBPACK_IMPORTED_MODULE_1__session_handler__["b" /* SessionHandler */](mc);
class StandaloneConnection extends __WEBPACK_IMPORTED_MODULE_0__client__["c" /* Connection */] {
    startCheckUpdate(client) { }
    stopCheckUpdate() { }
    checkUpdate(client) {
        let query = {
            command: "board",
            session_id: client.session_id,
            player_id: client.player_id,
            step: client.step,
        };
        session_handler.handleCommand(query).then((data) => {
            client.callback(data.value);
        });
    }
    matching(query, callback) {
        session_handler.handleMatching(query).then((matched) => {
            callback(JSON.stringify({ matching_id: matched.matching_id,
                player_id: matched.player_id,
                session_id: matched.session_id }));
        });
    }
    sendRequest(query, callback) {
        session_handler.handleCommand(query).then((data) => {
            callback(data.value);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StandaloneConnection;

class HybridConnection extends __WEBPACK_IMPORTED_MODULE_0__client__["c" /* Connection */] {
    constructor(online_connection = null) {
        super();
        this.online_connection = null;
        this.offline_connection = null;
        this.connection = null;
        this.online_connection = online_connection;
        this.offline_connection = new StandaloneConnection();
        this.connection = this.offline_connection;
    }
    setOnlineConnection(connection) {
        if (this.online_connection) {
            this.online_connection.stopCheckUpdate();
        }
        this.online_connection = connection;
    }
    startCheckUpdate(client) {
        this.connection.startCheckUpdate(client);
    }
    stopCheckUpdate() {
        this.connection.stopCheckUpdate();
    }
    checkUpdate(client) {
        this.connection.checkUpdate(client);
    }
    matching(query, callback) {
        this.connection.stopCheckUpdate();
        if ((query.mode !== __WEBPACK_IMPORTED_MODULE_2__protocol__["a" /* GameMode */].OffLine) && (this.online_connection != null)) {
            this.connection = this.online_connection;
        }
        else {
            this.connection = this.offline_connection;
        }
        this.connection.matching(query, callback);
    }
    sendRequest(query, callback) {
        this.connection.sendRequest(query, callback);
    }
}
/* unused harmony export HybridConnection */



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__session__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(5);


class AutoPlay {
    static play(session) {
        let player_id = session.getCurrentPlayerId();
        switch (session.getPhase()) {
            case __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].CharacterCard:
            case __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].DiceRoll:
                return session.diceRoll(player_id, 2, 0);
            case __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].BuildFacility:
                return AutoPlay.playBuildFacility(session);
        }
        return false;
    }
    static playBuildFacility(session) {
        let landmarks = session.getLandmarks();
        let player_id = session.getCurrentPlayerId();
        let player = session.getPlayer(player_id);
        let money = player.getMoney();
        for (let landmark of landmarks) {
            if (session.getOwnerId(landmark) !== -1) {
                continue;
            }
            if (money >= session.getFacility(landmark).getCost()) {
                return session.buildLandmark(player_id, landmark);
            }
        }
        let card_ids = session.getPlayerCards(player_id).getHand();
        for (let card_id of card_ids) {
            if (session.isCharacter(card_id)) {
                continue;
            }
            let facility = session.getFacility(card_id);
            if (money < facility.getCost()) {
                continue;
            }
            // TODO: Enabled to overwrite existing facilities.
            // availablePosition does not return overwritable facilities.
            let positions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* shuffle */])(session.availablePosition(card_id));
            if (positions.length === 0) {
                continue;
            }
            let [x, y] = positions[0];
            return session.buildFacility(player_id, x, y, card_id);
        }
        return session.buildFacility(player_id, -1, -1, -1);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AutoPlay;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__facility__ = __webpack_require__(0);

class PlayerCards {
    constructor(talon = [], hand = [], field = [], discard = []) {
        this.max_hand = 10;
        this.talon = talon;
        this.hand = hand;
        this.field = field;
        this.discard = discard;
    }
    toJSON() {
        return {
            class_name: "PlayerCards",
            talon: this.talon,
            hand: this.hand,
            field: this.field,
            discard: this.discard,
        };
    }
    static fromJSON(json) {
        return new PlayerCards(json.talon, json.hand, json.field, json.discard);
    }
    getSize() {
        return this.talon.length + this.hand.length + this.field.length + this.discard.length;
    }
    getIndex(card_id, facility_array) {
        // indexOf is type sensitive (e.g. "1" is different value from 1).
        // card_id could be a string.
        if (typeof card_id !== "number") {
            console.warn(`card_id(${card_id}) is not a number`);
            card_id = Number(card_id);
        }
        return facility_array.indexOf(card_id);
    }
    deleteCardId(card_id, facility_array) {
        let index = this.getIndex(card_id, facility_array);
        if (index < 0) {
            console.warn("deleteCardId - index < 0.");
            return false;
        }
        facility_array.splice(index, 1);
        return true;
    }
    moveCardId(card_id, array_from, array_to) {
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
    }
    addTalon(card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        this.talon.push(card_id);
        return true;
    }
    getTalon() {
        return this.talon;
    }
    getHand() {
        return this.hand;
    }
    // Move a random facility from Talon to Hand.
    dealToHand() {
        if (this.talon.length === 0 || this.hand.length === this.max_hand) {
            return -1;
        }
        let random_index = Math.floor(Math.random() * this.talon.length);
        let card_id = this.talon[random_index];
        this.moveTalonToHand(card_id);
        return card_id;
    }
    getTalonSize() {
        return this.talon.length;
    }
    getHandSize() {
        return this.hand.length;
    }
    moveTalonToHand(card_id) {
        if (this.hand.length === this.max_hand) {
            return false;
        }
        return this.moveCardId(card_id, this.talon, this.hand);
    }
    isInHand(card_id) {
        let index = this.getIndex(card_id, this.hand);
        return (index >= 0);
    }
    // Used for initial build.
    moveTalonToField(card_id) {
        return this.moveCardId(card_id, this.talon, this.field);
    }
    moveHandToField(card_id) {
        return this.moveCardId(card_id, this.hand, this.field);
    }
    moveHandToDiscard(card_id) {
        return this.moveCardId(card_id, this.hand, this.discard);
    }
    moveFieldToDiscard(card_id) {
        return this.moveCardId(card_id, this.field, this.discard);
    }
}
/* unused harmony export PlayerCards */

class CardManager {
    constructor(facilities = {}, characters = {}, player_cards_list = null, landmarks = []) {
        this.max_card_size = 1000;
        this.landmark_id_base = 10000;
        this.facilities = facilities;
        this.characters = characters;
        if (player_cards_list) {
            this.player_cards_list = player_cards_list;
        }
        else {
            this.player_cards_list = [];
            for (let i = 0; i < 4; i++) {
                this.player_cards_list.push(new PlayerCards());
            }
        }
        this.landmarks = landmarks;
    }
    toJSON() {
        let facility_json = {};
        for (let id in this.facilities) {
            facility_json[id] = this.facilities[id].toJSON();
        }
        let character_json = {};
        for (let id in this.characters) {
            character_json[id] = this.characters[id].toJSON();
        }
        return {
            class_name: "CardManager",
            facilities: facility_json,
            characters: character_json,
            player_cards_list: this.player_cards_list.map(cards => { return cards.toJSON(); }),
            landmarks: this.landmarks,
        };
    }
    static fromJSON(json) {
        let facilities = {};
        for (let id in json.facilities) {
            facilities[id] = __WEBPACK_IMPORTED_MODULE_0__facility__["b" /* Facility */].fromJSON(json.facilities[id]);
        }
        let characters = {};
        for (let id in json.characters) {
            characters[id] = __WEBPACK_IMPORTED_MODULE_0__facility__["d" /* Character */].fromJSON(json.characters[id]);
        }
        return new CardManager(facilities, characters, json.player_cards_list.map(cards => { return PlayerCards.fromJSON(cards); }), json.landmarks);
    }
    addFacility(player_id, facility_data_id) {
        let player_cards = this.player_cards_list[player_id];
        if (player_cards == null) {
            return false;
        }
        let size = player_cards.getSize();
        if (size >= this.max_card_size) {
            return false;
        }
        // CardId is separated per player (i.e. player1 = 1000 - 1999).
        let card_id = player_id * this.max_card_size + size;
        this.facilities[card_id] = new __WEBPACK_IMPORTED_MODULE_0__facility__["b" /* Facility */](facility_data_id);
        player_cards.addTalon(card_id);
        return true;
    }
    addCharacter(player_id, character_data_id) {
        let player_cards = this.player_cards_list[player_id];
        if (player_cards == null) {
            return false;
        }
        let size = player_cards.getSize();
        if (size >= this.max_card_size) {
            return false;
        }
        // Character card ID starts from 500.
        const char_base = 500;
        // CardId is separated per player (i.e. player1 = 1000 - 1999).
        let card_id = player_id * this.max_card_size + char_base + size;
        this.characters[card_id] = new __WEBPACK_IMPORTED_MODULE_0__facility__["d" /* Character */](character_data_id);
        player_cards.addTalon(card_id);
        return true;
    }
    addLandmark(landmark) {
        let card_id = this.landmark_id_base + this.landmarks.length;
        this.facilities[card_id] = landmark;
        this.landmarks.push([card_id, -1]); // NO_PLAYER.
        return card_id;
    }
    buildLandmark(player_id, landmark_id) {
        for (let landmark_info of this.landmarks) {
            if (landmark_info[0] === landmark_id) {
                landmark_info[1] = player_id;
                return true;
            }
        }
        return false;
    }
    isCharacter(card_id) {
        return (this.characters[card_id] != undefined);
    }
    getCharacter(card_id) {
        if (card_id < 0) {
            return null;
        }
        return this.characters[card_id];
    }
    isLandmark(card_id) {
        for (let landmark_info of this.landmarks) {
            if (landmark_info[0] === card_id) {
                return true;
            }
        }
        return false;
    }
    getLandmarks() {
        let landmarks = [];
        for (let landmark_info of this.landmarks) {
            landmarks.push(landmark_info[0]);
        }
        return landmarks;
    }
    getFacility(card_id) {
        if (card_id < 0) {
            return null;
        }
        return this.facilities[card_id];
    }
    isFacility(card_id) {
        return ((this.facilities[card_id] != undefined) && !this.isLandmark(card_id));
    }
    getOwner(card_id) {
        if (card_id < 0) {
            return -1;
        }
        if (this.isLandmark(card_id)) {
            for (let landmark_info of this.landmarks) {
                if (landmark_info[0] === card_id) {
                    return landmark_info[1];
                }
            }
            return -1;
        }
        // TODO: Check actual existance of card_id.
        // TODO: Owner can be changed while the game.
        return Math.floor(card_id / this.max_card_size);
    }
    getPlayerCards(player_id) {
        if (player_id < 0 || this.player_cards_list.length <= player_id) {
            console.warn("player_id is invalid.");
            return null;
        }
        return this.player_cards_list[player_id];
    }
    getPlayerCardsFromCardId(card_id) {
        if (card_id < 0 || card_id >= this.landmark_id_base) {
            return null;
        }
        return this.player_cards_list[this.getOwner(card_id)];
    }
    isInHand(player_id, card_id) {
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
    }
    isInArea(area, card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return (this.facilities[card_id].getArea().indexOf(area) !== -1);
    }
    moveFieldToDiscard(card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveFieldToDiscard(card_id);
    }
    moveHandToField(card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveHandToField(card_id);
    }
    moveHandToDiscard(card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveHandToDiscard(card_id);
    }
    // Used for initial build.
    moveTalonToField(card_id) {
        if (card_id < 0) {
            console.warn("card_id < 0.");
            return false;
        }
        return this.getPlayerCardsFromCardId(card_id).moveTalonToField(card_id);
    }
    compareCharacters(id1, id2) {
        let char1 = this.characters[id1];
        let char2 = this.characters[id2];
        return char1.data_id - char2.data_id;
    }
    compareAreas(area1, area2) {
        let len1 = area1.length;
        let len2 = area2.length;
        for (let i = 0; i < Math.min(len1, len2); ++i) {
            if (area1[i] === area2[i]) {
                continue;
            }
            return area1[i] - area2[i];
        }
        return len1 - len2;
    }
    sortFacilitiesForHand(facilities) {
        return facilities.sort((id1, id2) => {
            // Check cases of character cards.
            let c1 = this.isCharacter(id1) ? 1 : 0;
            let c2 = this.isCharacter(id2) ? 1 : 0;
            if (c1 + c2 === 2) {
                return this.compareCharacters(id1, id2);
            }
            else if (c1 + c2 === 1) {
                return c1 - c2;
            }
            // Both IDs represents facilities.
            let f1 = this.facilities[id1];
            let f2 = this.facilities[id2];
            let comp_area = this.compareAreas(f1.area, f2.area);
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
    }
    // Check if the facility is overwritable regardless the cost.
    canOverwrite(card_id) {
        if (this.isLandmark(card_id)) {
            return false;
        }
        return true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CardManager;

class CardEffect {
    constructor(data_id, round, turn) {
        this.data_id = data_id;
        this.character = new __WEBPACK_IMPORTED_MODULE_0__facility__["d" /* Character */](data_id);
        this.round = round;
        this.turn = turn;
    }
    toJSON() {
        return {
            class_name: "CardEffect",
            data_id: this.data_id,
            // Character is not encoded. data_id can reproduce Character.
            round: this.round,
            turn: this.turn,
        };
    }
    static fromJSON(json) {
        return new CardEffect(json.data_id, json.round, json.turn);
    }
}
/* unused harmony export CardEffect */

class EffectManager {
    constructor(cards = []) {
        this.cards = cards;
    }
    toJSON() {
        let cards = this.cards.map((card) => { return card.toJSON(); });
        return {
            class_name: "EffectManager",
            cards: cards,
        };
    }
    static fromJSON(json) {
        let cards = json.cards.map((card) => { return CardEffect.fromJSON(card); });
        return new EffectManager(cards);
    }
    addCard(data_id, round, turn) {
        this.cards.push(new CardEffect(data_id, round, turn));
    }
    // Remove expired cards.
    expire(round, turn) {
        let new_cards = [];
        const round_factor = 10; // Any number >= 4.
        for (let card of this.cards) {
            if ((card.round + card.character.round) * round_factor + card.turn >
                round * round_factor + turn) {
                new_cards.push(card);
            }
        }
        this.cards = new_cards;
    }
    getDiceDelta() {
        let delta = 0;
        for (let card of this.cards) {
            if (card.character.type === __WEBPACK_IMPORTED_MODULE_0__facility__["c" /* CharacterType */].DiceDelta) {
                delta += card.character.property["delta"];
            }
        }
        return delta;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = EffectManager;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__facility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__board__ = __webpack_require__(4);


class DeckMaker {
    constructor() {
        this.deck = [];
        this.cards = {}; // key is CardId.
        this.board = new __WEBPACK_IMPORTED_MODULE_1__board__["a" /* Board */]();
        this.availables = [];
        for (let x = 0; x < this.board.column; ++x) {
            this.availables[x] = __WEBPACK_IMPORTED_MODULE_0__facility__["e" /* CardData */].getAvailableFacilities(x + 1);
        }
    }
    getAvailableFacilities(x) {
        return this.availables[x];
    }
    setFacility(x, y, data_id) {
        let facility = new __WEBPACK_IMPORTED_MODULE_0__facility__["b" /* Facility */](data_id); // TODO: Can refer FACILITY_DATA instead?
        // Check the facility's area.
        let valid = false;
        for (let s = 0; s < facility.size; ++s) {
            if (facility.area.indexOf(x + 1 - s) !== -1) {
                x = x - s;
                valid = true;
                break;
            }
        }
        if (!valid) {
            return false;
        }
        let size = facility.size;
        this.board.removeCards(x, y, size).map((removed) => {
            delete this.cards[removed];
        });
        let card_id = this.board.row * x + y;
        this.board.setCardId(x, y, card_id, size);
        this.cards[card_id] = data_id;
        return true;
    }
    getFacility(card_id) {
        return new __WEBPACK_IMPORTED_MODULE_0__facility__["b" /* Facility */](this.cards[card_id]); // TODO: Create a Facility pool.
    }
    removeFacility(x, y) {
        this.board.removeCards(x, y, 1).map((removed) => {
            delete this.cards[removed];
        });
    }
    getFacilityDataIds() {
        return Object.keys(this.cards).map((key) => { return this.cards[key]; });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DeckMaker;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class DiceResult {
    constructor(dice1, dice2, delta = 0, is_miracle = false, miracle_dice1 = 0, miracle_dice2 = 0) {
        this.dice1 = dice1;
        this.dice2 = dice2;
        this.delta = delta;
        this.is_miracle = is_miracle;
        this.miracle_dice1 = miracle_dice1;
        this.miracle_dice2 = miracle_dice2;
    }
    toJSON() {
        return {
            class_name: "DiceResult",
            dice1: this.dice1,
            dice2: this.dice2,
            delta: this.delta,
            is_miracle: this.is_miracle,
            miracle_dice1: this.miracle_dice1,
            miracle_dice2: this.miracle_dice2,
        };
    }
    static fromJSON(json) {
        return new DiceResult(json.dice1, json.dice2, json.delta, json.is_miracle, json.miracle_dice1, json.miracle_dice2);
    }
    result() {
        if (this.is_miracle) {
            return this.miracle_dice1 + this.miracle_dice2 + this.delta;
        }
        return this.dice1 + this.dice2 + this.delta;
    }
    debugString() {
        return JSON.stringify(this);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DiceResult;

class Dice {
    static roll(dice_num, aim = 0, delta = 0) {
        let dice2_factor = (dice_num === 2) ? 1 : 0;
        let dice1 = Dice.roll1();
        let dice2 = Dice.roll1() * dice2_factor;
        if (dice1 + dice2 === aim) {
            // Lucky, but not miracle lucky.
            return new DiceResult(dice1, dice2, delta, false);
        }
        // Try again for miracle.
        let miracle_dice1 = Dice.roll1();
        let miracle_dice2 = Dice.roll1() * dice2_factor;
        if (miracle_dice1 + miracle_dice2 === aim) {
            return new DiceResult(dice1, dice2, delta, true, miracle_dice1, miracle_dice2);
        }
        return new DiceResult(dice1, dice2, delta, false);
    }
    static roll1() {
        return Math.floor(Math.random() * 6) + 1;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Dice;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__session__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__client__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__deck_maker__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__protocol__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__html_view_parts__ = __webpack_require__(13);






const COLOR_FIELD = "#EFF0D1";
const COLOR_LANDMARK = "#B0BEC5";
const COLOR_CLICKABLE = "#FFCA28";
const COLOR_HIGHTLIGHT_CARD = "#FFE082";
const COLOR_CHARACTER = "#FFF9C4";
const COLOR_PLAYERS = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];
const COLOR_GRAY = "#B0BEC5";
const COLOR_BLUE = "#90CAF9";
const COLOR_GREEN = "#A5D6A7";
const COLOR_RED = "#EF9A9A";
const COLOR_PURPLE = "#B39DDB";
var Scene;
(function (Scene) {
    Scene[Scene["Matching"] = 0] = "Matching";
    Scene[Scene["Game"] = 1] = "Game";
})(Scene || (Scene = {}));
class HtmlView {
    constructor(client) {
        this.event_drawer_timer = null;
        this.session = null;
        this.prev_session = null;
        this.prev_step = -1;
        this.clicked_card_view = null;
        this.deck_maker = new __WEBPACK_IMPORTED_MODULE_3__deck_maker__["a" /* DeckMaker */]();
        this.clicked_field = [0, 0];
        this.cards_views = [];
        this.player_views = [];
        this.landmarks_view = null;
        this.field_card_view = null;
        this.char_motion_view = null;
        this.money_motion_view = null;
        this.message_view = null;
        this.buttons_view = null;
        this.clicakable_fiels_view = null;
        this.scene = Scene.Matching;
        this.client = client;
        this.prev_session = new __WEBPACK_IMPORTED_MODULE_0__session__["a" /* Session */]();
    }
    initView(column = 12, row = 5) {
        // Add click listeners.
        // Matching.
        document.getElementById("matching_button_offline").addEventListener("click", () => { this.onClickMatching(__WEBPACK_IMPORTED_MODULE_4__protocol__["a" /* GameMode */].OffLine); });
        document.getElementById("matching_button_online").addEventListener("click", () => { this.onClickMatching(__WEBPACK_IMPORTED_MODULE_4__protocol__["a" /* GameMode */].OnLineSingle); });
        document.getElementById("matching_button_2players").addEventListener("click", () => { this.onClickMatching(__WEBPACK_IMPORTED_MODULE_4__protocol__["a" /* GameMode */].OnLine2Players); });
        // Hide components for game.
        document.getElementById("players").style.display = "none";
        // buttons.
        this.buttons_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["a" /* HtmlButtonsView */]("buttons");
        this.buttons_view.none();
        this.buttons_view.dice1.addClickListener(() => { this.onClickDice(1, 0); });
        this.buttons_view.dice2.addClickListener(() => { this.onClickDice(2, 0); });
        this.buttons_view.char_card.addClickListener(() => { this.onClickCharacter(); });
        this.buttons_view.end_turn.addClickListener(() => { this.onClickEndTurn(); });
        // Message view.
        this.message_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["b" /* HtmlMessageView */]("message");
        this.message_view.none();
        // HtmlPlayerView
        for (let pid = 0; pid < 4; ++pid) {
            let player_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["c" /* HtmlPlayerView */](pid);
            player_view.none();
            this.player_views.push(player_view);
        }
        // HtmlCardsView
        let card_size = 10;
        for (let pid = 0; pid < 4; ++pid) {
            let cards_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["d" /* HtmlCardsView */](`card_${pid}`, card_size);
            cards_view.none();
            for (let c = 0; c < card_size; ++c) {
                cards_view.cards[c].addClickListener(() => { this.onClickCard(pid, c); });
            }
            this.cards_views.push(cards_view);
        }
        this.cards_views[0].show();
        // Landmark cards
        let landmark_size = 5;
        this.landmarks_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["d" /* HtmlCardsView */]("landmark", landmark_size);
        this.landmarks_view.none();
        for (let i = 0; i < landmark_size; ++i) {
            this.landmarks_view.cards[i].addClickListener(() => { this.onClickLandmark(i); });
        }
        // Field card
        this.field_card_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["e" /* HtmlCardView */]("field_card");
        this.field_card_view.none();
        // Fields
        this.clicakable_fiels_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["f" /* HtmlClickableFieldsView */]("click", row, column);
        for (let y = 0; y < row; ++y) {
            for (let x = 0; x < column; ++x) {
                this.clicakable_fiels_view.fields[x][y].addClickListener(() => { this.onClickField(x, y); });
            }
        }
        // Character motion
        this.char_motion_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["e" /* HtmlCardView */]("char_motion");
        this.char_motion_view.none();
        // Money motion
        this.money_motion_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["g" /* HtmlViewObject */](document.getElementById("money_motion"));
        this.money_motion_view.none();
    }
    onClickDeckField(x, y) {
        let [px, py] = this.clicked_field;
        this.clicakable_fiels_view.setClickable(this.clicked_field, false);
        this.clicked_field = [x, y];
        if (px === x && py === y) {
            this.deck_maker.removeFacility(x, y);
            this.drawDeckBoard();
            return;
        }
        this.clicakable_fiels_view.setClickable(this.clicked_field, true);
        let i = 0;
        let data_ids = this.deck_maker.getAvailableFacilities(x);
        for (; i < data_ids.length; ++i) {
            let facility = new __WEBPACK_IMPORTED_MODULE_1__facility__["b" /* Facility */](data_ids[i]);
            let card_view = new __WEBPACK_IMPORTED_MODULE_5__html_view_parts__["e" /* HtmlCardView */](`card_0_${i}`);
            card_view.drawFacilityCard(facility);
        }
        for (; i < 10; ++i) {
            document.getElementById(`card_0_${i}`).style.display = "none";
        }
    }
    onClickField(x, y) {
        console.log(`clicked: field_${x}_${y}`);
        // Event on matching.
        if (this.scene === Scene.Matching) {
            this.onClickDeckField(x, y);
            return;
        }
        // Event on game (this.scene === Scene.Game).
        if (this.clicked_card_view == null) {
            this.drawFieldInfo(x, y);
            return;
        }
        let card_id = this.clicked_card_view.getCardId();
        this.client.sendRequest(__WEBPACK_IMPORTED_MODULE_2__client__["b" /* Request */].buildFacility(x, y, card_id));
    }
    onClickDice(dice_num, aim) {
        this.client.sendRequest(__WEBPACK_IMPORTED_MODULE_2__client__["b" /* Request */].rollDice(dice_num, aim));
    }
    onClickCharacter() {
        if (this.clicked_card_view == null) {
            return;
        }
        this.client.sendRequest(__WEBPACK_IMPORTED_MODULE_2__client__["b" /* Request */].characterCard(this.clicked_card_view.getCardId()));
    }
    onClickEndTurn() {
        this.client.sendRequest(__WEBPACK_IMPORTED_MODULE_2__client__["b" /* Request */].endTurn());
    }
    onClickMatching(mode) {
        let name = document.getElementById("matching_name").value;
        if (name.length === 0) {
            return;
        }
        let deck = document.getElementById("deck").value;
        this.client.matching(__WEBPACK_IMPORTED_MODULE_2__client__["b" /* Request */].matching(name, mode, deck));
    }
    onClickCard(player, card) {
        // Event on matching.
        if (this.scene === Scene.Matching) {
            let [x, y] = this.clicked_field;
            let data_id = this.deck_maker.getAvailableFacilities(x)[card];
            this.deck_maker.setFacility(x, y, data_id);
            this.drawDeckBoard();
            return;
        }
        // Event on game (this.scene === Scene.Game).
        let clicked_card_id = this.cards_views[player].cards[card].getCardId();
        let phase = this.session.getPhase();
        let is_char = this.session.isCharacter(clicked_card_id);
        let is_valid = ((phase === __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].CharacterCard) && is_char ||
            (phase === __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].BuildFacility) && !is_char);
        if (!is_valid) {
            return;
        }
        console.log(`clicked: card_${player}_${card}`);
        if (this.clicked_card_view && clicked_card_id === this.clicked_card_view.getCardId()) {
            this.resetCards();
            this.drawBoard(this.session); // TODO: draw click fields only.
            return;
        }
        this.resetCards();
        this.clicked_card_view = this.cards_views[player].cards[card];
        this.clicked_card_view.setHighlight(true);
        this.drawBoard(this.session);
        if (phase === __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].CharacterCard) {
            this.buttons_view.char_card.setClickable(true);
        }
        if (phase === __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].BuildFacility) {
            this.clicakable_fiels_view.setClickableAreas(this.session.getFacility(clicked_card_id).getArea());
        }
    }
    onClickLandmark(card) {
        if (this.session.getPhase() !== __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].BuildFacility) {
            return;
        }
        console.log(`clicked: landmark_${card}`);
        let clicked_card_id = this.session.getLandmarks()[card];
        if (this.session.getOwnerId(clicked_card_id) !== -1) {
            return;
        }
        this.resetCards();
        this.clicked_card_view = this.landmarks_view.cards[card];
        this.clicked_card_view.setHighlight(true);
        this.drawBoard(this.session);
        this.clicakable_fiels_view.setClickable(this.session.getPosition(clicked_card_id), true);
    }
    getPlayerColor(player_id) {
        if (player_id === -1 || player_id > COLOR_PLAYERS.length) {
            return COLOR_FIELD;
        }
        return COLOR_PLAYERS[player_id];
    }
    getFacilityColor(facility) {
        if (!facility) {
            return COLOR_FIELD;
        }
        let type = facility.type;
        switch (type) {
            case __WEBPACK_IMPORTED_MODULE_1__facility__["a" /* FacilityType */].Gray:
                return COLOR_GRAY;
            case __WEBPACK_IMPORTED_MODULE_1__facility__["a" /* FacilityType */].Blue:
                return COLOR_BLUE;
            case __WEBPACK_IMPORTED_MODULE_1__facility__["a" /* FacilityType */].Green:
                return COLOR_GREEN;
            case __WEBPACK_IMPORTED_MODULE_1__facility__["a" /* FacilityType */].Red:
                return COLOR_RED;
            case __WEBPACK_IMPORTED_MODULE_1__facility__["a" /* FacilityType */].Purple:
                return COLOR_PURPLE;
        }
    }
    getDiceDeltaMessage(delta) {
        if (delta === 0) {
            return "";
        }
        let unit = (delta > 0) ? "+" : "";
        return `(${unit}${delta})`;
    }
    getDiceResultMessage(dice, pid) {
        let faces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        let d1 = dice.dice1;
        let d2 = dice.dice2;
        let delta = this.getDiceDeltaMessage(dice.delta);
        let name = this.session.getPlayer(pid).name;
        return `${name} のサイコロは ${faces[d1]} ${faces[d2]} ${delta}: ${dice.result()} でした。`;
    }
    resetCards() {
        if (this.clicked_card_view) {
            this.clicked_card_view.setHighlight(false);
            this.clicked_card_view = null;
        }
    }
    switchScene(scene) {
        this.scene = scene;
        if (scene === Scene.Game) {
            // Hide the matching view and show the board view.
            document.getElementById("matching").style.display = "none";
            // Show components for game.
            document.getElementById("players").style.display = "";
            // Message view.
            this.message_view.show();
            this.drawSession(this.session);
            return;
        }
    }
    updateView(session, player_id) {
        this.session = session;
        if (this.scene === Scene.Matching) {
            this.switchScene(Scene.Game);
        }
        // Show event animations.
        this.drawEvents();
        // Update buttons.
        this.buttons_view.draw(session, player_id);
    }
    drawCards(session) {
        let players = session.getPlayers();
        // Update cards.
        for (let i = 0; i < players.length; ++i) {
            if (this.client.player_id !== i) {
                this.cards_views[i].none();
                continue;
            }
            let card_ids = session.getSortedHand(i);
            this.cards_views[i].draw(session, card_ids);
            this.cards_views[i].show();
        }
        for (let i = players.length; i < 4; ++i) {
            this.cards_views[i].none();
        }
        // Update landmarks.
        let landmark_ids = session.getLandmarks();
        this.landmarks_view.draw(session, landmark_ids);
        this.landmarks_view.show();
        this.resetCards(); // Nice to check if built or not?
    }
    drawFieldInfo(x, y) {
        let card_id = this.session.getCardIdOnBoard(x, y);
        if (card_id === -1 || card_id === this.field_card_view.getCardId()) {
            this.field_card_view.none();
            this.field_card_view.setCardId(-1);
            return;
        }
        console.log("drawFieldInfo");
        this.field_card_view.draw(this.session, card_id);
        this.field_card_view.showAt(this.getPosition((x < 6) ? "click_10_1" : "click_0_1"));
    }
    drawBoard(session) {
        const board = session.getBoard();
        for (let y = 0; y < board.row; ++y) {
            for (let x = 0; x < board.column; ++x) {
                const facility_id = board.getRawCardId(x, y);
                const owner_id = session.getOwnerId(facility_id);
                let facility = (facility_id < 0) ? null : session.getFacility(facility_id);
                this.drawField(x, y, facility_id, facility, owner_id);
            }
        }
    }
    drawDeckBoard() {
        const board = this.deck_maker.board;
        for (let y = 0; y < board.row; ++y) {
            for (let x = 0; x < board.column; ++x) {
                const facility_id = board.getRawCardId(x, y);
                const owner_id = 0;
                let facility = (facility_id < 0) ? null : this.deck_maker.getFacility(facility_id);
                this.drawField(x, y, facility_id, facility, owner_id);
            }
        }
        this.clicakable_fiels_view.setClickable(this.clicked_field, true);
        document.getElementById("deck").innerText =
            JSON.stringify(this.deck_maker.getFacilityDataIds());
    }
    drawField(x, y, facility_id, facility, owner_id) {
        let field = document.getElementById(`field_${x}_${y}`);
        this.clicakable_fiels_view.setClickable([x, y], false);
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
        let owner_color = (owner_id === -1) ? COLOR_LANDMARK : this.getPlayerColor(owner_id);
        field.innerText = facility.getName();
        field.style.display = "";
        field.style.backgroundColor = owner_color;
        field.style.borderColor = this.getFacilityColor(facility);
        field.colSpan = facility.size;
    }
    drawPlayers() {
        let players = this.session.getPlayers();
        for (let i = 0; i < players.length; ++i) {
            this.player_views[i].draw(this.session);
        }
        for (let i = players.length; i < 4; ++i) {
            this.player_views[i].hide();
        }
    }
    drawStatusMessage() {
        let session = this.session;
        let players = session.getPlayers();
        let player_id = session.getCurrentPlayerId();
        // Update message.
        let current_player = players[player_id];
        let name = current_player.name;
        let phase = session.getPhase();
        let message = "";
        let color = this.getPlayerColor(player_id);
        if (phase === __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].StartGame) {
            message = "マッチング中です";
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].CharacterCard) {
            let delta = this.getDiceDeltaMessage(session.getDiceDelta());
            message = `${name} のキャラカードまたはサイコロ${delta}です`;
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].DiceRoll) {
            let delta = this.getDiceDeltaMessage(session.getDiceDelta());
            message = `${name} のサイコロ${delta}です`;
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].BuildFacility) {
            message = `${name} の建設です`;
            this.message_view.drawMessage(message, color);
            return true;
        }
        if (phase === __WEBPACK_IMPORTED_MODULE_0__session__["b" /* Phase */].EndGame) {
            let events = this.session.getEvents();
            for (let event of events) {
                if (event.type === __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Quit) {
                    message = `${players[event.player_id].name} が切断しました`;
                    this.message_view.drawMessage(message, this.getPlayerColor(event.player_id));
                    return true;
                }
            }
            let winner = session.getPlayer(session.getWinner()).name;
            message = `${name} の勝ちです`;
            this.message_view.drawMessage(message, this.getPlayerColor(session.getWinner()));
            return true;
        }
        return false;
    }
    drawSession(session) {
        this.drawStatusMessage();
        this.drawPlayers();
        this.drawBoard(session);
        this.drawCards(session);
        this.prev_session = this.session;
    }
    drawEvents() {
        const interval = 2000; // msec.
        if (this.event_drawer_timer) {
            // If setInterval is ongoing, use that one. No additional action.
        }
        else {
            // Show the first message soon.
            this.drawEvent();
            // After 2 sec, continuously call showMessageFromQueue every 2 sec.
            this.event_drawer_timer = setInterval(() => {
                if (!this.drawEvent()) {
                    // If the queue is empty, clear the timer.
                    clearInterval(this.event_drawer_timer);
                    this.event_drawer_timer = null;
                }
            }, interval);
        }
    }
    drawEvent() {
        let events = this.session.getEvents();
        let step = -1;
        let i = 0;
        for (; i < events.length; ++i) {
            // Skip passed events.
            if (events[i].step > this.prev_step) {
                step = events[i].step;
                break;
            }
        }
        if (step === -1) {
            // All events have been drawn. Then, draw the current status.
            this.drawSession(this.session);
            return false;
        }
        for (; i < events.length; ++i) {
            let event = events[i];
            if (event.step !== step) {
                break;
            }
            // Draw cards 
            if (event.type === __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Draw) {
                let current_player = this.session.getPlayer(event.player_id);
                let name = current_player.name;
                let delta = this.getDiceDeltaMessage(this.session.getDiceDelta());
                let message = `${name} のキャラカードまたはサイコロ${delta}です`;
                let color = this.getPlayerColor(event.player_id);
                this.message_view.drawMessage(message, color);
                // Do not show other's draw event.
                if (event.player_id !== this.client.player_id) {
                    continue;
                }
                this.effectCardDeals(event.player_id, event.target_card_ids);
                continue;
            }
            // Dice
            if (event.type === __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Dice) {
                let message = this.getDiceResultMessage(event.dice, event.player_id);
                let color = this.getPlayerColor(event.player_id);
                this.clicakable_fiels_view.animateDiceResult(event.dice.result(), color);
                this.message_view.drawMessage(message, color);
                continue;
            }
            // Character card
            if (event.type === __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Character) {
                this.effectCharacter(this.session.getCurrentPlayerId(), event.card_id);
                if (this.session.getCharacter(event.card_id).type === __WEBPACK_IMPORTED_MODULE_1__facility__["c" /* CharacterType */].DrawCards) {
                    this.effectCardDeals(event.player_id, event.target_card_ids);
                }
                continue;
            }
            if (event.type === __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Salary) {
                for (let pid = 0; pid < event.moneys.length; pid++) {
                    let money = event.moneys[pid];
                    if (money === 0) {
                        continue;
                    }
                    this.player_views[pid].addMoney(money);
                }
            }
            if (event.type === __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Build) {
                let [x, y] = this.session.getPosition(event.card_id);
                let facility = this.session.getFacility(event.card_id);
                this.prev_session.getBoard().removeCards(x, y, facility.size);
                this.prev_session.getBoard().setCardId(x, y, event.card_id, facility.size);
                if (this.prev_session.isFacility(event.card_id)) {
                    this.prev_session.getPlayerCards(event.player_id).moveHandToField(event.card_id);
                }
                // Draw the board after money motion.
                window.setTimeout(() => {
                    this.drawBoard(this.prev_session);
                    this.drawCards(this.prev_session);
                }, 1000);
            }
            const money_motion = [
                __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Blue,
                __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Green,
                __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Red,
                __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Purple,
                __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Build,
            ];
            if (money_motion.indexOf(event.type) !== -1) {
                // Money motion
                let [x, y] = this.session.getPosition(event.card_id);
                for (let pid = 0; pid < event.moneys.length; pid++) {
                    let money = event.moneys[pid];
                    if (money === 0) {
                        continue;
                    }
                    let delay = 0;
                    if ([__WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Red, __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Purple, __WEBPACK_IMPORTED_MODULE_0__session__["c" /* EventType */].Build].indexOf(event.type) !== -1 &&
                        money > 0) {
                        delay = 1000;
                    }
                    window.setTimeout(() => {
                        this.drawMoneyMotion(money, pid, x, y);
                    }, delay);
                }
            }
        }
        this.prev_step = step;
        return true;
    }
    drawMoneyMotion(money, player_id, x, y) {
        if (money > 0) {
            this.effectMoneyMotion(`field_${x}_${y}`, `player_${player_id}_money`, money);
        }
        else if (money < 0) {
            this.effectMoneyMotion(`player_${player_id}_money`, `field_${x}_${y}`, money);
        }
        this.player_views[player_id].addMoney(money);
    }
    getPosition(element_id) {
        let rect = document.getElementById(element_id).getBoundingClientRect();
        return [rect.left, rect.top];
    }
    effectCharacter(player_id, card_id) {
        this.char_motion_view.draw(this.session, card_id);
        // Animation.
        let new_view = this.char_motion_view.clone();
        new_view.showAt(this.getPosition(`player_${player_id}_money`));
        new_view.animateMoveTo(this.getPosition("field_5_2"));
        window.setTimeout(() => { new_view.remove(); }, 1500);
    }
    effectCardDeal(player_id, card_id) {
        this.char_motion_view.draw(this.session, card_id);
        // Animation.
        let new_view = this.char_motion_view.clone();
        new_view.showAt(this.getPosition(`player_${player_id}_money`));
        new_view.animateMoveTo(this.getPosition(`card_${player_id}_0`));
        window.setTimeout(() => { new_view.remove(); }, 1500);
    }
    effectCardDeals(player_id, card_ids) {
        if (this.client.player_id !== player_id) {
            return;
        }
        let timeout = 1000;
        for (let card_id of card_ids) {
            window.setTimeout(() => {
                this.effectCardDeal(player_id, card_id);
            }, timeout);
            timeout += 500;
        }
    }
    effectMoneyMotion(element_from, element_to, money) {
        this.money_motion_view.element.innerHTML = `💸 ${money}`;
        // Animation.
        let money_view = this.money_motion_view.clone();
        money_view.showAt(this.getPosition(element_from));
        money_view.animateMoveTo(this.getPosition(element_to));
        window.setTimeout(() => { money_view.remove(); }, 1500);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HtmlView;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Visibility */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__facility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__session__ = __webpack_require__(1);


// TODO: Move it to a new file for util.
const COLOR_FIELD = "#EFF0D1";
const COLOR_LANDMARK = "#B0BEC5";
const COLOR_CLICKABLE = "#FFCA28";
const COLOR_HIGHTLIGHT_CARD = "#FFE082";
const COLOR_CHARACTER = "#FFF9C4";
const COLOR_PLAYERS = ["#909CC2", "#D9BDC5", "#90C290", "#9D8189"];
const COLOR_GRAY = "#B0BEC5";
const COLOR_BLUE = "#90CAF9";
const COLOR_GREEN = "#A5D6A7";
const COLOR_RED = "#EF9A9A";
const COLOR_PURPLE = "#B39DDB";
function getFacilityColor(facility) {
    if (!facility) {
        return COLOR_FIELD;
    }
    let type = facility.type;
    switch (type) {
        case __WEBPACK_IMPORTED_MODULE_0__facility__["a" /* FacilityType */].Gray:
            return COLOR_GRAY;
        case __WEBPACK_IMPORTED_MODULE_0__facility__["a" /* FacilityType */].Blue:
            return COLOR_BLUE;
        case __WEBPACK_IMPORTED_MODULE_0__facility__["a" /* FacilityType */].Green:
            return COLOR_GREEN;
        case __WEBPACK_IMPORTED_MODULE_0__facility__["a" /* FacilityType */].Red:
            return COLOR_RED;
        case __WEBPACK_IMPORTED_MODULE_0__facility__["a" /* FacilityType */].Purple:
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
})(Visibility || (Visibility = {}));
class HtmlViewObject {
    constructor(element) {
        this.element = element;
    }
    setVisibility(visibility) {
        if (visibility === Visibility.Visible) {
            this.element.style.visibility = "visible";
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
    }
    show() {
        this.setVisibility(Visibility.Visible);
    }
    hide() {
        this.setVisibility(Visibility.Invisible);
    }
    none() {
        this.setVisibility(Visibility.None);
    }
    clone() {
        let new_node = this.element.cloneNode(true);
        let new_element = document.body.appendChild(new_node);
        return new HtmlViewObject(new_element);
    }
    remove() {
        document.body.removeChild(this.element);
    }
    addClickListener(callback) {
        this.element.addEventListener("click", callback);
    }
    showAt([x, y]) {
        // The parent element should be relative.
        this.element.style.zIndex = "2";
        this.element.style.position = "absolute";
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
        this.show();
    }
    animateMoveTo([x, y]) {
        let rect_from = this.element.getBoundingClientRect();
        let diff_x = x - rect_from.left;
        let diff_y = y - rect_from.top;
        this.element.style.visibility = "visible";
        this.element.style.zIndex = "2";
        this.element.style.position = "absolute";
        this.element.style.top = rect_from.top + "px";
        this.element.style.left = rect_from.left + "px";
        this.element.style.transitionDuration = "1s";
        this.element.style.transitionTimingFunction = "ease";
        this.element.style.transform = `translate(${diff_x}px, ${diff_y}px)`;
        window.setTimeout(() => { this.none(); }, 1500);
    }
}
/* harmony export (immutable) */ __webpack_exports__["g"] = HtmlViewObject;

class HtmlCardsView extends HtmlViewObject {
    constructor(element_id, max_size) {
        super(document.getElementById(element_id));
        this.element_id = element_id;
        this.max_size = max_size;
        this.cards = [];
        this.card_ids = [];
        for (let i = 0; i < this.max_size; ++i) {
            let card_view = new HtmlCardView(`${element_id}_${i}`);
            this.cards.push(card_view);
            card_view.none();
        }
    }
    draw(session, card_ids) {
        for (let i = 0; i < this.max_size; ++i) {
            this.cards[i].draw(session, (i < card_ids.length) ? card_ids[i] : -1);
        }
    }
    // TODO: Not necessary?
    setCardIds(card_ids) {
        this.card_ids = card_ids;
        let i = 0;
        for (; i < card_ids.length; ++i) {
            this.cards[i].setCardId(card_ids[i]);
        }
        for (; i < this.max_size; ++i) {
            this.cards[i].setCardId(-1);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = HtmlCardsView;

class HtmlCardView extends HtmlViewObject {
    constructor(element_id) {
        super(document.getElementById(element_id));
        this.element_id = element_id;
        this.card_id = -1;
        this.element_name = this.element.getElementsByClassName("card_name")[0];
        this.element_cost = this.element.getElementsByClassName("card_cost")[0];
        this.element_description = this.element.getElementsByClassName("card_description")[0];
    }
    setCardId(card_id) {
        this.card_id = card_id;
    }
    getCardId() {
        return this.card_id;
    }
    draw(session, card_id) {
        this.card_id = card_id;
        // No card
        if (card_id === -1) {
            this.none();
            return;
        }
        // Character
        if (session.isCharacter(card_id)) {
            let character = session.getCharacter(card_id);
            this.drawCharacterCard(character);
            return;
        }
        // Landmark
        if (session.isLandmark(card_id)) {
            let landmark = session.getFacility(card_id);
            let owner_id = session.getOwnerId(card_id);
            this.drawLandmarkCard(landmark, owner_id);
            return;
        }
        // Facility
        let facility = session.getFacility(card_id);
        this.drawFacilityCard(facility);
    }
    drawFacilityCard(facility) {
        let area = this.getFacilityAreaString(facility);
        this.element_name.innerText = `${area} ${facility.getName()}`;
        this.element_cost.innerText = String(facility.getCost());
        this.element_description.innerText = facility.getDescription();
        this.element.style.backgroundColor = getFacilityColor(facility);
        this.show();
    }
    drawCharacterCard(character) {
        this.element_name.innerText = character.getName();
        this.element_cost.innerText = "";
        this.element_description.innerText = character.getDescription();
        this.element.style.backgroundColor = COLOR_CHARACTER;
        this.show();
    }
    drawLandmarkCard(landmark, owner_id) {
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
    }
    setHighlight(is_highlight) {
        this.element.style.borderColor = is_highlight ? COLOR_HIGHTLIGHT_CARD : "#EEEEEE";
    }
    getFacilityAreaString(facility) {
        const area_name = ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", ""];
        let area = facility.getArea().map((i) => {
            if (facility.size === 2) {
                return `${area_name[i]}+${area_name[i + 1]}`;
            }
            return area_name[i];
        }).join(",");
        return area;
    }
}
/* harmony export (immutable) */ __webpack_exports__["e"] = HtmlCardView;

class HtmlPlayerView extends HtmlViewObject {
    constructor(player_id) {
        super(document.getElementById(`player_${player_id}`));
        this.money_animation_timer = null;
        this.money = 0;
        this.player_id = player_id;
        this.element_name = document.getElementById(this.element.id + "_name");
        this.element_money = document.getElementById(this.element.id + "_money");
        this.element_salary = document.getElementById(this.element.id + "_salary");
        this.element_talon = document.getElementById(this.element.id + "_talon");
    }
    draw(session) {
        this.show();
        let player = session.getPlayer(this.player_id);
        this.element_name.innerText = player.name;
        this.element_salary.innerHTML = String(player.salary);
        let cards = session.getPlayerCards(this.player_id);
        this.element_talon.innerHTML = `${cards.getHandSize()}　／　📇 ${cards.getTalonSize()}`;
        this.setMoney(player.getMoney());
    }
    setMoney(money) {
        this.money = money;
        this.animateMoney(money);
    }
    addMoney(delta) {
        this.money += delta;
        this.animateMoney(this.money);
    }
    // TODO: move this logic to HtmlViewObject ?
    animateMoney(money) {
        if (this.money_animation_timer) {
            clearInterval(this.money_animation_timer);
        }
        this.money_animation_timer = setInterval(() => {
            let current_money = Number(this.element_money.innerText);
            if (current_money === money) {
                clearInterval(this.money_animation_timer);
                this.money_animation_timer = null;
                return;
            }
            if (current_money > money) {
                current_money -= Math.min(10, current_money - money);
            }
            else {
                current_money += Math.min(10, money - current_money);
            }
            this.element_money.innerText = String(current_money);
        }, 5);
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = HtmlPlayerView;

class HtmlMessageView extends HtmlViewObject {
    constructor(element_id) {
        super(document.getElementById(element_id));
    }
    drawMessage(message, color = COLOR_FIELD) {
        this.element.innerText = `🎲 ${message} 🎲`;
        this.element.style.backgroundColor = color;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = HtmlMessageView;

class HtmlButtonView extends HtmlViewObject {
    constructor(element_id) {
        super(document.getElementById(element_id));
    }
    setClickable(is_clickable) {
        // TODO: Use class of "clickable".
        this.element.style.backgroundColor = is_clickable ? COLOR_CLICKABLE : COLOR_FIELD;
    }
}
/* unused harmony export HtmlButtonView */

class HtmlButtonsView extends HtmlViewObject {
    constructor(element_id) {
        super(document.getElementById(element_id));
        this.dice1 = new HtmlButtonView(element_id + "_dice1");
        this.dice2 = new HtmlButtonView(element_id + "_dice2");
        this.char_card = new HtmlButtonView(element_id + "_char_card");
        this.end_turn = new HtmlButtonView(element_id + "_end_turn");
    }
    draw(session, player_id) {
        if (session.getCurrentPlayerId() !== player_id) {
            this.none();
            return;
        }
        this.dice1.hide();
        this.dice2.hide();
        this.char_card.hide();
        this.end_turn.hide();
        let phase = session.getPhase();
        if (phase === __WEBPACK_IMPORTED_MODULE_1__session__["b" /* Phase */].CharacterCard || phase === __WEBPACK_IMPORTED_MODULE_1__session__["b" /* Phase */].DiceRoll) {
            this.dice1.show();
            this.dice2.show();
        }
        if (phase === __WEBPACK_IMPORTED_MODULE_1__session__["b" /* Phase */].CharacterCard) {
            this.char_card.show();
            this.char_card.setClickable(false);
        }
        if (phase === __WEBPACK_IMPORTED_MODULE_1__session__["b" /* Phase */].BuildFacility) {
            this.end_turn.show();
        }
        this.show();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HtmlButtonsView;

class HtmlClickableFieldView extends HtmlViewObject {
    constructor(element_id) {
        super(document.getElementById(element_id));
    }
    reset() {
        this.element.style.borderColor = "transparent";
    }
    setClickable(is_clickable) {
        // TODO: Use class of "clickable".
        this.element.style.borderColor = is_clickable ? COLOR_CLICKABLE : "transparent";
    }
    setColor(color) {
        this.element.style.borderColor = color;
    }
}
/* unused harmony export HtmlClickableFieldView */

class HtmlClickableFieldsView extends HtmlViewObject {
    constructor(element_id, row, column) {
        super(document.getElementById(element_id));
        this.fields = [];
        this.row = row;
        this.column = column;
        for (let x = 0; x < column; ++x) {
            this.fields.push([]);
            for (let y = 0; y < row; ++y) {
                this.fields[x].push(new HtmlClickableFieldView(`${element_id}_${x}_${y}`));
            }
        }
    }
    resetAll() {
        for (let x = 0; x < this.column; ++x) {
            for (let y = 0; y < this.row; ++y) {
                this.fields[x][y].reset();
            }
        }
    }
    setClickableAreas(areas) {
        for (let area of areas) {
            let x = area - 1;
            for (let y = 0; y < this.row; ++y) {
                this.fields[x][y].setClickable(true);
            }
        }
    }
    setClickable([x, y], is_clickable) {
        this.fields[x][y].setClickable(is_clickable);
    }
    animateDiceResult(pip, color) {
        let x = pip - 1;
        let delay = 0;
        for (let i = 0; i < this.row; ++i) {
            let y = this.row - 1 - i;
            window.setTimeout(() => {
                this.fields[x][y].setColor(color);
                window.setTimeout(() => {
                    this.fields[x][y].setColor("transparent");
                }, 1500);
            }, delay);
            delay = delay + 10 * i; // 0, 10, 30, 60, 100, ...
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["f"] = HtmlClickableFieldsView;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__standalone_connection__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__saikoro__ = __webpack_require__(6);


let connection = new __WEBPACK_IMPORTED_MODULE_0__standalone_connection__["a" /* StandaloneConnection */]();
let client = new __WEBPACK_IMPORTED_MODULE_1__saikoro__["a" /* WebClient */](connection);
document.addEventListener("DOMContentLoaded", () => { client.initBoard(); });


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__session__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__facility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auto_play__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__protocol__ = __webpack_require__(3);




class KeyValue {
    constructor(key = "", value = null) {
        this.key = key;
        this.value = value;
    }
}
/* unused harmony export KeyValue */

// Memcache
class Memcache {
}
/* unused harmony export Memcache */

class MemcacheMock extends Memcache {
    constructor() {
        super(...arguments);
        this.cache = {};
    }
    get(key, callback) {
        callback(null, this.cache[key]);
    }
    getWithPromise(key) {
        return new Promise((resolve, reject) => {
            let data = new KeyValue(key, this.cache[key]);
            resolve(data);
        });
    }
    set(key, value, callback, expire) {
        this.cache[key] = value;
        callback(null);
    }
    setWithPromise(key, value) {
        this.cache[key] = value;
        return new Promise((resolve, reject) => {
            let data = new KeyValue(key, value);
            resolve(data);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MemcacheMock;

class MatchedData {
    constructor(matching_id = "", session_id = "", player_id = -1, session_string = "") {
        this.matching_id = matching_id;
        this.session_id = session_id;
        this.player_id = player_id;
        this.session_string = session_string;
    }
}
/* unused harmony export MatchedData */

class SessionHandler {
    constructor(mc) {
        this.mc = mc;
    }
    initSession() {
        let session = new __WEBPACK_IMPORTED_MODULE_0__session__["a" /* Session */]();
        const player_id0 = session.addPlayer("0", "こしあん", 1200, 250, false);
        const player_id1 = session.addPlayer("1", "つぶあん", 1000, 220, false);
        for (let i = 0; i < 10; ++i) {
            session.addFacility(player_id0, Math.floor(Math.random() * 12));
            session.addFacility(player_id1, Math.floor(Math.random() * 12));
        }
        session.startGame();
        this.doNext(session);
        return session;
    }
    doNext(session) {
        let prev_step = session.getStep();
        for (let i = 0; i < 100; ++i) {
            let cont = session.doNext();
            let new_step = session.getStep();
            if (cont) {
                prev_step = new_step;
                continue;
            }
            if (session.getCurrentPlayer().isAuto()) {
                cont = __WEBPACK_IMPORTED_MODULE_2__auto_play__["a" /* AutoPlay */].play(session);
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
    }
    processCommand(session, query) {
        if (query.command === "board") {
            let step = Number(query.step);
            if (step >= session.getStep()) {
                // No update.
                return false;
            }
        }
        else if (query.command === "character") {
            let player_id = Number(query.player_id);
            let card_id = Number(query.card_id);
            if (session.useCharacter(player_id, card_id)) {
                // TODO: integrate buildFacility and doNext.
                this.doNext(session);
            }
        }
        else if (query.command === "dice") {
            let player_id = Number(query.player_id);
            let dice_num = Number(query.dice_num);
            let aim = Number(query.aim);
            if (session.diceRoll(player_id, dice_num, aim)) {
                // TODO: integrate diceRoll and doNext.
                this.doNext(session);
            }
        }
        else if (query.command === "build") {
            let player_id = Number(query.player_id);
            let x = Number(query.x);
            let y = Number(query.y);
            let card_id = Number(query.card_id);
            if (x != null && y != null && player_id != null && card_id != null) {
                if (session.buildFacility(player_id, x, y, card_id)) {
                    // TODO: integrate buildFacility and doNext.
                    this.doNext(session);
                }
            }
        }
        else if (query.command === "quit") {
            let player_id = Number(query.player_id);
            if (session.quit(player_id)) {
                this.doNext(session);
            }
        }
        return true;
    }
    handleCommand(query) {
        let session_key = "session";
        if (query.session_id) {
            session_key = `session_${query.session_id}`;
        }
        let session;
        let updated = false;
        return this.mc.getWithPromise(session_key).then((data) => {
            if (data.value) {
                session = __WEBPACK_IMPORTED_MODULE_0__session__["a" /* Session */].fromJSON(JSON.parse(data.value));
            }
            else {
                session = this.initSession();
            }
            let updated = this.processCommand(session, query);
            if (!updated) {
                return new KeyValue(data.key, "{}");
            }
            let session_json = JSON.stringify(session.toJSON());
            return this.mc.setWithPromise(session_key, session_json);
        });
    }
    // TODO: This is a quite hacky way for testing w/o considering any race conditions.
    handleMatching(query) {
        let name = query.name;
        let mode = Number(query.mode);
        let user_id = query.user_id;
        let deck = [];
        try {
            let user_deck = JSON.parse(query.deck);
            deck = user_deck;
        }
        catch (e) {
            // Invalid deck format. Ignore it.
        }
        let num_players = 1;
        let num_npc = 2;
        if (mode === __WEBPACK_IMPORTED_MODULE_3__protocol__["a" /* GameMode */].OnLine2Players) {
            num_players = 2;
            num_npc = 0;
        }
        let matched_data = new MatchedData();
        let matching_key = `matching_${mode}`;
        // TODO: Some operations can be performed in parallel.
        return this.mc.getWithPromise(matching_key).then((data) => {
            let matching_id;
            if (data.value) {
                matching_id = Number(data.value);
            }
            else {
                matching_id = 10;
            }
            return this.mc.setWithPromise(matching_key, matching_id + 1);
        }).then((data) => {
            let matching_id = data.value - 1;
            // FIXIT: This is an obviously hacky way for two players. Fix it.
            let session_id = mode * 100000 + Math.floor(matching_id / num_players);
            let session_key = `session_${session_id}`;
            matched_data.matching_id = String(matching_id);
            matched_data.session_id = String(session_id);
            return this.mc.getWithPromise(session_key);
        }).then((data) => {
            let session_key = data.key;
            let session_value = data.value;
            let session;
            if (session_value) {
                session = __WEBPACK_IMPORTED_MODULE_0__session__["a" /* Session */].fromJSON(JSON.parse(session_value));
            }
            else {
                session = new __WEBPACK_IMPORTED_MODULE_0__session__["a" /* Session */]();
            }
            let player_id = this.addNewPlayer(session, user_id, name, deck, false);
            matched_data.player_id = player_id;
            if (player_id === num_players - 1) {
                // Add NPC.
                const NPC_NAMES = ["ごましお", "グラ", "ヂータ", "エル", "茜"];
                for (let i = 0; i < num_npc; ++i) {
                    let npc_name = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
                    this.addNewPlayer(session, `${i}`, npc_name + " (NPC)", [], true);
                }
                session.startGame();
                this.doNext(session);
            }
            let session_string = JSON.stringify(session.toJSON());
            matched_data.session_string = session_string;
            return this.mc.setWithPromise(session_key, session_string);
        }).then((data) => {
            return matched_data;
        });
    }
    addNewPlayer(session, user_id, name, deck, is_auto) {
        const player_id = session.addPlayer(user_id, name, 1200, 250, is_auto);
        let num_facilities = 0;
        let num_chars = 0;
        for (let data_id of deck) {
            if (__WEBPACK_IMPORTED_MODULE_1__facility__["e" /* CardData */].isFacility(data_id)) {
                session.addFacility(player_id, data_id);
                num_facilities++;
                continue;
            }
            if (__WEBPACK_IMPORTED_MODULE_1__facility__["e" /* CardData */].isCharacter(data_id)) {
                if (num_chars <= 5) {
                    session.addCharacter(player_id, data_id);
                    num_chars++;
                }
                continue;
            }
        }
        for (let i = num_facilities; i < 10; ++i) {
            session.addFacility(player_id, __WEBPACK_IMPORTED_MODULE_1__facility__["e" /* CardData */].getRandomFacilityDataId());
        }
        for (let i = num_chars; i < 2; ++i) {
            session.addCharacter(player_id, __WEBPACK_IMPORTED_MODULE_1__facility__["e" /* CardData */].getRandomCharacterDataId());
        }
        return player_id;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = SessionHandler;



/***/ })
/******/ ]);
//# sourceMappingURL=saikoro_client.js.map