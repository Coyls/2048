import type { CanvasManager } from './CanvasManager';

export class AnimationState {
	canvasManager: CanvasManager;

	constructor(canvasManager: CanvasManager) {
		this.canvasManager = canvasManager;
	}

	async startCycle() {}
	async paintCanvas() {}
}

export class PaintingState extends AnimationState {
	constructor(canvasManager: CanvasManager) {
		super(canvasManager);
	}

	async startCycle() {
		console.log('START');
		console.log('PaintingState: startCycle | STEP 1');
	}

	async paintCanvas() {
		console.log('PaintingState: paintCanvas | STEP 4');
		console.log('FINISH');
	}
}

export class MovingState extends AnimationState {
	constructor(canvasManager: CanvasManager) {
		super(canvasManager);
	}

	async startCycle() {}

	async paintCanvas() {
		console.log('MovingState: paintCanvas | STEP 2');
	}
}

export class NewTileState extends AnimationState {
	constructor(canvasManager: CanvasManager) {
		super(canvasManager);
	}

	async startCycle() {}

	async paintCanvas() {
		console.log('NewTileState: paintCanvas | STEP 3');
		if (this.canvasManager.game.newTile) {
			await this.canvasManager.animationNewTile({ cell: this.canvasManager.game.newTile });
		}

		this.canvasManager.game.newTile = null;

		await this.canvasManager.setState(new PaintingState(this.canvasManager));
	}
}
