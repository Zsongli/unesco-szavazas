import type { ParamMatcher } from '@sveltejs/kit';
import z from 'zod';

const schema = z.string().uuid();
export const match = (param => schema.safeParse(param).success) satisfies ParamMatcher;
