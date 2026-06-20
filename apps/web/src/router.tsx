import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { Root } from './routes/__root';
import { HomePage } from './routes/index';
import { AboutPage } from './routes/about';
import { ServicesPage } from './routes/services';
import { EstimatorPage } from './routes/estimator';
import { ContactPage } from './routes/contact';

const rootRoute = createRootRoute({ component: Root });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage });
const servicesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/services', component: ServicesPage });
const estimatorRoute = createRoute({ getParentRoute: () => rootRoute, path: '/estimator', component: EstimatorPage });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: ContactPage });

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  servicesRoute,
  estimatorRoute,
  contactRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
