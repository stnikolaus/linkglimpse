import { __ } from '@/lib/i18n';
import SectionHeading from '../shared/section-heading';
import { SocialPreviewsBaseProps } from '../types';
import { TwitterLinkPreview } from './link-preview';
import { TwitterPostPreview } from './post-preview';
import type { TwitterPreviewProps } from './types';

export type TwitterPreviewsProps = SocialPreviewsBaseProps & {
	tweets: Array< TwitterPreviewProps >;
};

export const TwitterPreviews: React.FC< TwitterPreviewsProps > = ( {
	headingLevel,
	hideLinkPreview,
	hidePostPreview,
	tweets,
} ) => {
	if ( ! tweets?.length ) {
		return null;
	}

	return (
		<div className="social-preview twitter-preview">
			{ ! hidePostPreview && (
				<section className="social-preview__section twitter-preview__section">
					{ tweets.map( ( tweet, index ) => {
						const isLast = index + 1 === tweets.length;
						return (
							<TwitterPostPreview
								key={ `twitter-preview__tweet-${ index }` }
								{ ...tweet }
								showThreadConnector={ ! isLast }
							/>
						);
					} ) }
				</section>
			) }
			{ ! hideLinkPreview && (
				<section className="social-preview__section twitter-preview__section">
					<TwitterLinkPreview { ...tweets[ 0 ] } name="" profileImage="" screenName="" />
				</section>
			) }
		</div>
	);
};
