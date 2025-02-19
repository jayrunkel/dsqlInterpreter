export interface SQLAst {
    version: string;
    metadata: {
        sourceDialect: string;
        timestamp: string;
    };
    type: string;
    distinct: boolean;
    fields: (FieldType | SubqueryType)[];
    from: TableType[];
    where?: WhereCondition;
    order_by?: OrderByType[];
    validations?: ValidationType;
}

export interface FieldType {
    type: string;
    field: string;
    table: string;
    alias: string;
    dataType: string;
}

export interface SubqueryType {
    type: string;
    alias: string;
    select: {
        type: string;
        distinct: boolean;
        fields: AggregateField[];
        from: TableType[];
        where: WhereCondition;
    };
}

export interface AggregateField {
    type: string;
    function?: string;
    field: string;
    alias: string;
    dataType: string;
    nullHandling?: string;
}

export interface TableType {
    type: string;
    name: string;
    alias: string;
}

export interface WhereCondition {
    type: string;
    left: {
        type: string;
        table: string;
        field: string;
        dataType: string;
    };
    operator: string;
    right: {
        type: string;
        value?: string;
        select?: {
            type: string;
            distinct: boolean;
            fields: {
                type: string;
                field: string;
                table: string;
                dataType: string;
            }[];
            from: TableType[];
            where: WhereCondition;
        };
    };
}

export interface OrderByType {
    field: string;
    table: string;
    direction: string;
    nulls: string;
}

export interface ValidationType {
    requiresGroupBy: boolean;
    referencedTables: string[];
    dependencies: {
        tables: string[];
        columns: {
            [key: string]: string[];
        };
    };
}