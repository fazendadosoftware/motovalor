"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseFromRepository = void 0;
const adm_zip_1 = __importDefault(require("adm-zip"));
const path_1 = require("path");
const fs_1 = require("fs");
const repository_1 = require("./repository");
const realm_1 = require("./realm");
const createDatabaseFromRepository = async (dbPath = '.db', dbFilename = 'fipe.realm') => {
    if (!(0, fs_1.existsSync)(dbPath))
        (0, fs_1.mkdirSync)(dbPath, { recursive: true });
    const indexes = await (0, repository_1.buildIndexesFromRepository)();
    const realm = await (0, realm_1.openRealm)((0, path_1.join)(dbPath, dbFilename));
    await (0, realm_1.updateDatabaseFromData)(realm, indexes);
    realm.compact();
    realm.close();
    const dbFile = (0, fs_1.readFileSync)((0, path_1.join)(dbPath, dbFilename));
    const zip = new adm_zip_1.default();
    zip.addFile(dbFilename, dbFile, 'utf-8');
    const zipPath = (0, path_1.join)(dbPath, dbFilename + '.zip');
    zip.writeZip(zipPath);
    // cleanup...
    const fileSuffixesForDeletion = ['', '.lock', '.tmp_compaction_space'];
    fileSuffixesForDeletion.forEach(suffix => (0, fs_1.unlinkSync)((0, path_1.join)(dbPath, `${dbFilename}${suffix}`)));
    (0, fs_1.rmdirSync)((0, path_1.join)(dbPath, `${dbFilename}.management`), { recursive: true });
    return zipPath;
};
exports.createDatabaseFromRepository = createDatabaseFromRepository;
//# sourceMappingURL=index.js.map