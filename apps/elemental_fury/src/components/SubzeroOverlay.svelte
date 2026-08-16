<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { elasticOut } from 'svelte/easing';
	import { Container, Graphics, Text } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';

	import { getContext } from '../game/context';
	import { getSymbolX, getSymbolY } from '../game/utils';
	import { SYMBOL_SIZE } from '../game/constants';
	import BoardContainer from './BoardContainer.svelte';

	const context = getContext();
	const showSubzero = $derived(
		context.stateGame.gameType === 'freeSpins' && context.stateGame.currentElement === 'subzero',
	);
	const lives = $derived(context.stateGame.subzeroLives);
	const frozenIce = $derived(context.stateGame.frozenIce);

	let lifeFlash = $state(1);
	let animFrame: number;

	onMount(() => {
		let time = 0;
		const loop = () => {
			time += 0.04;
			lifeFlash = 0.85 + Math.sin(time * 3) * 0.15;
			animFrame = requestAnimationFrame(loop);
		};
		animFrame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(animFrame);
	});
</script>

<FadeContainer show={showSubzero} duration={400} zIndex={15}>
	<BoardContainer>
		<!-- 1. Top Subzero 3-Lives HUD Counter -->
		<Container
			x={context.stateGameDerived.boardLayout().width * 0.5}
			y={-40}
		>
			<!-- HUD Glassmorphic Pill -->
			<Graphics
				draw={(g) => {
					g.clear();
					g.roundRect(-150, -22, 300, 44, 22);
					g.fill({ color: 0x030712, alpha: 0.85 });
					g.stroke({ width: 2, color: 0x38bdf8, alpha: 0.8 * lifeFlash });
				}}
			/>

			<Text
				anchor={{ x: 1, y: 0.5 }}
				x={-15}
				text="LIVES"
				style={{
					fontFamily: 'proxima-nova',
					fontSize: 16,
					fontWeight: '900',
					letterSpacing: 2,
					fill: 0x93c5fd,
				}}
			/>

			<!-- 3 Frost Life Crystals -->
			<Container x={30} y={0}>
				{#each [0, 1, 2] as idx}
					{@const active = idx < lives}
					<Container x={idx * 32}>
						<Graphics
							draw={(g) => {
								g.clear();
								// Diamond Crystal
								g.poly([
									{ x: 0, y: -12 },
									{ x: 9, y: 0 },
									{ x: 0, y: 12 },
									{ x: -9, y: 0 },
								]);
								if (active) {
									g.fill({ color: 0xe0f2fe, alpha: 0.95 });
									g.stroke({ width: 2, color: 0x38bdf8, alpha: lifeFlash });
								} else {
									g.fill({ color: 0x1e293b, alpha: 0.5 });
									g.stroke({ width: 1, color: 0x475569, alpha: 0.4 });
								}
							}}
						/>
					</Container>
				{/each}
			</Container>
		</Container>

		<!-- 2. Frozen Ice Shard Tile Overlays & Prize Value Badges -->
		{#each frozenIce as shard}
			{@const posX = getSymbolX(shard.reel)}
			{@const posY = getSymbolY(shard.row)}
			<Container x={posX} y={posY}>
				<!-- Glacial Ice Casing Frame -->
				<Graphics
					draw={(g) => {
						g.clear();
						const half = SYMBOL_SIZE * 0.46;
						// Frosty glowing cell border
						g.roundRect(-half, -half, half * 2, half * 2, 8);
						g.fill({ color: 0x0284c7, alpha: 0.28 });
						g.stroke({ width: 2.5, color: 0x38bdf8, alpha: 0.9 });

						// Corner Ice Shards
						const s = 10;
						g.poly([
							{ x: -half, y: -half },
							{ x: -half + s, y: -half },
							{ x: -half, y: -half + s },
						]);
						g.fill({ color: 0xe0f2fe, alpha: 0.9 });

						g.poly([
							{ x: half, y: -half },
							{ x: half - s, y: -half },
							{ x: half, y: -half + s },
						]);
						g.fill({ color: 0xe0f2fe, alpha: 0.9 });

						g.poly([
							{ x: -half, y: half },
							{ x: -half + s, y: half },
							{ x: -half, y: half - s },
						]);
						g.fill({ color: 0xe0f2fe, alpha: 0.9 });

						g.poly([
							{ x: half, y: half },
							{ x: half - s, y: half },
							{ x: half, y: half - s },
						]);
						g.fill({ color: 0xe0f2fe, alpha: 0.9 });
					}}
				/>

				<!-- Prize Amount Badge -->
				<Container y={SYMBOL_SIZE * 0.24}>
					<Graphics
						draw={(g) => {
							g.clear();
							g.roundRect(-36, -12, 72, 24, 12);
							g.fill({ color: 0x082f49, alpha: 0.9 });
							g.stroke({ width: 1.5, color: 0x38bdf8, alpha: 0.9 });
						}}
					/>
					<Text
						anchor={0.5}
						text={`${shard.value}×`}
						style={{
							fontFamily: 'proxima-nova',
							fontSize: 14,
							fontWeight: '900',
							fill: 0xf0f9ff,
							dropShadow: {
								alpha: 0.9,
								angle: Math.PI / 2,
								blur: 4,
								color: 0x0284c7,
								distance: 0,
							},
						}}
					/>
				</Container>
			</Container>
		{/each}
	</BoardContainer>
</FadeContainer>
