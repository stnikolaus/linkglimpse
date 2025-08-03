import { firstValid, hardTruncation, shortEnough, stripHtmlTags, Formatter } from '../helpers';

const TITLE_LENGTH = 120;

export const CAPTION_MAX_CHARS = 200;

export const threadsTitle: Formatter = ( text ) =>
	firstValid(
		shortEnough( TITLE_LENGTH ),
		hardTruncation( TITLE_LENGTH )
	)( stripHtmlTags( text ) ) || '';
