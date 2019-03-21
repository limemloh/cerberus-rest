import * as ts from "typescript";

const defaultOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2016,
  module: ts.ModuleKind.CommonJS
};

const printer = ts.createPrinter();

export function generateJSON(
  fileName: string,
  options: ts.CompilerOptions = defaultOptions
) {
  // Build a program using the set of root file names in fileNames
  const program = ts.createProgram([fileName], options);
  const checker = program.getTypeChecker();
  for (const sourceFile of program.getSourceFiles()) {
    // Skip declaration files
    if (sourceFile.isDeclarationFile) {
      continue;
    }

    sourceFile.forEachChild(node => {
      node;
    });
  }
}

generateJSON("./examples/simple/index.ts");
