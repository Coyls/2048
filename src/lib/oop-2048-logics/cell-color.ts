export const TEXT_COLOR_BASIC = '#5C534A';
export const TEXT_COLOR_VIOLET = '#FFF';

export const getCellColorBasic = (value: number): string => {
	switch (value) {
		case 0:
			return '#cdc1b4';
		case 2:
			return '#eee4da';
		case 4:
			return '#ede0c8';
		case 8:
			return '#f2b179';
		case 16:
			return '#f59563';
		case 32:
			return '#f67c5f';
		case 64:
			return '#f65e3b';
		case 128:
			return '#edcf72';
		case 256:
			return '#edcc61';
		case 512:
			return '#edc850';
		case 1024:
			return '#edc53f';
		case 2048:
			return '#edc22e';
		default:
			return '#cdc1b4';
	}
};

export const getCellColorViolet = (value: number): string => {
	switch (value) {
		case 0:
			return '#2b213d';
		case 2:
			return '#3b2f4d'; // Ton sombre et violet pour 2
		case 4:
			return '#4c3b62'; // Ton sombre pour 4
		case 8:
			return '#5f4877'; // Ton violet sombre pour 8
		case 16:
			return '#72468e'; // Ton violet plus intense pour 16
		case 32:
			return '#8a4b9b'; // Violet sombre pour 32
		case 64:
			return '#9f4cad'; // Ton violet plus lumineux pour 64
		case 128:
			return '#b04fbc'; // Violet vif pour 128
		case 256:
			return '#c359d0'; // Ton violet plus vibrant pour 256
		case 512:
			return '#d263e0'; // Violet clair et lumineux pour 512
		case 1024:
			return '#e174f3'; // Ton presque rose-violet pour 1024
		case 2048:
			return '#f285ff'; // Violet très lumineux pour 2048
		default:
			return '#2e1b3c'; // Couleur sombre par défaut pour les valeurs supérieures à 2048
	}
};
