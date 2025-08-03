import type { SocialPreviewBaseProps, MediaItem } from '../types';

export type TumblrUser = {
	displayName: string;
	avatarUrl?: string;
};

export type TumblrPreviewProps = SocialPreviewBaseProps & {
	user?: TumblrUser;
	customText?: string;
	media?: MediaItem[];
};
