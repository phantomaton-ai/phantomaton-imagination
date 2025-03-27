import plugins from 'phantomaton-plugins';
import execution from 'phantomaton-execution';
import commands from './commands.js';

const api = plugins.create({
  generateImage: plugins.singleton,
  imageConfig: plugins.optional,
  imageProvider: plugins.composite
}, ({configuration, extensions}) => [
  plugins.define(execution.command).as(commands(configuration))
]);

export default api;