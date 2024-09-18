#!/bin/bash
npx typeorm-ts-node-commonjs -d src/config/data-source.ts  query 'DROP TABLE if exists users cascade;'
npx typeorm-ts-node-commonjs -d src/config/data-source.ts  query 'DROP TABLE if exists stores cascade;'
npx typeorm-ts-node-commonjs -d src/config/data-source.ts  query 'DROP TABLE if exists links cascade;'
npx typeorm-ts-node-commonjs -d src/config/data-source.ts  query 'DROP TABLE if exists migrations cascade;'
