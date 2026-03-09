# Code Health Check Report

Date: 2026-03-09
Repository: bolt.diy_cloudflare

## Commands Run

### bolt.diy
- `pnpm -C bolt.diy lint` ❌
  - Failed with 47 lint errors across multiple files (formatting/style/import/TS lint rules).
- `pnpm -C bolt.diy typecheck` ❌
  - Failed with TypeScript errors in stream handling/API routes and missing `../build/server` types.
- `pnpm -C bolt.diy test` ✅
  - Passed: 4 test files, 54 tests.

### openclaw
- `pnpm -C openclaw lint` ✅
  - Passed with 0 warnings and 0 errors.
- `pnpm -C openclaw test:fast` ✅
  - Passed: 804 test files passed, 1 skipped; 6485 tests passed, 2 skipped.

## Overall Status
- `openclaw` checks are healthy for lint and unit tests.
- `bolt.diy` is **not fully okay yet** because lint and typecheck currently fail.
