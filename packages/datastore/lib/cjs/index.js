"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseFromRepository = void 0;
var tslib_1 = require("tslib");
var adm_zip_1 = (0, tslib_1.__importDefault)(require("adm-zip"));
var path_1 = require("path");
var fs_1 = require("fs");
var repository_1 = require("./repository");
var realm_1 = require("./realm");
var createDatabaseFromRepository = function (dbPath, dbFilename) {
    if (dbPath === void 0) { dbPath = '.db'; }
    if (dbFilename === void 0) { dbFilename = 'fipe.realm'; }
    return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
        var indexes, realm, dbFile, zip, zipPath, fileSuffixesForDeletion;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, fs_1.existsSync)(dbPath))
                        (0, fs_1.mkdirSync)(dbPath, { recursive: true });
                    return [4 /*yield*/, (0, repository_1.buildIndexesFromRepository)()];
                case 1:
                    indexes = _a.sent();
                    return [4 /*yield*/, (0, realm_1.openRealm)((0, path_1.join)(dbPath, dbFilename))];
                case 2:
                    realm = _a.sent();
                    return [4 /*yield*/, (0, realm_1.updateDatabaseFromData)(realm, indexes)];
                case 3:
                    _a.sent();
                    realm.compact();
                    realm.close();
                    dbFile = (0, fs_1.readFileSync)((0, path_1.join)(dbPath, dbFilename));
                    zip = new adm_zip_1.default();
                    zip.addFile(dbFilename, dbFile, 'utf-8');
                    zipPath = (0, path_1.join)(dbPath, dbFilename + '.zip');
                    zip.writeZip(zipPath);
                    fileSuffixesForDeletion = ['', '.lock', '.tmp_compaction_space'];
                    fileSuffixesForDeletion.forEach(function (suffix) { return (0, fs_1.unlinkSync)((0, path_1.join)(dbPath, "".concat(dbFilename).concat(suffix))); });
                    (0, fs_1.rmdirSync)((0, path_1.join)(dbPath, "".concat(dbFilename, ".management")), { recursive: true });
                    return [2 /*return*/, zipPath];
            }
        });
    });
};
exports.createDatabaseFromRepository = createDatabaseFromRepository;
//# sourceMappingURL=index.js.map