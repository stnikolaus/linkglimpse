import clsx from 'clsx';
import BlueskyPostActions from './post/actions';
import BlueskyPostBody from './post/body';
import BlueskyPostCard from './post/card';
import BlueskyPostHeader from './post/header';
import { BlueskyPostSidebar } from './post/sidebar';
import type { BlueskyPreviewProps } from './types';



export const BlueskyPostPreview: React.FC< BlueskyPreviewProps > = ( props ) => {
	const { user, appendUrl } = props;

	return (
		<div className="bluesky-preview__post">
			<BlueskyPostSidebar user={ user } />
			<div>
				<BlueskyPostHeader user={ user } />
				<BlueskyPostBody { ...props } appendUrl={ appendUrl ?? false }>
				</BlueskyPostBody>
				<BlueskyPostCard { ...props } />
				<BlueskyPostActions />
			</div>
		</div>
	);
};
