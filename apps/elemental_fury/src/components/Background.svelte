<script lang="ts">
	import { onMount } from 'svelte';
	import { Sprite, Rectangle, Container, Graphics } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';

	import { getContext } from '../game/context';

	const context = getContext();
	const canvasSizes = $derived(context.stateLayoutDerived.canvasSizes());
	const isPortrait = $derived(context.stateLayoutDerived.layoutType() === 'portrait');
	const backgroundProps = $derived(
		isPortrait
			? context.stateLayoutDerived.portraitBackgroundLayout({ scale: 1 })
			: context.stateLayoutDerived.normalBackgroundLayout({ scale: 1 }),
	);
	const showBaseBackground = $derived(context.stateGame.gameType === 'basegame');
	const currentElement = $derived(context.stateGame.currentElement);

	// Vortex Animation State
	let vortexAngle = $state(0);
	let pulsePhase = $state(0);
	let animFrame: number;

	// Particle stream for cosmic vortex
	const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
		baseAngle: (i / 32) * Math.PI * 2,
		distanceRatio: 0.2 + (i % 8) * 0.1,
		speed: 0.6 + (i % 4) * 0.2,
		colorIndex: i % 4, // 0: Cyan, 1: Amber, 2: Violet, 3: Teal
		size: 2 + (i % 3) * 1.5,
	}));

	const ELEMENT_COLORS = [
		0x38bdf8, // Subzero Cyan
		0xf59e0b, // Wildfire Amber
		0xc084fc, // Supercell Violet
		0x5eead4, // Maelstrom Teal
	];

	onMount(() => {
		let time = 0;
		const update = () => {
			time += 0.015;
			vortexAngle = time * 0.4;
			pulsePhase = 0.85 + Math.sin(time * 2) * 0.15;
			animFrame = requestAnimationFrame(update);
		};
		animFrame = requestAnimationFrame(update);
		return () => cancelAnimationFrame(animFrame);
	});
</script>

<!-- Black Backdrop Container -->
<Rectangle {...canvasSizes} backgroundColor={0x000000} zIndex={-3} />

<!-- Base Game Background: Perfectly Centered and Scaled -->
<FadeContainer show={showBaseBackground} duration={1000} zIndex={-2}>
	{#if isPortrait}
		<Sprite
			key="bgBasePortrait"
			anchor={0.5}
			{...backgroundProps}
		/>
	{:else}
		<Sprite
			key="bgBase"
			anchor={0.5}
			{...backgroundProps}
		/>
	{/if}

	<!-- Dynamic 4-Element Swirling Cosmic Vortex -->
	<Container
		x={canvasSizes.width * 0.5}
		y={canvasSizes.height * (isPortrait ? 0.5 : 0.46)}
	>
		<!-- Swirling Spiral Plasma Arms -->
		<Container rotation={vortexAngle}>
			<Graphics
				draw={(g) => {
					g.clear();
					const arms = 4;
					const maxRadius = isPortrait ? 280 : 380;

					for (let a = 0; a < arms; a++) {
						const armStartAngle = (a * Math.PI * 2) / arms;
						const color = ELEMENT_COLORS[a];

						// Draw curved logarithmic spiral arm
						const points: { x: number; y: number }[] = [];
						const steps = 24;
						for (let s = 0; s <= steps; s++) {
							const t = s / steps;
							const r = 50 + t * (maxRadius - 50);
							const theta = armStartAngle + t * 1.8;
							points.push({
								x: Math.cos(theta) * r,
								y: Math.sin(theta) * r,
							});
						}

						// Draw blurred wide glow
						g.moveTo(points[0].x, points[0].y);
						for (let i = 1; i < points.length; i++) {
							g.lineTo(points[i].x, points[i].y);
						}
						g.stroke({
							width: 14 * pulsePhase,
							color,
							alpha: 0.18 * pulsePhase,
							cap: 'round',
							join: 'round',
						});

						// Draw concentrated inner energy strand
						g.moveTo(points[0].x, points[0].y);
						for (let i = 1; i < points.length; i++) {
							g.lineTo(points[i].x, points[i].y);
						}
						g.stroke({
							width: 4 * pulsePhase,
							color,
							alpha: 0.45 * pulsePhase,
							cap: 'round',
							join: 'round',
						});
					}

					// Central Void Horizon (Dark center for crystal clear symbol contrast)
					g.circle(0, 0, 70);
					g.fill({ color: 0x02040a, alpha: 0.85 });
					g.circle(0, 0, 95);
					g.stroke({ width: 2, color: 0x475569, alpha: 0.3 });
				}}
			/>

			<!-- Orbiting Elemental Spark Particles -->
			<Graphics
				draw={(g) => {
					g.clear();
					const maxRadius = isPortrait ? 260 : 360;

					for (const p of PARTICLES) {
						const currentDist =
							50 + ((p.distanceRatio + (vortexAngle * p.speed * 0.15) % 1) % 1) * (maxRadius - 50);
						const theta = p.baseAngle + (currentDist / maxRadius) * 1.8;
						const px = Math.cos(theta) * currentDist;
						const py = Math.sin(theta) * currentDist;
						const alpha = Math.sin((currentDist / maxRadius) * Math.PI) * 0.75;
						const color = ELEMENT_COLORS[p.colorIndex];

						g.circle(px, py, p.size);
						g.fill({ color, alpha });
					}
				}}
			/>
		</Container>
	</Container>
</FadeContainer>

<!-- Freegame Elemental Arenas -->
<FadeContainer
	show={!showBaseBackground && currentElement === 'wildfire'}
	duration={1000}
	zIndex={-1}
>
	<Sprite
		key="bgWildfire"
		anchor={0.5}
		x={canvasSizes.width * 0.5}
		y={canvasSizes.height * 0.5}
		width={canvasSizes.width}
		height={canvasSizes.height}
	/>
</FadeContainer>

<FadeContainer
	show={!showBaseBackground && currentElement === 'maelstrom'}
	duration={1000}
	zIndex={-1}
>
	<Sprite
		key="bgMaelstrom"
		anchor={0.5}
		x={canvasSizes.width * 0.5}
		y={canvasSizes.height * 0.5}
		width={canvasSizes.width}
		height={canvasSizes.height}
	/>
</FadeContainer>

<FadeContainer
	show={!showBaseBackground && currentElement === 'supercell'}
	duration={1000}
	zIndex={-1}
>
	<Sprite
		key="bgSupercell"
		anchor={0.5}
		x={canvasSizes.width * 0.5}
		y={canvasSizes.height * 0.5}
		width={canvasSizes.width}
		height={canvasSizes.height}
	/>
</FadeContainer>

<FadeContainer
	show={!showBaseBackground && currentElement === 'subzero'}
	duration={1000}
	zIndex={-1}
>
	<Sprite
		key="bgSubzero"
		anchor={0.5}
		x={canvasSizes.width * 0.5}
		y={canvasSizes.height * 0.5}
		width={canvasSizes.width}
		height={canvasSizes.height}
	/>
</FadeContainer>
