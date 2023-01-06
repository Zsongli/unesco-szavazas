import type { UserConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import UnpluginIcons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders"

export default {
	plugins: [
		sveltekit(),
		UnpluginIcons({
			compiler: "svelte",
			customCollections: {
				"custom": FileSystemIconLoader("./static/icons")
			}
		})
	]
} as UserConfig;
