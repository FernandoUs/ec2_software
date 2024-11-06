module.exports = {
    preset: 'ts-jest',  // Si estás usando TypeScript
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // Para transformar archivos .ts
    },
    testEnvironment: 'node', // Si estás trabajando en un entorno de Node.js
    transformIgnorePatterns: [
      'node_modules/(?!chai|chai-as-promised)', // Incluye estas bibliotecas en la transformación
    ],
  };
  