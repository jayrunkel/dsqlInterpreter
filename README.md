# dsqlInterpreter

I'll help you create a comprehensive README.md file for your SQL to MongoDB query transformer project:

```markdown
# SQL to MongoDB Aggregation Pipeline Transformer

This project transforms SQL queries into MongoDB aggregation pipeline by processing the SQL AST (Abstract Syntax Tree) in JSON format.

## Description

The SQL to MongoDB Transformer is a TypeScript-based tool that converts SQL queries into equivalent MongoDB aggregation pipelines. It works by parsing a JSON representation of the SQL query's AST and generating the corresponding MongoDB aggregation stages.

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- TypeScript knowledge (for development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jayrunkel/dsqlInterpreter.git 
cd dsqlInterpreter
```

2. Install dependencies:
```bash
npm install
```

## Project Structure

```
.
├── README.md
├── package-lock.json
├── package.json
├── src
│   ├── __tests__
│   │   └── SqlToMongoTranslator.test.ts
│   ├── data
│   │   └── sampleAst.json
│   ├── index.ts
│   ├── translators
│   │   └── SqlToMongoTranslator.ts
│   └── types
│       ├── json.d.ts
│       ├── mongodb-pipeline.ts
│       └── sql-ast.ts
└── tsconfig.json
```

## Usage

1. Build the project:
```bash
npm run build
```

2. Run the tests:
```bash
npm test
```

3. Use in your code:
```typescript
import { SqlToMongoTranslator } from './translators/SqlToMongoTranslator';

const sqlAst = {
    // Your SQL AST in JSON format
};

const translator = new SqlToMongoTranslator();
const mongoPipeline = translator.translate(sqlAst);
```

## Available Scripts

- `npm run build`: Compiles TypeScript code to JavaScript
- `npm run start`: Runs the compiled application
- `npm run test`: Runs the test suite
- `npm run lint`: Runs the linter
- `npm run dev`: Runs the application in development mode with hot-reload

## Testing

The project uses Jest for testing. Test files are located in the `src/__tests__` directory.

To run tests:
```bash
npm test
```

## Types

The project includes TypeScript type definitions for:
- SQL AST structures (`sql-ast.ts`)
- MongoDB Pipeline stages (`mongodb-pipeline.ts`)
- JSON utilities (`json.d.ts`)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository.

## Authors

- Tushar Kagde
