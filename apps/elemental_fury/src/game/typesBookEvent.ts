import type { BetType } from 'rgs-requests';

import type { SymbolName, RawSymbol, GameType, Position } from './types';

type BookEventReveal = {
	index: number;
	type: 'reveal';
	board: RawSymbol[][];
	paddingPositions: number[];
	anticipation: number[];
	gameType: GameType;
};

type BookEventWinInfo = {
	index: number;
	type: 'winInfo';
	totalWin: number;
	wins: {
		symbol: SymbolName;
		win: number;
		positions: Position[];
		meta: {
			globalMult: number;
			clusterMult: number;
			winWithoutMult: number;
			overlay: Position;
		};
	}[];
};

type BookEventSetTumbleWin = {
	index: number;
	type: 'updateTumbleWin';
	amount: number;
};

type BookEventSetTotalWin = {
	index: number;
	type: 'setTotalWin';
	amount: number;
};

type BookEventFreeSpinTrigger = {
	index: number;
	type: 'freeSpinTrigger';
	totalFs: number;
	positions: Position[];
};

type BookEventUpdateFreeSpin = {
	index: number;
	type: 'updateFreeSpin';
	amount: number;
	total: number;
};

type BookEventUpdateGlobalMult = {
	index: number;
	type: 'updateGlobalMult';
	globalMult: number;
};

type BookEventFreeSpinEnd = {
	index: number;
	type: 'freeSpinEnd';
	amount: number;
	winLevel: number;
};

type BookEventBoardMultiplierInfo = {
	index: number;
	type: 'boardMultiplierInfo';
	multInfo: {
		positions: (Position & { multiplier: number })[];
	};
	winInfo: {
		tumbleWin: 400;
		boardMult: 5;
		totalWin: 2000;
	};
};

type BookEventTumbleBoard = {
	index: number;
	type: 'tumbleBoard';
	explodingSymbols: Position[];
	newSymbols: RawSymbol[][];
};

type BookEventFinalWin = {
	index: number;
	type: 'finalWin';
	amount: number;
};

type BookEventSetWin = {
	index: number;
	type: 'setWin';
	amount: number;
	winLevel: number;
};

// customised
type BookEventCreateBonusSnapshot = {
	index: number;
	type: 'createBonusSnapshot';
	bookEvents: BookEvent[];
};

// Maelstrom: this spin's Wind Wisp coin values, folded into the win total after the
// M-symbol board multiplier (see game_events.py: send_coin_collect_event).
type BookEventCoinCollectInfo = {
	index: number;
	type: 'coinCollectInfo';
	positions: (Position & { value: number })[];
	spinCoinWin: number;
};

// Subzero: this spin's lives count and current frozen-tile state (see game_events.py:
// send_ice_freeze_event). Fires every Subzero spin, win or not.
type BookEventIceFreezeInfo = {
	index: number;
	type: 'iceFreezeInfo';
	lives: number;
	frozeNew: boolean;
	positions: (Position & { value: number })[];
};

// Subzero: the final lump-sum payout across every frozen tile once lives run out (see
// game_events.py: send_ice_win_event).
type BookEventIceWinInfo = {
	index: number;
	type: 'iceWinInfo';
	totalWin: number;
	positions: (Position & { value: number })[];
};

export type BookEvent =
	| BookEventReveal
	| BookEventWinInfo
	| BookEventBoardMultiplierInfo
	| BookEventSetTumbleWin
	| BookEventSetTotalWin
	| BookEventFreeSpinTrigger
	| BookEventUpdateFreeSpin
	| BookEventUpdateGlobalMult
	| BookEventTumbleBoard
	| BookEventCreateBonusSnapshot
	| BookEventFinalWin
	| BookEventSetWin
	| BookEventFreeSpinEnd
	| BookEventCoinCollectInfo
	| BookEventIceFreezeInfo
	| BookEventIceWinInfo
	// customised
	| BookEventCreateBonusSnapshot;

export type Bet = BetType<BookEvent>;
export type BookEventOfType<T> = Extract<BookEvent, { type: T }>;
export type BookEventContext = { bookEvents: BookEvent[] };
