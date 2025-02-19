import { SqlToMongoTranslator } from '../translators/SqlToMongoTranslator';
import * as sampleAst from '../data/sampleAst.json';

describe('SqlToMongoTranslator', () => {
    it('should translate SQL AST to MongoDB pipeline correctly', () => {
        const translator = new SqlToMongoTranslator(sampleAst);
        const pipeline = translator.translate();

        // Expected pipeline based on your SQL query
        const expectedPipeline = [
            {
        $lookup: {
            from: 'D',
                localField: '_id',
                foreignField: 'A_id',
                as: 'D_records'
        }
    },
        {
        $match: {
            'D_records.status': 'Active'
        }
        },
        {
        $lookup: {
            from: 'B',
                localField: '_id',
                foreignField: 'A_id',
                as: 'B_records'
        }
        },
        {
        $lookup: {
            from: 'C',
                localField: '_id',
                foreignField: 'A_id',
                as: 'C_records'
        }
        },
        {
        $project: {
            id: 1,
                username: 1,
                lastname: 1,
                B_count: { $size: '$B_records' },
            max_salary: { $max: '$C_records.salary' }
        }
        },
        {
        $sort: { id: 1 }
        }
    ];

        expect(pipeline).toEqual(expectedPipeline);
    });
});