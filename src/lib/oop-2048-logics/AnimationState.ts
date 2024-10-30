import type { CanvasManager } from './CanvasManager';

export class AnimationState {
	canvasManager: CanvasManager;

	constructor(canvasManager: CanvasManager) {
		this.canvasManager = canvasManager;
	}

	startCycle = () => {};
	paintCanvas = () => {};
}

export class PaintingState extends AnimationState {
	constructor(canvasManager: CanvasManager) {
		super(canvasManager);
	}

	startCycle = () => {
		console.log('START');
		console.log('PaintingState: startCycle');
		this.canvasManager.setState(new MovingState(this.canvasManager));
	};

	paintCanvas = () => {
		console.log('PaintingState: paintCanvas');
		console.log('FINISH');
	};
}

export class MovingState extends AnimationState {
	constructor(canvasManager: CanvasManager) {
		super(canvasManager);
	}

	startCycle = () => {};

	paintCanvas = () => {
		console.log('MovingState: paintCanvas');
		this.canvasManager.setState(new NewTileState(this.canvasManager));
	};
}

export class NewTileState extends AnimationState {
	constructor(canvasManager: CanvasManager) {
		super(canvasManager);
	}

	startCycle = () => {};

	paintCanvas = () => {
		console.log('NewTileState: paintCanvas');
		this.canvasManager.setState(new PaintingState(this.canvasManager));
	};
}
