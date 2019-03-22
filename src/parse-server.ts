import * as ts from "typescript";

const defaultOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2016,
  module: ts.ModuleKind.CommonJS
};

export function parseServerCode(
  fileName: string,
  options: ts.CompilerOptions = defaultOptions
) {
  // Build a program using the set of root file names in fileNames
  const program = ts.createProgram([fileName], options);
  // Important
  const checker = program.getTypeChecker();
  const appName = getAppName(program);
  if (appName === undefined) {
    throw new Error("Unable to find the CRest application");
  }

  const endpoints = extractEndpoints(program, appName);
  return endpoints;
}

function extractEndpoints(program: ts.Program, appName: ts.Identifier) {
  for (const sourceFile of program.getSourceFiles()) {
    // Skip declaration files
    if (sourceFile.isDeclarationFile) {
      continue;
    }
    sourceFile.forEachChild(node => {
      if (ts.isExpressionStatement(node)) {
        const firstChild = node.expression.getChildAt(0);
        if (
          ts.isPropertyAccessExpression(firstChild) &&
          ts.isIdentifier(firstChild.expression) &&
          firstChild.expression.text === appName.text
        ) {
          const argsListNode = node.expression.getChildAt(2);
          const argNodes = argsListNode
            .getChildren()
            .filter(a => a.kind !== ts.SyntaxKind.CommaToken);
          const method = firstChild.name;
          parseEndpoint(method, argNodes);
        }
      }
    });
  }
}

function parseEndpoint(method: ts.Identifier, args: ts.Node[]) {
  const [path, validation, fn] = args;

  console.log(
    method.getFullText(),
    path.getText(),
    validation.getFullText(),
    fn.getFullText()
  );
}

function getAppName(program: ts.Program): ts.Identifier | undefined {
  let appName = undefined;
  for (const sourceFile of program.getSourceFiles()) {
    // Skip declaration files
    if (sourceFile.isDeclarationFile) {
      continue;
    }
    ts.forEachChild(sourceFile, node => {
      if (ts.isVariableStatement(node)) {
        for (const decl of node.declarationList.declarations) {
          if (
            decl.initializer !== undefined &&
            ts.isCallExpression(decl.initializer) &&
            decl.initializer.expression.getText() === "CRest" &&
            ts.isIdentifier(decl.name)
          ) {
            appName = decl.name;
            return true;
          }
        }
      }
    });
  }
  return appName;
}

parseServerCode("./examples/simple/index.ts");
