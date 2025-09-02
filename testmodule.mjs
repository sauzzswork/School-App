const { createRouter } = await import('next-connect');
const handler = createRouter();
console.log(typeof handler); // should log: 'object'