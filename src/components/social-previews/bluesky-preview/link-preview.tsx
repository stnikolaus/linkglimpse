import { BlueskyPostPreview } from './post-preview';
import type { BlueskyPreviewProps } from './types';

export const BlueskyLinkPreview: React.FC< BlueskyPreviewProps > = ( props ) => {
	return <BlueskyPostPreview { ...props } user={ undefined } customText={props.customText} />;
};
