---
inject: true
to: src/database/typeorm/seeds/run-seed.ts
before: close
---
  await app.get(<%= name %>SeedService).run();
