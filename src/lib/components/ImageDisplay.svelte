<script lang="ts">
    export let classes: string

	const photos = [
		"spanyol5.jpg",
		"ciprus2.jpg",
		"egyiptom4.jpg",
		"konferansz1.jpg",
		"kina2.jpg",
		"egyiptom0.jpg"
	];
</script>

<a
    href="https://flic.kr/s/aHBqjA5MLT"
    rel="noreferrer"
    target="_blank"
    class={classes + " justify-self-end rounded-2xl overflow-hidden shadow-2xl"}
>
    <img
        class="w-full h-full object-cover object-center"
        src="/homepage/{photos[Math.floor(Math.random() * photos.length)]}"
        alt="UNESCO Műsor 2022"
    />
</a>
