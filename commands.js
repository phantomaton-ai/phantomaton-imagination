const commands = configuration => {
  return [
    {
      name: 'imagine',
      description: 'Generate an image based on a text prompt.',
      example: { attributes: { prompt: 'A cat riding a unicorn' } },
      validate: (attributes) => !!attributes.prompt,
      execute: async (attributes, body, context) => {
        const { prompt } = attributes;
        const { imageProvider } = context.extensions;
        const providers = await imageProvider();
        if (!providers || providers.length === 0) {
          return 'No image providers available.';
        }
        const image = await providers[0].generateImage(prompt);
        return image; // Assuming the provider returns the image data or a URL.
      }
    }
  ];
};

export default commands;