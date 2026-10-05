import { installAuthFetch } from './lib/admin-auth';

// Attach the admin token to same-origin requests and prompt for it on a 401.
installAuthFetch();
