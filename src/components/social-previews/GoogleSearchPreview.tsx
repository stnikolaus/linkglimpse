'use client';

interface GoogleSearchPreviewProps {
  title: string;
  description: string;
  url: string;
  siteTitle?: string;
}

export default function GoogleSearchPreview({
  title,
  description,
  url,
  siteTitle
}: GoogleSearchPreviewProps) {
  const getDomain = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      // Remove "www." prefix if present
      const domainWithoutWww = hostname.replace(/^www\./i, '');
      // Capitalize first letter
      return domainWithoutWww.charAt(0).toUpperCase() + domainWithoutWww.slice(1);
    } catch {
      return url;
    }
  };

  const domain = getDomain(url);
  
  // Format URL to match Google's breadcrumb style
  const formatGoogleUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search;
      if (path === '/') return domain;
      return `${domain} › ${path.substring(1).split('/').join(' › ')}`;
    } catch {
      return url;
    }
  };

  // Truncate text functions
  const truncateTitle = (text: string, maxLength: number = 63) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const truncateDescription = (text: string, maxLength: number = 160) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const truncateUrl = (text: string, maxLength: number = 68) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="google-search-preview bg-white">
      <div className="google-search-preview__wrapper">
        <div className="google-search-preview__result">
          {/* Website Icon and Site Name */}
          <div className="google-search-preview__header">
            <div className="google-search-preview__branding">
              <img
                className="google-search-preview__icon"
                src={`https://www.google.com/s2/favicons?sz=128&domain_url=${domain}`}
                alt=""
                width="28"
                height="28"
              />
              <div className="google-search-preview__site">
                <div className="google-search-preview__site-title">{siteTitle || domain}</div>
                <div className="google-search-preview__url">{truncateUrl(formatGoogleUrl(url))}</div>
              </div>
            </div>
            <div className="google-search-preview__menu">
              <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
              </svg>
            </div>
          </div>
          
          {/* Title */}
          <div className="google-search-preview__title">
            {truncateTitle(title)}
          </div>
          
          {/* Description */}
          <div className="google-search-preview__snippet">
            {truncateDescription(description)}
          </div>
        </div>
      </div>
    </div>
  );
} 
