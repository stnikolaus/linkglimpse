import { __ } from '@/lib/i18n';
import SectionHeading from '../shared/section-heading';
import { SocialPreviewsBaseProps } from '../types';
import { FacebookLinkPreview } from './link-preview';
import { LinkPreviewDetails } from './link-preview-details';
import { FacebookPostPreview } from './post-preview';
import type { FacebookPreviewProps } from './types';

export type FacebookPreviewsProps = FacebookPreviewProps & SocialPreviewsBaseProps;

export const FacebookPreviews: React.FC< FacebookPreviewsProps > = ( {
	headingLevel,
	hideLinkPreview,
	hidePostPreview,
	...props
} ) => {
	const hasMedia = !! props.media?.length;
	const hasCustomImage = !! props.customImage;

	return (
		<div className="social-preview facebook-preview">
			{ ! hidePostPreview && (
				<section className="social-preview__section facebook-preview__section">
					{ hasMedia ? <FacebookPostPreview { ...props } /> : <FacebookLinkPreview { ...props } /> }
				</section>
			) }
			{ ! hideLinkPreview && (
				<section className="social-preview__section facebook-preview__section">
					{ hasCustomImage ? (
						<LinkPreviewDetails { ...props } />
					) : (
						<FacebookLinkPreview { ...props } compactDescription customText="" user={ undefined } />
					) }
				</section>
			) }
		</div>
	);
};
