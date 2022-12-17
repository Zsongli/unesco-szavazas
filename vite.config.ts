import type { UserConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import UnpluginIcons from "unplugin-icons/vite";

export default {
	plugins: [
		sveltekit(),
		UnpluginIcons({
			compiler: "svelte"
		})
	]
} as UserConfig;
