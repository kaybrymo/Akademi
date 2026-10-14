import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COMMUNITY_APP_URL, communityUrl } from '@/lib/appLinks';

/** Old in-app community URLs now live in the standalone Akademi Community app. */
function targetPath(pathname: string) {
  if (pathname.startsWith('/admin/communities')) return '/admin';
  const detail = pathname.match(/\/communit(?:y|ies)\/([^/]+)/);
  return detail ? `/communities/${detail[1]}` : '/communities';
}

export default function CommunityRedirect() {
  const { pathname } = useLocation();
  const target = communityUrl(targetPath(pathname));

  useEffect(() => {
    if (COMMUNITY_APP_URL) window.location.replace(target);
  }, [target]);

  if (COMMUNITY_APP_URL) return null;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-xl font-extrabold text-slate-900">Communities moved</h1>
      <p className="text-sm text-slate-500 max-w-sm">
        Communities now run as their own app. Set <code>VITE_COMMUNITY_URL</code> to its address to link to it from here.
      </p>
      <Link to="/" className="text-sm font-bold text-[#0F5338]">Back to Akademi</Link>
    </div>
  );
}
