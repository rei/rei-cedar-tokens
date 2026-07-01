import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['style-dictionary/**/*.test.ts', 'scripts/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['style-dictionary/**/*.ts'],
      exclude: [
        'style-dictionary/**/*.test.ts',
        'style-dictionary/**/*.d.ts',
        'style-dictionary/build.ts',
      ],
    },
  },
});
