<script lang="ts">
	import { onMount } from 'svelte';
	import { Container, Graphics, Text } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { stateBet } from 'state-shared';

	import { getContext } from '../game/context';
	import { getSymbolX, getSymbolY } from '../game/utils';
	import { SYMBOL_SIZE } from '../game/constants';
	import BoardContainer from './BoardContainer.svelte';

	const context = getContext();
	const showMaelstrom = $derived(
		context.stateGame.gameType === 'freeSpins' && context.stateGame.currentElement === 'maelstrom',
	);
	const coinTotal = $derived(context.stateGame.coinTotal);

	let windTime = $state(0);
	let animFrame: number;

	// Extract active coin symbols from the board
	const coinTiles = $derived(() => {
		const coins: { reel: number; row: number; value: number }[] = [];
		const board = context.stateGame.board;
		for (let r = 0; r < board.length; r++) {
			const symbols = board[r].reelState.symbols;
			for (let row = 0; row < symbols.length; row++) {
				const sym = symbols[row]?.rawSymbol as any;
				if (sym?.name === 'C') {
					coins.push({
						reel: r,
						row: row,
						value: sym?.prize ?? sym?.multiplier ?? 1,
					});
				}
			}
		}
		return coins;
	});

	onMount(() => {
		let time = 0;
		const loop = () => {
			time += 0.04;
			windTime = time;
			animFrame = requestAnimationFrame(loop);
		};
		animFrame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(animFrame);
	});
</script>

<FadeContainer show={showMaelstrom} duration={400} zIndex={17}>
	<BoardContainer>
		<!-- 1. Top Maelstrom Coin Bank HUD -->
		<Container
			x={context.stateGameDerived.boardLayout().width * 0.5}
			y={-40}
		>
			<Graphics
				draw={(g) => {
					g.clear();
					// Glassmorphic Teal Pill
					g.roundRect(-160, -22, 320, 44, 22);
					g.fill({ color: 0x03131c, alpha: 0.88 });
					g.stroke({
						width: 2,
						color: 0x2dd4bf,
						alpha: 0.85 + Math.sin(windTime * 4) * 0.15,
					});

					// Mini Cyclone Icon
					const cx = -125;
					const cy = 0;
					g.circle(cx, cy, 12);
					g.stroke({ width: 2, color: 0x5eead4, alpha: 0.9 });
					g.circle(cx, cy, 5);
					g.fill({ color: 0xf0fdfa, alpha: 0.95 });
				}}
			/>

			<Text
				anchor={{ x: 0, y: 0.5 }}
				x={-100}
				text="COIN BANK:"
				style={{
					fontFamily: 'proxima-nova',
					fontSize: 14,
					fontWeight: '900',
					letterSpacing: 2,
					fill: 0x5eead4,
				}}
			/>

			<Text
				anchor={{ x: 1, y: 0.5 }}
				x={140}
				text={`$${(coinTotal * stateBet.betAmount).toFixed(2)}`}
				style={{
					fontFamily: 'proxima-nova',
					fontSize: 16,
					fontWeight: '900',
					fill: 0xf0fdfa,
					dropShadow: {
						alpha: 0.9,
						angle: Math.PI / 2,
						blur: 6,
						color: 0x0d9488,
						distance: 0,
					},
				}}
			/>
		</Container>

		<!-- 2. Individual Coin Prize Tags Over 'C' Symbol Cells -->
		{#each coinTiles() as coin}
			{@const posX = getSymbolX(coin.reel)}
			{@const posY = getSymbolY(coin.row)}
			<Container x={posX} y={posY}>
				<!-- Swirling Wind Halo -->
				<Graphics
					draw={(g) => {
						g.clear();
						const half = SYMBOL_SIZE * 0.46;
						g.roundRect(-half, -half, half * 2, half * 2, 8);
						g.fill({ color: 0x0d9488, alpha: 0.2 });
						g.stroke({ width: 2, color: 0x2dd4bf, alpha: 0.85 });
					}}
				/>

				<!-- Prize Amount Tag -->
				<Container y={SYMBOL_SIZE * 0.24}>
					<Graphics
						draw={(g) => {
							g.clear();
							g.roundRect(-34, -12, 68, 24, 12);
							g.fill({ color: 0x042f2e, alpha: 0.92 });
							g.stroke({ width: 1.5, color: 0x2dd4bf, alpha: 0.95 });
						}}
					/>
					<Text
						anchor={0.5}
						text={`$${(coin.value * stateBet.betAmount).toFixed(2)}`}
						style={{
							fontFamily: 'proxima-nova',
							fontSize: 12,
							fontWeight: '900',
							fill: 0xf0fdfa,
							dropShadow: {
								alpha: 0.9,
								angle: Math.PI / 2,
								blur: 4,
								color: 0x0d9488,
								distance: 0,
							},
						}}
					/>
				</Container>
			</Container>
		{/each}
	</BoardContainer>
</FadeContainer>
