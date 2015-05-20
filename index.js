'use strict';

module.exports = walkAST;
function walkAST(ast, before, after) {
  function replace(replacement) {
    ast = replacement;
  }
  var result = before && before(ast, replace);
  if (before && result === false) {
    return ast;
  }
  switch (ast.type) {
    case 'NamedBlock':
    case 'Block':
      ast.nodes = ast.nodes.map(function (node) {
        return walkAST(node, before, after);
      });
      break;
    case 'Case':
    case 'Each':
    case 'When':
    case 'Code':
      if (ast.block) {
        ast.block = walkAST(ast.block, before, after);
      }
      if (ast.alternative) {
        ast.alternative = walkAST(ast.alternative, before, after);
      }
      if (ast.code) {
        ast.code = walkAST(ast.code, before, after);
      }
      break;
    case 'Mixin':
    case 'Tag':
      if (ast.block) {
        ast.block = walkAST(ast.block, before, after);
      }
      if (ast.code) {
        ast.code = walkAST(ast.code, before, after);
      }
      break;
    case 'BlockComment':
    case 'Filter':
    case 'Include':
      if (ast.block) {
        ast.block = walkAST(ast.block, before, after);
      }
      break;
    case 'Extends':
    case 'Attrs':
    case 'Comment':
    case 'Doctype':
    case 'Literal':
    case 'MixinBlock':
    case 'Text':
    case 'NewLine':
      break;
    default:
      throw new Error('Unexpected node type ' + ast.type);
  }
  after && after(ast, replace);
  return ast;
}
