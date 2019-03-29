import { template } from '@babel/core';

export const isClassPropertyAssignedToArrowFunction = (path) => {
  const { node } = path;
  return (
    node &&
    node.type === 'ClassProperty' &&
    node.value &&
    node.value.type === 'ArrowFunctionExpression'
  );
}

export const findClassConstructor = (classBodyPath) => {
  return classBodyPath
    .get('body')
    .find(({ node }) => node.type === 'ClassMethod' && node.kind === 'constructor');
}

export const prependClassBodyWithConstructor = (classBodyPath, t) => {
  const newConstructor = t.classMethod(
    'constructor',
    t.identifier('constructor'),
    [],
    t.blockStatement([]),
    false,
    null
  );
  if (classBodyPath.parent.superClass) {
    newConstructor.params = [t.restElement(t.identifier("args"))];
    newConstructor.body.body.push(template.statement.ast`super(...args)`);
  }
  classBodyPath.unshiftContainer('body', newConstructor);
  return classBodyPath.get('body')[0];
}

export const getIdentifierNameFromClassPropertyPath = (classPropertyPath) => {
  return classPropertyPath.node.key.name;
}

export const appendMethodBindingToConstructor = (classConstructorPath, identifierName, t) => {
  const newBindingNode = t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(t.thisExpression(), t.identifier(identifierName)),
      t.callExpression(
        t.memberExpression(
          t.memberExpression(t.thisExpression(), t.identifier(identifierName)),
          t.identifier('bind')
        ),
        [t.thisExpression()]
      )
    )
  );
  classConstructorPath.get('body').pushContainer('body', newBindingNode);
}

export const convertClassPropertyToMethod = (classPropertyPath, identifierName, t) => {
  const isImplicitReturn = !t.isBlockStatement(classPropertyPath.node.value.body);
  const methodReturnBlock = isImplicitReturn
    ? t.blockStatement([t.returnStatement(classPropertyPath.node.value.body)])
    : t.blockStatement(classPropertyPath.node.value.body.body);
  const newMethod = t.classMethod(
    'method',
    t.identifier(identifierName),
    classPropertyPath.node.value.params,
    methodReturnBlock,
    false,
    null
  );
  newMethod.async = classPropertyPath.node.value.async;
  classPropertyPath.replaceWith(newMethod);
}