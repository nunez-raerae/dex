# Dex (Expo Pokédex)

A simple Pokédex built with **Expo + React Native + Expo Router**, backed by **PokéAPI** and cached with **TanStack Query**.

## Features

- Browse Pokémon with cached API fetching ([`useGetPokeList`](api/controller.tsx), [`useInfinitePokeList`](api/controller.tsx))
- Pokémon detail screen with gradient background + type badges ([app/[MoreDetail].tsx](app/[MoreDetail].tsx))
- Detail tabs: **About**, **Base Stats** (animated segments), **Evolution** (chain fetch) ([`TabComponent`](app/component/TabComponent.tsx))
- Reusable card UI for list items ([`CardView`](app/component/CardView.tsx))
- Type colors/icons utilities ([utils/util.tsx](utils/util.tsx))

## Tech Stack

- Expo / React Native
- Expo Router
- TanStack React Query
- TypeScript
- `react-native-svg`, `expo-linear-gradient`, `react-native-size-matters`

## Project Structure

- API hooks & types: [api/controller.tsx](api/controller.tsx)
- Routes:
  - Home: [app/index.tsx](app/index.tsx)
  - Details: [app/[MoreDetail].tsx](app/[MoreDetail].tsx)
  - Layout: [app/\_layout.tsx](app/_layout.tsx)
- UI components: [app/component/](app/component/)
  - [`CardView`](app/component/CardView.tsx)
  - [`TabComponent`](app/component/TabComponent.tsx)
  - [app/component/SearchBar.tsx](app/component/SearchBar.tsx)
- Assets: [assets/](assets/)

## Getting Started

### (1) Install dependencies

```sh
npm install
```
