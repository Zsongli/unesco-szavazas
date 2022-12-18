<script>
	import { Popover, Button } from "flowbite-svelte";
</script>

<Button id="b1">Default popover</Button>
<Popover class="w-64 text-sm font-light " title="Popover title" placement="bottom" triggeredBy="#b1">
	And here's some amazing content. It's very engaging. Right?
</Popover>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
