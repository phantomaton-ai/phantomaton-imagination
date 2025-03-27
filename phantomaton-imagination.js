import plugins from 'phantomaton-plugins';

const api = plugins.create({
  generateImage: plugins.singleton,
  imageConfig: plugins.optional
});

export default api;