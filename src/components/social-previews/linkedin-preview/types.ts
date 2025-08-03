import { SocialPreviewBaseProps, SocialPreviewsBaseProps, MediaItem } from '../types';

export type LinkedInPreviewProps = SocialPreviewBaseProps & {
	jobTitle?: string;
	name: string;
	profileImage: string;
	articleReadTime?: number;
	media?: MediaItem[];
};

export type LinkedInPreviewsProps = LinkedInPreviewProps & SocialPreviewsBaseProps;
