import type { ParamMatcher } from '@sveltejs/kit';

// this param matcher doensn't allow negative numbers
export const match = (param => /^\d+$/.test(param)) satisfies ParamMatcher;
