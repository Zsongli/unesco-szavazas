<script lang="ts">
    export let classes: string

	const photos = [
        "golyaB.jpg",
        "golyaE.jpg",
        "golyaE2.jpg",
        "golyaF.jpg",
        "golyaF2.jpg",
        "golyaMIB.jpg",
        "golyaShrek.jpg",
        "golyaTuz.jpg",
        "beni.jpg",
	];
</script>

<a
    href="https://flic.kr/s/aHBqjB5q3x"
    rel="noreferrer"
    target="_blank"
    class={classes + " justify-self-end rounded-2xl overflow-hidden shadow-2xl"}
>
    <img
        class="w-full h-full object-cover object-center"
        src="/homepage/{photos[Math.floor(Math.random() * photos.length)]}"
        alt="Gólyabál 2023"
    />
</a>
