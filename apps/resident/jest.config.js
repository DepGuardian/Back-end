module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@auth/(.*)$': '<rootDir>/src/$1',
      '^@libs/(.*)$': '<rootDir>/../../libs/$1',
      '^@database/(.*)$': '<rootDir>/../../libs/database/$1'
    },
    roots: ['<rootDir>'],
    modulePaths: ['.'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', '<rootDir>'],
    // Removida la línea setupFiles que causaba el error
  };