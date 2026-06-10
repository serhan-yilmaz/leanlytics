import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'

import AppLayout from '../app/layout/AppLayout.tsx'
import Dashboard from '../pages/Dashboard.tsx'
import Measurements from '../pages/Measurements.tsx'
import Trends from '../pages/Trends.tsx'
import Settings from '../pages/Settings.tsx'
import Landing from '../pages/Landing.tsx'
import Privacy from '../pages/Privacy.tsx'


const rootRoute = createRootRoute({
  component: AppLayout,
})

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
})

const measurementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/measurements',
  component: Measurements,
})

const trendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trends',
  component: Trends,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: Privacy,
})

const routeTree = rootRoute.addChildren([
  landingRoute, 
  dashboardRoute,
  measurementsRoute,
  trendsRoute,
  settingsRoute,
  privacyRoute
])

export const router = createRouter({ routeTree })