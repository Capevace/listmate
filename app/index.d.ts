declare module 'rsshub' {
	export function init(config: any): void;
	export function request(url: string): Promise<any>;
};