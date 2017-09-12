/**
 * The relevant parts of TypeScript.
 *
 * For all exports, see: https://github.com/AssemblyScript/assemblyscript/blob/master/src/typescript.ts
 *
 * @module assemblyscript/typescript
 * @preferred
 */ /** */

import * as nodePath from "path";
import * as ts from "../lib/typescript";
import * as library from "./library";

// With a little help of "Find all references" the following list aims to provide an answer to
// the interesting question "Which parts of TypeScript do we actually use, and where?".

export import ArrayLiteralExpression = ts.ArrayLiteralExpression;
export import ArrayTypeNode = ts.ArrayTypeNode;
export import AssertionExpression = ts.AssertionExpression;
export import BinaryExpression = ts.BinaryExpression;
export import Block = ts.Block;
export import BreakStatement = ts.BreakStatement;
export import CallExpression = ts.CallExpression;
export import ClassDeclaration = ts.ClassDeclaration;
       import CompilerHost = ts.CompilerHost;
       import CompilerOptions = ts.CompilerOptions;
export import ConditionalExpression = ts.ConditionalExpression;
export import ConstructorDeclaration = ts.ConstructorDeclaration;
export import ContinueStatement = ts.ContinueStatement;
export import DiagnosticCategory = ts.DiagnosticCategory;
export import DiagnosticCollection = ts.DiagnosticCollection;
export import DiagnosticMessage = ts.DiagnosticMessage;
export import Diagnostic = ts.Diagnostic;
export import DoStatement = ts.DoStatement;
export import ElementAccessExpression = ts.ElementAccessExpression;
export import EnumDeclaration = ts.EnumDeclaration;
export import EnumMember = ts.EnumMember;
export import EntityName = ts.EntityName;
export import ExpressionStatement = ts.ExpressionStatement;
export import Expression = ts.Expression;
       import FormatDiagnosticsHost = ts.FormatDiagnosticsHost;
export import ForStatement = ts.ForStatement;
export import FunctionLikeDeclaration = ts.FunctionLikeDeclaration;
export import FunctionDeclaration = ts.FunctionDeclaration;
export import GetAccessorDeclaration = ts.GetAccessorDeclaration;
export import Identifier = ts.Identifier;
export import IfStatement = ts.IfStatement;
export import LiteralExpression = ts.LiteralExpression;
export import LiteralTypeNode = ts.LiteralTypeNode;
export import MethodDeclaration = ts.MethodDeclaration;
export import ModifierFlags = ts.ModifierFlags;
       import ModuleKind = ts.ModuleKind;
export import NewExpression = ts.NewExpression;
export import NodeArray = ts.NodeArray;
export import NodeFlags = ts.NodeFlags;
export import Node = ts.Node;
export import NumericLiteral = ts.NumericLiteral;
export import OmittedExpression = ts.OmittedExpression;
export import ParenthesizedExpression = ts.ParenthesizedExpression;
export import ParenthesizedTypeNode = ts.ParenthesizedTypeNode;
export import PostfixUnaryExpression = ts.PostfixUnaryExpression;
export import PrefixUnaryExpression = ts.PrefixUnaryExpression;
export import Program = ts.Program;
export import PropertyAccessExpression = ts.PropertyAccessExpression;
export import PropertyDeclaration = ts.PropertyDeclaration;
export import TypeAliasDeclaration = ts.TypeAliasDeclaration;
export import TypeChecker = ts.TypeChecker;
export import TypeNode = ts.TypeNode;
export import TypeParameterDeclaration = ts.TypeParameterDeclaration;
export import TypeReferenceNode = ts.TypeReferenceNode;
export import TypeReference = ts.TypeReference;
export import Type = ts.Type;
export import VariableDeclarationList = ts.VariableDeclarationList;
export import VariableStatement = ts.VariableStatement;
export import ReturnStatement = ts.ReturnStatement;
       import ResolvedModule = ts.ResolvedModule;
export import ScriptTarget = ts.ScriptTarget;
export import SetAccessorDeclaration = ts.SetAccessorDeclaration;
export import SourceFile = ts.SourceFile;
export import Statement = ts.Statement;
export import StringLiteral = ts.StringLiteral;
export import SwitchStatement = ts.SwitchStatement;
export import Symbol = ts.Symbol;
export import SyntaxKind = ts.SyntaxKind;
export import ThrowStatement = ts.ThrowStatement;
export import UnionTypeNode = ts.UnionTypeNode;
export import WhileStatement = ts.WhileStatement;

export import getPreEmitDiagnostics = ts.getPreEmitDiagnostics;
export import getSourceFileOfNode = ts.getSourceFileOfNode;
export import getTextOfNode = ts.getTextOfNode;
export import isDeclaration = ts.isDeclaration;
export import createDiagnosticCollection = ts.createDiagnosticCollection;
export import createDiagnosticForNode = ts.createDiagnosticForNode;
       import createGetCanonicalFileName = ts.createGetCanonicalFileName;
export import createProgram = ts.createProgram;
export import createSourceFile = ts.createSourceFile;
export import createNodeArray = ts.createNodeArray;
       import resolveModuleName = ts.resolveModuleName;
       import sys = ts.sys;

// generated diagnostic extensions
export { DiagnosticsEx } from "./typescript/diagnosticMessages.generated";

/** Default format diagnostics host for convenience. */
export const defaultFormatDiagnosticsHost: FormatDiagnosticsHost = {
  getCurrentDirectory: () => sys.getCurrentDirectory(),
  getNewLine: () => sys.newLine,
  getCanonicalFileName: createGetCanonicalFileName(sys.useCaseSensitiveFileNames)
};

/** Default compiler options for AssemblyScript compilation. */
export const defaultCompilerOptions = <CompilerOptions>{
  target: ScriptTarget.Latest,
  module: ModuleKind.None,
  noLib: true,
  experimentalDecorators: true,
  types: []
};

/** Creates an AssemblyScript-compatible compiler host. */
export function createCompilerHost(moduleSearchLocations: string[], entryFileSource?: string, entryFileName: string = "module.ts"): CompilerHost {
  const files: { [key: string]: SourceFile } = {};
  if (typeof entryFileSource === "string")
    files[entryFileName] = createSourceFile(entryFileName, <string>entryFileSource, ScriptTarget.Latest);
  Object.keys(library.files).forEach(name => {
    files[name] = createSourceFile(name, library.files[name], ScriptTarget.Latest);
  });

  return {
    getSourceFile,
    getDefaultLibFileName: () => "assembly.d.ts",
    writeFile: (filename: string, content: string) => sys.writeFile(filename, content),
    getCurrentDirectory: () => sys.getCurrentDirectory(),
    getDirectories: (path: string) => sys.getDirectories(path),
    getCanonicalFileName: fileName => sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
    getNewLine: () => sys.newLine,
    useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames,
    fileExists,
    readFile,
    resolveModuleNames
  };

  function fileExists(fileName: string): boolean {
    return !!files[fileName] || sys.fileExists(fileName);
  }

  function readFile(fileName: string): string {
    return (files[fileName] ? files[fileName].text : sys.readFile(fileName)) || "";
  }

  function getSourceFile(fileName: string, languageVersion: ScriptTarget, onError?: (message: string) => void): SourceFile {
    if (files[fileName])
      return files[fileName];
    const sourceText = /[\/\\]assembly\.d\.ts$/.test(fileName) ? "" : sys.readFile(fileName);
    if (sourceText === undefined && onError)
      onError("file not found: " + fileName);
    return files[fileName] = createSourceFile(fileName, sourceText || "", languageVersion);
  }

  function resolveModuleNames(moduleNames: string[], containingFile: string): ResolvedModule[] {
    return <ResolvedModule[]>moduleNames.map(moduleName => {
      // try to use standard resolution
      const result = resolveModuleName(moduleName, containingFile, defaultCompilerOptions, { fileExists, readFile });
      if (result.resolvedModule)
        return result.resolvedModule;
      // check fallback locations, for simplicity assume that module at location should be represented by '.d.ts' file
      for (const location of moduleSearchLocations) {
        const modulePath = nodePath.join(location, moduleName + ".d.ts");
        if (fileExists(modulePath))
          return { resolvedFileName: modulePath };
      }
      return undefined;
    });
  }
}

/** Formats a diagnostic message in plain text. */
export function formatDiagnosticsEx(diagnostics: Diagnostic[], host?: FormatDiagnosticsHost) {
  return ts.formatDiagnostics(diagnostics, host || defaultFormatDiagnosticsHost);
}

/** Formats a diagnostic message with terminal colors and source context. */
export function formatDiagnosticsWithColorAndContextEx(diagnostics: Diagnostic[], host?: FormatDiagnosticsHost) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, host || defaultFormatDiagnosticsHost);
}

/** Prints a diagnostic message to console. */
export function printDiagnostic(diagnostic: Diagnostic): void {
  if (typeof process !== "undefined" && process && process.stderr) {
    if (diagnostic.category === DiagnosticCategory.Message)
      process.stderr.write(formatDiagnosticsEx([ diagnostic ], defaultFormatDiagnosticsHost));
    else
      process.stderr.write(formatDiagnosticsWithColorAndContextEx([ diagnostic ], defaultFormatDiagnosticsHost) + "\n");
  } else {
    if (diagnostic.category === DiagnosticCategory.Message)
      (console.info || console.log)(formatDiagnosticsEx([ diagnostic ], defaultFormatDiagnosticsHost));
    else if (diagnostic.category === DiagnosticCategory.Warning)
      (console.warn || console.log)(formatDiagnosticsEx([ diagnostic ], defaultFormatDiagnosticsHost));
    else
      (console.error || console.log)(formatDiagnosticsEx([ diagnostic ], defaultFormatDiagnosticsHost));
  }
}

/** Gets the name of a symbol.  */
export function getNameOfSymbol(symbol: Symbol): string {
  return ts.unescapeLeadingUnderscores(symbol.escapedName);
}
