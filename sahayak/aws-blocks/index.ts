import { Scope } from '@aws-blocks/blocks';

export const scope = new Scope('sahayak-production');

// No API, auth, or data blocks needed for a static site.
// The Hosting construct in index.cdk.ts handles everything.
