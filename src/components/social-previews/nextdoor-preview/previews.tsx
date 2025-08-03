import { __ } from '@/lib/i18n';
import SectionHeading from '../shared/section-heading';
import { SocialPreviewsBaseProps } from '../types';
import { NextdoorLinkPreview } from './link-preview';
import { NextdoorPostPreview } from './post-preview';
import type { NextdoorPreviewProps } from './types';

export type NextdoorPreviewsProps = NextdoorPreviewProps & SocialPreviewsBaseProps;

export const NextdoorPreviews: React.FC< NextdoorPreviewsProps > = ( {
	headingLevel,
	hideLinkPreview,
	hidePostPreview,
	...props
} ) => {
	return (
		<div className="social-preview nextdoor-preview">
			{ ! hidePostPreview && (
				<section className="social-preview__section nextdoor-preview__section">
					<NextdoorPostPreview { ...props } />
				</section>
			) }
			{ ! hideLinkPreview && (
				<section className="social-preview__section nextdoor-preview__section">
					<NextdoorLinkPreview { ...props } name="" profileImage="" />
				</section>
			) }
		</div>
	);
};
