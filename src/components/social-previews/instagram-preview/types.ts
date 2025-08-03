import { SocialPreviewBaseProps, SocialPreviewsBaseProps, MediaItem } from '../types';

export type InstagramPreviewProps = Pick< SocialPreviewBaseProps, 'image' > & {
	name: string;
	profileImage: string;
	caption?: string;
	media?: MediaItem[];
};

export type InstagramPreviewsProps = InstagramPreviewProps & SocialPreviewsBaseProps;
