import { __ } from '@/lib/i18n';
import SectionHeading from '../shared/section-heading';
import { SocialPreviewsBaseProps } from '../types';
import { LinkedInLinkPreview } from './link-preview';
import { LinkedInPostPreview } from './post-preview';
import type { LinkedInPreviewProps } from './types';

export type LinkedInPreviewsProps = LinkedInPreviewProps & SocialPreviewsBaseProps;

export const LinkedInPreviews: React.FC< LinkedInPreviewsProps > = ( {
	headingLevel,
	hideLinkPreview,
	hidePostPreview,
	...props
} ) => {
	return (
		<div className="social-preview linkedin-preview">
			{ ! hidePostPreview && (
				<section className="social-preview__section linkedin-preview__section">
					<LinkedInPostPreview { ...props } />
				</section>
			) }
			{ ! hideLinkPreview && (
				<section className="social-preview__section linkedin-preview__section">
					<LinkedInLinkPreview { ...props } name="" profileImage="" />
				</section>
			) }
		</div>
	);
};
