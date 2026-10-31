export const mockConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_SECRET':
        return 'abcdef';
      case 'JWT_EXPIRES_IN':
        return '1d';
    }
  },
};
