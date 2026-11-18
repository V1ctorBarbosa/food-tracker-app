# Food Track

Mobile-first app for logging meals, water and weight, and tracking calories and macronutrients against daily targets. Meals can be logged from a food catalog or **estimated by AI from a photo of the plate or a short description**, then reviewed item by item before saving.

Built with **React Native, Expo and TypeScript**, for Android, iOS and web. The interface is in Brazilian Portuguese.

> Backend (.NET / C#, DDD, AWS Lambda): [food-tracker-api](https://github.com/V1ctorBarbosa/food-tracker-api)

## Highlights

- **AI meal estimate.** Take or pick a photo (resized on device before upload), add an optional description, and get every ingredient back with its estimated quantity and nutrition. A review screen lets the user toggle items in or out and re-run the estimate with an edited description.
- **Daily dashboard** with calorie and macronutrient progress, water intake and weight tracking, plus charts over time.
- **Food catalog search** (TACO table, Open Food Facts) and custom foods; food in grams, drinks in milliliters.
- **Feature-Sliced Design**: code organized by `app`, `pages`, `features`, `entities` and `shared` slices, each with a public API.
- **Render-focused components.** Derived data (filtering, grouping, deltas, formatting) lives in plain `model/` functions next to each slice, so it is unit-tested without rendering anything.
- **370+ tests** with Jest and React Native Testing Library.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Expo (React Native), Expo Router |
| Language | TypeScript |
| Server state | TanStack Query |
| Forms and validation | React Hook Form + Zod |
| Styling | NativeWind (Tailwind), one centralized light/dark theme |
| Animation | Reanimated: elements animate in and out instead of popping |
| Auth | Google Sign-In + Firebase Auth, behind a project-defined `AuthGateway` port |
| Tests | Jest, React Native Testing Library |

**Dependency inversion on the frontend too:** pages and features talk to an `AuthGateway` interface, and a single Firebase adapter implements it. Swapping the auth provider means writing one new adapter, not editing every screen.

## How it is built

Each feature starts as a written spec in the API repository ([docs/specs](https://github.com/V1ctorBarbosa/food-tracker-api/tree/master/docs/specs)) and is developed with Claude Code in a workflow of small reviewed changes, tests with every change and Conventional Commits. The AI writes alongside me; the design decisions and the review are mine.

## Running locally

```bash
npm install
npx expo start
npm test
```

The app talks to the deployed API by default (`EXPO_PUBLIC_API_BASE_URL`). Google Sign-In needs a development build.
