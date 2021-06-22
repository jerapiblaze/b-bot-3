"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
// import { zip } from 'zip-a-folder'
var events_1 = require("events");
// const { Client, MessageAttachment, Message } = require('discord.js')
// const { EventEmitter } = require('events')
var fs = require('fs');
var zip = require('zip-a-folder').zip;
var sleep = function (milliseconds) {
    var date = Date.now();
    var currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};
var fetchChannel = function (client, channel_id) { return __awaiter(void 0, void 0, void 0, function () {
    var channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = client.channels.cache.get(channel_id);
                if (!((!channel) || (channel.partial))) return [3 /*break*/, 2];
                return [4 /*yield*/, client.channels.fetch(channel_id)];
            case 1:
                channel = _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, channel];
        }
    });
}); };
var Backup2Discord = /** @class */ (function (_super) {
    __extends(Backup2Discord, _super);
    function Backup2Discord(options) {
        var _this = _super.call(this) || this;
        _this._workDir = null;
        _this._backupDir = null;
        _this._exclude = null;
        _this._discordChannelID = null;
        _this._basePath = null;
        _this._clientReady = false;
        _this._token = null;
        _this._keepClientAlive = true;
        _this._comment = null;
        _this._name = null;
        if (!options)
            throw new Error("Bad config");
        if (!options.discordToken)
            throw new Error("No discord client or discord token provided");
        if (!options.workDir)
            throw new Error("No working directory provided");
        if (!options.backupDir)
            throw new Error("No backup directory provided");
        if (!options.discordChannelID)
            throw new Error("No discord channel id provided");
        var discordToken = options.discordToken, workDir = options.workDir, backupDir = options.backupDir, exclude = options.exclude, discordChannelID = options.discordChannelID, keepClientAlive = options.keepClientAlive, comment = options.comment, name = options.name;
        _this._client = new discord_js_1.Client({ partials: ['CHANNEL'] });
        _this._token = discordToken;
        if ((!_this._client.options.partials) || (!_this._client.options.partials.includes('CHANNEL'))) {
            _this.emit('warn', "it's recommended to enable CHANNEL partial");
        }
        _this._workDir = workDir;
        _this._backupDir = backupDir;
        _this._exclude = exclude ? exclude : [];
        _this._discordChannelID = discordChannelID;
        _this._keepClientAlive = keepClientAlive;
        _this._comment = comment;
        _this._name = name ? name : 'all';
        if (module && require.main) {
            var path = require.main.path;
            if (path) {
                _this._basePath = path;
                _this._workDir = path + "/" + _this._workDir;
                _this._backupDir = path + "/" + _this._backupDir;
            }
        }
        return _this;
    }
    Backup2Discord.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.login(this._token)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Backup2Discord.prototype.makeBackupFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subItem, tempDir, _i, subItem_1, s, _a, subItem_2, s;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        subItem = fs.readdirSync(this._backupDir, { withFileTypes: true })
                            .filter(function (dirent) { return dirent.isDirectory(); })
                            .map(function (dirent) { return dirent.name; });
                        tempDir = fs.mkdtempSync(this._workDir + "/backup_temp_");
                        _i = 0, subItem_1 = subItem;
                        _b.label = 1;
                    case 1:
                        if (!(_i < subItem_1.length)) return [3 /*break*/, 4];
                        s = subItem_1[_i];
                        if (this._exclude.includes(s))
                            return [3 /*break*/, 3];
                        return [4 /*yield*/, zip(this._backupDir + "/" + s, tempDir + "/" + s + ".zip", 9)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, zip(tempDir, this._workDir + "/" + this._name + ".zip", 9)];
                    case 5:
                        _b.sent();
                        for (_a = 0, subItem_2 = subItem; _a < subItem_2.length; _a++) {
                            s = subItem_2[_a];
                            if (this._exclude.includes(s))
                                continue;
                            fs.rmSync(tempDir + "/" + s + ".zip");
                        }
                        fs.rmdirSync(tempDir);
                        return [2 /*return*/, this._workDir + "/" + this._name + ".zip"];
                }
            });
        });
    };
    Backup2Discord.prototype.backupNow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var target, backupFile, file, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fetchChannel(this._client, this._discordChannelID)];
                    case 2:
                        target = _a.sent();
                        if (!target) {
                            throw new Error('404: channel not found');
                        }
                        return [4 /*yield*/, this.makeBackupFile()];
                    case 3:
                        backupFile = _a.sent();
                        file = new discord_js_1.MessageAttachment(backupFile);
                        return [4 /*yield*/, target.send("\u2705 Backup completed\n**Name:** " + this._name + "\n**Time:** " + Date() + "\n**Comment:** " + this._comment, file)];
                    case 4:
                        msg = _a.sent();
                        if (!this._keepClientAlive) {
                            this._client.destroy();
                        }
                        return [2 /*return*/, msg];
                }
            });
        });
    };
    return Backup2Discord;
}(events_1.EventEmitter));
module.exports = Backup2Discord;
//# sourceMappingURL=index.js.map