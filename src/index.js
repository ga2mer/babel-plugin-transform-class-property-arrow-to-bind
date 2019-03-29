import {
  isClassPropertyAssignedToArrowFunction,
  findClassConstructor,
  prependClassBodyWithConstructor,
  getIdentifierNameFromClassPropertyPath,
  convertClassPropertyToMethod,
  appendMethodBindingToConstructor
} from './helpers';

const babelPluginTransformClassPropertyArrowFunctions = ({ types: t }) => {
  return {
    name: 'babelPluginTransformClassPropertyArrowToBind',
    visitor: {
      ClassDeclaration(currentClassDeclarationPath) {
        const classBodyPath = currentClassDeclarationPath.get('body');
        let classConstructorPath = null;

        classBodyPath.get('body').forEach(path => {
          if (isClassPropertyAssignedToArrowFunction(path)) {
            if (classConstructorPath === null) {
              classConstructorPath =
                findClassConstructor(classBodyPath) ||
                prependClassBodyWithConstructor(classBodyPath, t);
            }

            const identifierName = getIdentifierNameFromClassPropertyPath(path);
            convertClassPropertyToMethod(path, identifierName, t);
            appendMethodBindingToConstructor(classConstructorPath, identifierName, t);
          }
        });
      },
    },
  };
}

export default babelPluginTransformClassPropertyArrowFunctions;
