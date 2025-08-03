import { __ } from '@/lib/i18n';
import SectionHeading from '../shared/section-heading';
import { SocialPreviewsBaseProps } from '../types';
import { ThreadsLinkPreview } from './link-preview';
import { ThreadsPostPreview } from './post-preview';
import type { ThreadsPreviewProps } from './types';

export type ThreadsPreviewsProps = SocialPreviewsBaseProps & {
	posts: Array< ThreadsPreviewProps >;
};

export const ThreadsPreviews: React.FC< ThreadsPreviewsProps > = ( {
	headingLevel,
	hideLinkPreview,
	hidePostPreview,
	posts,
} ) => {
	if ( ! posts?.length ) {
		return null;
	}

	return (
		<div className="social-preview threads-preview">
			{ ! hidePostPreview && (
				<section className="social-preview__section threads-preview__section">
					{ posts.map( ( post, index ) => {
						const isLast = index + 1 === posts.length;
						return (
							<ThreadsPostPreview
								key={ `threads-preview__post-${ index }` }
								{ ...post }
								showThreadConnector={ ! isLast }
							/>
						);
					} ) }
				</section>
			) }
			{ ! hideLinkPreview ? (
				<section className="social-preview__section threads-preview__section">
					{ posts[ 0 ].image ? (
						<>
							<ThreadsLinkPreview { ...posts[ 0 ] } name="" profileImage="" />
						</>
					) : (
						<p className="social-preview__section-desc">
							{ __(
								'Threads link preview requires an image to be set for the post. Please add an image to see the preview.',
								'social-previews'
							) }
						</p>
					) }
				</section>
			) : null }
		</div>
	);
};
