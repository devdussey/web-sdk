<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const boardLayout = $derived(context.stateGameDerived.boardLayout());
</script>

<Sprite
	key="base6x5Frame"
	anchor={0.5}
	x={boardLayout.x}
	y={boardLayout.y}
	width={boardLayout.width * 1.2}
	height={boardLayout.height * 1.2}
	zIndex={-1}
/>
