// client/src/lib/meta.ts
import type {
	DetailedHTMLProps,
	LinkHTMLAttributes,
	MetaHTMLAttributes,
} from "react";

type MetaTag = DetailedHTMLProps<
	MetaHTMLAttributes<HTMLMetaElement>,
	HTMLMetaElement
> & { title?: string };

type LinkTag = DetailedHTMLProps<
	LinkHTMLAttributes<HTMLLinkElement>,
	HTMLLinkElement
>;

type HeadConfig = {
	title: string;
	description?: string;
	path?: string;
	type?: "website" | "article";
};

const SITE_NAME = "Full Stack App";
const BASE_URL = import.meta.env.VITE_APP_URL ?? "https://localhost:5173";

export function buildHead({
	title,
	description,
	path,
	type = "website",
}: HeadConfig): {
	meta?: MetaTag[];
	links?: LinkTag[];
} {
	const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
	const url = path ? `${BASE_URL}${path}` : BASE_URL;
	const imageUrl = `${BASE_URL}/og/og-image.png`;

	const meta: MetaTag[] = [
		{ title: fullTitle },
		{ name: "description", content: description ?? "" },

		{ property: "og:type", content: type ?? "website" },
		{ property: "og:title", content: fullTitle },
		{ property: "og:url", content: url },
		{ property: "og:image", content: imageUrl },

		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: fullTitle },
		{ name: "twitter:image", content: imageUrl },
	].filter((m) => {
		if (m.name === "description" && !m.content) return false;
		return true;
	});

	if (description) {
		meta.push({ property: "og:description", content: description });
		meta.push({ name: "twitter:description", content: description });
	}

	const links: LinkTag[] = path ? [{ rel: "canonical", href: url }] : [];

	return {
		meta,
		links: links.length ? links : undefined,
	};
}
