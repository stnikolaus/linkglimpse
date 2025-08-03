import { __ } from '@/lib/i18n';
import { SectionHeading } from '../shared/section-heading';
import { SocialPreviewsBaseProps } from '../types';
import { TumblrLinkPreview } from './link-preview';
import { TumblrPostPreview } from './post-preview';
import { TumblrPreviewProps } from './types';

export type TumblrPreviewsProps = TumblrPreviewProps & SocialPreviewsBaseProps;

export const TumblrPreviews: React.FC< TumblrPreviewsProps > = ( {
	headingLevel,
	hideLinkPreview,
	hidePostPreview,
	...props
} ) => {
	const hasMedia = !! props.media?.length;

	return (
		<div className="social-preview tumblr-preview">
			{ ! hidePostPreview && (
				<section className="social-preview__section tumblr-preview__section">
					{ hasMedia ? <TumblrPostPreview { ...props } /> : <TumblrLinkPreview { ...props } /> }
				</section>
			) }
			{ ! hideLinkPreview && (
				<section className="social-preview__section tumblr-preview__section">
					<TumblrLinkPreview { ...props } user={ undefined } />
				</section>
			) }
		</div>
	);
};
