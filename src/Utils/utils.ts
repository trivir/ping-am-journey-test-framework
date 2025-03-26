import type { TemplateKeys } from "../Types";

export function stringBuilder<T extends string, K extends TemplateKeys<T>>(
	template: T,
	params: Record<K, string | number>,
): string {
	return template.replace(/\{(\w+)\}/g, (match, key) => {
		return key in params ? String(params[key as K]) : match;
	});
}
