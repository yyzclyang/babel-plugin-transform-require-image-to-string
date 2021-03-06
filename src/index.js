const {
  isRequireStatement,
  isValidArgument,
  isNeedTransform,
  defaultOptions,
  handler
} = require('./util');

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(p, state) {
        if (isRequireStatement(p) && isValidArgument(p)) {
          const options = Object.assign({}, defaultOptions, state.opts);

          const imageSrcValue = p.get('arguments')[0].node.value;

          if (isNeedTransform(imageSrcValue, options)) {
            // 引用图片的文件的路径
            const resourceFilePath = state.file.opts.filename;

            const imagePublicUrl = handler(
              imageSrcValue,
              resourceFilePath,
              options
            );
            // 在 ast 中替换 require 调用节点为 url 字符串节点
            p.replaceWith(t.valueToNode(imagePublicUrl));
          }
        }
      }
    }
  };
};
