<script lang="ts">
	import { onMount } from 'svelte';
	import { Container, Graphics } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';

	import { getContext } from '../game/context';
	import { getSymbolX, getSymbolY } from '../game/utils';
	import { SYMBOL_SIZE } from '../game/constants';
	import BoardContainer from './BoardContainer.svelte';

	const context = getContext();
	const showWildfire = $derived(
		context.stateGame.gameType === 'freeSpins' && context.stateGame.currentElement === 'wildfire',
	);

	let flameTime = $state(0);
	let animFrame: number;

	// Extract active Wild symbols from the board
	const wildTiles = $derived(() => {
		const wilds: { reel: number; row: number }[] = [];
		const board = context.stateGame.board;
		for (let r = 0; r < board.length; r++) {
			const symbols = board[r].reelState.symbols;
			for (let row = 0; row < symbols.length; row++) {
				const sym = symbols[row]?.rawSymbol;
				if (sym?.name === 'W') {
					wilds.push({ reel: r, row: row });
				}
			}
		}
		return wilds;
	});

	onMount(() => {
		let time = 0;
		const loop = () => {
			time += 0.04;
			flameTime = time;
			animFrame = requestAnimationFrame(loop);
		};
		animFrame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(animFrame);
	});
</script>

<FadeContainer show={showWildfire} duration={400} zIndex={18}>
	<BoardContainer>
		{#each wildTiles() as wild}
			{@const posX = getSymbolX(wild.reel)}
			{@const posY = getSymbolY(wild.row)}
			<Container x={posX} y={posY}>
				<!-- Blazing Magma Sticky Aura -->
				<Graphics
					draw={(g) => {
						g.clear();
						const half = SYMBOL_SIZE * 0.46;
						const flicker = Math.sin(flameTime * 6) * 2;

						// Outer flame glow
						g.roundRect(-half - flicker, -half - flicker, (half + flicker) * 2, (half + flicker) * 2, 8);
						g.fill({ color: 0xdc2626, alpha: 0.25 });
						g.stroke({ width: 2.5, color: 0xf59e0b, alpha: 0.9 });

						// Corner Flame Tongues
						const flameH = 12 + Math.sin(flameTime * 8) * 4;
						g.poly([
							{ x: -half + 4, y: -half },
							{ x: -half + 12, y: -half - flameH },
							{ x: -half + 20, y: -half },
						]);
						g.fill({ color: 0xfbbf24, alpha: 0.85 });

						g.poly([
							{ x: half - 20, y: -half },
							{ x: half - 12, y: -half - flameH },
							{ x: half - 4, y: -half },
						]);
						g.fill({ color: 0xfbbf24, alpha: 0.85 });
					}}
				/>
			</Container>
		{/each}
	</BoardContainer>
</FadeContainer>
