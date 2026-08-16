<script lang="ts">
	import { Text, Container, Sprite, Graphics } from 'pixi-svelte';
	import { FadeContainer, LoadingProgress } from 'components-pixi';
	import { MainContainer } from 'components-layout';

	import { getContext } from '../game/context';
	import TransitionAnimation from './TransitionAnimation.svelte';
	import PressToContinue from './PressToContinue.svelte';
	import ElementalLoaderCore from './ElementalLoaderCore.svelte';

	type Props = { onloaded: () => void };

	const props: Props = $props();
	const context = getContext();
	let loadingType = $state<'start' | 'transition'>('start');
</script>

<FadeContainer show={loadingType === 'start'}>
	<MainContainer>
		<Container
			x={context.stateLayoutDerived.mainLayout().width * 0.5}
			y={context.stateLayoutDerived.mainLayout().height * 0.5}
		>
			<!-- Animated Thick Elemental Plasma Ring (Counter-Clockwise Swirl) -->
			<ElementalLoaderCore y={-10} radius={270} />

			<!-- Title Container Centered Inside the Elemental Plasma Ring -->
			<Container y={-15}>
				<!-- Decorative Glowing Filigree Accent Lines -->
				<Graphics
					draw={(g) => {
						g.clear();
						// Left accent line with fading diamond
						g.moveTo(-310, 0);
						g.lineTo(-200, 0);
						g.stroke({ width: 2, color: 0x38bdf8, alpha: 0.6 });
						g.poly([
							{ x: -195, y: -4 },
							{ x: -187, y: 0 },
							{ x: -195, y: 4 },
							{ x: -203, y: 0 },
						]);
						g.fill({ color: 0x38bdf8, alpha: 0.9 });

						// Right accent line with fading diamond
						g.moveTo(200, 0);
						g.lineTo(310, 0);
						g.stroke({ width: 2, color: 0xf59e0b, alpha: 0.6 });
						g.poly([
							{ x: 195, y: -4 },
							{ x: 203, y: 0 },
							{ x: 195, y: 4 },
							{ x: 187, y: 0 },
						]);
						g.fill({ color: 0xf59e0b, alpha: 0.9 });
					}}
				/>

				<!-- Majestic Game Title -->
				<Text
					text="ELEMENTAL FURY"
					anchor={0.5}
					style={{
						fontFamily: 'proxima-nova',
						fontSize: 52,
						fontWeight: '900',
						letterSpacing: 6,
						fill: 0xfffbeb,
						dropShadow: {
							alpha: 0.95,
							angle: Math.PI / 2,
							blur: 16,
							color: 0xdc2626,
							distance: 0,
						},
					}}
				/>
			</Container>

			<!-- Premium Glassmorphic Publisher Badge -->
			<Container y={45}>
				<Graphics
					draw={(g) => {
						g.clear();
						// Translucent pill backdrop
						g.roundRect(-135, -15, 270, 30, 15);
						g.fill({ color: 0x070b16, alpha: 0.88 });
						g.stroke({
							width: 1.5,
							color: 0x38bdf8,
							alpha: 0.5,
						});
					}}
				/>
				<Text
					text="✦ BY DEVDUSSEY ✦"
					anchor={0.5}
					style={{
						fontFamily: 'proxima-nova',
						fontSize: 13,
						fontWeight: '800',
						letterSpacing: 4,
						fill: 0x93c5fd,
					}}
				/>
			</Container>

			{#if !context.stateApp.loaded}
				<LoadingProgress y={250} width={1967 * 0.2} height={346 * 0.2}>
					{#snippet background(sizes)}
						<Sprite key="progressBarBackground.png" {...sizes} />
					{/snippet}
					{#snippet progress(sizes)}
						<Sprite key="progressBar.png" {...sizes} />
					{/snippet}
					{#snippet frame(sizes)}
						<Sprite key="progressBarFrame.png" {...sizes} />
					{/snippet}
				</LoadingProgress>
			{/if}
		</Container>
	</MainContainer>
</FadeContainer>

<FadeContainer show={loadingType === 'start' && context.stateApp.loaded}>
	<PressToContinue onpress={() => (loadingType = 'transition')} />
</FadeContainer>

<FadeContainer show={loadingType === 'transition'}>
	<TransitionAnimation oncomplete={props.onloaded} />
</FadeContainer>
