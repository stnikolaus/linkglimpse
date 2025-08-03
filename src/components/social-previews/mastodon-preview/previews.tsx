import { __ } from '@/lib/i18n';
import { SectionHeading } from '../shared/section-heading';
import { SocialPreviewsBaseProps } from '../types';
import { MastodonLinkPreview } from './link-preview';
import { MastodonPostPreview } from './post-preview';
import { MastodonPreviewProps } from './types';

export type MastodonPreviewsProps = MastodonPreviewProps & SocialPreviewsBaseProps;

export const MastodonPreviews: React.FC< MastodonPreviewsProps > = ( {
	headingLevel,
	hidePostPreview,
	hideLinkPreview,
	...props
} ) => {
	return (
		<div className="social-preview mastodon-preview">
			{ ! hidePostPreview && (
				<section className="social-preview__section mastodon-preview__section">
					<MastodonPostPreview { ...props } />
				</section>
			) }
			{ ! hideLinkPreview && (
				<section className="social-preview__section mastodon-preview__section">
					<MastodonLinkPreview { ...props } user={ undefined } />
				</section>
			) }
		</div>
	);
};
