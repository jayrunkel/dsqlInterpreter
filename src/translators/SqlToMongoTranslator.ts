import { SQLAst, FieldType, SubqueryType, WhereCondition } from '../types/sql-ast';
import { MongoDBPipeline, MongoDBStage } from '../types/mongodb-pipeline';

export class SqlToMongoTranslator {
    private ast: SQLAst;

    constructor(ast: SQLAst) {
        this.ast = ast;
    }

    public translate(): MongoDBPipeline {
        const pipeline: MongoDBPipeline = [];

        // Handle WHERE conditions first (if exists)
        if (this.ast.where) {
            this.handleWhere(pipeline);
        }

        // Handle field lookups
        this.handleFields(pipeline);

        // Handle ORDER BY
        if (this.ast.order_by) {
            this.handleOrderBy(pipeline);
        }

        return pipeline;
    }

    private handleWhere(pipeline: MongoDBPipeline): void {
        const whereCondition = this.ast.where;
        if (whereCondition?.right.type === 'subquery' && whereCondition.right.select) {
            const subquery = whereCondition.right.select;
            const fromTable = subquery.from[0].name;
            const whereClause = subquery.where;

            pipeline.push({
                $lookup: {
                    from: fromTable,
                    localField: '_id',
                    foreignField: `${this.ast.from[0].name}_id`,
                    as: `${fromTable}_records`
                }
            });

            if (whereClause) {
                const matchCondition = this.buildMatchCondition(whereClause);
                pipeline.push({
                    $match: matchCondition
                });
            }
        }
    }

    private buildMatchCondition(condition: WhereCondition): Record<string, any> {
        const { left, operator, right } = condition;
        const fieldPath = `${left.table}_records.${left.field}`;

        switch (operator) {
            case '=':
                return { [fieldPath]: right.value };
            case 'IN':
                return { [fieldPath]: { $in: right.value } };
            // Add more operators as needed
            default:
                return {};
        }
    }

    private handleFields(pipeline: MongoDBPipeline): void {
        const lookups = new Set<string>();
        const projectStage: Record<string, any> = {};

        this.ast.fields.forEach(field => {
            if (field.type === 'field') {
                this.handleSimpleField(field as FieldType, projectStage);
            } else if (field.type === 'subquery') {
                this.handleSubqueryField(field as SubqueryType, lookups, projectStage);
            }
        });

        // Add lookups to pipeline
        lookups.forEach(tableName => {
            pipeline.push({
                $lookup: {
                    from: tableName,
                    localField: '_id',
                    foreignField: `${this.ast.from[0].name}_id`,
                    as: `${tableName}_records`
                }
            });
        });

        // Add project stage
        pipeline.push({ $project: projectStage });
    }

    private handleSimpleField(field: FieldType, projectStage: Record<string, any>): void {
        projectStage[field.alias || field.field] = 1;
    }

    private handleSubqueryField(
        subquery: SubqueryType,
        lookups: Set<string>,
        projectStage: Record<string, any>
    ): void {
        const tableName = subquery.select.from[0].name;
        lookups.add(tableName);

        const aggregateField = subquery.select.fields[0];
        if (!aggregateField.function) return;

        switch (aggregateField.function.toUpperCase()) {
            case 'COUNT':
                projectStage[subquery.alias] = { $size: `$${tableName}_records` };
                break;
            case 'MAX':
                projectStage[subquery.alias] = { $max: `$${tableName}_records.${aggregateField.field}` };
                break;
            case 'MIN':
                projectStage[subquery.alias] = { $min: `$${tableName}_records.${aggregateField.field}` };
                break;
            case 'AVG':
                projectStage[subquery.alias] = { $avg: `$${tableName}_records.${aggregateField.field}` };
                break;
            case 'SUM':
                projectStage[subquery.alias] = { $sum: `$${tableName}_records.${aggregateField.field}` };
                break;
        }
    }

    private handleOrderBy(pipeline: MongoDBPipeline): void {
        const sortStage: Record<string, 1 | -1> = {};
        this.ast.order_by?.forEach(orderBy => {
            sortStage[orderBy.field] = orderBy.direction.toUpperCase() === 'ASC' ? 1 : -1;
        });
        pipeline.push({ $sort: sortStage });
    }
}