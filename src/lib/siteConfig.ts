import siteConfigJson from '../../site.config.json';

export const siteConfig = {
  helpEmail: siteConfigJson.helpEmail || 'fake@fakeemail.com',
} as const;
