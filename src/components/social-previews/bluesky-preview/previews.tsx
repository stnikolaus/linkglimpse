import { SocialPreviewsBaseProps } from '../types';
import { BlueskyLinkPreview } from './link-preview';
import { BlueskyPostPreview } from './post-preview';
import { BlueskyPreviewProps } from './types';

export type BlueskyPreviewsProps = BlueskyPreviewProps & SocialPreviewsBaseProps;

export const BlueskyPreviews: React.FC< BlueskyPreviewsProps > = ( {
	headingLevel: _headingLevel,
	hidePostPreview,
	hideLinkPreview,
	...props
} ) => {
	return (
		<div className="social-preview bluesky-preview">
			{ ! hidePostPreview && (
				<section className="social-preview__section bluesky-preview__section">
					<BlueskyPostPreview { ...props } />
				</section>
			) }
			{ ! hideLinkPreview && (
				<section className="social-preview__section bluesky-preview__section">
					<BlueskyLinkPreview { ...props } />
				</section>
			) }
		</div>
	);
};
