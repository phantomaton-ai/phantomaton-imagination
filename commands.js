const commands = (adapter, configuration) => {
  return [
    {
      name: 'imagine',
      description: 'Generate an image based on a text prompt.',
      example: { attributes: { prompt: 'A cat riding a unicorn' } },
      validate: (attributes) => !!attributes.prompt,
      execute: async (attributes) => {
        const { prompt } = attributes;
        if (!adapter || adapter.length === 0) {
          return 'No image adapter available.';
        }
        const image = await adapter[0].imagine(prompt);
        return image; // Assuming the adapter returns the image data or a URL.
      }
    }
  ];
};

export default commands;