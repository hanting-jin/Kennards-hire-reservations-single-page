# Kennards Hire Reservations Single Page

This project is a React single-page app that displays branch reservations. The sections below explain how to install and run it locally, the tech stack used, the folder layout, how to use the core `BookingTable` component, and how polling works.

## 1) Install and start locally
- Prerequisites: Node.js 18+ and npm.
- Install dependencies: `npm install`
- Start dev server: `npm run dev` 
- Build for production: `npm run build`

## 2) Tech stack
- Framework: React 18 + TypeScript
- Bundler/dev server: Vite
- Styling: Tailwind-style utility classes (via `index.css` and component classNames)
- UI primitives: Headless components in `src/components/ui` plus Lucide icons
- Data fetching/state: React Query (@tanstack/react-query)
- Routing: React Router
- Date helpers: date-fns
- testing: jest

## 3) Folder structure 
- `src/main.tsx` — App entry, mounts React and router.
- `src/App.tsx` — Top-level router provider.
- `src/router.tsx` — Route definitions (lazy-loaded pages).
- `src/AppLayout.tsx` and `src/components/Layout.tsx` — Page chrome with header.
- `src/pages/ReservationsPage.tsx` — Main reservations screen + data hook wiring.
- `src/components/BookingTable/` — Core table UI (desktop/mobile, headers, states).
- `src/api/` — API client and React Query hooks.
- `src/lib/utils/` — Date and reservation helpers.
- `src/enums.ts` — Shared enums (e.g., BranchId).

## 4) BookingTable usage
`BookingTable` renders the reservations list for both desktop and mobile. You pass a config object plus the data to display.

Basic example (see `src/pages/ReservationsPage.tsx` for the real usage):
```tsx
<BookingTable
  title="Reservations"
  tableData={reservations} // Reservation[]
  config={{
    columns,                 // BookingTableColumn[]
    mobileLayout: {          // Optional mobile layout slots
      topLeft: ['time', 'type'],
      topRight: 'hireNumber',
      body: ['customer', 'contact', 'phone', 'equipment'],
    },
    getRowKey: (r) => r.contract.hireNumber,
    showDateNavigator: true, // Shows Prev/Next and date range label
    rangeLabel,              // String label for the current range/day
    onPrev, onNext,          // Handlers for navigation
    showExpandLinesToggle: true, // Desktop toggle to expand line items
    isLoading, isFetching, isError, // States from React Query
    errorMessage,            // Optional error text
    onRetry: refetch,        // Retry handler for errors
    onRefresh: refetch,      // Mobile refresh button handler
  }}
  filters={<BranchSelect branchId={branchId} onChange={setBranchId} />}
/>
```
- Desktop: shows all reservations within the selected week, grouped by date, with optional expanded line items.
- Mobile: shows only pickup reservations for the selected day; when none exist it shows “No pickup reservations”.

## 5) API polling
- The reservations query uses React Query’s `useQuery` with `refetchInterval: 30000` (30 seconds) defined in `src/api/reservationsApi.ts`.
- While fetching, the UI keeps previous data to avoid flashing (`placeholderData: keepPreviousData`) and shows a subtle “Updating latest reservations…” hint in the date navigator when `isFetching` is true.
