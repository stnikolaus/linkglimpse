import { SocialPreviewsBaseProps } from '../types';
import { InstagramPostPreview } from './post-preview';
import type { InstagramPreviewProps } from './types';

export type InstagramPreviewsProps = InstagramPreviewProps & SocialPreviewsBaseProps;

export const InstagramPreviews: React.FC< InstagramPreviewsProps > = ( {
	headingLevel: _headingLevel,
	hidePostPreview,
	...props
} ) => {
	return (
		<div className="social-preview instagram-preview">
			{ ! hidePostPreview && (
				<section className="social-preview__section instagram-preview__section">
					<InstagramPostPreview { ...props } />
				</section>
			) }
		</div>
	);
};
