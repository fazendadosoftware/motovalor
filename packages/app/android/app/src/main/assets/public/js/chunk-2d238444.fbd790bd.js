(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d238444"],{ff3a:function(e,t,i){"use strict";i.r(t),i.d(t,"CapacitorSQLiteWeb",(function(){return s}));var r=i("1547");class s extends r["b"]{constructor(){super(...arguments),this.sqliteEl=null,this.isStoreOpen=!1}async initWebStore(){return await customElements.whenDefined("jeep-sqlite"),this.sqliteEl=document.querySelector("jeep-sqlite"),null!=this.sqliteEl?(this.sqliteEl.addEventListener("jeepSqliteImportProgress",e=>{this.notifyListeners("sqliteImportProgressEvent",e.detail)}),this.sqliteEl.addEventListener("jeepSqliteExportProgress",e=>{this.notifyListeners("sqliteExportProgressEvent",e.detail)}),this.isStoreOpen||(this.isStoreOpen=await this.sqliteEl.isStoreOpen()),Promise.resolve()):Promise.reject("InitWeb: this.sqliteEl is null")}async saveToStore(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{return await this.sqliteEl.saveToStore(e),Promise.resolve()}catch(t){return Promise.reject(""+t)}}async echo(e){if(null!=this.sqliteEl){const t=await this.sqliteEl.echo(e);return t}throw this.unimplemented("Not implemented on web.")}async isSecretStored(){throw this.unimplemented("Not implemented on web.")}async setEncryptionSecret(e){throw console.log("setEncryptionSecret",e),this.unimplemented("Not implemented on web.")}async changeEncryptionSecret(e){throw console.log("changeEncryptionSecret",e),this.unimplemented("Not implemented on web.")}async createConnection(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{return await this.sqliteEl.createConnection(e),Promise.resolve()}catch(t){return Promise.reject(""+t)}}async open(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{return await this.sqliteEl.open(e),Promise.resolve()}catch(t){return Promise.reject(""+t)}}async closeConnection(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{return await this.sqliteEl.closeConnection(e),Promise.resolve()}catch(t){return Promise.reject(""+t)}}async getVersion(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.getVersion(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async checkConnectionsConsistency(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");try{const t=await this.sqliteEl.checkConnectionsConsistency(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async close(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{return await this.sqliteEl.close(e),Promise.resolve()}catch(t){return Promise.reject(""+t)}}async execute(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.execute(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async executeSet(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.executeSet(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async run(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.run(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async query(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.query(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async isDBExists(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.isDBExists(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async isDBOpen(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.isDBOpen(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async isDatabase(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(this.isStoreOpen||(this.isStoreOpen=await this.sqliteEl.isStoreOpen()),!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.isDatabase(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async isTableExists(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.isTableExists(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async deleteDatabase(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{return await this.sqliteEl.deleteDatabase(e),Promise.resolve()}catch(t){return Promise.reject(""+t)}}async isJsonValid(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(this.isStoreOpen||(this.isStoreOpen=await this.sqliteEl.isStoreOpen()),!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.isJsonValid(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async importFromJson(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(this.isStoreOpen||(this.isStoreOpen=await this.sqliteEl.isStoreOpen()),!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.importFromJson(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async exportToJson(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.exportToJson(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async createSyncTable(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.createSyncTable(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async setSyncDate(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{return await this.sqliteEl.setSyncDate(e),Promise.resolve()}catch(t){return Promise.reject(""+t)}}async getSyncDate(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const t=await this.sqliteEl.getSyncDate(e);return Promise.resolve(t)}catch(t){return Promise.reject(""+t)}}async addUpgradeStatement(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{return await this.sqliteEl.addUpgradeStatement(e),Promise.resolve()}catch(t){return Promise.reject(""+t)}}async copyFromAssets(e){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{return await this.sqliteEl.copyFromAssets(e),Promise.resolve()}catch(t){return Promise.reject(""+t)}}async getDatabaseList(){if(null==this.sqliteEl)throw this.unimplemented("Not implemented on web.");if(this.isStoreOpen||(this.isStoreOpen=await this.sqliteEl.isStoreOpen()),!this.isStoreOpen)return Promise.reject('Store "jeepSqliteStore" failed to open');try{const e=await this.sqliteEl.getDatabaseList();return Promise.resolve(e)}catch(e){return Promise.reject(""+e)}}async getMigratableDbList(e){throw console.log("getMigratableDbList",e),this.unimplemented("Not implemented on web.")}async addSQLiteSuffix(e){throw console.log("addSQLiteSuffix",e),this.unimplemented("Not implemented on web.")}async deleteOldDatabases(e){throw console.log("deleteOldDatabases",e),this.unimplemented("Not implemented on web.")}}}}]);
//# sourceMappingURL=chunk-2d238444.fbd790bd.js.map