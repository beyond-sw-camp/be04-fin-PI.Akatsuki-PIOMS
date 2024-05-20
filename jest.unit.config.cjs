module.exports = {
    // 테스트 환경 설정
    testEnvironment: 'node',

    // 테스트 파일 위치 설정
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],

    // 모듈 파일 확장자 설정
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

    // 커버리지 설정 (테스트 커버리지 보고서를 생성하는 데 사용)
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '**/*.{js,jsx,ts,tsx}',
        '!**/node_modules/**',
        '!**/vendor/**'
    ],

    // 변환기 설정 (예: Babel을 사용하여 ES6 코드를 변환)
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest'
    },

    // 테스트 결과 출력 형식 설정
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: 'test_results/junit',
            outputName: 'junit.xml',
        }]
    ],

    // 모의 모듈 설정 (예: CSS 모듈)
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy'
    }
};
