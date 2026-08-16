import _ from 'lodash';

import type { RawSymbol, SymbolState } from './types';

export const SYMBOL_SIZE = 100;

export const REEL_PADDING = 0.53;

// initial board (padded top and bottom)
export const INITIAL_BOARD: RawSymbol[][] = [
	[
		{ name: 'M', multiplier: 10 },
		{ name: 'H1' },
		{ name: 'M', multiplier: 2 },
		{ name: 'L1' },
		{ name: 'H1' },
		{ name: 'H4' },
		{ name: 'H1' },
	],
	[
		{ name: 'L3' },
		{ name: 'H2' },
		{ name: 'M', multiplier: 4 },
		{ name: 'L2' },
		{ name: 'S', scatter: true },
		{ name: 'S', scatter: true },
		{ name: 'L2' },
	],
	[
		{ name: 'L2' },
		{ name: 'H3' },
		{ name: 'M', multiplier: 5 },
		{ name: 'L3' },
		{ name: 'W' },
		{ name: 'L2' },
		{ name: 'L2' },
	],
	[
		{ name: 'L3' },
		{ name: 'H4' },
		{ name: 'M', multiplier: 7 },
		{ name: 'L4' },
		{ name: 'W' },
		{ name: 'H1' },
		{ name: 'H1' },
	],
	[
		{ name: 'H3' },
		{ name: 'H4' },
		{ name: 'M', multiplier: 10 },
		{ name: 'H2' },
		{ name: 'S', scatter: true },
		{ name: 'L2' },
		{ name: 'M', multiplier: 7 },
	],
	[
		{ name: 'H2' },
		{ name: 'H2' },
		{ name: 'S', scatter: true },
		{ name: 'L3' },
		{ name: 'H1' },
		{ name: 'S', scatter: true },
		{ name: 'L2' },
	],
];

export const BOARD_DIMENSIONS = { x: INITIAL_BOARD.length, y: INITIAL_BOARD[0].length - 2 };

export const BOARD_SIZES = {
	width: SYMBOL_SIZE * BOARD_DIMENSIONS.x,
	height: SYMBOL_SIZE * BOARD_DIMENSIONS.y,
};

export const BACKGROUND_RATIO = 2039 / 1000;
export const PORTRAIT_BACKGROUND_RATIO = 1242 / 2208;
const PORTRAIT_RATIO = 800 / 1422;
const LANDSCAPE_RATIO = 1600 / 900;
const DESKTOP_RATIO = 1422 / 800;

const DESKTOP_HEIGHT = 800;
const LANDSCAPE_HEIGHT = 900;
const PORTRAIT_HEIGHT = 1422;
export const DESKTOP_MAIN_SIZES = { width: DESKTOP_HEIGHT * DESKTOP_RATIO, height: DESKTOP_HEIGHT };
export const LANDSCAPE_MAIN_SIZES = {
	width: LANDSCAPE_HEIGHT * LANDSCAPE_RATIO,
	height: LANDSCAPE_HEIGHT,
};
export const PORTRAIT_MAIN_SIZES = {
	width: PORTRAIT_HEIGHT * PORTRAIT_RATIO,
	height: PORTRAIT_HEIGHT,
};

export const HIGH_SYMBOLS = ['H1', 'H2', 'H3', 'H4', 'H5'];

export const INITIAL_SYMBOL_STATE: SymbolState = 'static';

const M_SIZE = 0.3;
const HIGH_SYMBOL_SIZE = 0.9;
const LOW_SYMBOL_SIZE = 0.9;
const SPECIAL_SYMBOL_SIZE = 1;

const SPIN_OPTIONS_SHARED = {
	reelFallInDelay: 80,
	reelPaddingMultiplierNormal: 1.25,
	reelPaddingMultiplierAnticipated: 18,
	reelFallOutDelay: 145,
};

export const SPIN_OPTIONS_DEFAULT = {
	...SPIN_OPTIONS_SHARED,
	symbolFallInSpeed: 3.5,
	symbolFallInInterval: 30,
	symbolFallInBounceSpeed: 0.15,
	symbolFallInBounceSizeMulti: 0.5,
	symbolFallOutSpeed: 3.5,
	symbolFallOutInterval: 20,
};

export const SPIN_OPTIONS_FAST = {
	...SPIN_OPTIONS_SHARED,
	symbolFallInSpeed: 7,
	symbolFallInInterval: 0,
	symbolFallInBounceSpeed: 0.3,
	symbolFallInBounceSizeMulti: 0.25,
	symbolFallOutSpeed: 7,
	symbolFallOutInterval: 0,
};

export const MOTION_BLUR_VELOCITY = 31;

export const zIndexes = {
	background: {
		backdrop: -3,
		normal: -2,
		feature: -1,
	},
};

const explosion = {
	type: 'spine',
	assetKey: 'explosion',
	animationName: 'explosion',
	sizeRatios: { width: 1, height: 1 },
};

    const h1Static = { type: 'sprite', assetKey: 'H1_svg', sizeRatios: { width: 0.9, height: 0.9 } };
    const h2Static = { type: 'sprite', assetKey: 'H2_svg', sizeRatios: { width: 0.9, height: 0.9 } };
    const h3Static = { type: 'sprite', assetKey: 'H3_svg', sizeRatios: { width: 0.9, height: 0.9 } };
    const h4Static = { type: 'sprite', assetKey: 'H4_svg', sizeRatios: { width: 0.9, height: 0.9 } };
    const h5Static = h4Static;

    const l1Static = { type: 'sprite', assetKey: 'L1_svg', sizeRatios: { width: 0.85, height: 0.85 } };
    const l2Static = { type: 'sprite', assetKey: 'L2_svg', sizeRatios: { width: 0.85, height: 0.85 } };
    const l3Static = { type: 'sprite', assetKey: 'L3_svg', sizeRatios: { width: 0.85, height: 0.85 } };
    const l4Static = { type: 'sprite', assetKey: 'L4_svg', sizeRatios: { width: 0.85, height: 0.85 } };
    const sStatic = { type: 'sprite', assetKey: 'S_svg', sizeRatios: { width: 1.1, height: 1.1 } };
    const wStatic = { type: 'sprite', assetKey: 'W_svg', sizeRatios: { width: 1.05, height: 1.05 } };
    const cStatic = { type: 'sprite', assetKey: 'C_svg', sizeRatios: { width: 1.0, height: 1.0 } };
    const tStatic = { type: 'sprite', assetKey: 'T_svg', sizeRatios: { width: 1.0, height: 1.0 } };
    const iStatic = { type: 'sprite', assetKey: 'I_svg', sizeRatios: { width: 1.0, height: 1.0 } };

    const m2Static = { type: 'sprite', assetKey: 'M_svg', sizeRatios: { width: 0.95, height: 0.95 } };
    const m4Static = m2Static;
    const m5Static = m2Static;
    const m7Static = m2Static;
    const m10Static = m2Static;

	const wSizeRatios = { width: 1.5 * 0.9, height: SPECIAL_SYMBOL_SIZE * 1.15 };
	const sSizeRatios = { width: 2.5, height: SPECIAL_SYMBOL_SIZE * 2.3 };

	const backgroundLowStatic = {
	type: 'spine',
	assetKey: 'M',
	animationName: 'low_multiplier_static',
	sizeRatios: { width: M_SIZE, height: M_SIZE },
};
const backgroundMidStatic = {
	type: 'spine',
	assetKey: 'M',
	animationName: 'mid_multiplier_static',
	sizeRatios: { width: M_SIZE, height: M_SIZE },
};
const backgroundHighStatic = {
	type: 'spine',
	assetKey: 'M',
	animationName: 'high_multiplier_static',
	sizeRatios: { width: M_SIZE, height: M_SIZE },
};

const backgroundLow = {
	explosion,
	win: {
		type: 'spine',
		assetKey: 'M',
		animationName: 'low_multiplier_pay',
		sizeRatios: { width: M_SIZE, height: M_SIZE },
	},
	postWinStatic: backgroundLowStatic,
	static: backgroundLowStatic,
	spin: {
		type: 'spine',
		assetKey: 'M',
		animationName: 'low_multiplier_static',
		sizeRatios: { width: M_SIZE, height: M_SIZE },
	},
	land: {
		type: 'spine',
		assetKey: 'M',
		animationName: 'low_multiplier_land',
		sizeRatios: { width: M_SIZE, height: M_SIZE },
	},
};

const backgroundMid = {
	explosion,
	win: {
		type: 'spine',
		assetKey: 'M',
		animationName: 'mid_multiplier_pay',
		sizeRatios: { width: M_SIZE, height: M_SIZE },
	},
	postWinStatic: backgroundMidStatic,
	static: backgroundMidStatic,
	spin: {
		type: 'spine',
		assetKey: 'M',
		animationName: 'mid_multiplier_static',
		sizeRatios: { width: M_SIZE, height: M_SIZE },
	},
	land: {
		type: 'spine',
		assetKey: 'M',
		animationName: 'mid_multiplier_land',
		sizeRatios: { width: M_SIZE, height: M_SIZE },
	},
};

const backgroundHigh = {
	explosion,
	win: {
		type: 'spine',
		assetKey: 'M',
		animationName: 'high_multiplier_pay',
		sizeRatios: { width: M_SIZE, height: M_SIZE },
	},
	postWinStatic: backgroundHighStatic,
	static: backgroundHighStatic,
	spin: {
		type: 'spine',
		assetKey: 'M',
		animationName: 'high_multiplier_static',
		sizeRatios: { width: M_SIZE, height: M_SIZE },
	},
	land: {
		type: 'spine',
		assetKey: 'M',
		animationName: 'high_multiplier_land',
		sizeRatios: { width: M_SIZE, height: M_SIZE },
	},
};

export const SYMBOL_INFO_MAP = {
	H1: {
		explosion,
		win: h1Static,
		postWinStatic: h1Static,
		static: h1Static,
		spin: h1Static,
		land: h1Static,
	},
	H2: {
		explosion,
		win: h2Static,
		postWinStatic: h2Static,
		static: h2Static,
		spin: h2Static,
		land: h2Static,
	},
	H3: {
		explosion,
		win: h3Static,
		postWinStatic: h3Static,
		static: h3Static,
		spin: h3Static,
		land: h3Static,
	},
	H4: {
		explosion,
		win: h4Static,
		postWinStatic: h4Static,
		static: h4Static,
		spin: h4Static,
		land: h4Static,
	},
	H5: {
		explosion,
		win: h4Static,
		postWinStatic: h4Static,
		static: h4Static,
		spin: h4Static,
		land: h4Static,
	},
	L1: {
		explosion,
		win: l1Static,
		postWinStatic: l1Static,
		static: l1Static,
		spin: l1Static,
		land: l1Static,
	},
	L2: {
		explosion,
		win: l2Static,
		postWinStatic: l2Static,
		static: l2Static,
		spin: l2Static,
		land: l2Static,
	},
	L3: {
		explosion,
		win: l3Static,
		postWinStatic: l3Static,
		static: l3Static,
		spin: l3Static,
		land: l3Static,
	},
	L4: {
		explosion,
		win: l4Static,
		postWinStatic: l4Static,
		static: l4Static,
		spin: l4Static,
		land: l4Static,
	},
	W: {
		explosion,
		postWinStatic: wStatic,
		static: wStatic,
		spin: wStatic,
		win: wStatic,
		land: wStatic,
	},
	S: {
		explosion,
		postWinStatic: sStatic,
		static: sStatic,
		spin: sStatic,
		win: sStatic,
		land: sStatic,
	},
	C: {
		explosion,
		postWinStatic: cStatic,
		static: cStatic,
		spin: cStatic,
		win: cStatic,
		land: cStatic,
	},
	T: {
		explosion,
		postWinStatic: tStatic,
		static: tStatic,
		spin: tStatic,
		win: tStatic,
		land: tStatic,
	},
	I: {
		explosion,
		postWinStatic: iStatic,
		static: iStatic,
		spin: iStatic,
		win: iStatic,
		land: iStatic,
	},
	M_2: {
		explosion,
		postWinStatic: m2Static,
		static: m2Static,
		spin: m2Static,
		win: m2Static,
		land: m2Static,
	},
	M_4: {
		explosion,
		postWinStatic: m4Static,
		static: m4Static,
		spin: m4Static,
		win: m4Static,
		land: m4Static,
	},
	M_5: {
		explosion,
		postWinStatic: m5Static,
		static: m5Static,
		spin: m5Static,
		win: m5Static,
		land: m5Static,
	},
	M_7: {
		explosion,
		postWinStatic: m7Static,
		static: m7Static,
		spin: m7Static,
		win: m7Static,
		land: m7Static,
	},
	M_10: {
		explosion,
		postWinStatic: m10Static,
		static: m10Static,
		spin: m10Static,
		win: m10Static,
		land: m10Static,
	},
	M_TAKEN_2: backgroundLow,
	M_TAKEN_4: backgroundLow,
	M_TAKEN_5: backgroundMid,
	M_TAKEN_7: backgroundMid,
	M_TAKEN_10: backgroundHigh,
} as const;

export const MULTIPLIER_BACKGROUND_INFO_MAP = {
	M_2: backgroundLow,
	M_4: backgroundLow,
	M_5: backgroundMid,
	M_7: backgroundMid,
	M_10: backgroundHigh,
};

export const SCATTER_LAND_SOUND_MAP = {
	1: 'sfx_scatter_stop_1',
	2: 'sfx_scatter_stop_2',
	3: 'sfx_scatter_stop_3',
	4: 'sfx_scatter_stop_4',
	5: 'sfx_scatter_stop_5',
} as const;
