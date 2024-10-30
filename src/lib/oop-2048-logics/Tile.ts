type ParentsTile = [Tile, Tile] | null;

export class Tile {
	id: string;
	value: number;
	parents: ParentsTile;
	hasCollided: boolean;

	constructor(parents: ParentsTile = null) {
		this.id = this.createId();
		this.value = this.setValue(parents);
		this.parents = parents;
		this.hasCollided = Boolean(parents);
	}

	private createId = () => Math.random().toString(36).substring(2, 15);
	private createInitialValue = () => (Math.random() < 0.9 ? 2 : 4);
	private crateMergedValue = ([tile1, tile2]: [Tile, Tile]) => tile1.value + tile2.value;

	private setValue = (parents: ParentsTile) => {
		return parents ? this.crateMergedValue(parents) : this.createInitialValue();
	};
}
