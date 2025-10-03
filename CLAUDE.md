# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js template project integrated with the SJ AB Component Library design system. The project uses React 19, Next.js 15.5.4 with Turbopack, and TypeScript.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack)
- **Production build**: `npm build` (uses Turbopack)
- **Start production**: `npm start`
- **Lint**: `npm run lint`

Development server runs at http://localhost:3000

## Architecture

### App Structure

Uses Next.js App Router with the source directory at `src/app/`:
- `src/app/layout.tsx` - Root layout with metadata and Providers wrapper
- `src/app/providers.tsx` - Client-side providers component (wraps app with ThemeProvider)
- `src/app/page.tsx` - Home page component

### Path Aliases

TypeScript is configured with `@/*` alias mapping to `./src/*`

### SJ AB Component Library Integration

The project extensively uses the `@sj-ab/component-library` design system with modular packages:

**Theme System:**
- Import themes from `@sj-ab/component-library.styles.themes` (lightTheme, darkTheme)
- Wrap components with `ThemeProvider` from `@sj-ab/component-library.ui.theme-provider`
- Access design tokens via `theme.designTokens.*` in sx props

**Common UI Components:**
- Typography: `@sj-ab/component-library.ui.typography`
- Buttons: `@sj-ab/component-library.ui.flow-button`, `.text-button`, etc.
- Layout: `@sj-ab/component-library.ui.stack`, `.container`, `.grid`
- Cards: `@sj-ab/component-library.ui.card` and related card components
- Navigation: `@sj-ab/component-library.ui.navigation-bar`, `.app-bar`, etc.

**Important Imports:**
- Most MUI base components (Box, Stack, etc.) should be imported from `@mui/material`
- SJ-specific styled components use the `@sj-ab/component-library.ui.*` namespace
- Design tokens, colors, fonts come from `@sj-ab/component-library.styles.*`
- Hooks from `@sj-ab/component-library.hooks.*`
- Utilities from `@sj-ab/component-library.utils.*`

### Component Patterns

**Client Components:**
- Use `"use client"` directive for components with React hooks or interactivity
- The Providers component (src/app/providers.tsx) must be client-side

**Theme Access:**
- Access design tokens in sx prop: `sx={(theme) => ({ backgroundColor: theme.designTokens.color.background.base.primary.value })}`

## TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- No type definitions in tsconfig (types array is empty)
- Uses Next.js TypeScript plugin
