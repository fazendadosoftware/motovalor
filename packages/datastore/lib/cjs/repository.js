"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIndexesFromRepository = exports.getExistingTableIdsInRepository = exports.getIndexOfExistingReferenceTablesInRepository = void 0;
var tslib_1 = require("tslib");
var nodegit_1 = require("nodegit");
var adm_zip_1 = (0, tslib_1.__importDefault)(require("adm-zip"));
var fs_1 = require("fs");
var path_1 = require("path");
var os_1 = require("os");
var date_fns_1 = require("date-fns");
var pt_BR_1 = (0, tslib_1.__importDefault)(require("date-fns/locale/pt-BR"));
var async_1 = require("async");
var model_1 = require("./model");
var repository;
var publicKey = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '..', 'ssh_keys', 'id_rsa.pub')).toString();
var privateKey = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '..', 'ssh_keys', 'id_rsa')).toString();
var pathToRepo = (0, path_1.join)(__dirname, '../.repository');
var cloneUrl = 'git@github.com:fazendadosoftware/vehicle-prices-datasets.git';
var baseFolder = 'fipe';
var getRepositoryAuthCallbacks = function () { return ({
    certificateCheck: function () { return 0; },
    credentials: function (url, userName) { return nodegit_1.Cred.sshKeyMemoryNew(userName, publicKey, privateKey, ''); }
}); };
var initializeRepository = function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var cloneOptions, err_1, errno, err_2, errno, filename, fileContent, index, oid, defaultSignature, firstCommit;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (repository !== undefined)
                    return [2 /*return*/, repository];
                cloneOptions = { fetchOpts: { callbacks: getRepositoryAuthCallbacks() } };
                if (!(0, fs_1.existsSync)(pathToRepo))
                    (0, fs_1.mkdirSync)(pathToRepo);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, nodegit_1.Repository.open(pathToRepo)];
            case 2:
                repository = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                errno = err_1 === null || err_1 === void 0 ? void 0 : err_1.errno;
                if (errno !== -3)
                    throw err_1;
                return [3 /*break*/, 4];
            case 4:
                if (!(repository === undefined)) return [3 /*break*/, 6];
                console.log('cloning repository...');
                return [4 /*yield*/, nodegit_1.Clone.clone(cloneUrl, pathToRepo, cloneOptions)];
            case 5:
                repository = _a.sent();
                console.log('done!');
                return [3 /*break*/, 8];
            case 6:
                console.log('fetching repository...');
                return [4 /*yield*/, repository.fetch('origin', { callbacks: getRepositoryAuthCallbacks() })];
            case 7:
                _a.sent();
                console.log('done!');
                _a.label = 8;
            case 8:
                _a.trys.push([8, 10, , 19]);
                return [4 /*yield*/, repository.getMasterCommit()];
            case 9:
                _a.sent();
                return [3 /*break*/, 19];
            case 10:
                err_2 = _a.sent();
                errno = err_2 === null || err_2 === void 0 ? void 0 : err_2.errno;
                if (!(errno === -3)) return [3 /*break*/, 18];
                filename = '.gitignore';
                fileContent = '#ignore all kind of files\n*\n#except zip files\n!*.zip';
                (0, fs_1.writeFileSync)((0, path_1.join)(repository.workdir(), filename), fileContent);
                return [4 /*yield*/, repository.refreshIndex()];
            case 11:
                index = _a.sent();
                return [4 /*yield*/, index.addByPath(filename)];
            case 12:
                _a.sent();
                return [4 /*yield*/, index.write()];
            case 13:
                _a.sent();
                return [4 /*yield*/, index.writeTree()];
            case 14:
                oid = _a.sent();
                return [4 /*yield*/, repository.defaultSignature()];
            case 15:
                defaultSignature = _a.sent();
                return [4 /*yield*/, repository.createCommit('HEAD', defaultSignature, defaultSignature, 'first commit', oid, [])];
            case 16:
                firstCommit = _a.sent();
                return [4 /*yield*/, repository.createBranch('master', firstCommit)];
            case 17:
                _a.sent();
                _a.label = 18;
            case 18: return [3 /*break*/, 19];
            case 19: return [2 /*return*/, repository];
        }
    });
}); };
var getReferenceTableDataset = function (referenceTableCode) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var HEAD, tree, filename, entryPath, entry, buffer, zip, entries, zipEntry, errorMsg;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(repository === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, initializeRepository()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, repository.getMasterCommit()];
            case 3:
                HEAD = _a.sent();
                return [4 /*yield*/, HEAD.getTree()];
            case 4:
                tree = _a.sent();
                filename = "".concat(referenceTableCode, ".zip");
                entryPath = (0, path_1.join)(tree.path(), baseFolder, filename).split(path_1.sep).join(path_1.posix.sep);
                return [4 /*yield*/, tree.getEntry(entryPath)];
            case 5:
                entry = _a.sent();
                return [4 /*yield*/, entry.getBlob().then(function (blob) { return blob.content(); })];
            case 6:
                buffer = _a.sent();
                zip = new adm_zip_1.default(buffer);
                entries = zip.getEntries();
                zipEntry = entries.find(function (_a) {
                    var entryName = _a.entryName;
                    return entryName === "".concat(referenceTableCode, ".json");
                });
                if (typeof zipEntry === 'undefined') {
                    errorMsg = "".concat(referenceTableCode, ".json not found in ").concat(referenceTableCode, ".zip");
                    console.error(errorMsg);
                    throw Error(errorMsg);
                }
                return [2 /*return*/, JSON.parse(zipEntry.getData().toString())];
        }
    });
}); };
var getIndexOfExistingReferenceTablesInRepository = function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var HEAD, folder, entries, fileIndex_1, index_1, logProgress_1, interval, _a, _b, _i, refTableId, _c, rows, referenceTable, errMsg;
    return (0, tslib_1.__generator)(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!(repository === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, initializeRepository()];
            case 1:
                _d.sent();
                _d.label = 2;
            case 2: return [4 /*yield*/, repository.getMasterCommit()
                // PULL LATEST COMMITS FROM MASTER BRANCH
            ];
            case 3:
                HEAD = _d.sent();
                // PULL LATEST COMMITS FROM MASTER BRANCH
                return [4 /*yield*/, repository.fetchAll({ callbacks: getRepositoryAuthCallbacks() })
                        .then(function () { return repository.mergeBranches('master', 'origin/master'); })];
            case 4:
                // PULL LATEST COMMITS FROM MASTER BRANCH
                _d.sent();
                return [4 /*yield*/, HEAD.getEntry(baseFolder)];
            case 5:
                folder = _d.sent();
                if (!folder.isDirectory()) return [3 /*break*/, 11];
                return [4 /*yield*/, folder.getTree().then(function (tree) { return tree.entries(); })];
            case 6:
                entries = _d.sent();
                fileIndex_1 = entries
                    .filter(function (entry) { return entry.isFile(); })
                    .reduce(function (accumulator, entry) {
                    var groups = entry.name().match(/^(\d+).zip/);
                    if (Array.isArray(groups) && groups.length === 2) {
                        accumulator[groups[1]] = true;
                        // return accumulator
                    }
                    return accumulator;
                }, {});
                index_1 = {};
                logProgress_1 = function () {
                    var percComplete = Math.round(Object.keys(index_1).length * 100 / Object.keys(fileIndex_1).length);
                    console.log("".concat(percComplete, "% scanning existing tables in repository"));
                };
                interval = setInterval(function () { return logProgress_1(); }, 2000);
                _a = [];
                for (_b in fileIndex_1)
                    _a.push(_b);
                _i = 0;
                _d.label = 7;
            case 7:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                refTableId = _a[_i];
                return [4 /*yield*/, getReferenceTableDataset(parseInt(refTableId))];
            case 8:
                _c = _d.sent(), rows = _c.rows, referenceTable = _c.referenceTable;
                index_1[referenceTable] = rows.length;
                _d.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10:
                clearInterval(interval);
                logProgress_1();
                return [2 /*return*/, index_1];
            case 11:
                errMsg = "folder ".concat(baseFolder, "/ not found");
                console.error(errMsg);
                throw Error(errMsg);
        }
    });
}); };
exports.getIndexOfExistingReferenceTablesInRepository = getIndexOfExistingReferenceTablesInRepository;
var getExistingTableIdsInRepository = function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var HEAD, folder, entries, tableIds, errMsg;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(repository === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, initializeRepository()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, repository.getMasterCommit()
                // PULL LATEST COMMITS FROM MASTER BRANCH
            ];
            case 3:
                HEAD = _a.sent();
                // PULL LATEST COMMITS FROM MASTER BRANCH
                return [4 /*yield*/, repository.fetchAll({ callbacks: getRepositoryAuthCallbacks() })
                        .then(function () { return repository.mergeBranches('master', 'origin/master'); })];
            case 4:
                // PULL LATEST COMMITS FROM MASTER BRANCH
                _a.sent();
                return [4 /*yield*/, HEAD.getEntry(baseFolder)];
            case 5:
                folder = _a.sent();
                if (!folder.isDirectory()) return [3 /*break*/, 7];
                return [4 /*yield*/, folder.getTree().then(function (tree) { return tree.entries(); })];
            case 6:
                entries = _a.sent();
                tableIds = entries
                    .filter(function (entry) { return entry.isFile(); })
                    .reduce(function (accumulator, entry) {
                    var groups = entry.name().match(/^(\d+).zip/);
                    if (Array.isArray(groups) && groups.length === 2) {
                        var tableId = parseInt(groups[1]);
                        accumulator.add(tableId);
                    }
                    return accumulator;
                }, new Set());
                return [2 /*return*/, Array.from(tableIds).sort(function (a, b) { return a - b; })];
            case 7:
                errMsg = "folder ".concat(baseFolder, "/ not found");
                console.error(errMsg);
                throw Error(errMsg);
        }
    });
}); };
exports.getExistingTableIdsInRepository = getExistingTableIdsInRepository;
var processTableData = function (tableData) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var referenceTable, columns, rows, _a, makeColumnIndex, modelKeys, priceColIndex, modelYearColumnIndex, refDate, makeIndex, modelIndex, modelYearIndex;
    return (0, tslib_1.__generator)(this, function (_b) {
        referenceTable = tableData.referenceTable, columns = tableData.columns, rows = tableData.rows;
        _a = model_1.Model.getModelFieldIndexes(columns), makeColumnIndex = _a.makeColumnIndex, modelKeys = _a.modelKeys, priceColIndex = _a.priceColIndex, modelYearColumnIndex = _a.modelYearColumnIndex;
        refDate = parseInt((0, date_fns_1.parse)(rows[0][columns.indexOf('MesReferencia')].trim(), 'MMMM \'de\' yyyy', new Date(), { locale: pt_BR_1.default })
            .toISOString()
            .split('T')[0].replace(/-/g, '').slice(0, -2));
        makeIndex = {};
        modelIndex = {};
        modelYearIndex = {};
        rows.forEach(function (row) {
            var make = model_1.Make.fromRow(row, makeColumnIndex);
            makeIndex[make.id] = make;
            var model = model_1.Model.fromRow(row, modelKeys, make.id);
            if (modelIndex[model.id] === undefined)
                modelIndex[model.id] = model;
            // check for collisions...
            else {
                var idStringCurrent = model_1.Model.getModelIdString(modelIndex[model.id]);
                var idStringNew = model_1.Model.getModelIdString(model);
                if (idStringCurrent !== idStringNew)
                    throw Error("ID collision: ".concat(idStringNew, " !== ").concat(idStringCurrent));
            }
            var value = Number(row[priceColIndex].replace(/[R$.\s]/g, '').replace(/,/g, '.'));
            var year = Number(row[modelYearColumnIndex]);
            // const dateIndex = parseInt(refDate.slice(0, -2).replace(/-/g, ''))
            var modelYear = new model_1.ModelYear(model.id, year);
            var modelYearId = model_1.ModelYear.getModelYearPKey(modelYear);
            if (modelYearIndex[modelYearId] === undefined)
                modelYearIndex[modelYearId] = modelYear;
            modelYearIndex[modelYearId].putPrice(refDate, value);
        });
        return [2 /*return*/, { tableId: referenceTable, refDate: refDate, makeIndex: makeIndex, modelIndex: modelIndex, modelYearIndex: modelYearIndex }];
    });
}); };
var buildIndexesFromRepository = function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var HEAD, folder, entries, files_2, processedFiles_1, logProgress_2, interval, fipeTables, makeIndex_1, modelIndex_1, modelYearIndex_1, processes, _i, files_1, refTableId, tableData, outputData, tableId, refDate, tableMakeIndex, tableModelIndex, tableModelYearIndex, makeIndexCallbacks, modelIndexCallbacks, modelYearCallbacks, makes, models, modelYears, errMsg;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(repository === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, initializeRepository()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, repository.getMasterCommit()
                // PULL LATEST COMMITS FROM MASTER BRANCH
            ];
            case 3:
                HEAD = _a.sent();
                // PULL LATEST COMMITS FROM MASTER BRANCH
                return [4 /*yield*/, repository.fetchAll({ callbacks: getRepositoryAuthCallbacks() })
                        .then(function () { return repository.mergeBranches('master', 'origin/master'); })];
            case 4:
                // PULL LATEST COMMITS FROM MASTER BRANCH
                _a.sent();
                return [4 /*yield*/, HEAD.getEntry(baseFolder)];
            case 5:
                folder = _a.sent();
                if (!folder.isDirectory()) return [3 /*break*/, 12];
                return [4 /*yield*/, folder.getTree().then(function (tree) { return tree.entries(); })];
            case 6:
                entries = _a.sent();
                files_2 = entries
                    .filter(function (entry) { return entry.isFile(); })
                    .reduce(function (accumulator, entry) {
                    var groups = entry.name().match(/^(\d+).zip/);
                    if (Array.isArray(groups) && groups.length === 2)
                        accumulator.push(parseInt(groups[1]));
                    return accumulator;
                }, []);
                processedFiles_1 = 0;
                logProgress_2 = function () {
                    var percComplete = Math.round(processedFiles_1 * 100 / files_2.length);
                    console.log("".concat(percComplete, "% scanning existing tables in repository"));
                };
                interval = setInterval(function () { return logProgress_2(); }, 2000);
                fipeTables = [];
                makeIndex_1 = {};
                modelIndex_1 = {};
                modelYearIndex_1 = {};
                processes = (0, os_1.cpus)().length;
                _i = 0, files_1 = files_2;
                _a.label = 7;
            case 7:
                if (!(_i < files_1.length)) return [3 /*break*/, 11];
                refTableId = files_1[_i];
                return [4 /*yield*/, getReferenceTableDataset(refTableId)];
            case 8:
                tableData = _a.sent();
                return [4 /*yield*/, processTableData(tableData)];
            case 9:
                outputData = _a.sent();
                tableId = outputData.tableId, refDate = outputData.refDate, tableMakeIndex = outputData.makeIndex, tableModelIndex = outputData.modelIndex, tableModelYearIndex = outputData.modelYearIndex;
                fipeTables.push(new model_1.FipeTable(tableId, refDate));
                makeIndexCallbacks = Object.entries(tableMakeIndex)
                    .map(function (_a) {
                    var makeId = _a[0], make = _a[1];
                    return function (callback) {
                        if (makeIndex_1[makeId] === undefined)
                            makeIndex_1[makeId] = make;
                        callback(null);
                    };
                });
                (0, async_1.parallelLimit)(makeIndexCallbacks, processes);
                modelIndexCallbacks = Object.entries(tableModelIndex)
                    .map(function (_a) {
                    var modelId = _a[0], model = _a[1];
                    return function (callback) {
                        if (modelIndex_1[modelId] === undefined)
                            modelIndex_1[modelId] = model;
                        callback(null);
                    };
                });
                (0, async_1.parallelLimit)(modelIndexCallbacks, processes);
                modelYearCallbacks = Object.entries(tableModelYearIndex)
                    .map(function (_a) {
                    var modelYearId = _a[0], modelYear = _a[1];
                    return function (callback) {
                        if (modelYearIndex_1[modelYearId] === undefined)
                            modelYearIndex_1[modelYearId] = modelYear;
                        else {
                            Object.entries(modelYear.prices)
                                .forEach(function (_a) {
                                var dateIndex = _a[0], price = _a[1];
                                return modelYearIndex_1[modelYearId].putPrice(dateIndex, price);
                            });
                        }
                        callback(null);
                    };
                });
                (0, async_1.parallelLimit)(modelYearCallbacks, processes);
                processedFiles_1++;
                _a.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 7];
            case 11:
                clearInterval(interval);
                logProgress_2();
                makes = Object.values(makeIndex_1);
                models = Object.values(modelIndex_1);
                modelYears = Object.values(modelYearIndex_1);
                return [2 /*return*/, { fipeTables: fipeTables, makes: makes, models: models, modelYears: modelYears }];
            case 12:
                errMsg = "folder ".concat(baseFolder, "/ not found");
                console.error(errMsg);
                throw Error(errMsg);
        }
    });
}); };
exports.buildIndexesFromRepository = buildIndexesFromRepository;
//# sourceMappingURL=repository.js.map