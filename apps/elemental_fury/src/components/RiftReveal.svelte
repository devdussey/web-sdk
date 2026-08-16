<script lang="ts" module>
	import type { ElementType } from '../game/types';

	export type EmitterEventRiftReveal =
		| { type: 'riftRevealShow' }
		| { type: 'riftRevealHide' }
		| { type: 'riftRevealUpdate'; element: ElementType; totalFreeSpins: number };
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { elasticOut } from 'svelte/easing';
	import { CanvasSizeRectangle, MainContainer } from 'components-layout';
	import { FadeContainer } from 'components-pixi';
	import { waitForResolve, waitForTimeout } from 'utils-shared/wait';
	import { Container, Graphics, Sprite, Text } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import PressToContinue from './PressToContinue.svelte';

	const context = getContext();
	const mainLayout = $derived(context.stateLayoutDerived.mainLayout());

	const ELEMENT_DATA: Record<
		ElementType,
		{
			title: string;
			subtitle: string;
			harbingerKey: 'H1_svg' | 'H2_svg' | 'H3_svg' | 'H4_svg';
			primaryColor: number;
			secondaryColor: number;
			glowColor: string;
			accentColor: string;
		}
	> = {
		wildfire: {
			title: 'WILDFIRE',
			subtitle: 'EXPANDING WILDFIRE REELS',
			harbingerKey: 'H1_svg',
			primaryColor: 0xdc2626,
			secondaryColor: 0xfbbf24,
			glowColor: '#F59E0B',
			accentColor: '#EF4444',
		},
		maelstrom: {
			title: 'MAELSTROM',
			subtitle: 'CYCLONE COIN COLLECT',
			harbingerKey: 'H2_svg',
			primaryColor: 0x0d9488,
			secondaryColor: 0x5eead4,
			glowColor: '#5EEAD4',
			accentColor: '#14B8A6',
		},
		supercell: {
			title: 'SUPERCELL',
			subtitle: 'ARCING LIGHTNING CHAIN',
			harbingerKey: 'H3_svg',
			primaryColor: 0x7e22ce,
			secondaryColor: 0xc084fc,
			glowColor: '#C084FC',
			accentColor: '#A855F7',
		},
		subzero: {
			title: 'SUBZERO',
			subtitle: 'HOLD & WIN GLACIAL SHARDS',
			harbingerKey: 'H4_svg',
			primaryColor: 0x0284c7,
			secondaryColor: 0xe0f2fe,
			glowColor: '#E0F2FE',
			accentColor: '#38BDF8',
		},
	};

	let show = $state(false);
	let activeElement = $state<ElementType>('wildfire');
	let totalSpins = $state(10);
	let oncomplete = $state(() => {});

	// Animation Tweens
	let portalScale = new Tween(0, { duration: 800, easing: elasticOut });
	let portalRotation = $state(0);
	let glowPulse = $state(1);
	let animFrame: number;

	const currentElementMeta = $derived(ELEMENT_DATA[activeElement]);

	onMount(() => {
		let time = 0;
		const loop = () => {
			time += 0.03;
			portalRotation = time * 0.5;
			glowPulse = 0.85 + Math.sin(time * 3) * 0.15;
			animFrame = requestAnimationFrame(loop);
		};
		animFrame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(animFrame);
	});

	context.eventEmitter.subscribeOnMount({
		riftRevealShow: () => {
			show = true;
			portalScale.set(0, { duration: 0 });
		},
		riftRevealHide: () => {
			show = false;
		},
		riftRevealUpdate: async (emitterEvent) => {
			activeElement = emitterEvent.element || 'wildfire';
			totalSpins = emitterEvent.totalFreeSpins || 10;
			show = true;

			// Trigger dramatic entrance sound
			context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_superfreespin' });

			// Animate portal explosion
			await waitForTimeout(100);
			portalScale.set(1, { duration: 900, easing: elasticOut });

			// Wait for user interaction
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});
</script>

<FadeContainer {show} duration={400} zIndex={100}>
	<!-- Dark Cosmic Rift Backdrop -->
	<CanvasSizeRectangle backgroundColor={0x030712} backgroundAlpha={0.88} />

	<MainContainer>
		<Container
			x={mainLayout.width * 0.5}
			y={mainLayout.height * 0.44}
			scale={portalScale.current}
		>
			<!-- Pulsing Outer Elemental Aura Ring -->
			<Graphics
				draw={(g) => {
					g.clear();
					// Outer ambient aura
					g.circle(0, 0, 220);
					g.fill({ color: currentElementMeta.primaryColor, alpha: 0.18 * glowPulse });

					// Inner focus glow
					g.circle(0, 0, 160);
					g.fill({ color: currentElementMeta.secondaryColor, alpha: 0.25 * glowPulse });

					// Concentric energy ring
					g.circle(0, 0, 140);
					g.stroke({
						width: 4,
						color: currentElementMeta.secondaryColor,
						alpha: 0.7 * glowPulse,
					});

					// Portal border chassis
					g.circle(0, 0, 115);
					g.stroke({
						width: 6,
						color: currentElementMeta.primaryColor,
						alpha: 0.9,
					});
					g.fill({ color: 0x050814, alpha: 0.92 });
				}}
			/>

			<!-- Radiant Elemental Halo -->
			<Graphics
				draw={(g) => {
					g.clear();
					g.circle(0, 0, 128);
					g.stroke({
						width: 3 * glowPulse,
						color: currentElementMeta.secondaryColor,
						alpha: 0.8 * glowPulse,
					});
				}}
			/>

			<!-- Harbinger Character Avatar Emblem -->
			<Sprite
				key={currentElementMeta.harbingerKey}
				anchor={0.5}
				width={180}
				height={180}
			/>

			<!-- Banner Plaque: "RIFT REVEAL: [ELEMENT]" -->
			<Container y={150}>
				<!-- Title Pill Background -->
				<Graphics
					draw={(g) => {
						g.clear();
						g.roundRect(-220, -25, 440, 50, 25);
						g.fill({ color: 0x090d1f, alpha: 0.95 });
						g.stroke({
							width: 3,
							color: currentElementMeta.secondaryColor,
							alpha: 0.85,
						});
					}}
				/>

				<Text
					anchor={0.5}
					text={`✦ ${currentElementMeta.title} ✦`}
					style={{
						fontFamily: 'proxima-nova',
						fontSize: 28,
						fontWeight: '900',
						letterSpacing: 4,
						fill: currentElementMeta.glowColor,
						dropShadow: {
							alpha: 0.8,
							angle: Math.PI / 2,
							blur: 8,
							color: currentElementMeta.primaryColor,
							distance: 0,
						},
					}}
				/>
			</Container>

			<!-- Feature Subtitle / Mechanic Description -->
			<Container y={200}>
				<Text
					anchor={0.5}
					text={currentElementMeta.subtitle}
					style={{
						fontFamily: 'proxima-nova',
						fontSize: 16,
						fontWeight: '700',
						letterSpacing: 2,
						fill: 0xffffff,
					}}
				/>
			</Container>

			<!-- Free Spins Award Plaque -->
			<Container y={260}>
				<Graphics
					draw={(g) => {
						g.clear();
						g.roundRect(-180, -32, 360, 64, 18);
						g.fill({ color: currentElementMeta.primaryColor, alpha: 0.35 });
						g.stroke({
							width: 2,
							color: currentElementMeta.secondaryColor,
							alpha: 0.9,
						});
					}}
				/>

				<Text
					anchor={0.5}
					text={`${totalSpins} FREE SPINS`}
					style={{
						fontFamily: 'proxima-nova',
						fontSize: 34,
						fontWeight: '900',
						letterSpacing: 3,
						fill: 0xfffbeb,
						dropShadow: {
							alpha: 0.9,
							angle: Math.PI / 2,
							blur: 10,
							color: 0xf59e0b,
							distance: 0,
						},
					}}
				/>
			</Container>
		</Container>
	</MainContainer>

	<!-- Press to Continue User Prompt -->
	<PressToContinue onpress={() => oncomplete()} />
</FadeContainer>
