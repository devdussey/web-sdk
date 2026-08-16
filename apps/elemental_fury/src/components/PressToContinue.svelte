<script lang="ts">
	import { onMount } from 'svelte';
	import { MainContainer, OnPressFullScreen } from 'components-layout';
	import { OnHotkey } from 'components-shared';
	import { Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';

	type Props = {
		onpress: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	let pulseAlpha = $state(1);
	let animFrame: number;

	onMount(() => {
		let time = 0;
		const update = () => {
			time += 0.04;
			pulseAlpha = 0.75 + Math.sin(time * 2.5) * 0.25;
			animFrame = requestAnimationFrame(update);
		};

		animFrame = requestAnimationFrame(update);
		return () => cancelAnimationFrame(animFrame);
	});
</script>

<MainContainer alignVertical="bottom">
	<Sprite
		key="pressToContinueText"
		width={Math.min(context.stateLayoutDerived.mainLayout().width * 0.85, 540)}
		height={Math.min(context.stateLayoutDerived.mainLayout().width * 0.85, 540) * (120 / 800)}
		anchor={{ x: 0.5, y: 1 }}
		x={context.stateLayoutDerived.mainLayout().width * 0.5}
		y={context.stateLayoutDerived.mainLayout().height - 30}
		alpha={pulseAlpha}
	/>
</MainContainer>
<OnHotkey hotkey="Space" onpress={() => props.onpress()} />
<OnPressFullScreen onpress={() => props.onpress()} />
