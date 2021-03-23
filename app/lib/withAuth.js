import { useAuth } from './useAuth';
import withConditionalRedirect from './withConditionalRedirect';

/**
 * Require the user to be authenticated in order to render the component.
 * If the user isn't authenticated, forward to the given URL.
 */
export default function withAuth(WrappedComponent, location = '/auth/signin') {
  return withConditionalRedirect({
    WrappedComponent,
    location,
    clientCondition: function withAuthClientCondition() {
      console.log('client');
      const { user } = useAuth();
      console.log('Client user', user);
      if (user) {
        console.log('client false');
        return false;
      }
      console.log('client true');
      return true;
    },
    serverCondition: function withAuthServerCondition(ctx) {
      console.log('server');
      console.log('accessToken', ctx.req?.cookies.accessToken);
      console.log('here', !ctx.req?.cookies.accessToken);
      return !ctx.req?.cookies.accessToken;
    },
  });
}
