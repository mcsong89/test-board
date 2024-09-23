// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // 소스 디렉토리의 테스트 파일 경로
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 절대 경로 설정이 필요한 경우
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  // 빌드된 파일을 테스트하지 않도록 설정
  testPathIgnorePatterns: ['/dist/'],
};
