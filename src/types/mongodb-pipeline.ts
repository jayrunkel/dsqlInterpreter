export type MongoDBStage = {
    $match?: Record<string, any>;
    $lookup?: {
        from: string;
        localField: string;
        foreignField: string;
        as: string;
    };
    $project?: Record<string, any>;
    $sort?: Record<string, 1 | -1>;
    $group?: Record<string, any>;
};

export type MongoDBPipeline = MongoDBStage[];
