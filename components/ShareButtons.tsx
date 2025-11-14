'use client';

import { JournalEntry } from '@/types/journal';

interface ShareButtonsProps {
  entry: JournalEntry;
}

export default function ShareButtons({ entry }: ShareButtonsProps) {
  // Generate a shareable excerpt from the content
  const excerpt = entry.content
    .replace(/[#*`_\[\]()]/g, '') // Remove markdown syntax
    .substring(0, 150)
    .trim() + (entry.content.length > 150 ? '...' : '');

  // Generate the share text
  const shareTitle = `"${entry.title}" - My Journal Entry`;
  const shareText = `${shareTitle}\n\n${excerpt}`;

  // Note: In a production app with a backend, you'd use the actual deployed URL
  // For now, we'll use a hash-based URL that works locally
  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}#entry-${entry.id}`
    : '';

  const shareLinks = {
    twitter: () => {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(pageUrl)}`;
      window.open(url, 'twitter-share', 'width=600,height=400');
    },
    linkedin: () => {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
      window.open(url, 'linkedin-share', 'width=600,height=400');
    },
    facebook: () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
      window.open(url, 'facebook-share', 'width=600,height=400');
    },
    whatsapp: () => {
      const url = `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n\n${excerpt}\n\n${pageUrl}`)}`;
      window.open(url, 'whatsapp-share');
    },
    email: () => {
      const subject = encodeURIComponent(entry.title);
      const body = encodeURIComponent(`${excerpt}\n\n${pageUrl}`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    },
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-sm text-gray-500">Share:</span>
      <button
        onClick={shareLinks.twitter}
        title="Share on Twitter"
        className="p-2 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-500 transition-colors"
        aria-label="Share on Twitter"
      >
        <TwitterIcon />
      </button>
      <button
        onClick={shareLinks.linkedin}
        title="Share on LinkedIn"
        className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon />
      </button>
      <button
        onClick={shareLinks.facebook}
        title="Share on Facebook"
        className="p-2 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Share on Facebook"
      >
        <FacebookIcon />
      </button>
      <button
        onClick={shareLinks.whatsapp}
        title="Share on WhatsApp"
        className="p-2 rounded-lg bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <WhatsAppIcon />
      </button>
      <button
        onClick={shareLinks.email}
        title="Share via Email"
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Share via Email"
      >
        <EmailIcon />
      </button>
    </div>
  );
}

// Icon components
function TwitterIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M17.6915026,13.4744748 C17.4788717,13.3599899 16.1143525,12.6559347 15.9139881,12.5915265 C15.7136236,12.5271182 15.5917067,12.4563722 15.5917067,12.2899707 C15.5917067,12.1235692 15.6626225,11.9571677 15.7734885,11.8195249 C15.8843545,11.6818821 16.3567572,11.1272331 16.4989669,10.9379105 C16.6411765,10.7485879 16.5826771,10.5820864 16.449196,10.4644408 C16.3157148,10.3467952 15.7136236,9.8359498 15.5132591,9.7715416 C15.3128947,9.7071335 15.1563085,9.76290559 15.0520347,9.79621488 C14.9477609,9.82952416 14.5685345,10.0234898 14.1893081,10.4644408 L13.9889437,10.6713267 C13.8467341,10.8606493 13.4675077,10.8195249 13.1244739,10.6831559 C12.7814401,10.5467868 11.9295886,10.2136939 10.9200152,9.35472519 C10.1338041,8.73819206 9.54548754,7.9679429 9.40327788,7.77861328 C9.26106821,7.58928365 9.39456408,7.45511729 9.52805994,7.32865741 C9.66155581,7.20219754 9.8221519,6.99530915 9.93302029,6.83812195 C10.0438887,6.68093475 9.98539128,6.45901887 9.92689388,6.31706533 C9.86839649,6.17511179 9.27734734,4.86551477 9.09705902,4.41393206 C8.93646847,4.00457064 8.77587791,4.05984351 8.66497968,4.05984351 C8.55408145,4.05984351 8.43199973,4.06165317 8.31041744,4.06165317 C8.18883514,4.06165317 7.98432093,4.10540341 7.78430652,4.30158492 C7.5842921,4.49776643 6.95201881,5.1239079 6.95201881,6.47320398 C6.95201881,7.82249932 7.80626155,9.13322609 7.91705003,9.26978046 C8.02783852,9.40633483 9.27734734,11.4175739 11.2619181,12.3827882 C11.6870266,12.6110742 12.0045633,12.7449844 12.2404103,12.8408933 C12.6656188,13.0272365 13.0623848,13.0091274 13.3747573,12.9642029 C13.7280262,12.9110849 14.4624053,12.5291227 14.6427192,12.1948369 C14.8230331,11.8605511 14.8230331,11.5773062 14.7809142,11.5074934 C14.7387953,11.4376807 14.6168783,11.3968502 14.4352472,11.296427 Z M12.0045633,0 C5.375682,0 0.00623155803,5.371935 0.00623155803,11.9950699 C0.00623155803,14.6033766 0.800983235,17.0300879 2.24852637,18.9987507 L1.10670993,23.4764312 L5.76527167,21.6978949 C7.636644,22.9827903 9.947808,23.8387519 12.4206273,23.8387519 L12.0045633,23.8387519 C18.6345549,23.8387519 23.9903808,18.4668169 23.9903808,11.843681 C23.9903808,5.21919969 18.6345549,0 12.0045633,0 Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
