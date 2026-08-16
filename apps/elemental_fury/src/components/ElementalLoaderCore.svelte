<script lang="ts">
	import { onMount } from 'svelte';
	import { Container, Graphics } from 'pixi-svelte';

	type Props = {
		y?: number;
		scale?: number;
		radius?: number;
	};

	const props: Props = $props();

	let rotation = $state(0);
	let pulse = $state(1);
	let timeState = $state(0);
	let animFrame: number;

	const baseRadius = $derived(props.radius ?? 260);

	// 4 Elemental Signature Color Palettes
	const ELEMENT_COLORS = [
		{ primary: 0x38bdf8, secondary: 0xe0f2fe, name: 'subzero' }, // Top-Left: Cyan Frost
		{ primary: 0xf59e0b, secondary: 0xef4444, name: 'wildfire' }, // Top-Right: Magma Amber/Flame
		{ primary: 0xc084fc, secondary: 0x7e22ce, name: 'supercell' }, // Bottom-Left: Storm Violet
		{ primary: 0x2dd4bf, secondary: 0x0d9488, name: 'maelstrom' }, // Bottom-Right: Tempest Teal
	];

	// 36 Dynamic Orbiting Plasma Particles traveling counter-clockwise
	const PARTICLES = Array.from({ length: 36 }, (_, i) => ({
		angleOffset: (i / 36) * Math.PI * 2,
		radialOffset: ((i * 7) % 24) - 12,
		speed: 0.8 + (i % 4) * 0.25,
		size: 2 + (i % 3) * 1.5,
		elementIndex: i % 4,
	}));

	onMount(() => {
		let time = 0;
		const update = () => {
			time += 0.02;
			timeState = time;
			// Counter-Clockwise continuous spin
			rotation = -time * 0.75;
			pulse = 1 + Math.sin(time * 2.5) * 0.04;
			animFrame = requestAnimationFrame(update);
		};

		animFrame = requestAnimationFrame(update);
		return () => cancelAnimationFrame(animFrame);
	});
</script>

<Container y={props.y ?? 0} scale={(props.scale ?? 1) * pulse}>
	<!-- Counter-Clockwise Swirling Plasma Ring Container -->
	<Container rotation={rotation}>
		<Graphics
			draw={(g) => {
				g.clear();
				const r = baseRadius;
				const segments = 64;
				const arcStep = (Math.PI * 2) / segments;

				// 1. LAYER 1: Deep Outer Atmospheric Soft Glow (Thick ethereal aura ~45px)
				for (let i = 0; i < segments; i++) {
					const angle1 = i * arcStep;
					const angle2 = (i + 1.1) * arcStep;
					const elemIdx = Math.floor((i / segments) * 4) % 4;
					const col = ELEMENT_COLORS[elemIdx].primary;

					g.arc(0, 0, r, angle1, angle2);
					g.stroke({
						width: 44,
						color: col,
						alpha: 0.16,
						cap: 'round',
					});
				}

				// 2. LAYER 2: Mid-Layer Smoky Plasma Turbulence
				for (let i = 0; i < segments; i++) {
					const angle1 = i * arcStep;
					const angle2 = (i + 1.1) * arcStep;
					const elemIdx = Math.floor((i / segments) * 4) % 4;
					const col = ELEMENT_COLORS[elemIdx].primary;

					// Subtle harmonic undulation
					const wave = Math.sin(angle1 * 6 + timeState * 3) * 4;

					g.arc(0, 0, r + wave, angle1, angle2);
					g.stroke({
						width: 22,
						color: col,
						alpha: 0.38,
						cap: 'round',
					});
				}

				// 3. LAYER 3: Core Luminous Energy Stream
				for (let i = 0; i < segments; i++) {
					const angle1 = i * arcStep;
					const angle2 = (i + 1.1) * arcStep;
					const elemIdx = Math.floor((i / segments) * 4) % 4;
					const col = ELEMENT_COLORS[elemIdx].secondary;

					// Electric jitter wave
					const jitter = Math.cos(angle1 * 10 - timeState * 4) * 2;

					g.arc(0, 0, r + jitter, angle1, angle2);
					g.stroke({
						width: 9,
						color: col,
						alpha: 0.85,
						cap: 'round',
					});
				}

				// 4. LAYER 4: Brilliant White-Hot Central Filament
				for (let i = 0; i < segments; i++) {
					const angle1 = i * arcStep;
					const angle2 = (i + 1.1) * arcStep;
					g.arc(0, 0, r, angle1, angle2);
					g.stroke({
						width: 3.5,
						color: 0xffffff,
						alpha: 0.92,
						cap: 'round',
					});
				}

				// 5. Orbiting Counter-Clockwise Plasma Sparks & Tendrils
				for (const p of PARTICLES) {
					// Counter-clockwise position
					const pAngle = p.angleOffset - timeState * p.speed * 0.8;
					const pRad = r + p.radialOffset + Math.sin(timeState * 3 + p.angleOffset) * 6;
					const px = Math.cos(pAngle) * pRad;
					const py = Math.sin(pAngle) * pRad;
					const col = ELEMENT_COLORS[p.elementIndex].primary;

					// Spark core
					g.circle(px, py, p.size);
					g.fill({ color: 0xffffff, alpha: 0.95 });

					// Spark outer plasma halo
					g.circle(px, py, p.size * 2.6);
					g.fill({ color: col, alpha: 0.45 });
				}
			}}
		/>
	</Container>
</Container>
