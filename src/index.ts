import { SqlToMongoTranslator } from './translators/SqlToMongoTranslator';
import { SQLAst } from './types/sql-ast';
import * as rawAst from './data/sampleAst.json';

const sampleAst = rawAst as SQLAst;
const translator = new SqlToMongoTranslator(sampleAst);
const pipeline = translator.translate();

console.log('Generated MongoDB Aggregation Pipeline:');
console.log(JSON.stringify(pipeline, null, 2));