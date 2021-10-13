"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFTSIndexFromDatabase = exports.updateDatabaseFromData = exports.openRealm = void 0;
const realm_1 = __importStar(require("realm"));
const fuse_js_1 = __importDefault(require("fuse.js"));
const schema_1 = require("./schema");
const openRealm = async (path) => {
    const realm = await (0, realm_1.open)({ path, schema: [schema_1.FipeTableSchema, schema_1.MakeSchema, schema_1.ModelSchema, schema_1.ModelYearSchema] });
    return realm;
};
exports.openRealm = openRealm;
const updateDatabaseFromData = async (realm, data) => {
    const { fipeTables, models, modelYears } = data;
    realm.beginTransaction();
    try {
        fipeTables
            .forEach(fipeTable => realm.create(schema_1.FipeTableSchema.schema.name, fipeTable, realm_1.default.UpdateMode.All));
        models
            .forEach(model => realm.create(schema_1.ModelSchema.schema.name, model, realm_1.default.UpdateMode.All));
        modelYears
            .forEach(modelYear => realm.create(schema_1.ModelYearSchema.schema.name, modelYear, realm_1.default.UpdateMode.All));
        realm.commitTransaction();
    }
    catch (error) {
        realm.cancelTransaction();
        throw error;
    }
};
exports.updateDatabaseFromData = updateDatabaseFromData;
const buildFTSIndexFromDatabase = async (realm) => {
    const models = realm.objects(schema_1.ModelSchema.name)
        .map(model => model.toJSON())
        .map(model => ({ ...model, modelYears: Object.keys(model.modelYears) }));
    return fuse_js_1.default.createIndex(['make', 'name', 'modelYears'], models).toJSON();
};
exports.buildFTSIndexFromDatabase = buildFTSIndexFromDatabase;
//# sourceMappingURL=realm.js.map