<script lang="ts">
	import { onMount } from 'svelte';
	import { Container, Graphics, Text } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';

	import { getContext } from '../game/context';
	import { getSymbolX, getSymbolY } from '../game/utils';
	import { SYMBOL_SIZE, BOARD_DIMENSIONS } from '../game/constants';
	import BoardContainer from './BoardContainer.svelte';

	const context = getContext();
	const showSupercell = $derived(
		context.stateGame.gameType === 'freeSpins' && context.stateGame.currentElement === 'supercell',
	);

	let sparkTime = $state(0);
	let animFrame: number;

	// Extract active lightning tiles from the board
	const lightningTiles = $derived(() => {
		const tiles: { reel: number; row: number; multiplier: number }[] = [];
		const board = context.stateGame.board;
		for (let r = 0; r < board.length; r++) {
			const symbols = board[r].reelState.symbols;
			for (let row = 0; row < symbols.length; row++) {
				const sym = symbols[row]?.rawSymbol;
				if (sym?.name === 'T') {
					tiles.push({
						reel: r,
						row: row,
						multiplier: sym.multiplier ?? 2,
					});
				}
			}
		}
		return tiles;
	});

	onMount(() => {
		let time = 0;
		const loop = () => {
			time += 0.05;
			sparkTime = time;
			animFrame = requestAnimationFrame(loop);
		};
		animFrame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(animFrame);
	});
</script>

<FadeContainer show={showSupercell} duration={400} zIndex={16}>
	<BoardContainer>
		{@const tiles = lightningTiles()}

		<!-- 1. Branching Arcs Between Adjacent Lightning Tiles -->
		<Graphics
			draw={(g) => {
				g.clear();
				if (tiles.length < 2) return;

				for (let i = 0; i < tiles.length; i++) {
					for (let j = i + 1; j < tiles.length; j++) {
						const t1 = tiles[i];
						const t2 = tiles[j];
						const distReel = Math.abs(t1.reel - t2.reel);
						const distRow = Math.abs(t1.row - t2.row);

						// 4-Directional Adjacency check (distance == 1)
						if ((distReel === 1 && distRow === 0) || (distReel === 0 && distRow === 1)) {
							const x1 = getSymbolX(t1.reel);
							const y1 = getSymbolY(t1.row);
							const x2 = getSymbolX(t2.reel);
							const y2 = getSymbolY(t2.row);

							// Jagged lightning arc path
							const midX = (x1 + x2) / 2 + Math.sin(sparkTime * 8 + i) * 12;
							const midY = (y1 + y2) / 2 + Math.cos(sparkTime * 8 + j) * 12;

							// Outer violet glow
							g.moveTo(x1, y1);
							g.lineTo(midX, midY);
							g.lineTo(x2, y2);
							g.stroke({ width: 8, color: 0xc084fc, alpha: 0.45, cap: 'round' });

							// Inner white-hot plasma arc
							g.moveTo(x1, y1);
							g.lineTo(midX, midY);
							g.lineTo(x2, y2);
							g.stroke({ width: 2.5, color: 0xffffff, alpha: 0.95, cap: 'round' });
						}
					}
				}
			}}
		/>

		<!-- 2. Electric Multiplier Badges Over Each Lightning Tile -->
		{#each tiles as tile}
			{@const posX = getSymbolX(tile.reel)}
			{@const posY = getSymbolY(tile.row)}
			<Container x={posX} y={posY}>
				<!-- Pulsing Aura Halo -->
				<Graphics
					draw={(g) => {
						g.clear();
						const half = SYMBOL_SIZE * 0.46;
						g.roundRect(-half, -half, half * 2, half * 2, 8);
						g.fill({ color: 0x7e22ce, alpha: 0.22 });
						g.stroke({
							width: 2,
							color: 0xc084fc,
							alpha: 0.85 + Math.sin(sparkTime * 6) * 0.15,
						});
					}}
				/>

				<!-- Multiplier Value Badge -->
				<Container y={SYMBOL_SIZE * 0.24}>
					<Graphics
						draw={(g) => {
							g.clear();
							g.roundRect(-32, -12, 64, 24, 12);
							g.fill({ color: 0x3b0764, alpha: 0.92 });
							g.stroke({ width: 1.5, color: 0xc084fc, alpha: 0.95 });
						}}
					/>
					<Text
						anchor={0.5}
						text={`${tile.multiplier}×`}
						style={{
							fontFamily: 'proxima-nova',
							fontSize: 14,
							fontWeight: '900',
							fill: 0xf5d0fe,
							dropShadow: {
								alpha: 0.9,
								angle: Math.PI / 2,
								blur: 4,
								color: 0x9333ea,
								distance: 0,
							},
						}}
					/>
				</Container>
			</Container>
		{/each}
	</BoardContainer>
</FadeContainer>
