# _profile.rocks_ app

Built with [Next.js](https://nextjs.org/).

## Features

- [React compiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler) enabled
- [Output static export](https://nextjs.org/docs/app/guides/static-exports)
- [ESlint](https://eslint.org/) & [Prettier](https://prettier.io/) configured
- [Sass](https://sass-lang.com/) & [SCSS](https://sass-lang.com/) support
- [TypeScript](https://www.typescriptlang.org/) (checks JavaScript files too)

## Getting Started

### 1. Installation

Clone the repository and install dependencies using your preferred package manager.

```sh
# Using npm
npm install

# Using Yarn
yarn install

# Using pnpm
pnpm install

# Using Bun
bun install
```

### 2. Configuration

Create a `.env` file in the root of the project.

```sh
# .env
NEXT_PUBLIC_API="http://localhost:4000"

NEXT_PUBLIC_HREF_HELP="https://www.profile.rocks/i/help"
NEXT_PUBLIC_HREF_PRIVACY="https://www.profile.rocks/i/privacy"
NEXT_PUBLIC_HREF_TERMS="https://www.profile.rocks/i/terms"

NEXT_PUBLIC_PLATFORM_NAME="profile.rocks"
NEXT_PUBLIC_PLATFORM_DESCRIPTION="Design the Map of Your Online Presence"

NEXT_PUBLIC_SITE="https://app.profile.rocks"
```

See [`sample.env`](/sample.env).

### 3. Running the Server

You can run the server in development mode.

```sh
# Using npm
npm run dev

# Using Yarn
yarn run dev

# Using pnpm
pnpm run dev

# Using Bun
bun run dev
```

Check the `package.json` `"scripts"` field for other built-in scripts (build, lint, format...).

## License

```txt
Copyright © 2025 Stefan Samson <ss42701@outlook.com> (https://ssbit01.github.io/)

This project is licensed under the MIT License.
See the LICENSE file for the full license text.

For details on third-party components and their licenses, see THIRD_PARTY_LICENSES.md.
```

This project is licensed under the [MIT License](LICENSE).

See [ICON-LICENSES.md](/ICON-LICENSES.md) for icon licenses.

You can find other [profile.rocks](https://www.profile.rocks/) open source projects at <https://github.com/profile-rocks>.
