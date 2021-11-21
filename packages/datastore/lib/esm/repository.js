import { Repository, Clone, Cred } from 'nodegit';
import AdmZip from 'adm-zip';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { sep, posix, join } from 'path';
import { cpus } from 'os';
import { parse } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { parallelLimit } from 'async';
import { FipeTable, Make, Model, ModelYear } from './model';
let repository;
const publicKey = readFileSync(join(__dirname, '..', 'ssh_keys', 'id_rsa.pub')).toString();
const privateKey = readFileSync(join(__dirname, '..', 'ssh_keys', 'id_rsa')).toString();
const pathToRepo = join(__dirname, '../.repository');
const cloneUrl = 'git@github.com:fazendadosoftware/vehicle-prices-datasets.git';
const baseFolder = 'fipe';
const getRepositoryAuthCallbacks = () => ({
    certificateCheck: () => { return 0; },
    credentials: (url, userName) => Cred.sshKeyMemoryNew(userName, publicKey, privateKey, '')
});
const initializeRepository = async () => {
    if (repository !== undefined)
        return repository;
    const cloneOptions = { fetchOpts: { callbacks: getRepositoryAuthCallbacks() } };
    if (!existsSync(pathToRepo))
        mkdirSync(pathToRepo);
    try {
        repository = await Repository.open(pathToRepo);
    }
    catch (err) {
        const errno = err?.errno;
        if (errno !== -3)
            throw err;
    }
    if (repository === undefined) {
        console.log('cloning repository...');
        repository = await Clone.clone(cloneUrl, pathToRepo, cloneOptions);
        console.log('done!');
    }
    else {
        console.log('fetching repository...');
        await repository.fetch('origin', { callbacks: getRepositoryAuthCallbacks() });
        console.log('done!');
    }
    try {
        await repository.getMasterCommit();
    }
    catch (err) {
        const errno = err?.errno;
        // if no master branch exists
        if (errno === -3) {
            const filename = '.gitignore';
            const fileContent = '#ignore all kind of files\n*\n#except zip files\n!*.zip';
            writeFileSync(join(repository.workdir(), filename), fileContent);
            const index = await repository.refreshIndex();
            await index.addByPath(filename);
            await index.write();
            const oid = await index.writeTree();
            const defaultSignature = await repository.defaultSignature();
            const firstCommit = await repository.createCommit('HEAD', defaultSignature, defaultSignature, 'first commit', oid, []);
            await repository.createBranch('master', firstCommit);
        }
    }
    return repository;
};
const getReferenceTableDataset = async (referenceTableCode) => {
    if (repository === undefined)
        await initializeRepository();
    const HEAD = await repository.getMasterCommit();
    const tree = await HEAD.getTree();
    const filename = `${referenceTableCode}.zip`;
    // entryPath should have the Posix format
    const entryPath = join(tree.path(), baseFolder, filename).split(sep).join(posix.sep);
    const entry = await tree.getEntry(entryPath);
    const buffer = await entry.getBlob().then(blob => blob.content());
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();
    const zipEntry = entries.find(({ entryName }) => entryName === `${referenceTableCode}.json`);
    if (typeof zipEntry === 'undefined') {
        const errorMsg = `${referenceTableCode}.json not found in ${referenceTableCode}.zip`;
        console.error(errorMsg);
        throw Error(errorMsg);
    }
    return JSON.parse(zipEntry.getData().toString());
};
export const getIndexOfExistingReferenceTablesInRepository = async () => {
    if (repository === undefined)
        await initializeRepository();
    const HEAD = await repository.getMasterCommit();
    // PULL LATEST COMMITS FROM MASTER BRANCH
    await repository.fetchAll({ callbacks: getRepositoryAuthCallbacks() })
        .then(() => repository.mergeBranches('master', 'origin/master'));
    const folder = await HEAD.getEntry(baseFolder);
    if (folder.isDirectory()) {
        const entries = await folder.getTree().then(tree => tree.entries());
        const fileIndex = entries
            .filter(entry => entry.isFile())
            .reduce((accumulator, entry) => {
            const groups = entry.name().match(/^(\d+).zip/);
            if (Array.isArray(groups) && groups.length === 2) {
                accumulator[groups[1]] = true;
                // return accumulator
            }
            return accumulator;
        }, {});
        const index = {};
        const logProgress = () => {
            const percComplete = Math.round(Object.keys(index).length * 100 / Object.keys(fileIndex).length);
            console.log(`${percComplete}% scanning existing tables in repository`);
        };
        const interval = setInterval(() => logProgress(), 2000);
        for (const refTableId in fileIndex) {
            const { rows, referenceTable } = await getReferenceTableDataset(parseInt(refTableId));
            index[referenceTable] = rows.length;
        }
        clearInterval(interval);
        logProgress();
        return index;
    }
    else {
        const errMsg = `folder ${baseFolder}/ not found`;
        console.error(errMsg);
        throw Error(errMsg);
    }
};
export const getExistingTableIdsInRepository = async () => {
    if (repository === undefined)
        await initializeRepository();
    const HEAD = await repository.getMasterCommit();
    // PULL LATEST COMMITS FROM MASTER BRANCH
    await repository.fetchAll({ callbacks: getRepositoryAuthCallbacks() })
        .then(() => repository.mergeBranches('master', 'origin/master'));
    const folder = await HEAD.getEntry(baseFolder);
    if (folder.isDirectory()) {
        const entries = await folder.getTree().then(tree => tree.entries());
        const tableIds = entries
            .filter(entry => entry.isFile())
            .reduce((accumulator, entry) => {
            const groups = entry.name().match(/^(\d+).zip/);
            if (Array.isArray(groups) && groups.length === 2) {
                const tableId = parseInt(groups[1]);
                accumulator.add(tableId);
            }
            return accumulator;
        }, new Set());
        return Array.from(tableIds).sort((a, b) => a - b);
    }
    else {
        const errMsg = `folder ${baseFolder}/ not found`;
        console.error(errMsg);
        throw Error(errMsg);
    }
};
const processTableData = async (tableData) => {
    const { referenceTable, columns, rows } = tableData;
    const { makeColumnIndex, modelKeys, priceColIndex, modelYearColumnIndex } = Model.getModelFieldIndexes(columns);
    const refDate = parseInt(parse(rows[0][columns.indexOf('MesReferencia')].trim(), 'MMMM \'de\' yyyy', new Date(), { locale: ptBR })
        .toISOString()
        .split('T')[0].replace(/-/g, '').slice(0, -2));
    const makeIndex = {};
    const modelIndex = {};
    const modelYearIndex = {};
    rows.forEach((row) => {
        const make = Make.fromRow(row, makeColumnIndex);
        makeIndex[make.id] = make;
        const model = Model.fromRow(row, modelKeys, make.id);
        if (modelIndex[model.id] === undefined)
            modelIndex[model.id] = model;
        // check for collisions...
        else {
            const idStringCurrent = Model.getModelIdString(modelIndex[model.id]);
            const idStringNew = Model.getModelIdString(model);
            if (idStringCurrent !== idStringNew)
                throw Error(`ID collision: ${idStringNew} !== ${idStringCurrent}`);
        }
        const value = Number(row[priceColIndex].replace(/[R$.\s]/g, '').replace(/,/g, '.'));
        const year = Number(row[modelYearColumnIndex]);
        // const dateIndex = parseInt(refDate.slice(0, -2).replace(/-/g, ''))
        const modelYear = new ModelYear(model.id, year);
        const modelYearId = ModelYear.getModelYearPKey(modelYear);
        if (modelYearIndex[modelYearId] === undefined)
            modelYearIndex[modelYearId] = modelYear;
        modelYearIndex[modelYearId].putPrice(refDate, value);
    });
    return { tableId: referenceTable, refDate, makeIndex, modelIndex, modelYearIndex };
};
export const buildIndexesFromRepository = async () => {
    if (repository === undefined)
        await initializeRepository();
    const HEAD = await repository.getMasterCommit();
    // PULL LATEST COMMITS FROM MASTER BRANCH
    await repository.fetchAll({ callbacks: getRepositoryAuthCallbacks() })
        .then(() => repository.mergeBranches('master', 'origin/master'));
    const folder = await HEAD.getEntry(baseFolder);
    if (folder.isDirectory()) {
        const entries = await folder.getTree().then(tree => tree.entries());
        const files = entries
            .filter(entry => entry.isFile())
            .reduce((accumulator, entry) => {
            const groups = entry.name().match(/^(\d+).zip/);
            if (Array.isArray(groups) && groups.length === 2)
                accumulator.push(parseInt(groups[1]));
            return accumulator;
        }, []);
        let processedFiles = 0;
        const logProgress = () => {
            const percComplete = Math.round(processedFiles * 100 / files.length);
            console.log(`${percComplete}% scanning existing tables in repository`);
        };
        const interval = setInterval(() => logProgress(), 2000);
        const fipeTables = [];
        const makeIndex = {};
        const modelIndex = {};
        const modelYearIndex = {};
        const processes = cpus().length;
        for (const refTableId of files) {
            const tableData = await getReferenceTableDataset(refTableId);
            const outputData = await processTableData(tableData);
            const { tableId, refDate, makeIndex: tableMakeIndex, modelIndex: tableModelIndex, modelYearIndex: tableModelYearIndex } = outputData;
            fipeTables.push(new FipeTable(tableId, refDate));
            const makeIndexCallbacks = Object.entries(tableMakeIndex)
                .map(([makeId, make]) => callback => {
                if (makeIndex[makeId] === undefined)
                    makeIndex[makeId] = make;
                callback(null);
            });
            parallelLimit(makeIndexCallbacks, processes);
            const modelIndexCallbacks = Object.entries(tableModelIndex)
                .map(([modelId, model]) => callback => {
                if (modelIndex[modelId] === undefined)
                    modelIndex[modelId] = model;
                callback(null);
            });
            parallelLimit(modelIndexCallbacks, processes);
            const modelYearCallbacks = Object.entries(tableModelYearIndex)
                .map(([modelYearId, modelYear]) => callback => {
                if (modelYearIndex[modelYearId] === undefined)
                    modelYearIndex[modelYearId] = modelYear;
                else {
                    Object.entries(modelYear.prices)
                        .forEach(([dateIndex, price]) => modelYearIndex[modelYearId].putPrice(dateIndex, price));
                }
                callback(null);
            });
            parallelLimit(modelYearCallbacks, processes);
            processedFiles++;
        }
        clearInterval(interval);
        logProgress();
        const makes = Object.values(makeIndex);
        const models = Object.values(modelIndex);
        const modelYears = Object.values(modelYearIndex);
        return { fipeTables, makes, models, modelYears };
    }
    else {
        const errMsg = `folder ${baseFolder}/ not found`;
        console.error(errMsg);
        throw Error(errMsg);
    }
};
//# sourceMappingURL=repository.js.map