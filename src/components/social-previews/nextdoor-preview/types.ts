import { SocialPreviewBaseProps, SocialPreviewsBaseProps, MediaItem } from '../types';

export type NextdoorPreviewProps = SocialPreviewBaseProps & {
	neighborhood?: string;
	name: string;
	profileImage: string;
	media?: MediaItem[];
};

export type NextdoorPreviewsProps = NextdoorPreviewProps & SocialPreviewsBaseProps;
