---
default: false
version: 14.1.0
date: 2026-07-01
---

# Release notes – v14.1.0

## Overview

Minor release that adds official support for Node.js 24 by updating the engines field to allow Node 24 and above.

## Features

- **Node.js 24 support** — Updated the `engines.node` field in `package.json` from `">= 22.12.0 <23"` to `">= 24.0.0"` to officially support Node.js 24.
  - **Files changed:**
    - `package.json` — Updated engines.node field to `">= 24.0.0"`
    - `.nvmrc` — Updated to Node 24.0.0
    - `.github/workflows/*.yml` — Updated CI workflows to use Node 24.0.0
  - **Before:** Node 24 was not officially supported, causing EBADENGINE warnings during installation
  - **After:** Node 24 is fully supported with no warnings

## Migration guide

### No breaking changes

This is a backward-compatible update. Existing consumers using Node 22 or later will continue to work without any changes.

### Node.js version requirement

The minimum supported Node.js version is now 24.0.0. If you are using an earlier version, you will need to upgrade Node.js before installing this version.

## Be Aware Of

### Notices

- This release requires Node.js 24.0.0 or later
- CI/CD pipelines should be updated to use Node 24 or later
- The `.nvmrc` file has been updated to Node 24.0.0 for local development
